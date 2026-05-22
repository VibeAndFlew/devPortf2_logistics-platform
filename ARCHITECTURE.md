# FLEETWATCH — Architecture

> System architecture, data flow, and design decisions for the Fleet Intelligence platform.

---

## System Overview

FLEETWATCH follows a **layered architecture** with clear separation between presentation, orchestration, and data planes. The system is designed for horizontal scalability with real-time telemetry as the primary data spine.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                 │
│  Next.js 16 App (React 19, RSC, SSR)  │  Service Worker (Offline)  │
├─────────────────────────────────────────────────────────────────────┤
│                        EDGE LAYER                                   │
│  Vercel Edge Network  │  Middleware (Auth, Geo, Rewrites)           │
├─────────────────────────────────────────────────────────────────────┤
│                        SERVER LAYER                                 │
│  API Routes (REST)  │  Server Actions  │  WebSocket  │  SSE         │
├─────────────────────────────────────────────────────────────────────┤
│                        CACHE LAYER                                  │
│  Redis (Session, Pub/Sub, Query Cache)                              │
├─────────────────────────────────────────────────────────────────────┤
│                        DATA LAYER                                   │
│  PostgreSQL (Primary)  │  Read Replicas  │  S3 (Documents/Images)   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Telemetry Pipeline

The telemetry pipeline is the heart of FLEETWATCH. It ingests real-time vehicle data, processes it through a validation and enrichment chain, and broadcasts updates to connected clients.

```
Vehicle GPS/G Sensor
     │
     ▼
  WebSocket Client ──► Redis Pub/Sub ──► WebSocket Server ──► Connected Clients
     │
     ▼
  Validation (Zod Schema)
     │
     ▼
  Enrichment (Geofence Check, Speed Calc)
     │
     ▼
  Batch Writer ──► PostgreSQL (Telemetry Table)
```

### Key Design Decisions

1. **WebSocket for real-time, SSE for widgets** — Telemetry streams use WebSocket for bidirectional communication; dashboard KPI widgets use SSE for simpler server-to-client push
2. **Redis Pub/Sub for fan-out** — When horizontally scaled, telemetry events published to Redis are broadcast to all server instances
3. **Batch writes for durability** — Raw telemetry is batched and written to PostgreSQL every 5 seconds to avoid write amplification
4. **Client-side coalescing** — The telemetry hook buffers events and flushes on a 1-second interval to reduce WS message frequency

---

## Route Optimization Engine

The route optimization module uses a multi-stop TSP solver with traffic awareness:

1. **Input** — Ordered stops with geocoded addresses, time windows, vehicle capabilities
2. **Solver** — Nearest-neighbor heuristic + 2-opt improvement for ~50-stop routes; LKH for >50 stops
3. **Traffic Integration** — Mapbox Directions API traffic data weights edge costs
4. **Output** — Optimized stop sequence, ETAs per stop, total distance/duration, cost estimate

---

## Component Tree (Key Modules)

```
<FleetDashboard>
├── <FleetMap>                    — Mapbox GL map with vehicle markers
│   ├── <VehicleMarker>           — Animated marker per vehicle
│   ├── <GeofenceOverlay>        — Geofence zone rendering
│   └── <HeatmapLayer>           — Fleet density visualization
├── <TelemetryPanel>             — Right-side telemetry inspector
│   ├── <VehicleTelemetry>       — Speed, fuel, diagnostics
│   ├── <DriverCard>             — Driver info card
│   └── <TripTimeline>           — Trip event timeline
├── <FleetSidebar>               — Vehicle list with status indicators
└── <KPIStrip>                   — Live KPI bar (active, idle, maintenance)
```

---

## Database Schema (Core Entities)

```
fleet_vehicles
  id UUID PK
  name VARCHAR(100)
  vin VARCHAR(17) UNIQUE
  vehicle_type ENUM('truck', 'van', 'ev', 'trailer')
  status ENUM('active', 'idle', 'maintenance', 'offline')
  telemetry_device_id VARCHAR(50)
  created_at TIMESTAMPTZ
  updated_at TIMESTAMPTZ

telemetry_events
  id BIGSERIAL PK
  vehicle_id UUID FK
  latitude DECIMAL(10,7)
  longitude DECIMAL(10,7)
  speed_kmh DECIMAL(5,1)
  heading DECIMAL(5,1)
  fuel_level_pct DECIMAL(4,1)
  engine_temp_c DECIMAL(4,1)
  odometer_km DECIMAL(10,1)
  recorded_at TIMESTAMPTZ
  ingested_at TIMESTAMPTZ

drivers
  id UUID PK
  full_name VARCHAR(100)
  license_number VARCHAR(50)
  license_class VARCHAR(10)
  certification_expiry DATE
  status ENUM('available', 'driving', 'off_duty', 'sleeper')
  hos_remaining_min INT
  score DECIMAL(3,2)

deliveries
  id UUID PK
  driver_id UUID FK
  vehicle_id UUID FK
  status ENUM('pending', 'in_transit', 'delivered', 'exception')
  pickup_location JSONB
  dropoff_location JSONB
  planned_eta TIMESTAMPTZ
  actual_arrival TIMESTAMPTZ
  proof_of_delivery JSONB
```

---

## Performance Targets

| Metric | Target | Measurement |
|---|---|---|
| Telemetry latency (vehicle→dashboard) | <2s | End-to-end WS trace |
| Dashboard time-to-interactive | <2s | Lighthouse |
| Fleet page FPS (1000 vehicles) | 30fps | Chrome DevTools |
| API p99 response time | <200ms | Sentry tracing |
| Build time | <90s | Vercel build logs |
| Lighthouse score | >90 | Lighthouse CI |

---

## Security Architecture

- **Zero-trust networking** — All inter-service communication requires authentication
- **API key proxy** — Third-party API keys never reach the client; server-side proxy all external requests
- **Input validation** — Zod schemas at every API boundary
- **Rate limiting** — Per-IP and per-session rate limits on telemetry ingestion endpoints
- **CSP** — Strict Content Security Policy prevents XSS and data exfiltration

---

## Deployment Architecture

```
                    ┌──────────────┐
                    │   Vercel     │
                    │   Edge       │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
         ┌────┴───┐  ┌────┴───┐  ┌────┴───┐
         │ Next   │  │ Next   │  │ Next   │  (Serverless)
         │ Instance│  │ Instance│  │ Instance│
         └────┬───┘  └────┬───┘  └────┬───┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────┴──────┐
                    │   Redis     │
                    │  (Pub/Sub)  │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │ PostgreSQL  │
                    │  (Primary)  │
                    └─────────────┘
```
