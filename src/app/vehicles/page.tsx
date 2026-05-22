"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { vehicles } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Gauge, Fuel, Thermometer, Search, Wrench } from "lucide-react"

const statusDots: Record<string, string> = {
  active: "bg-emerald-500",
  idle: "bg-amber-500",
  maintenance: "bg-red-500",
  offline: "bg-gray-500",
}
const statusBadge: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  active: "success", idle: "warning", maintenance: "destructive", offline: "outline",
}

export default function VehiclesPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = vehicles.filter((v) => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.plate.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== "all" && v.type !== typeFilter) return false
    if (statusFilter !== "all" && v.status !== statusFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Vehicles</h1>
          <p className="text-xs text-muted-foreground">Fleet inventory & telemetry</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-44 pl-7 text-xs" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Types</SelectItem>
              <SelectItem value="truck" className="text-xs">Truck</SelectItem>
              <SelectItem value="van" className="text-xs">Van</SelectItem>
              <SelectItem value="trailer" className="text-xs">Trailer</SelectItem>
              <SelectItem value="container_ship" className="text-xs">Container Ship</SelectItem>
              <SelectItem value="cargo_plane" className="text-xs">Cargo Plane</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Status</SelectItem>
              <SelectItem value="active" className="text-xs">Active</SelectItem>
              <SelectItem value="idle" className="text-xs">Idle</SelectItem>
              <SelectItem value="maintenance" className="text-xs">Maintenance</SelectItem>
              <SelectItem value="offline" className="text-xs">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((v) => (
          <Card key={v.id} className="hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${statusDots[v.status]}`} />
                  <CardTitle className="text-sm font-semibold">{v.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{v.plate}</span>
                  <span className="text-[10px] text-muted-foreground capitalize">{v.type.replace("_", " ")}</span>
                </div>
              </div>
              <Badge variant={statusBadge[v.status]} className="text-[9px] px-1.5 py-0 capitalize">
                {v.status === "active" ? `${v.speed} mph` : v.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wrench className="h-3 w-3" />
                <span>Driver: {v.driver}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1"><Fuel className="h-3 w-3" /> Fuel</span>
                  <span className={cn(v.fuelLevel < 20 ? "text-destructive" : v.fuelLevel < 40 ? "text-amber-400" : "text-emerald-400")}>
                    {v.fuelLevel}%
                  </span>
                </div>
                <Progress value={v.fuelLevel} className={cn("h-1", v.fuelLevel < 20 ? "[&>div]:bg-destructive" : v.fuelLevel < 40 ? "[&>div]:bg-amber-500" : "")} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded bg-muted/50 p-1.5 text-center">
                  <Gauge className="h-3 w-3 text-muted-foreground mx-auto" />
                  <div className="text-[10px] font-medium text-foreground">{v.speed} <span className="text-[8px] text-muted-foreground">mph</span></div>
                </div>
                <div className="rounded bg-muted/50 p-1.5 text-center">
                  <Thermometer className="h-3 w-3 text-muted-foreground mx-auto" />
                  <div className="text-[10px] font-medium text-foreground">{v.telemetry.engineTemp}°</div>
                </div>
                <div className="rounded bg-muted/50 p-1.5 text-center">
                  <div className="text-[10px] font-medium text-foreground">{(v.odometer / 1000).toFixed(0)}k</div>
                  <div className="text-[8px] text-muted-foreground">odometer</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
