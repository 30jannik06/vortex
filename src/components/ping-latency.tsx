"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const POLL_INTERVAL_MS = 10000

function PingLatency({ host }: { host: string }) {
  const [latency, setLatency] = useState<number | null | "offline">(null)

  useEffect(() => {
    let cancelled = false

    function check() {
      fetch(`/api/ping?host=${encodeURIComponent(host)}`)
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return
          setLatency(data.online ? data.latencyMs : "offline")
        })
        .catch(() => {
          if (!cancelled) setLatency("offline")
        })
    }

    check()
    const id = setInterval(check, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [host])

  if (latency === null) {
    return <Skeleton className="h-8 w-20" />
  }

  return (
    <span className="font-mono text-2xl tabular-nums">
      {latency === "offline" ? "offline" : `${latency} ms`}
    </span>
  )
}

export { PingLatency }
