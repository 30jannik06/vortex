"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/status-badge"
import { Clock } from "@/components/clock"

const links = [
  { href: "/", label: "Übersicht" },
  { href: "/pc", label: "PC" },
  { href: "/network", label: "Netzwerk" },
  { href: "/tools", label: "Tools" },
]

function Nav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card">
      <div className="mx-auto flex h-15 max-w-[1200px] items-center gap-4 px-4 sm:gap-8 sm:px-6">
        <span className="font-mono text-sm font-semibold tracking-widest whitespace-nowrap">
          VORTEX
        </span>
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-b-2 border-transparent px-1 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  active
                    ? "border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-4">
          <StatusBadge label="System online" variant="active" className="hidden sm:inline-flex" />
          <Clock />
        </div>
      </div>
    </header>
  )
}

export { Nav }
