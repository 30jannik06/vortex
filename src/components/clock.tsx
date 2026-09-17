"use client"

import { useEffect, useState } from "react"

function Clock() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="hidden font-mono text-xs tabular-nums text-muted-foreground sm:inline">
      {time ?? "--:--:--"}
    </span>
  )
}

export { Clock }
