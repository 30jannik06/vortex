"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authHeaders } from "@/lib/api-client"

const kinds = [
  { value: "router", label: "Router" },
  { value: "switch", label: "Switch" },
  { value: "nas", label: "NAS" },
  { value: "other", label: "Sonstiges" },
]

function AddDeviceForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)

    const payload = {
      name: formData.get("name"),
      kind: formData.get("kind"),
      ip: formData.get("ip") || null,
      mac: formData.get("mac") || null,
    }

    try {
      const res = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Gerät konnte nicht angelegt werden")
      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler")
    } finally {
      setPending(false)
    }
  }

  if (!open) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <Plus /> Gerät hinzufügen
      </Button>
    )
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground" htmlFor="device-name">
          Name
        </label>
        <Input id="device-name" name="name" required placeholder="Fritzbox" className="w-40" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground" htmlFor="device-kind">
          Typ
        </label>
        <select
          id="device-kind"
          name="kind"
          defaultValue={kinds[0].value}
          className="h-9 w-32 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {kinds.map((k) => (
            <option key={k.value} value={k.value} className="bg-popover">
              {k.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground" htmlFor="device-ip">
          IP
        </label>
        <Input id="device-ip" name="ip" placeholder="192.168.1.2" className="w-36 font-mono" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground" htmlFor="device-mac">
          MAC
        </label>
        <Input id="device-mac" name="mac" placeholder="AA:BB:CC:DD:EE:FF" className="w-40 font-mono" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          Speichern
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)}>
          <X />
        </Button>
      </div>
      {error && <p className="w-full text-xs text-destructive">{error}</p>}
    </form>
  )
}

export { AddDeviceForm }
