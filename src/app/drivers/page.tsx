"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { drivers } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Star, Phone, Mail, Award, Clock, Search } from "lucide-react"

const statusDots: Record<string, string> = {
  driving: "bg-emerald-500",
  resting: "bg-amber-500",
  offline: "bg-gray-500",
  available: "bg-blue-500",
}
const statusBadge: Record<string, "success" | "warning" | "outline" | "info"> = {
  driving: "success", resting: "warning", offline: "outline", available: "info",
}

export default function DriversPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = drivers.filter((d) => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== "all" && d.status !== statusFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Drivers</h1>
          <p className="text-xs text-muted-foreground">Driver roster & compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-44 pl-7 text-xs" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Status</SelectItem>
              <SelectItem value="driving" className="text-xs">Driving</SelectItem>
              <SelectItem value="resting" className="text-xs">Resting</SelectItem>
              <SelectItem value="available" className="text-xs">Available</SelectItem>
              <SelectItem value="offline" className="text-xs">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((d) => {
          const initials = d.name.split(" ").map((n) => n[0]).join("")
          return (
            <Card key={d.id} className="hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted text-xs font-medium text-foreground">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-semibold">{d.name}</CardTitle>
                        <Badge variant={statusBadge[d.status]} className="text-[9px] px-1.5 py-0 capitalize">{d.status}</Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("h-3 w-3", i < Math.floor(d.rating) ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
                        ))}
                        <span className="text-[10px] text-muted-foreground ml-1">{d.rating}</span>
                      </div>
                    </div>
                  </div>
                  {d.status === "driving" && <span className={`h-2 w-2 rounded-full ${statusDots[d.status]} animate-pulse`} />}
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{d.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{d.email}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Vehicle</span>
                  <span className="font-medium text-foreground">{d.vehicle}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Trips</span>
                  <span className="font-medium text-foreground">{d.totalTrips}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Hours Today</span>
                    <span className={cn(d.currentHours > 11 ? "text-destructive" : d.currentHours > 8 ? "text-amber-400" : "text-emerald-400")}>
                      {d.currentHours}h / {d.maxHours}h
                    </span>
                  </div>
                  <Progress value={(d.currentHours / d.maxHours) * 100} className={cn("h-1", d.currentHours > 11 ? "[&>div]:bg-destructive" : d.currentHours > 8 ? "[&>div]:bg-amber-500" : "")} />
                </div>
                <div className="flex flex-wrap gap-1">
                  {d.certification.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-[8px] px-1 py-0 flex items-center gap-0.5">
                      <Award className="h-2.5 w-2.5" />{cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
