import type { NextRequest } from "next/server"

function isAuthorized(request: NextRequest): boolean {
  const token = process.env.API_TOKEN
  if (!token) return true // kein Token konfiguriert -> nur fürs lokale Netz gedacht

  const header = request.headers.get("authorization")
  return header === `Bearer ${token}`
}

export { isAuthorized }
