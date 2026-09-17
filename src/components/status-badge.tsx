import { Badge, badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"

type StatusVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

function StatusBadge({
  label,
  variant = "online",
  className,
}: {
  label: string
  variant?: StatusVariant
  className?: string
}) {
  return (
    <Badge
      variant={variant}
      className={cn("font-mono text-xs tracking-wide uppercase", className)}
    >
      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
      {label}
    </Badge>
  )
}

export { StatusBadge }
