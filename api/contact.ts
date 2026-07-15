import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const rateLimit = new Map<string, { count: number; resetAt: number }>()
const PER_IP_LIMIT = 5
const GLOBAL_LIMIT = 50
const WINDOW = 60_000
const MAX_BODY_BYTES = 65_536
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

async function sendNotification(name: string, email: string, message: string, requestId: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log(`[${requestId}] No RESEND_API_KEY — skipping notification`)
    return
  }
  try {
    const safeName = escapeHtml(name)
    const safeMsg = escapeHtml(message)
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'myths-portfolio <onboarding@resend.dev>',
        to: ['richardgermain29@gmail.com'],
        subject: `Portfolio contact: ${safeName} (${email})`,
        html: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><p>${safeMsg}</p><hr><p style="color:#888;font-size:12px">Sent via myths-portfolio &middot; request ${requestId}</p>`,
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      console.error(`[${requestId}] Resend error ${res.status}: ${body}`)
    } else {
      console.log(`[${requestId}] Notification sent to richardgermain29@gmail.com`)
    }
  } catch (err) {
    console.error(`[${requestId}] Notification error:`, err)
  }
}

function sanitize(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim()
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

function trackGlobal() {
  const now = Date.now()
  const global = rateLimit.get('__global__')
  if (!global || now > global.resetAt) {
    rateLimit.set('__global__', { count: 1, resetAt: now + WINDOW })
    return
  }
  global.count++
}

function originAllowed(origin: string): boolean {
  const allowed = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
    : ['https://myths-portfolio.vercel.app']
  return allowed.includes(origin)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestId = crypto.randomUUID().slice(0, 8)

  if (typeof req.headers['content-length'] === 'string' && Number.parseInt(req.headers['content-length']) > MAX_BODY_BYTES) {
    console.warn(`[${requestId}] Payload too large: ${req.headers['content-length']} bytes`)
    return res.status(413).json({ error: 'Payload too large.' })
  }

  const origin = req.headers.origin as string | undefined
  if (origin && !originAllowed(origin)) {
    console.warn(`[${requestId}] Blocked origin: ${origin}`)
    return res.status(403).json({ error: 'Forbidden' })
  }

  res.setHeader('Access-Control-Allow-Origin', origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')
  res.setHeader('X-Request-Id', requestId)

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!checkRateLimit(req)) {
    console.warn(`[${requestId}] Rate limited`)
    return res.status(429).json({ error: 'Too many requests. Try again later.' })
  }
  trackGlobal()

  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Invalid request body.' })
  }

  const dangerous = ['__proto__', 'constructor', 'prototype']
  for (const key of dangerous) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      console.warn(`[${requestId}] Dangerous key: ${key}`)
      return res.status(400).json({ error: 'Invalid fields detected.' })
    }
  }

  if (String(req.body.website || '').trim()) {
    return res.status(200).json({ ok: true })
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
  if (!EMAIL_RE.test(email) || email.length > 120) {
    return res.status(400).json({ error: 'Invalid email.' })
  }
  if (message.length < 10 || message.length > 2000) {
    return res.status(400).json({ error: 'Message must be between 10-2000 characters.' })
  }
  if (name !== rawName || email !== rawEmail || message !== rawMessage) {
    console.warn(`[${requestId}] Sanitization changed input`, { name, rawName })
    return res.status(400).json({ error: 'Invalid characters detected.' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase.from('contact_messages').insert({
      name,
      email,
      message,
      request_id: requestId,
      user_agent: (req.headers['user-agent'] as string)?.slice(0, 500) || null,
    })
    if (error) {
      console.error(`[${requestId}] Supabase insert error:`, error.message)
      return res.status(500).json({ error: 'Failed to save message.' })
    }
    console.log(`[${requestId}] Message stored from ${email}`)
    sendNotification(name, email, message, requestId)
    res.setHeader('X-Blessing', 'may-your-builds-never-fail')
    return res.status(200).json({ ok: true, request_id: requestId, whisper: 'You noticed what others don\'t.' })
  }

  console.log(`[${requestId}] No Supabase configured — logged message from ${email}`)
  return res.status(200).json({ ok: true, request_id: requestId })
}
