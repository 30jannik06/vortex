import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get("deviceId") ?? undefined
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 20)

  const logs = await prisma.actionLog.findMany({
    where: deviceId ? { deviceId } : undefined,
    orderBy: { createdAt: "desc" },
    take: Number.isFinite(limit) ? limit : 20,
    include: { device: true },
  })

  return NextResponse.json(logs)
}
