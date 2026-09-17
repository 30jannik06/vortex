import os from "node:os"
import fs from "node:fs/promises"

type SystemInfo = {
  cpuPercent: number
  memTotalMb: number
  memUsedMb: number
  memPercent: number
  tempCelsius: number | null
  uptimeSeconds: number
  hostname: string
}

async function readTemperature(): Promise<number | null> {
  try {
    const raw = await fs.readFile("/sys/class/thermal/thermal_zone0/temp", "utf8")
    return Number.parseInt(raw, 10) / 1000
  } catch {
    return null
  }
}

function cpuLoadPercent(): number {
  const cpus = os.cpus()
  const totals = cpus.map((cpu) => {
    const times = cpu.times
    const total = times.user + times.nice + times.sys + times.idle + times.irq
    return { idle: times.idle, total }
  })
  const idle = totals.reduce((sum, t) => sum + t.idle, 0)
  const total = totals.reduce((sum, t) => sum + t.total, 0)
  return total === 0 ? 0 : Math.round((1 - idle / total) * 100)
}

async function getSystemInfo(): Promise<SystemInfo> {
  const totalMem = os.totalmem()
  const freeMem = os.freemem()

  return {
    cpuPercent: cpuLoadPercent(),
    memTotalMb: Math.round(totalMem / 1024 / 1024),
    memUsedMb: Math.round((totalMem - freeMem) / 1024 / 1024),
    memPercent: Math.round(((totalMem - freeMem) / totalMem) * 100),
    tempCelsius: await readTemperature(),
    uptimeSeconds: Math.round(os.uptime()),
    hostname: os.hostname(),
  }
}

export { getSystemInfo }
export type { SystemInfo }
