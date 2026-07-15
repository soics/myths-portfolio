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

interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string; id: string }>
  album: {
    name: string
    images: Array<{ url: string; width: number; height: number }>
    id: string
  }
  duration_ms: number
  track_number: number
}

interface AudioFeatures {
  id: string
  tempo: number
  energy: number
  danceability: number
  valence: number
  acousticness: number
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'public, s-maxage=300, max-age=300')

  if (_req.method === 'OPTIONS') return res.status(204).end()
  if (_req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const playlistId = process.env.SPOTIFY_PLAYLIST_ID || '66NGizgGbDz1c6P5WO3EQB'

  try {
    const token = await getAccessToken()

    const playlistRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}?fields=name,description,images,external_urls,owner,tracks.items(track(id,name,artists,album,duration_ms,track_number))`,
      { headers: { Authorization: `Bearer ${token}` } },
    )

    if (!playlistRes.ok) {
      const body = await playlistRes.text()
      throw new Error(`Playlist error ${playlistRes.status}: ${body}`)
    }

    const playlist = await playlistRes.json()

    const tracks: SpotifyTrack[] = playlist.tracks.items
      .map((item: { track: SpotifyTrack | null }) => item.track)
      .filter(Boolean)

    const trackIds = tracks.map(t => t.id).filter(Boolean)
    let audioFeatures: AudioFeatures[] = []

    if (trackIds.length > 0) {
      const featuresRes = await fetch(
        `https://api.spotify.com/v1/audio-features?ids=${trackIds.slice(0, 100).join(',')}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (featuresRes.ok) {
        const featuresData = await featuresRes.json()
        audioFeatures = featuresData.audio_features.filter(Boolean)
      }
    }

    const featuresMap = new Map(audioFeatures.map(f => [f.id, f]))

    const enrichedTracks = tracks.map(track => {
      const features = featuresMap.get(track.id)
      return {
        id: track.id,
        name: track.name,
        artists: track.artists,
        album: track.album,
        durationMs: track.duration_ms,
        trackNumber: track.track_number,
        audioFeatures: features ? {
          tempo: features.tempo,
          energy: features.energy,
          danceability: features.danceability,
          valence: features.valence,
          acousticness: features.acousticness,
        } : null,
      }
    })

    res.status(200).json({
      name: playlist.name,
      description: playlist.description,
      images: playlist.images,
      externalUrl: playlist.external_urls?.spotify,
      owner: playlist.owner,
      tracks: enrichedTracks,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[spotify/playlist]', msg)
    res.status(502).json({ error: 'Failed to fetch playlist' })
  }
}
