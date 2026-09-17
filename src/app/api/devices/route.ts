import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAuthorized } from "@/lib/api-auth"

export async function GET() {
  const devices = await prisma.device.findMany({ orderBy: { createdAt: "asc" } })
  return NextResponse.json(devices)
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body?.name || !body?.kind) {
    return NextResponse.json({ error: "name und kind sind erforderlich" }, { status: 400 })
  }

  const device = await prisma.device.create({
    data: {
      name: body.name,
      kind: body.kind,
      ip: body.ip ?? null,
      mac: body.mac ?? null,
    },
  })

  return NextResponse.json(device, { status: 201 })
}
