"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { vehicles, deliveries, dispatchEvents, drivers, warehouses } from "@/lib/mock-data"
import { Truck, Package, Users, Warehouse, Radio, AlertTriangle, TrendingUp, MapPin, Clock } from "lucide-react"

const statusColor: Record<string, string> = {
  active: "bg-emerald-500",
  idle: "bg-amber-500",
  maintenance: "bg-red-500",
  offline: "bg-gray-500",
  in_transit: "bg-blue-500",
  delivered: "bg-emerald-500",
  pending: "bg-amber-500",
  driving: "bg-emerald-500",
  resting: "bg-amber-500",
  available: "bg-blue-500",
}

export default function Dashboard() {
  const activeVehicles = vehicles.filter((v) => v.status === "active").length
  const inTransitDeliveries = deliveries.filter((d) => d.status === "in_transit").length
  const delivered = deliveries.filter((d) => d.status === "delivered").length
  const totalDeliveries = deliveries.length
  const onTimeRate = Math.round((delivered / totalDeliveries) * 100)
  const totalDrivers = drivers.length
  const availableDrivers = drivers.filter((d) => d.status === "available").length
  const fleetUtilization = Math.round(
    (vehicles.filter((v) => v.status === "active").length / vehicles.length) * 100
  )
  const pendingDispatch = dispatchEvents.filter((e) => !e.read && e.priority === "high").length

  const recentDeliveries = deliveries.filter((d) => d.status === "in_transit").slice(0, 4)
  const alerts = dispatchEvents.filter((e) => !e.read).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Command Center</h1>
          <p className="text-xs text-muted-foreground">Fleet intelligence overview</p>
        </div>
        <Badge variant="outline" className="gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          System Online
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card>
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Truck className="h-3 w-3" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Active Vehicles</span>
            </div>
            <div className="text-xl font-bold text-primary">{activeVehicles}</div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span>+2 from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Package className="h-3 w-3" />
              <span className="text-[10px] font-medium uppercase tracking-wider">In Transit</span>
            </div>
            <div className="text-xl font-bold text-foreground">{inTransitDeliveries}</div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="h-3 w-3 text-blue-500" />
              <span>{totalDeliveries} total orders</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-[10px] font-medium uppercase tracking-wider">On-Time Rate</span>
            </div>
            <div className="text-xl font-bold text-emerald-400">{onTimeRate}%</div>
            <Progress value={onTimeRate} className="h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-3 w-3" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Total Drivers</span>
            </div>
            <div className="text-xl font-bold text-foreground">{totalDrivers}</div>
            <div className="text-[10px] text-muted-foreground">{availableDrivers} available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Warehouse className="h-3 w-3" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Fleet Utilization</span>
            </div>
            <div className="text-xl font-bold text-amber-400">{fleetUtilization}%</div>
            <Progress value={fleetUtilization} className="h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Radio className="h-3 w-3" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Pending Dispatch</span>
            </div>
            <div className="text-xl font-bold text-destructive">{pendingDispatch}</div>
            <div className="text-[10px] text-muted-foreground">high priority</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Live Fleet Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["active", "idle", "maintenance", "offline"].map((status) => {
              const count = vehicles.filter((v) => v.status === status).length
              const pct = Math.round((count / vehicles.length) * 100)
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${statusColor[status]}`} />
                  <span className="w-20 text-xs capitalize text-muted-foreground">{status}</span>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          status === "active" ? "bg-emerald-500" :
                          status === "idle" ? "bg-amber-500" :
                          status === "maintenance" ? "bg-red-500" : "bg-gray-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-8 text-right text-xs font-medium text-foreground">{count}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[280px] overflow-y-auto">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-2 rounded-md bg-muted/50 p-2">
                <div className={`mt-0.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                  alert.priority === "high" ? "bg-destructive" :
                  alert.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
                }`} />
                <div className="min-w-0">
                  <p className="text-[11px] text-foreground leading-tight">{alert.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(alert.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Recent Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center gap-3 rounded-md border border-border p-2.5">
                <div className={`h-2 w-2 rounded-full ${
                  delivery.priority === "critical" ? "bg-destructive" :
                  delivery.priority === "express" ? "bg-amber-500" : "bg-blue-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{delivery.orderNumber}</span>
                    <Badge variant={delivery.status === "in_transit" ? "success" : "warning"} className="text-[9px] px-1.5 py-0">
                      {delivery.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground truncate">{delivery.pickup.address.split(",")[0]}</span>
                    <span className="text-[10px] text-muted-foreground">→</span>
                    <span className="text-[10px] text-muted-foreground truncate">{delivery.dropoff.address.split(",")[0]}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-foreground">{delivery.progress}%</div>
                  <div className="w-16 mt-1">
                    <Progress value={delivery.progress} className="h-1" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Fleet Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {warehouses.slice(0, 4).map((wh) => (
              <div key={wh.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground">{wh.name}</span>
                  <span className="text-[10px] text-muted-foreground">{wh.utilization}% utilized</span>
                </div>
                <Progress value={wh.utilization} className="h-1.5" />
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>{wh.availableDocks}/{wh.dockDoors} docks free</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>{wh.staff} staff</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
