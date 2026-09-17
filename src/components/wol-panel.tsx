"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PowerButton } from "@/components/power-button"
import { Button } from "@/components/ui/button"
import { authHeaders } from "@/lib/api-client"

function WolPanel({
  deviceId,
  mac,
  ip,
}: {
  deviceId: string
  mac: string | null
  ip: string | null
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleClick() {
    if (!mac) {
      setMessage("Keine MAC-Adresse hinterlegt")
      return
    }
    setPending(true)
    setMessage(null)
    try {
      const res = await fetch("/api/wol", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ mac, deviceId }),
      })
      if (!res.ok) throw new Error("WOL fehlgeschlagen")
      setMessage("Wake-on-LAN gesendet")
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Fehler")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <PowerButton onClick={handleClick} pending={pending} />
      <span className="min-h-4 font-mono text-xs tracking-wide text-muted-foreground uppercase">
        {message ?? "PC starten"}
      </span>
      <div className="flex w-full max-w-[280px] gap-2.5">
        <Button
          variant="secondary"
          className="flex-1"
          disabled={!ip}
          nativeButton={!ip}
          render={ip ? <a href={`rdp://${ip}`} /> : undefined}
        >
          Remote Desktop
        </Button>
        <Button variant="secondary" className="flex-1" onClick={() => router.refresh()}>
          Aktualisieren
        </Button>
      </div>
    </div>
  )
}

export { WolPanel }
