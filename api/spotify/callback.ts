import type { VercelRequest, VercelResponse } from '@vercel/node'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!

const REDIRECT = process.env.VERCEL_ENV === 'production'
  ? 'https://myths-portfolio.vercel.app/api/spotify/callback'
  : 'http://localhost:5173/api/spotify/callback'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, error: authError, state } = req.query
  const cookie = req.headers.cookie || ''
  const verifier = cookie.split(';').find(c => c.trim().startsWith('spotify_verifier='))?.split('=')[1]

  if (authError) {
    return res.status(400).send(authPage(`Authorization failed`, `<p>${authError}</p>`))
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).send(authPage(`Invalid callback`, `<p>No authorization code received.</p>`))
  }

  if (!verifier) {
    return res.status(400).send(authPage(`Session expired`, `<p>The authorization session expired.</p><a href="/api/spotify/auth" style="color:#c4a455">Try again</a>`))
  }

  try {
    const body = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT,
      code_verifier: verifier,
    })

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    if (!tokenRes.ok) {
      const errText = await tokenRes.text()
      throw new Error(`Token exchange error ${tokenRes.status}: ${errText}`)
    }

    const data = await tokenRes.json()
    const refreshToken = data.refresh_token

    const saved = await setEnvVar(refreshToken)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.status(200).send(authPage(`✓ Authorized`, `
      <p style="color:rgba(232,232,238,0.6);margin-bottom:20px">
        ${saved ? 'Your Spotify account is linked. The music player is ready.' : 'Your Spotify account is linked.'}
      </p>
      ${!saved ? `
      <div style="background:rgba(196,164,85,0.08);border-radius:12px;border:1px solid rgba(196,164,85,0.2);padding:20px;margin-bottom:20px;text-align:left">
        <p style="font-size:13px;color:rgba(232,232,238,0.6);margin-bottom:8px">
          1. Copy this refresh token:
        </p>
        <code id="token" style="display:block;padding:12px;background:#0c0c10;border-radius:8px;font-size:11px;color:#c4a455;word-break:break-all;margin-bottom:12px">${refreshToken}</code>
        <button onclick="navigator.clipboard.writeText(document.getElementById('token').textContent)" style="padding:8px 16px;border-radius:8px;background:rgba(196,164,85,0.1);color:#c4a455;border:1px solid rgba(196,164,85,0.2);cursor:pointer;font-size:12px">Copy</button>
        <p style="font-size:13px;color:rgba(232,232,238,0.6);margin-top:12px">
          2. Then run this in your terminal:
        </p>
        <code style="display:block;padding:12px;background:#0c0c10;border-radius:8px;font-size:11px;color:#c4a455;word-break:break-all">
          vercel env add SPOTIFY_REFRESH_TOKEN production
        </code>
        <p style="font-size:13px;color:rgba(232,232,238,0.6);margin-top:12px">
          3. Paste the token and redeploy:
        </p>
        <code style="display:block;padding:12px;background:#0c0c10;border-radius:8px;font-size:11px;color:#c4a455">
          vercel --prod
        </code>
      </div>
      ` : ''}
      <a href="/" style="display:inline-block;padding:10px 24px;border-radius:100px;background:rgba(196,164,85,0.1);color:#c4a455;text-decoration:none;font-size:13px;border:1px solid rgba(196,164,85,0.2)">Back to portfolio</a>
    `))
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[spotify/callback] Error:', msg)
    res.status(500).send(authPage(`Error`, `<p>${msg}</p>`))
  }
}

function authPage(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
  <body style="background:#070709;color:#e8e8ee;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px">
    <div style="text-align:center;max-width:520px;width:100%">
      <h1 style="color:#c4a455;font-size:22px;font-weight:600;margin-bottom:8px">${title}</h1>
      ${body}
    </div>
  </body>
</html>`
}

async function setEnvVar(refreshToken: string): Promise<boolean> {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    if (!supabaseUrl || !supabaseKey) return false
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase
      .from('app_secrets')
      .upsert(
        { key: 'spotify_refresh_token', value: refreshToken, updated_at: new Date().toISOString() },
        { onConflict: 'key' },
      )
    if (error) {
      console.error('[spotify/callback] Supabase error:', error.message)
      return false
    }
    return true
  } catch {
    return false
  }
}
