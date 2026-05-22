# API Reference

> FLEETWATCH internal API endpoints, WebSocket protocol, and server actions.

---

## REST API Routes

### Fleet

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/fleet/vehicles` | List all vehicles |
| `GET` | `/api/fleet/vehicles/:id` | Get vehicle details |
| `POST` | `/api/fleet/vehicles` | Register new vehicle |
| `PATCH` | `/api/fleet/vehicles/:id` | Update vehicle |
| `DELETE` | `/api/fleet/vehicles/:id` | Remove vehicle |
| `GET` | `/api/fleet/vehicles/:id/telemetry` | Get telemetry history |
| `GET` | `/api/fleet/vehicles/:id/maintenance` | Get maintenance schedule |

### Drivers

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/drivers` | List all drivers |
| `GET` | `/api/drivers/:id` | Get driver profile |
| `POST` | `/api/drivers` | Add driver |
| `PATCH` | `/api/drivers/:id` | Update driver |
| `GET` | `/api/drivers/:id/performance` | Get performance scorecard |

### Deliveries

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/deliveries` | List deliveries |
| `GET` | `/api/deliveries/:id` | Get delivery details |
| `POST` | `/api/deliveries` | Create delivery |
| `PATCH` | `/api/deliveries/:id` | Update delivery status |
| `POST` | `/api/deliveries/:id/proof` | Upload proof of delivery |

### Routes

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/routes/optimize` | Optimize route |
| `GET` | `/api/routes/:id` | Get route details |
| `PUT` | `/api/routes/:id/reroute` | Dynamic reroute |

### Dispatch

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/dispatch/board` | Get dispatch board state |
| `POST` | `/api/dispatch/assign` | Assign driver/vehicle to delivery |
| `POST` | `/api/dispatch/unassign` | Remove assignment |
| `POST` | `/api/dispatch/exception` | Report exception |

---

## WebSocket Protocol

### Endpoint
```
wss://fleetwatch.dev/ws/fleet
```

### Client → Server

| Type | Payload | Description |
|---|---|---|
| `subscribe` | `{ vehicles: string[] }` | Subscribe to vehicle telemetry |
| `unsubscribe` | `{ vehicles: string[] }` | Unsubscribe from vehicles |
| `history` | `{ vehicle_id, from, to }` | Request telemetry history |
| `ping` | `{}` | Keep-alive |

### Server → Client

| Type | Payload | Description |
|---|---|---|
| `telemetry` | `TelemetryEvent` | Real-time vehicle telemetry |
| `geofence_alert` | `GeofenceAlert` | Geofence entry/exit/violation |
| `status_change` | `StatusChange` | Vehicle status transition |
| `history` | `TelemetryEvent[]` | History response |
| `pong` | `{}` | Keep-alive response |
| `error` | `{ message: string }` | Error message |

---

## Server Actions

Server Actions are used for mutations that don't require REST endpoints:

| Action | Input | Description |
|---|---|---|
| `assignDelivery` | `{ deliveryId, driverId, vehicleId }` | Assign resources |
| `updateDeliveryStatus` | `{ deliveryId, status, notes? }` | Update delivery |
| `reportIncident` | `{ vehicleId, type, description }` | Report incident |
| `scheduleMaintenance` | `{ vehicleId, date, type }` | Schedule maintenance |

---

## Zod Schemas

All API inputs are validated with Zod schemas:

```typescript
const CreateVehicleSchema = z.object({
  name: z.string().min(1).max(100),
  vin: z.string().length(17),
  vehicle_type: z.enum(["truck", "van", "ev", "trailer"]),
  telemetry_device_id: z.string().optional(),
});

const OptimizeRouteSchema = z.object({
  vehicleId: z.string().uuid(),
  startLocation: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  stops: z.array(z.object({
    id: z.string(),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    type: z.enum(["pickup", "dropoff", "depot"]),
    timeWindow: z.object({
      start: z.string(),
      end: z.string(),
    }).optional(),
  })).min(1).max(50),
});
```
