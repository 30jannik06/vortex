"use client"

import { Power } from "lucide-react"
import { cn } from "@/lib/utils"

function PowerButton({
  onClick,
  pending = false,
  disabled = false,
  className,
}: {
  onClick?: () => void
  pending?: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || pending}
      aria-label="Gerät einschalten"
      className={cn(
        "group relative flex size-[140px] shrink-0 items-center justify-center rounded-full border border-primary/40 bg-secondary text-primary transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-60",
        className
      )}
    >
      <span
        className={cn(
          "absolute inset-0 rounded-full border border-primary/30 motion-safe:animate-none",
          pending
            ? "motion-safe:animate-ping"
            : "group-hover:motion-safe:animate-ping"
        )}
        aria-hidden
      />
      <Power className="size-10" strokeWidth={1.5} />
    </button>
  )
}

export { PowerButton }
