import Link from "next/link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { TelemetryPanel } from "@/components/telemetry-panel"
import { PageHeader } from "@/components/page-header"
import { getSystemInfo } from "@/lib/system"

export const dynamic = "force-dynamic"

const links = [
  {
    href: "/pc",
    title: "PC",
    description: "Power-Steuerung, Geräteinfo, Verlauf",
    footer: "Steuerung öffnen",
  },
  {
    href: "/network",
    title: "Netzwerk",
    description: "Internet, Ping, verbundene Geräte",
    footer: "Details ansehen",
  },
  {
    href: "/tools",
    title: "Tools",
    description: "Homelab-Werkzeuge im Überblick",
    footer: "Alle Tools",
  },
]

export default async function Home() {
  const systemInfo = await getSystemInfo()

  return (
    <div className="flex flex-col gap-7">
      <PageHeader title="Übersicht" description="Alle Systeme auf einen Blick" />

      <div className="grid gap-3.5 sm:grid-cols-3">
        {links.map(({ href, title, description, footer }) => (
          <Link key={href} href={href}>
            <Card className="flex h-full min-h-[112px] justify-between gap-3.5 transition-colors hover:border-accent/40 hover:bg-secondary/40">
              <CardHeader className="gap-1.5">
                <CardTitle className="text-[15px]">{title}</CardTitle>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardHeader>
              <div className="px-6 font-mono text-xs text-accent">{footer} →</div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Raspberry Pi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TelemetryPanel initial={systemInfo} />
        </CardContent>
      </Card>
    </div>
  )
}
