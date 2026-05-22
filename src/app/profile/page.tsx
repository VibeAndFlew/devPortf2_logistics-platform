"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { drivers, deliveries, dispatchEvents } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Award, Activity, Clock, Star, MapPin, Phone, Mail } from "lucide-react"

export default function ProfilePage() {
  const user = drivers[0]
  const initials = user.name.split(" ").map((n) => n[0]).join("")
  const completedDeliveries = deliveries.filter((d) => d.driver === user.name && d.status === "delivered").length
  const activeDeliveries = deliveries.filter((d) => d.driver === user.name && d.status === "in_transit").length
  const recentEvents = dispatchEvents.filter((e) => e.actor === user.name || e.actor === "System").slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
        <p className="text-xs text-muted-foreground">Personal stats & activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="h-16 w-16 mb-3">
                <AvatarFallback className="bg-primary/20 text-primary text-lg font-bold">{initials}</AvatarFallback>
              </Avatar>
              <h2 className="text-base font-bold text-foreground">{user.name}</h2>
              <p className="text-xs text-muted-foreground">CEO & Fleet Director</p>
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-3 w-3", i < Math.floor(user.rating) ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{user.rating}</span>
              </div>
              <Separator className="my-3" />
              <div className="space-y-1.5 w-full text-left text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3 w-3" /> {user.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3 w-3" /> {user.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3 w-3" /> Los Angeles, CA
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              {user.certification.map((cert) => (
                <Badge key={cert} variant="secondary" className="text-[9px] px-2 py-0.5">{cert}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-3 space-y-1">
                <div className="text-[10px] text-muted-foreground">Total Trips</div>
                <div className="text-xl font-bold text-foreground">{user.totalTrips}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 space-y-1">
                <div className="text-[10px] text-muted-foreground">Total Hours</div>
                <div className="text-xl font-bold text-foreground">{user.totalHours.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 space-y-1">
                <div className="text-[10px] text-muted-foreground">Completed</div>
                <div className="text-xl font-bold text-emerald-400">{completedDeliveries}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 space-y-1">
                <div className="text-[10px] text-muted-foreground">Active</div>
                <div className="text-xl font-bold text-blue-400">{activeDeliveries}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "On-Time Delivery", value: 96, color: "bg-emerald-500" },
                { label: "Fuel Efficiency", value: 84, color: "bg-primary" },
                { label: "Customer Rating", value: 92, color: "bg-amber-500" },
                { label: "Route Compliance", value: 88, color: "bg-blue-500" },
              ].map((m) => (
                <div key={m.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-medium text-foreground">{m.value}%</span>
                  </div>
                  <Progress value={m.value} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-2 rounded-md bg-muted/50 p-2">
                  <div className={`mt-0.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                    event.priority === "high" ? "bg-destructive" :
                    event.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
                  }`} />
                  <div className="min-w-0">
                    <p className="text-[11px] text-foreground leading-tight">{event.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(event.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
