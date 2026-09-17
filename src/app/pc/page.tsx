import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { WolPanel } from "@/components/wol-panel"
import { PingStatus } from "@/components/ping-status"
import { PageHeader } from "@/components/page-header"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

async function getOrSyncPc() {
  const envIp = process.env.DEVICE_IP ?? null
  const envMac = process.env.DEVICE_MAC ?? null

  const existing = await prisma.device.findFirst({ where: { kind: "pc" } })
  if (!existing) {
    return prisma.device.create({
      data: { name: "Gaming-PC", kind: "pc", ip: envIp, mac: envMac },
    })
  }

  // .env ist die Quelle der Wahrheit für IP/MAC — bei Änderung nachziehen.
  if (existing.ip !== envIp || existing.mac !== envMac) {
    return prisma.device.update({
      where: { id: existing.id },
      data: { ip: envIp, mac: envMac },
    })
  }

  return existing
}

export default async function PcPage() {
  const device = await getOrSyncPc()
  const logs = await prisma.actionLog.findMany({
    where: { deviceId: device.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  return (
    <div>
      <PageHeader
        title="PC"
        description="Steuerung und Status deines Gaming-PCs"
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Status
            </CardTitle>
            {device.ip && <PingStatus host={device.ip} />}
          </CardHeader>
          <CardContent>
            <WolPanel deviceId={device.id} mac={device.mac} ip={device.ip} />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Geräteinfo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col gap-2.5">
                {[
                  ["Hostname", device.name],
                  ["IP-Adresse", device.ip ?? "—"],
                  ["MAC-Adresse", device.mac ?? "—"],
                ].map(([label, value], i, arr) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-mono">{value}</dd>
                    </div>
                    {i < arr.length - 1 && <Separator className="mt-2.5" />}
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Verlauf
              </CardTitle>
            </CardHeader>
            <CardContent>
              {logs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Noch keine Aktionen protokolliert.
                </p>
              )}
              <div className="flex flex-col">
                {logs.map((log, i) => (
                  <div key={log.id}>
                    <div className="flex gap-3 py-2.5 text-sm">
                      <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">
                        {log.createdAt.toLocaleTimeString("de-DE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>{log.action}</span>
                    </div>
                    {i < logs.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
