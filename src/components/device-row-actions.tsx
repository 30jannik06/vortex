"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authHeaders } from "@/lib/api-client"

function DeviceRowActions({ deviceId }: { deviceId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleDelete() {
    setPending(true)
    try {
      const res = await fetch(`/api/devices/${deviceId}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
      })
      if (res.ok) router.refresh()
    } finally {
      setPending(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Löschen bestätigen"
          disabled={pending}
          onClick={handleDelete}
        >
          <Check className="text-destructive" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Abbrechen"
          disabled={pending}
          onClick={() => setConfirming(false)}
        >
          <X className="text-muted-foreground" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Gerät entfernen"
      onClick={() => setConfirming(true)}
    >
      <Trash2 className="text-muted-foreground" />
    </Button>
  )
}

export { DeviceRowActions }
