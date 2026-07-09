import type { VercelRequest, VercelResponse } from '@vercel/node'

const rateLimit = new Map<string, { count: number; resetAt: number }>()
const PER_IP_LIMIT = 5
const GLOBAL_LIMIT = 50
const WINDOW = 60_000

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim()
}

function checkRateLimit(req: VercelRequest): boolean {
  const now = Date.now()
  const ip = req.socket.remoteAddress || 'unknown'

  const global = rateLimit.get('__global__')
  if (global && now <= global.resetAt && global.count >= GLOBAL_LIMIT) return false

  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW })
    return true
  }
  if (entry.count >= PER_IP_LIMIT) return false
  entry.count++
  return true
}

function getGlobalCounter() {
  const now = Date.now()
  const global = rateLimit.get('__global__')
  if (!global || now > global.resetAt) {
    rateLimit.set('__global__', { count: 1, resetAt: now + WINDOW })
    return 1
  }
  global.count++
  rateLimit.set('__global__', global)
  return global.count
}

const allowedOrigin = 'https://myths-portfolio.vercel.app'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined
  if (origin && origin !== allowedOrigin) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!checkRateLimit(req)) {
    return res.status(429).json({ error: 'Too many requests. Try again later.' })
  }
  getGlobalCounter()

  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Invalid request body.' })
  }

  const dangerous = ['__proto__', 'constructor', 'prototype']
  for (const key of dangerous) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      return res.status(400).json({ error: 'Invalid fields detected.' })
    }
  }

  const rawName = typeof req.body.name === 'string' ? req.body.name.trim() : ''
  const rawEmail = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const rawMessage = typeof req.body.message === 'string' ? req.body.message.trim() : ''

  const name = sanitize(rawName)
  const email = sanitize(rawEmail)
  const message = sanitize(rawMessage)

  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ error: 'Name must be between 2-80 characters.' })
  }
  if (!email.includes('@') || email.length > 120) {
    return res.status(400).json({ error: 'Invalid email.' })
  }
  if (message.length < 10 || message.length > 2000) {
    return res.status(400).json({ error: 'Message must be between 10-2000 characters.' })
  }
  if (name !== rawName || email !== rawEmail || message !== rawMessage) {
    return res.status(400).json({ error: 'Invalid characters detected.' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (supabaseUrl && supabaseKey) {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase.from('contact_messages').insert({
      name,
      email,
      message,
      user_agent: (req.headers['user-agent'] as string)?.slice(0, 500) || null,
    })
    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ error: 'Failed to save message.' })
    }
    return res.status(200).json({ ok: true })
  }

  console.log('Contact submission (no Supabase):', { name, email })
  return res.status(200).json({ ok: true })
}
