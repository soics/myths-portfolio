import type { VercelRequest, VercelResponse } from '@vercel/node'

const rateLimit = new Map<string, { count: number; resetAt: number }>()
const PER_IP_LIMIT = 20
const WINDOW = 60_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW })
    return true
  }
  if (entry.count >= PER_IP_LIMIT) return false
  entry.count++
  return true
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestId = crypto.randomUUID().slice(0, 8)

  res.setHeader('X-Request-Id', requestId)
  res.setHeader('X-Content-Type-Options', 'nosniff')

  const origin = req.headers.origin as string | undefined
  const allowedOrigins = [
    'https://myths-portfolio.vercel.app',
    'http://localhost:5173',
    'http://localhost:45678',
  ]
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Vary', 'Origin')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown'
  if (!checkRateLimit(ip)) {
    console.warn(`[${requestId}] Rate limited: ${ip}`)
    return res.status(429).json({ error: 'Too many requests. Try again later.' })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const [profileRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/soics', { signal: controller.signal }),
      fetch('https://api.github.com/users/soics/repos?sort=updated&per_page=12&type=public', { signal: controller.signal }),
    ])
    clearTimeout(timeout)

    if (!profileRes.ok || !reposRes.ok) {
      const status = Math.max(profileRes.status, reposRes.status)
      console.warn(`[${requestId}] GitHub API error: ${profileRes.status} / ${reposRes.status}`)
      return res.status(status).json({ error: 'GitHub API error' })
    }

    const profile = await profileRes.json()
    const repos = (await reposRes.json())
      .filter((r: { fork: boolean; archived: boolean }) => !r.fork && !r.archived)
      .slice(0, 6)

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')
    return res.status(200).json({ profile, repos })
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      console.error(`[${requestId}] GitHub API timeout`)
      return res.status(504).json({ error: 'GitHub API timed out' })
    }
    console.error(`[${requestId}] GitHub API fetch error:`, err)
    return res.status(500).json({ error: 'Failed to fetch GitHub data' })
  }
}
