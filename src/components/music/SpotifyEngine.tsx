import { useEffect, useRef } from 'react'
import { useMusicStore } from '../../lib/music-store'

const PLAYLIST_ID = '66NGizgGbDz1c6P5WO3EQB'

export function SpotifyEngine() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const store = useMusicStore.getState()
    store.setPlaybackMode('loading')

    fetch(`/api/spotify-oembed?url=https://open.spotify.com/playlist/${PLAYLIST_ID}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        const store = useMusicStore.getState()
        store.setPlaylist({
          name: data.title || 'Old School',
          description: '',
          images: [{ url: data.thumbnail_url, width: 300, height: 300 }],
          externalUrl: `https://open.spotify.com/playlist/${PLAYLIST_ID}`,
        })
        store.setPlaybackMode('embed')
      })
      .catch(err => {
        const store = useMusicStore.getState()
        store.setError(err instanceof Error ? err.message : 'Failed to load')
        store.setPlaybackMode('embed')
      })
  }, [])

  return null
}
