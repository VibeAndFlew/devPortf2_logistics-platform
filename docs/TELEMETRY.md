# Telemetry Pipeline

> Real-time vehicle telemetry ingestion, processing, and distribution architecture.

---

## Overview

The telemetry pipeline ingests real-time data from vehicle-mounted GPS/IoT devices, validates and enriches the data, and broadcasts it to all connected dashboard clients. The system is designed for **sub-2-second latency** from vehicle to dashboard at a fleet scale of 10,000+ vehicles.

---

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌─────────────────┐
│  IoT Device  │────▶│  WebSocket   │────▶│  Redis Pub/Sub  │
│  (GPS/Sensor)│     │  Gateway     │     │  (Fan-Out)      │
└──────────────┘     └──────┬───────┘     └────────┬────────┘
                            │                      │
                            ▼                      ▼
                     ┌──────────────┐     ┌─────────────────┐
                     │  Validation  │     │  WebSocket      │
                     │  (Zod Schema)│     │  Broadcast      │
                     └──────┬───────┘     └─────────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Enrichment  │
                     │  (Geofence,  │
                     │   Speed, HOS)│
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Batch       │
                     │  Writer      │
                     │  (5s window) │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  PostgreSQL  │
                     │  Telemetry   │
                     │  Events Table│
                     └──────────────┘
```

---

## Data Flow

### Ingestion

Each vehicle's IoT device sends telemetry payloads over a persistent WebSocket connection:

```json
{
  "vehicle_id": "FL-1042",
  "timestamp": "2026-05-22T12:34:56Z",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "speed_kmh": 67.2,
  "heading": 45.0,
  "fuel_level_pct": 73.5,
  "engine_temp_c": 89.2,
  "odometer_km": 142387.4,
  "battery_soc_pct": null,
  "diagnostics": {
    "engine_rpm": 1850,
    "oil_pressure_psi": 42,
    "tire_pressure_psi": [105, 103, 104, 106, 102, 104]
  }
}
```

### Validation

All incoming telemetry is validated against a Zod schema before processing:

```typescript
const TelemetrySchema = z.object({
  vehicle_id: z.string().min(1).max(50),
  timestamp: z.string().datetime(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  speed_kmh: z.number().min(0).max(300),
  heading: z.number().min(0).max(360),
  fuel_level_pct: z.number().min(0).max(100).nullable(),
  engine_temp_c: z.number().min(-40).max(150).nullable(),
  odometer_km: z.number().min(0),
  battery_soc_pct: z.number().min(0).max(100).nullable(),
  diagnostics: z.record(z.unknown()).optional(),
});
```

### Enrichment

After validation, each event is enriched with:

- **Geofence Check** — Is the vehicle inside/outside any defined geofence zones?
- **Speed Context** — Is the vehicle exceeding the speed limit for the current road?
- **HOS Tracking** — How long has the current driver been on duty?
- **Maintenance Prediction** — Is the vehicle approaching a maintenance milestone?

### Broadcast

Enriched events are published to Redis Pub/Sub. All WebSocket server instances subscribe to the `telemetry:events` channel and forward events to connected clients.

### Persistence

Events are batched and written to PostgreSQL every 5 seconds to amortize write overhead:

```sql
INSERT INTO telemetry_events (
  vehicle_id, latitude, longitude, speed_kmh, heading,
  fuel_level_pct, engine_temp_c, odometer_km, recorded_at, ingested_at
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
ON CONFLICT DO NOTHING;
```

---

## Client Integration (React Hook)

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import type { TelemetryEvent } from "@/lib/telemetry/schema";

interface UseTelemetryOptions {
  vehicleIds?: string[];
  batchInterval?: number;
}

export function useTelemetry({ vehicleIds, batchInterval = 1000 }: UseTelemetryOptions = {}) {
  const [events, setEvents] = useState<Map<string, TelemetryEvent>>(new Map());
  const wsRef = useRef<WebSocket | null>(null);
  const bufferRef = useRef<TelemetryEvent[]>([]);

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "subscribe",
        vehicles: vehicleIds ?? [],
      }));
    };

    ws.onmessage = (msg) => {
      const event = JSON.parse(msg.data) as TelemetryEvent;
      bufferRef.current.push(event);
    };

    const flush = setInterval(() => {
      if (bufferRef.current.length === 0) return;
      setEvents((prev) => {
        const next = new Map(prev);
        for (const event of bufferRef.current) {
          next.set(event.vehicle_id, event);
        }
        return next;
      });
      bufferRef.current = [];
    }, batchInterval);

    return () => {
      ws.close();
      clearInterval(flush);
    };
  }, [vehicleIds, batchInterval]);

  return events;
}
```

---

## Performance Characteristics

| Metric | Target | Method |
|---|---|---|
| Vehicle→Dashboard Latency | <2s | WebSocket + Redis Pub/Sub |
| Throughput (single instance) | 10,000 events/s | Async I/O, batched writes |
| Database Write Rate | 2,000 events/s per batch | 5-second window, batch insert |
| Client Memory (10k vehicles) | <50MB | Differential updates |
| Connection Pool (WebSocket) | 10,000 concurrent | Horizontal scale via Redis |

---

## Error Handling

- **Connection Loss** — Client-side exponential backoff reconnection (1s, 2s, 4s, 8s, max 30s)
- **Validation Failure** — Malformed payloads are logged and rejected; the WebSocket connection remains open
- **Backpressure** — If the client falls behind, the server drops stale events (oldest first)
- **Persistence Failure** — Telemetry is buffered in Redis if PostgreSQL is unavailable; replay on recovery

---

## Monitoring

- **Telemetry rate** (events/min) — Dashboard metric
- **P99 latency** (vehicle→dashboard) — Distributed trace
- **WebSocket connection count** — Grafana dashboard
- **Validation failure rate** — Error log aggregation
- **Write batch size** — PostgreSQL insert monitoring
