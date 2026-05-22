"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { vehicles } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Search, MapPin, Navigation, Gauge, Fuel, Thermometer, ArrowUp } from "lucide-react"

const statusColors: Record<string, string> = {
  active: "text-emerald-500",
  idle: "text-amber-500",
  maintenance: "text-red-500",
  offline: "text-gray-500",
}
const statusDots: Record<string, string> = {
  active: "bg-emerald-500",
  idle: "bg-amber-500",
  maintenance: "bg-red-500",
  offline: "bg-gray-500",
}

export default function FleetPage() {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)

  const filtered = vehicles.filter((v) => {
    if (filter !== "all" && v.status !== filter) return false
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.plate.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const selected = vehicles.find((v) => v.id === selectedVehicle)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Live Fleet</h1>
          <p className="text-xs text-muted-foreground">Real-time vehicle tracking & telemetry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[400px] overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#141820_0%,_#0c0f14_100%)]">
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `linear-gradient(#06d6a0 1px, transparent 1px), linear-gradient(90deg, #06d6a0 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-primary/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Map integration — satellite view</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-[300px]">
                  {filtered.slice(0, 8).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVehicle(v.id)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] transition-all",
                        selectedVehicle === v.id ? "bg-primary/20 border border-primary" : "bg-card border border-border hover:bg-secondary"
                      )}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusDots[v.status]}`} />
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <Input
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-xs"
          />
          <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
            <TabsList className="w-full h-8">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="active" className="text-xs">Active</TabsTrigger>
              <TabsTrigger value="idle" className="text-xs">Idle</TabsTrigger>
              <TabsTrigger value="maintenance" className="text-xs">Maint</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
            {filtered.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVehicle(v.id)}
                className={cn(
                  "w-full text-left rounded-md border border-border bg-card p-2.5 transition-all hover:bg-secondary",
                  selectedVehicle === v.id && "border-primary"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${statusDots[v.status]}`} />
                    <span className="text-sm font-medium text-foreground">{v.name}</span>
                  </div>
                  <span className={cn("text-xs font-medium capitalize", statusColors[v.status])}>{v.status}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span>{v.plate}</span>
                  <span>{v.speed} mph</span>
                  <span>{v.location.address.split(",")[0]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Navigation className="h-4 w-4 text-primary" />
              {selected.name} — Telemetry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="rounded-md bg-muted/50 p-2.5 space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Gauge className="h-3 w-3" /> Speed
                </div>
                <div className="text-sm font-bold text-foreground">{selected.speed} <span className="text-[10px] font-normal text-muted-foreground">mph</span></div>
              </div>
              <div className="rounded-md bg-muted/50 p-2.5 space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ArrowUp className="h-3 w-3" /> Heading
                </div>
                <div className="text-sm font-bold text-foreground">{selected.heading}°</div>
              </div>
              <div className="rounded-md bg-muted/50 p-2.5 space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Fuel className="h-3 w-3" /> Fuel
                </div>
                <div className="text-sm font-bold text-foreground">{selected.fuelLevel}%</div>
              </div>
              <div className="rounded-md bg-muted/50 p-2.5 space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Thermometer className="h-3 w-3" /> Engine
                </div>
                <div className="text-sm font-bold text-foreground">{selected.telemetry.engineTemp}°F</div>
              </div>
              <div className="rounded-md bg-muted/50 p-2.5 space-y-1">
                <div className="text-[10px] text-muted-foreground">Tire Pressure</div>
                <div className="text-sm font-bold text-foreground">{selected.telemetry.tirePressure}%</div>
              </div>
              <div className="rounded-md bg-muted/50 p-2.5 space-y-1">
                <div className="text-[10px] text-muted-foreground">Weight</div>
                <div className="text-sm font-bold text-foreground">{selected.onboardWeight.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">lbs</span></div>
              </div>
              <div className="rounded-md bg-muted/50 p-2.5 space-y-1">
                <div className="text-[10px] text-muted-foreground">Odometer</div>
                <div className="text-sm font-bold text-foreground">{(selected.odometer / 1000).toFixed(1)}k</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
              <span>Driver: {selected.driver}</span>
              <span>VIN: {selected.vin}</span>
              <span>Last Service: {selected.lastService}</span>
              <span>Location: {selected.location.address}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
