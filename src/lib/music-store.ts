import { create } from 'zustand'

export interface Track {
  id: string
  name: string
  artists: Array<{ name: string; id: string }>
  album: {
    name: string
    images: Array<{ url: string; width: number; height: number }>
    id: string
  }
  durationMs: number
  trackNumber: number
  audioFeatures?: {
    tempo: number
    energy: number
    danceability: number
    valence: number
    acousticness: number
  } | null
}

export interface PlaylistInfo {
  name: string
  description: string
  images: Array<{ url: string; width: number; height: number }>
  externalUrl: string
}

export type PlaybackMode = 'idle' | 'loading' | 'sdk' | 'embed' | 'error'

export interface MusicStore {
  tracks: Track[]
  currentTrackIndex: number
  playlist: PlaylistInfo | null
  isPlaying: boolean
  volume: number
  isMuted: boolean
  progress: number
  duration: number
  playbackMode: PlaybackMode
  expandedView: boolean
  error: string | null
  sdkDeviceId: string | null
  embedRef: HTMLIFrameElement | null

  setTracks: (tracks: Track[]) => void
  setPlaylist: (info: PlaylistInfo) => void
  goToTrack: (index: number) => void
  setIsPlaying: (v: boolean) => void
  setVolume: (v: number) => void
  toggleMute: () => void
  setProgress: (v: number) => void
  setDuration: (v: number) => void
  setPlaybackMode: (mode: PlaybackMode) => void
  setExpandedView: (v: boolean) => void
  setError: (e: string | null) => void
  setSdkDeviceId: (id: string | null) => void
  setEmbedRef: (ref: HTMLIFrameElement | null) => void

  nextTrack: () => void
  prevTrack: () => void
  togglePlay: () => void
  currentTrack: () => Track | null
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  tracks: [],
  currentTrackIndex: 0,
  playlist: null,
  isPlaying: false,
  volume: 0.3,
  isMuted: false,
  progress: 0,
  duration: 0,
  playbackMode: 'idle',
  expandedView: false,
  error: null,
  sdkDeviceId: null,
  embedRef: null,

  setTracks: (tracks) => set({ tracks, currentTrackIndex: 0 }),
  setPlaylist: (playlist) => set({ playlist }),
  goToTrack: (index) => set({ currentTrackIndex: index, progress: 0 }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume, isMuted: false }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setPlaybackMode: (playbackMode) => set({ playbackMode, error: playbackMode === 'error' ? null : get().error }),
  setExpandedView: (expandedView) => set({ expandedView }),
  setError: (error) => set({ error, playbackMode: error ? 'error' : get().playbackMode }),
  setSdkDeviceId: (sdkDeviceId) => set({ sdkDeviceId }),
  setEmbedRef: (embedRef) => set({ embedRef }),

  nextTrack: () => {
    const { tracks, currentTrackIndex } = get()
    if (tracks.length === 0) return
    const next = (currentTrackIndex + 1) % tracks.length
    set({ currentTrackIndex: next, progress: 0 })
  },

  prevTrack: () => {
    const { tracks, currentTrackIndex } = get()
    if (tracks.length === 0) return
    const prev = (currentTrackIndex - 1 + tracks.length) % tracks.length
    set({ currentTrackIndex: prev, progress: 0 })
  },

  togglePlay: () => {
    const { isPlaying } = get()
    set({ isPlaying: !isPlaying })
  },

  currentTrack: () => {
    const { tracks, currentTrackIndex } = get()
    return tracks[currentTrackIndex] || null
  },
}))
