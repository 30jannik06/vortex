import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { PingStatus } from "@/components/ping-status"
import { PingLatency } from "@/components/ping-latency"
import { PageHeader } from "@/components/page-header"
import { AddDeviceForm } from "@/components/add-device-form"
import { DeviceRowActions } from "@/components/device-row-actions"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const INTERNET_PROBE = "1.1.1.1"

export default async function NetworkPage() {
  const devices = await prisma.device.findMany({ orderBy: { createdAt: "asc" } })
  const routerIp = process.env.DEVICE_BROADCAST?.replace(/\.255$/, ".1")

  return (
    <div>
      <PageHeader
        title="Netzwerk"
        description="Verbindungsstatus und Geräte im Heimnetz"
      />

      <div className="mb-4 grid gap-3.5 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Internet
            </CardTitle>
            <PingStatus host={INTERNET_PROBE} />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Ping
            </CardTitle>
            <PingLatency host={INTERNET_PROBE} />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Router
            </CardTitle>
            {routerIp ? <PingStatus host={routerIp} /> : <span>—</span>}
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Geräte
          </CardTitle>
          <AddDeviceForm />
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>MAC</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">{device.name}</TableCell>
                <TableCell className="text-muted-foreground">{device.kind}</TableCell>
                <TableCell className="font-mono">{device.ip ?? "—"}</TableCell>
                <TableCell className="font-mono">{device.mac ?? "—"}</TableCell>
                <TableCell>
                  {device.ip ? <PingStatus host={device.ip} /> : "—"}
                </TableCell>
                <TableCell>
                  {device.kind !== "pc" && <DeviceRowActions deviceId={device.id} />}
                </TableCell>
              </TableRow>
            ))}
            {devices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Keine Geräte hinterlegt.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
