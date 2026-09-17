import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendWol } from "@/lib/wol"
import { isAuthorized } from "@/lib/api-auth"

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const mac: string | undefined = body?.mac ?? process.env.DEVICE_MAC
  const address: string | undefined = body?.address ?? process.env.DEVICE_BROADCAST
  const deviceId: string | undefined = body?.deviceId

  if (!mac) {
    return NextResponse.json({ error: "mac ist erforderlich" }, { status: 400 })
  }

  try {
    await sendWol(mac, address)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "WOL fehlgeschlagen" },
      { status: 500 }
    )
  }

  if (deviceId) {
    await prisma.actionLog.create({
      data: { deviceId, action: "wol_sent" },
    })
  }

  return NextResponse.json({ ok: true })
}
