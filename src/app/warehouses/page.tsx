"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { warehouses } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Warehouse, Users, Dock, ArrowUpDown, ClipboardCheck } from "lucide-react"

const statusBadge: Record<string, "success" | "destructive" | "warning"> = {
  active: "success", maintenance: "destructive", full: "warning",
}
const statusDot: Record<string, string> = {
  active: "bg-emerald-500", maintenance: "bg-red-500", full: "bg-amber-500",
}

export default function WarehousesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Warehouses</h1>
          <p className="text-xs text-muted-foreground">Distribution centers & inventory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {warehouses.map((w) => (
          <Card key={w.id} className="hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${statusDot[w.status]}`} />
                    <CardTitle className="text-sm font-semibold">{w.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] px-1 py-0">{w.code}</Badge>
                    <Badge variant={statusBadge[w.status]} className="text-[9px] px-1.5 py-0 capitalize">{w.status}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Capacity Utilization</span>
                  <span className={cn(w.utilization >= 90 ? "text-destructive" : w.utilization >= 75 ? "text-amber-400" : "text-emerald-400")}>
                    {w.utilization}%
                  </span>
                </div>
                <Progress value={w.utilization} className={cn("h-1.5", w.utilization >= 90 ? "[&>div]:bg-destructive" : w.utilization >= 75 ? "[&>div]:bg-amber-500" : "")} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-muted/50 p-2 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Dock className="h-3 w-3" /> Dock Doors
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {w.availableDocks}<span className="text-[10px] font-normal text-muted-foreground">/{w.dockDoors}</span>
                  </div>
                </div>
                <div className="rounded-md bg-muted/50 p-2 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Users className="h-3 w-3" /> Staff
                  </div>
                  <div className="text-sm font-bold text-foreground">{w.staff}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ArrowUpDown className="h-3 w-3" />
                  In: {w.inboundCount} / Out: {w.outboundCount}
                </span>
                <span className="flex items-center gap-1">
                  <ClipboardCheck className="h-3 w-3" />
                  {w.lastAudit}
                </span>
              </div>

              <div className="text-[10px] text-muted-foreground">
                {w.location.address}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
