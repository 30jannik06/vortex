"use client"

import { useEffect, useState } from "react"
import { StatusBadge } from "@/components/status-badge"
import { Skeleton } from "@/components/ui/skeleton"

const POLL_INTERVAL_MS = 10000

function PingStatus({ host }: { host: string }) {
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    function check() {
      fetch(`/api/ping?host=${encodeURIComponent(host)}`)
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled) setOnline(Boolean(data.online))
        })
        .catch(() => {
          if (!cancelled) setOnline(false)
        })
    }

    check()
    const id = setInterval(check, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [host])

  if (online === null) {
    return <Skeleton className="h-5 w-20" />
  }

  return online ? (
    <StatusBadge label="ONLINE" variant="online" />
  ) : (
    <StatusBadge label="OFFLINE" variant="outline" />
  )
}

export { PingStatus }
