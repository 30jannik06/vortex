function authHeaders(): HeadersInit {
  const token = process.env.NEXT_PUBLIC_API_TOKEN
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export { authHeaders }
