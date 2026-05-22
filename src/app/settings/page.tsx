"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { User, Settings2, Bell, Shield, Link } from "lucide-react"

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "config", label: "Fleet Config", icon: Settings2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Link },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        <p className="text-xs text-muted-foreground">System configuration & preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="h-9">
          {sections.map((s) => (
            <TabsTrigger key={s.id} value={s.id} className="text-xs gap-1.5">
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Profile Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Full Name</Label>
                  <Input defaultValue="Vibhanshu Buldeo" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Email</Label>
                  <Input defaultValue="v.buldeo@fleetwatch.io" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Phone</Label>
                  <Input defaultValue="+1 (415) 555-0199" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Role</Label>
                  <Input defaultValue="CEO & Fleet Director" className="h-8 text-xs" />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button size="sm" className="h-8 text-xs">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Fleet Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Max Driver Hours</Label>
                  <Input defaultValue="14" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Refuel Threshold (%)</Label>
                  <Input defaultValue="25" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Max Load Weight (lbs)</Label>
                  <Input defaultValue="26000" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Idle Timeout (min)</Label>
                  <Input defaultValue="15" className="h-8 text-xs" />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button size="sm" className="h-8 text-xs">Update Config</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Delay Alerts", desc: "Notify when shipments are delayed" },
                { label: "Incident Reports", desc: "Notify on accidents or breakdowns" },
                { label: "Maintenance Reminders", desc: "Notify when service is due" },
                { label: "Dispatch Assignments", desc: "Notify on new dispatch events" },
                { label: "Driver Status Changes", desc: "Notify when drivers change status" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div>
                    <div className="text-xs font-medium text-foreground">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Security Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Current Password</Label>
                  <Input type="password" className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">New Password</Label>
                  <Input type="password" className="h-8 text-xs" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <div className="text-xs font-medium text-foreground">Two-Factor Authentication</div>
                  <div className="text-[10px] text-muted-foreground">Add an extra layer of security</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <div className="text-xs font-medium text-foreground">Session Timeout</div>
                  <div className="text-[10px] text-muted-foreground">Auto-logout after inactivity</div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button size="sm" className="h-8 text-xs">Update Security</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Integrations</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Slack", desc: "Dispatch notifications & alerts", status: "Connected" },
                { name: "Twilio", desc: "SMS driver communications", status: "Connected" },
                { name: "Google Maps", desc: "Navigation & route optimization", status: "Connected" },
                { name: "QuickBooks", desc: "Invoice & billing sync", status: "Disconnected" },
                { name: "Samsara", desc: "IoT telemetry integration", status: "Connected" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div>
                    <div className="text-xs font-medium text-foreground">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                  </div>
                  <Badge variant={item.status === "Connected" ? "success" : "outline"} className="text-[9px] px-1.5 py-0">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
