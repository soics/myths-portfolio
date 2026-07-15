import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!

const REDIRECT = process.env.VERCEL_ENV === 'production'
  ? 'https://myths-portfolio.vercel.app/api/spotify/callback'
  : 'http://localhost:5173/api/spotify/callback'

function base64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const codeVerifier = base64url(crypto.randomBytes(32))
  const codeChallenge = base64url(
    crypto.createHash('sha256').update(codeVerifier).digest(),
  )

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    scope: 'playlist-read-private playlist-read-collaborative streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing',
    state: codeVerifier,
  })

  res.setHeader('Set-Cookie', `spotify_verifier=${codeVerifier}; HttpOnly; Path=/api/spotify; Max-Age=300; SameSite=Lax`)
  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`)
}
