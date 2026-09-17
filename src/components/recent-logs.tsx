import { prisma } from "@/lib/prisma"

async function RecentLogs({ limit = 6 }: { limit?: number }) {
  const logs = await prisma.actionLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { device: true },
  })

  if (logs.length === 0) {
    return <p className="text-sm text-muted-foreground">Noch keine Aktionen protokolliert.</p>
  }

  return (
    <div className="flex flex-col">
      {logs.map((log, i) => (
        <div key={log.id}>
          <div className="flex items-center justify-between gap-3 py-2 text-sm">
            <span className="truncate">
              <span className="text-muted-foreground">{log.device.name}</span>
              {" · "}
              {log.action}
            </span>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {log.createdAt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          {i < logs.length - 1 && <div className="h-px bg-border" />}
        </div>
      ))}
    </div>
  )
}

export { RecentLogs }
