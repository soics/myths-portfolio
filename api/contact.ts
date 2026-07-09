import type { VercelRequest, VercelResponse } from '@vercel/node'

const rateLimit = new Map<string, { count: number; resetAt: number }>()
const LIMIT = 5
const WINDOW = 60_000

function getIP(req: VercelRequest): string {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW })
    return true
  }
  if (entry.count >= LIMIT) return false
  entry.count++
  return true
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getIP(req)
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again later.' })
  }

  const { name, email, message } = req.body || {}

  if (typeof name !== 'string' || name.length < 2 || name.length > 80) {
    return res.status(400).json({ error: 'Name must be between 2-80 characters.' })
  }
  if (typeof email !== 'string' || !email.includes('@') || email.length > 120) {
    return res.status(400).json({ error: 'Invalid email.' })
  }
  if (typeof message !== 'string' || message.length < 10 || message.length > 2000) {
    return res.status(400).json({ error: 'Message must be between 10-2000 characters.' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (supabaseUrl && supabaseKey) {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      user_agent: (req.headers['user-agent'] as string)?.slice(0, 500) || null,
    })
    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ error: 'Failed to save message.' })
    }
    return res.status(200).json({ ok: true })
  }

  console.log('Contact form submission (no Supabase):', { name, email })
  return res.status(200).json({ ok: true })
}
