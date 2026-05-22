# Route Optimization Engine

> Multi-stop route optimization, traffic-aware ETA calculation, and dynamic rerouting.

---

## Overview

The route optimization engine solves the Vehicle Routing Problem (VRP) with time windows for fleets of up to 50 stops per route. It combines heuristic solvers for speed with traffic-aware edge weights for accuracy.

---

## Solver Architecture

```
┌──────────────┐
│  Input       │
│  (Stops,     │
│   Vehicles,  │
│   Time Wins) │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌─────────────────┐
│  Nearest     │     │  2-Opt          │
│  Neighbor    │────▶│  Improvement    │
│  (Initial)   │     │  (Refinement)   │
└──────────────┘     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  Traffic-Aware   │
                     │  Weighting       │
                     │  (Mapbox API)    │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  Output          │
                     │  (Optimized      │
                     │   Route + ETAs)  │
                     └─────────────────┘
```

---

## Solver Details

### Phase 1: Initial Solution (Nearest Neighbor)

1. Start at the vehicle's current location or depot
2. Find the nearest unvisited stop by great-circle distance
3. Add it to the route
4. Repeat until all stops are visited
5. Return to depot if required

### Phase 2: Improvement (2-Opt)

For routes with fewer than 50 stops, a 2-opt improvement heuristic is applied:

1. Take the initial route from Phase 1
2. For every pair of edges `(i, i+1)` and `(j, j+1)`:
   - Remove the edges
   - Reconnect with `(i, j)` and `(i+1, j+1)` (reversing the segment)
   - If the new route is shorter, keep it
3. Repeat until no improvement is found

This typically converges in O(n²) iterations and yields routes within 5-10% of optimal.

### Phase 3: Traffic Weighting

After the geometric solver produces an optimized sequence, edge costs are updated with real-time traffic data from the Mapbox Directions API:

```
Weighted Cost = α × Distance + β × Duration(traffic) + γ × FuelCost
```

Where:
- `α = 0.3` (distance importance)
- `β = 0.5` (time importance, weighted with traffic)
- `γ = 0.2` (fuel cost importance)

---

## API

### Optimize Route

```typescript
interface RouteOptimizationInput {
  vehicleId: string;
  startLocation: { lat: number; lng: number };
  stops: Array<{
    id: string;
    location: { lat: number; lng: number };
    timeWindow?: { start: string; end: string };
    duration_min?: number;
    type: "pickup" | "dropoff" | "depot";
  }>;
  trafficAware?: boolean;
  returnToDepot?: boolean;
}

interface RouteOptimizationOutput {
  stops: Array<{
    id: string;
    sequence: number;
    eta: string;
    distance_from_prev_km: number;
    duration_from_prev_min: number;
  }>;
  total_distance_km: number;
  total_duration_min: number;
  total_cost_usd: number;
  fuel_estimate_gal: number;
  savings_vs_original: {
    distance_km: number;
    duration_min: number;
    cost_usd: number;
  };
}
```

### Example

```typescript
const result = await optimizeRoute({
  vehicleId: "FL-1042",
  startLocation: { lat: 40.7128, lng: -74.0060 },
  stops: [
    { id: "stop-1", location: { lat: 40.7580, lng: -73.9855 }, type: "pickup" },
    { id: "stop-2", location: { lat: 40.7484, lng: -73.9857 }, type: "dropoff" },
    { id: "stop-3", location: { lat: 40.7614, lng: -73.9776 }, type: "pickup" },
    { id: "stop-4", location: { lat: 40.7549, lng: -73.9840 }, type: "dropoff" },
  ],
  trafficAware: true,
  returnToDepot: false,
});

console.log(result);
// {
//   stops: [...],
//   total_distance_km: 42.3,
//   total_duration_min: 96,
//   total_cost_usd: 18.42,
//   savings_vs_original: { distance_km: 8.7, duration_min: 22, cost_usd: 3.81 }
// }
```

---

## Dynamic Rerouting

The route optimizer supports dynamic rerouting when real-time telemetry events indicate:

- **Route deviation** — Vehicle has strayed >1km from the planned route
- **Delay accumulation** — ETA for the next stop has slipped by >15 minutes
- **Driver request** — Manual reroute via the dispatch interface
- **Traffic event** — Major incident detected on the planned route

When a reroute is triggered, the solver re-runs from the vehicle's current position with the remaining unvisited stops, preserving any completed deliveries.

---

## Performance

| Route Size | Initial Solve | 2-Opt Refinement | With Traffic |
|---|---|---|---|
| 5 stops | <10ms | <5ms | ~200ms |
| 10 stops | <20ms | <15ms | ~400ms |
| 25 stops | ~50ms | ~100ms | ~1s |
| 50 stops | ~150ms | ~500ms | ~2.5s |

For routes >50 stops, consider using the LKH (Lin-Kernighan Helsgaun) solver via the batch API endpoint.

---

## Cost Model

The cost estimate accounts for:

- **Fuel** — Based on average fuel economy of the vehicle type × current fuel price
- **Tolls** — Along the optimized route (via Mapbox toll data)
- **Driver wages** — Duration × hourly rate
- **Vehicle depreciation** — Per-mile rate
- **Maintenance** — Per-mile rate, adjusted for vehicle age

---

## Implementation

The solver is implemented in `src/lib/routes/` with the following modules:

| File | Purpose |
|---|---|
| `solver.ts` | Core TSP/VRP solver (nearest neighbor + 2-opt) |
| `traffic.ts` | Mapbox traffic data integration |
| `cost-model.ts` | Cost estimation engine |
| `types.ts` | TypeScript interfaces and Zod schemas |
| `reroute.ts` | Dynamic rerouting logic |
| `utils.ts` | Distance calculations, time formatting |
