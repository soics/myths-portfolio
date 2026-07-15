import type { VercelRequest, VercelResponse } from '@vercel/node'

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const CACHE: { token: string; expiresAt: number } = { token: '', expiresAt: 0 }

async function getAccessToken(): Promise<string> {
  if (Date.now() < CACHE.expiresAt) return CACHE.token

  const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Spotify token error ${res.status}: ${body}`)
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
