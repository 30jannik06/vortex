"use client"

import { useEffect, useState } from "react"
import type { SystemInfo } from "@/lib/system"
import { Sparkline } from "@/components/sparkline"

const POLL_INTERVAL_MS = 5000
const HISTORY_LENGTH = 20

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function Row({
  label,
  value,
  history,
  sparklineClassName,
}: {
  label: string
  value: string
  history?: number[]
  sparklineClassName?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs tracking-wide text-muted-foreground">{label}</dt>
      <div className="flex items-center gap-3">
        {history && history.length > 1 && (
          <Sparkline data={history} className={sparklineClassName ?? "h-4 w-14 text-accent"} />
        )}
        <dd className="font-mono text-sm tabular-nums text-foreground">{value}</dd>
      </div>
    </div>
  )
}

function TelemetryPanel({ initial }: { initial: SystemInfo }) {
  const [info, setInfo] = useState(initial)
  const [cpuHistory, setCpuHistory] = useState<number[]>([initial.cpuPercent])
  const [tempHistory, setTempHistory] = useState<number[]>(
    initial.tempCelsius !== null ? [initial.tempCelsius] : []
  )

  useEffect(() => {
    const id = setInterval(() => {
      fetch("/api/system")
        .then((res) => res.json())
        .then((data: SystemInfo) => {
          setInfo(data)
          setCpuHistory((prev) => [...prev, data.cpuPercent].slice(-HISTORY_LENGTH))
          if (data.tempCelsius !== null) {
            setTempHistory((prev) => [...prev, data.tempCelsius as number].slice(-HISTORY_LENGTH))
          }
        })
        .catch(() => {})
    }, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <dl className="flex flex-col gap-3">
      <Row label="CPU" value={`${info.cpuPercent} %`} history={cpuHistory} />
      <Row label="RAM" value={`${info.memPercent} %`} />
      <Row
        label="Temp"
        value={info.tempCelsius !== null ? `${info.tempCelsius.toFixed(1)} °C` : "—"}
        history={tempHistory}
        sparklineClassName="h-4 w-14 text-primary"
      />
      <Row label="Uptime" value={formatUptime(info.uptimeSeconds)} />
    </dl>
  )
}

export { TelemetryPanel }
