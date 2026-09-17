import { NextRequest, NextResponse } from "next/server"
import { execFile } from "node:child_process"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

const HOST_PATTERN = /^[a-zA-Z0-9.:-]+$/

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("host") ?? process.env.DEVICE_IP

  if (!target || !HOST_PATTERN.test(target)) {
    return NextResponse.json({ error: "Ungültiger Host" }, { status: 400 })
  }

  const args = process.platform === "win32"
    ? ["-n", "1", "-w", "1000", target]
    : ["-c", "1", "-W", "1", target]

  try {
    const start = Date.now()
    await execFileAsync("ping", args)
    return NextResponse.json({ online: true, latencyMs: Date.now() - start })
  } catch {
    return NextResponse.json({ online: false, latencyMs: null })
  }
}
