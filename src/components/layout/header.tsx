"use client"

import { useState, useEffect } from "react"
import { Bell, Radio } from "lucide-react"
import { vehicles } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const activeVehicles = vehicles.filter((v) => v.status === "active").length
  const idleVehicles = vehicles.filter((v) => v.status === "idle").length
  const maintVehicles = vehicles.filter((v) => v.status === "maintenance").length

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">FLEETWATCH ONLINE</span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">{activeVehicles} Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs text-muted-foreground">{idleVehicles} Idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-xs text-muted-foreground">{maintVehicles} Maint</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-muted-foreground">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </span>
        <div className="relative">
          <Bell className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-white">
            3
          </span>
        </div>
      </div>
    </header>
  )
}
