"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { routes } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Map, Gauge, Cloud, Fuel, ArrowRight, Clock } from "lucide-react"

const statusBadge: Record<string, "success" | "outline" | "warning" | "destructive"> = {
  active: "success", completed: "outline", planned: "warning", cancelled: "destructive",
}
const trafficDot: Record<string, string> = {
  low: "bg-emerald-500", moderate: "bg-amber-500", heavy: "bg-red-500",
}

export default function RoutesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Routes</h1>
          <p className="text-xs text-muted-foreground">Planned & active shipping lanes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {routes.map((r) => (
          <Card key={r.id} className="hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-semibold">{r.name}</CardTitle>
                  </div>
                  <Badge variant={statusBadge[r.status]} className="text-[9px] px-1.5 py-0 capitalize">{r.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                {r.waypoints.map((wp, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={cn("h-1.5 w-1.5 rounded-full", i === 0 ? "bg-emerald-500" : i === r.waypoints.length - 1 ? "bg-destructive" : "bg-muted-foreground/30")} />
                    <span className="text-[10px] text-muted-foreground">{wp.name}</span>
                    {i < r.waypoints.length - 1 && <ArrowRight className="h-2.5 w-2.5 text-muted-foreground/30" />}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-muted/50 p-2 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Gauge className="h-3 w-3" /> Distance
                  </div>
                  <div className="text-sm font-bold text-foreground">{r.distance} <span className="text-[10px] font-normal text-muted-foreground">mi</span></div>
                </div>
                <div className="rounded-md bg-muted/50 p-2 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> Duration
                  </div>
                  <div className="text-sm font-bold text-foreground">{r.estimatedDuration < 24 ? `${r.estimatedDuration}h` : `${(r.estimatedDuration / 24).toFixed(1)}d`}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${trafficDot[r.trafficLevel]}`} />
                  Traffic: {r.trafficLevel}
                </span>
                <span className="flex items-center gap-1">
                  <Cloud className="h-3 w-3" />
                  {r.weather}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Driver</span>
                <span className="font-medium text-foreground">{r.driver}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Deliveries</span>
                <span className="font-medium text-foreground">{r.deliveries.length}</span>
              </div>
              {r.fuelUsed > 0 && (
                <div className="flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1 text-muted-foreground"><Fuel className="h-3 w-3" /> Fuel Used</span>
                  <span className="font-medium text-foreground">{r.fuelUsed} gal</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


