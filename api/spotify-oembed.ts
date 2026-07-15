import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, max-age=3600')

  if (req.method === 'OPTIONS') return res.status(204).end()

  const url = req.query.url
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing ?url parameter' })
  }

  try {
    const oembedRes = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
    )
    if (!oembedRes.ok) {
      const text = await oembedRes.text()
      return res.status(oembedRes.status).json({ error: text.slice(0, 200) })
    }
    const data = await oembedRes.json()
    res.status(200).json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    res.status(502).json({ error: msg })
  }
}
