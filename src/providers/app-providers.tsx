"use client"

import { TooltipProvider } from "@/components/ui/tooltip"

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      {children}
    </TooltipProvider>
  )
}
