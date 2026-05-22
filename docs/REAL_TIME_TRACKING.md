# Real-Time Fleet Tracking

> Live fleet tracking, geofencing, and telemetry visualization architecture.

---

## Overview

The real-time tracking module provides sub-second visibility into fleet operations. Every vehicle's position, speed, heading, and diagnostic data is streamed to the command center dashboard through a WebSocket-first architecture with SSE fallback.

---

## Tracking Stack

```
┌────────────────────────────────────────────────────┐
│                  DASHBOARD                          │
│  ┌─────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │Mapbox GL│  │Telemetry │  │ Vehicle List     │  │
│  │ Map     │  │ Panel    │  │ (Status Sidebar) │  │
│  └────┬────┘  └────┬─────┘  └────────┬─────────┘  │
│       │            │                 │              │
│       └────────────┼─────────────────┘              │
│                    │                                │
│              ┌─────▼──────┐                         │
│              │ useFleet   │                         │
│              │ WebSocket  │                         │
│              │ Hook       │                         │
│              └─────┬──────┘                         │
└────────────────────┼────────────────────────────────┘
                     │
                     ▼
              ┌──────────────┐
              │  WebSocket   │
              │  Server      │
              └──────┬───────┘
                     │
              ┌──────▼───────┐
              │  Redis       │
              │  Pub/Sub     │
              └──────────────┘
```

---

## WebSocket Protocol

### Connection

```typescript
const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/fleet`);
```

### Client → Server Messages

**Subscribe to vehicles:**
```json
{
  "type": "subscribe",
  "vehicles": ["FL-1042", "FL-0891", "FL-2137"],
  "include_history": true
}
```

**Request telemetry history:**
```json
{
  "type": "history",
  "vehicle_id": "FL-1042",
  "from": "2026-05-22T12:00:00Z",
  "to": "2026-05-22T13:00:00Z"
}
```

### Server → Client Messages

**Telemetry event:**
```json
{
  "type": "telemetry",
  "vehicle_id": "FL-1042",
  "timestamp": "2026-05-22T12:34:56Z",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "speed_kmh": 67.2,
  "heading": 45,
  "fuel_level_pct": 73.5,
  "status": "active",
  "geofence_events": []
}
```

**Geofence alert:**
```json
{
  "type": "geofence_alert",
  "vehicle_id": "FL-1042",
  "geofence_id": "gf-001",
  "event": "entry",
  "timestamp": "2026-05-22T12:34:56Z"
}
```

---

## Map Visualization

The fleet map uses Mapbox GL JS with the following layers:

### Vehicle Markers
- **Active** — Teal (#14b8a6) circle with pulse animation
- **Idle** — Yellow (#eab308) diamond marker
- **Offline** — Red (#ef4444) square marker
- **Selected** — Larger size with a glow halo

### Heatmap Layer
Fleet density heatmap rendered as a Mapbox heatmap layer with:
- **Radius**: 30px at zoom 10
- **Intensity**: Weighted by vehicle density
- **Color ramp**: Teal (low) → Yellow (mid) → Red (high)

### Geofence Zones
- Rendered as semi-transparent polygon fills
- Entry/exit events trigger dashboard notifications
- Speed limit violations highlighted in red

### Trip Trails
- Each active vehicle shows its path for the last 30 minutes
- Color gradient: lighter teal (older) → solid teal (current position)
- Trail opacity fades with age

---

## React Components

### Fleet Map Component

```typescript
"use client";

interface FleetMapProps {
  vehicles: VehicleData[];
  selectedVehicleId?: string;
  onVehicleSelect?: (id: string) => void;
  showHeatmap?: boolean;
  showGeofences?: boolean;
  center?: [number, number];
  zoom?: number;
}
```

### Telemetry Panel

```typescript
"use client";

interface TelemetryPanelProps {
  vehicleId: string;
  telemetry: TelemetryEvent;
  expanded?: boolean;
}
```

Displays:
- Current speed (analog-style gauge)
- Fuel/battery level (vertical bar)
- Engine temperature (horizontal bar)
- Heading compass
- Trip distance and duration
- Last 20 telemetry events as a timeline

### Vehicle List Sidebar

- Scrollable list of all fleet vehicles
- Status indicator (active/idle/offline/maintenance)
- Driver name and current speed
- Click to center map on vehicle
- Search/filter by vehicle ID, driver name, or status

---

## Performance Optimizations

### Client-Side
- **Marker clustering** — Vehicles within 50px of each other cluster at zoom levels <12
- **Viewport culling** — Only render markers and trails within the current map viewport + 10% margin
- **Differential updates** — Only rerender markers whose position has changed
- **Throttled updates** — Telemetry updates at 1fps unless the vehicle is selected (3fps)

### Server-Side
- **Connection pooling** — Reuse WebSocket connections for multiple vehicle subscriptions
- **Selective broadcast** — Only send events to clients that have subscribed to that vehicle
- **History pagination** — Token-based cursor pagination for telemetry history

---

## Offline Handling

- **Connection loss** — Client uses exponential backoff reconnection (1s, 2s, 4s, max 30s)
- **Buffer and replay** — During disconnection, missed events are buffered server-side for up to 5 minutes
- **Last known position** — Map shows last known position with stale data indicator (grey marker)
- **Optimistic updates** — Dispatch actions committed locally before server confirmation

---

## Sample Usage

```typescript
"use client";

import { useFleetTelemetry } from "@/lib/telemetry/use-fleet-telemetry";
import { FleetMap } from "@/components/fleet/fleet-map";
import { TelemetryPanel } from "@/components/fleet/telemetry-panel";

export default function FleetPage() {
  const { vehicles, selectedVehicle, selectVehicle } = useFleetTelemetry();

  return (
    <div className="flex h-full">
      <FleetMap
        vehicles={vehicles}
        selectedVehicleId={selectedVehicle?.id}
        onVehicleSelect={selectVehicle}
        showHeatmap
        showGeofences
      />
      {selectedVehicle && (
        <TelemetryPanel
          vehicleId={selectedVehicle.id}
          telemetry={selectedVehicle.telemetry}
        />
      )}
    </div>
  );
}
```
