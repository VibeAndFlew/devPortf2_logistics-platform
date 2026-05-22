"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dispatchEvents } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Radio, ArrowRightCircle, AlertTriangle, MessageCircle, RefreshCw, Bell, Plus } from "lucide-react"

const typeIcon: Record<string, React.ReactNode> = {
  assignment: <ArrowRightCircle className="h-3.5 w-3.5 text-blue-400" />,
  status_change: <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />,
  delay: <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />,
  incident: <AlertTriangle className="h-3.5 w-3.5 text-destructive" />,
  comms: <MessageCircle className="h-3.5 w-3.5 text-primary" />,
  reroute: <Radio className="h-3.5 w-3.5 text-purple-400" />,
}
const priorityBadge: Record<string, "destructive" | "warning" | "info"> = {
  high: "destructive", medium: "warning", low: "info",
}
const typeOptions = ["all", "assignment", "status_change", "delay", "incident", "comms", "reroute"]

export default function DispatchPage() {
  const [typeFilter, setTypeFilter] = useState("all")

  const filtered = typeFilter === "all"
    ? dispatchEvents
    : dispatchEvents.filter((e) => e.type === typeFilter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Dispatch</h1>
          <p className="text-xs text-muted-foreground">Operational event log</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {typeOptions.map((t) => (
                <SelectItem key={t} value={t} className="text-xs capitalize">{t.replace("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" className="h-8 gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            New Dispatch
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            Event Feed ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {filtered.map((event, i) => (
              <div
                key={event.id}
                className={cn(
                  "flex items-start gap-3 rounded-md p-3 transition-colors",
                  !event.read ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-muted/30 border-l-2 border-transparent"
                )}
              >
                <div className="mt-0.5">{typeIcon[event.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground capitalize">{event.type.replace("_", " ")}</span>
                    {!event.read && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                    <Badge variant={priorityBadge[event.priority]} className="text-[9px] px-1.5 py-0 capitalize ml-auto">
                      {event.priority}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{event.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                    <span>{event.actor}</span>
                    <span>•</span>
                    <span>{new Date(event.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
