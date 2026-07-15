import type { VercelRequest, VercelResponse } from '@vercel/node'

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const CACHE: { token: string; expiresAt: number } = { token: '', expiresAt: 0 }

async function getAccessToken(): Promise<string> {
  if (Date.now() < CACHE.expiresAt) return CACHE.token

  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
  const clientId = process.env.SPOTIFY_CLIENT_ID!
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!

  let body: URLSearchParams
  let headers: Record<string, string>

  if (refreshToken) {
    body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
    })
    headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
  } else {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    body = new URLSearchParams({ grant_type: 'client_credentials' })
    headers = {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers,
    body: body.toString(),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`Spotify token error ${res.status}: ${errBody}`)
  }

  const data = await res.json()
  CACHE.token = data.access_token
  CACHE.expiresAt = Date.now() + (data.expires_in - 60) * 1000
  return data.access_token
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-store, max-age=0')

  if (_req.method === 'OPTIONS') return res.status(204).end()
  if (_req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = await getAccessToken()
    res.status(200).json({ access_token: token })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[spotify/token]', msg)
    res.status(502).json({ error: 'Failed to fetch token' })
  }
}
