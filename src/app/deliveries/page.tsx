"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { deliveries } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Package, Search, ArrowRight, Clock } from "lucide-react"

const statusBadge: Record<string, "success" | "warning" | "info" | "outline" | "destructive"> = {
  pending: "warning", picked_up: "info", in_transit: "info", delivered: "success", exception: "destructive", returned: "outline",
}
const priorityDot: Record<string, string> = {
  critical: "bg-destructive", express: "bg-amber-500", standard: "bg-blue-500",
}

export default function DeliveriesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filtered = deliveries.filter((d) => {
    if (search && !d.orderNumber.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== "all" && d.status !== statusFilter) return false
    if (priorityFilter !== "all" && d.priority !== priorityFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Deliveries</h1>
          <p className="text-xs text-muted-foreground">Order tracking & dispatch log</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-44 pl-7 text-xs" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Status</SelectItem>
              <SelectItem value="pending" className="text-xs">Pending</SelectItem>
              <SelectItem value="picked_up" className="text-xs">Picked Up</SelectItem>
              <SelectItem value="in_transit" className="text-xs">In Transit</SelectItem>
              <SelectItem value="delivered" className="text-xs">Delivered</SelectItem>
              <SelectItem value="exception" className="text-xs">Exception</SelectItem>
              <SelectItem value="returned" className="text-xs">Returned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Priority</SelectItem>
              <SelectItem value="critical" className="text-xs">Critical</SelectItem>
              <SelectItem value="express" className="text-xs">Express</SelectItem>
              <SelectItem value="standard" className="text-xs">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            Order Log ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left font-medium py-2 px-2">Order</th>
                  <th className="text-left font-medium py-2 px-2">Status</th>
                  <th className="text-left font-medium py-2 px-2">Route</th>
                  <th className="text-left font-medium py-2 px-2 hidden md:table-cell">Driver</th>
                  <th className="text-left font-medium py-2 px-2">Priority</th>
                  <th className="text-left font-medium py-2 px-2 hidden lg:table-cell">Progress</th>
                  <th className="text-left font-medium py-2 px-2 hidden lg:table-cell">ETA</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-2">
                      <span className="font-medium text-foreground">{d.orderNumber}</span>
                    </td>
                    <td className="py-2.5 px-2">
                      <Badge variant={statusBadge[d.status]} className="text-[9px] px-1.5 py-0 capitalize">
                        {d.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground max-w-[200px]">
                        <span className="truncate">{d.pickup.address.split(",")[0]}</span>
                        <ArrowRight className="h-2.5 w-2.5 shrink-0" />
                        <span className="truncate">{d.dropoff.address.split(",")[0]}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 hidden md:table-cell text-muted-foreground">{d.driver}</td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${priorityDot[d.priority]}`} />
                        <span className="capitalize text-[10px] text-muted-foreground">{d.priority}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={d.progress} className="h-1.5 w-16" />
                        <span className={cn("text-[10px] font-medium", d.progress >= 100 ? "text-emerald-400" : "text-foreground")}>
                          {d.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {d.eta ? new Date(d.eta).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
