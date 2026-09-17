import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAuthorized } from "@/lib/api-auth"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const device = await prisma.device.findUnique({ where: { id } })
  if (!device) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 })
  }
  if (device.kind === "pc") {
    return NextResponse.json(
      { error: "Das über .env verwaltete PC-Gerät kann nicht gelöscht werden" },
      { status: 400 }
    )
  }

  await prisma.actionLog.deleteMany({ where: { deviceId: id } })
  await prisma.device.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
