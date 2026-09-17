import { MonitorSmartphone, Router } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { TelemetryPanel } from "@/components/telemetry-panel"
import { RecentLogs } from "@/components/recent-logs"
import { getSystemInfo } from "@/lib/system"

export const dynamic = "force-dynamic"

const linkTools = [
  {
    icon: MonitorSmartphone,
    title: "Remote Desktop",
    description: "Per RDP auf den Gaming-PC verbinden",
    href: process.env.DEVICE_IP ? `rdp://${process.env.DEVICE_IP}` : undefined,
    label: "Verbinden",
  },
  {
    icon: Router,
    title: "Router-Login",
    description: "Admin-Oberfläche des Routers öffnen",
    href: process.env.DEVICE_BROADCAST
      ? `http://${process.env.DEVICE_BROADCAST.replace(/\.255$/, ".1")}`
      : undefined,
    label: "Öffnen",
  },
]

export default async function ToolsPage() {
  const systemInfo = await getSystemInfo()

  return (
    <div>
      <PageHeader title="Tools" description="Kurzbefehle für dein Heimnetz" />
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {linkTools.map(({ icon: Icon, title, description, href, label }) => (
          <Card key={title} className="justify-between">
            <CardHeader>
              <Icon className="mb-2 size-5 text-accent" strokeWidth={1.5} />
              <CardTitle className="text-[15px]">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="sm"
                disabled={!href}
                nativeButton={!href}
                render={
                  href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" />
                  ) : undefined
                }
              >
                {label}
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="text-[15px]">System-Status</CardTitle>
            <CardDescription>Live-Telemetrie des Raspberry Pi</CardDescription>
          </CardHeader>
          <CardContent>
            <TelemetryPanel initial={systemInfo} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[15px]">Aktions-Log</CardTitle>
            <CardDescription>Letzte protokollierte Aktionen</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentLogs />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
