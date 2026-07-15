import { useEffect, useRef, useCallback } from 'react'
import { useMusicStore } from '../../lib/music-store'

const SDK_SCRIPT_ID = 'spotify-player-sdk'

type SpotifyPlayer = {
  connect: () => Promise<boolean>
  disconnect: () => void
  addListener: (event: string, cb: (...args: unknown[]) => void) => void
  removeListener: (event: string, cb?: (...args: unknown[]) => void) => void
  getCurrentState: () => Promise<{
    paused: boolean
    position: number
    duration: number
    track_window: {
      current_track: {
        id: string
        uri: string
        name: string
        artists: Array<{ name: string; uri: string }>
        album: { images: Array<{ url: string }> }
      }
      previous_tracks: unknown[]
      next_tracks: unknown[]
    }
  } | null>
  togglePlay: () => Promise<void>
  next: () => Promise<void>
  previous: () => Promise<void>
  setVolume: (volume: number) => Promise<void>
  pause: () => Promise<void>
  resume: () => Promise<void>
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void
    Spotify: {
      Player: new (config: {
        name: string
        getOAuthToken: (cb: (token: string) => void) => void
        volume?: number
      }) => SpotifyPlayer
    }
  }
}

async function trySdkInit(
  playerRef: React.MutableRefObject<SpotifyPlayer | null>,
  deviceIdRef: React.MutableRefObject<string | null>,
  onReady: () => void,
  onError: () => void,
): Promise<void> {
  try {
    const tokenRes = await fetch('/api/spotify/token')
    if (!tokenRes.ok) throw new Error('Token fetch failed')
    const { access_token } = await tokenRes.json()

    if (!document.getElementById(SDK_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = SDK_SCRIPT_ID
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      document.body.appendChild(script)
    }

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('SDK load timeout')), 15000)
      window.onSpotifyWebPlaybackSDKReady = () => {
        clearTimeout(timeout)
        resolve()
      }
      if (window.Spotify) {
        clearTimeout(timeout)
        resolve()
      }
    })

    if (!window.Spotify) {
      throw new Error('Spotify SDK not available')
    }

    const player = new window.Spotify.Player({
      name: 'myths-portfolio player',
      getOAuthToken: (cb) => cb(access_token),
      volume: 0.3,
    })

    player.addListener('ready', (({ device_id }: { device_id: string }) => {
      deviceIdRef.current = device_id
      useMusicStore.getState().setSdkDeviceId(device_id)
      playerRef.current = player
      onReady()
    }) as (...args: unknown[]) => void)

    player.addListener('not_ready', (() => {
      deviceIdRef.current = null
      useMusicStore.getState().setSdkDeviceId(null)
    }) as (...args: unknown[]) => void)

    player.addListener('player_state_changed', ((state: {
      paused: boolean
      position: number
      duration: number
      track_window: {
        current_track: {
          id: string
          uri: string
          name: string
          artists: Array<{ name: string; uri: string }>
          album: { images: Array<{ url: string }> }
        }
      }
    } | null) => {
      if (!state) return
      const store = useMusicStore.getState()
      store.setIsPlaying(!state.paused)
      store.setProgress(state.position)
      store.setDuration(state.duration)
    }) as (...args: unknown[]) => void)

    const connected = await player.connect()
    if (!connected) {
      throw new Error('SDK connection failed')
    }
  } catch {
    onError()
  }
}

export function SpotifyEngine() {
  const initialized = useRef(false)
  const playerRef = useRef<SpotifyPlayer | null>(null)
  const deviceIdRef = useRef<string | null>(null)
  const progressInterval = useRef<ReturnType<typeof setInterval>>(undefined)

  const store = useMusicStore()

  const fetchPlaylist = useCallback(async () => {
    try {
      const res = await fetch('/api/spotify/playlist')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const tracks = data.tracks.map((t: Record<string, unknown>) => ({
        id: t.id,
        name: t.name,
        artists: t.artists,
        album: t.album,
        durationMs: t.durationMs,
        trackNumber: t.trackNumber,
        audioFeatures: t.audioFeatures,
      }))
      useMusicStore.getState().setTracks(tracks)
      useMusicStore.getState().setPlaylist({
        name: data.name,
        description: data.description || '',
        images: data.images || [],
        externalUrl: data.externalUrl || '',
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load playlist'
      useMusicStore.getState().setError(msg)
    }
  }, [])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    fetchPlaylist()

    const mode = useMusicStore.getState().playbackMode
    if (mode !== 'idle') return

    useMusicStore.getState().setPlaybackMode('loading')

    trySdkInit(
      playerRef,
      deviceIdRef,
      () => {
        useMusicStore.getState().setPlaybackMode('sdk')
      },
      () => {
        useMusicStore.getState().setPlaybackMode('embed')
      },
    )
  }, [fetchPlaylist])

  useEffect(() => {
    const store_ = useMusicStore.getState()

    if (store_.playbackMode === 'sdk' && playerRef.current) {
      const player = playerRef.current
      player.setVolume(store_.isMuted ? 0 : store_.volume)

      if (store_.isPlaying) {
        player.resume()
      } else {
        player.pause()
      }
    }
  }, [])

  useEffect(() => {
    if (store.playbackMode !== 'sdk' || !playerRef.current) return

    const player = playerRef.current
    player.setVolume(store.isMuted ? 0 : store.volume)
  }, [store.volume, store.isMuted, store.playbackMode])

  useEffect(() => {
    if (store.playbackMode !== 'sdk' || !playerRef.current) return

    const player = playerRef.current
    if (store.isPlaying) {
      player.resume()
      progressInterval.current = setInterval(() => {
        const curr = useMusicStore.getState()
        if (curr.progress < curr.duration) {
          useMusicStore.getState().setProgress(curr.progress + 1000)
        }
      }, 1000)
    } else {
      player.pause()
      clearInterval(progressInterval.current)
    }

    return () => clearInterval(progressInterval.current)
  }, [store.isPlaying, store.playbackMode])

  useEffect(() => {
    if (store.currentTrackIndex === -1) return

    if (store.playbackMode === 'embed') {
      const curr = store.currentTrack()
      if (curr) {
        store.setProgress(0)
      }
    }
  }, [store.currentTrackIndex, store.playbackMode, store])

  return null
}
