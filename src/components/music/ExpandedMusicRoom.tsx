import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X, Play, Pause, SkipForward, SkipBack,
  Volume2, Volume1, VolumeX,
  ExternalLink, Disc3,
} from 'lucide-react'
import { useMusicStore } from '../../lib/music-store'
import { AudioVisualizer } from './AudioVisualizer'

const PLAY_LIST_ID = import.meta.env.SPOTIFY_PLAYLIST_ID || '66NGizgGbDz1c6P5WO3EQB'

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0

  function fmt(ms: number) {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full max-w-md">
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-gold/40 to-gold"
          style={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] font-mono text-white/20">
        <span>{fmt(current)}</span>
        <span>{fmt(total)}</span>
      </div>
    </div>
  )
}

function LargeCD({ isPlaying }: { isPlaying: boolean }) {
  const track = useMusicStore((s) => s.currentTrack())
  const albumImage = track?.album?.images?.[1]?.url || track?.album?.images?.[0]?.url

  return (
    <div className="relative mx-auto flex items-center justify-center">
      <div
        className={`relative size-48 sm:size-56 md:size-64 rounded-full overflow-hidden ${
          isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
        }`}
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
          animationPlayState: isPlaying ? 'running' : 'paused',
          boxShadow: isPlaying
            ? '0 0 60px rgba(196,164,85,0.08), 0 0 120px rgba(196,164,85,0.04)'
            : '0 0 30px rgba(0,0,0,0.3)',
        }}
      >
        <div className="size-full rounded-full bg-zinc-800/80 overflow-hidden">
          {albumImage ? (
            <img src={albumImage} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Disc3 size={64} className="text-zinc-700/50" />
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3), inset 0 0 10px rgba(196,164,85,0.05)',
          }}
        />
      </div>
    </div>
  )
}

export function ExpandedMusicRoom({ onClose }: { onClose: () => void }) {
  const track = useMusicStore((s) => s.currentTrack())
  const isPlaying = useMusicStore((s) => s.isPlaying)
  const togglePlay = useMusicStore((s) => s.togglePlay)
  const nextTrack = useMusicStore((s) => s.nextTrack)
  const prevTrack = useMusicStore((s) => s.prevTrack)
  const progress = useMusicStore((s) => s.progress)
  const duration = useMusicStore((s) => s.duration)
  const playlist = useMusicStore((s) => s.playlist)
  const volume = useMusicStore((s) => s.volume)
  const isMuted = useMusicStore((s) => s.isMuted)
  const setVolume = useMusicStore((s) => s.setVolume)
  const toggleMute = useMusicStore((s) => s.toggleMute)

  const [showEmbed, setShowEmbed] = useState(false)

  const cdEl = useRef<HTMLDivElement>(null)

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === ' ') { e.preventDefault(); togglePlay() }
  }, [onClose, togglePlay])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Music player"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <AudioVisualizer intensity={1.2} />

        <motion.div
          ref={cdEl}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6 px-6 py-10"
        >
          <button
            type="button"
            onClick={onClose}
            className="focus-ring absolute right-6 top-6 flex size-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/50"
            aria-label="Close player"
          >
            <X size={18} />
          </button>

          <LargeCD isPlaying={isPlaying} />

          <div className="text-center">
            <AnimatePresence mode="wait">
              {track ? (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 className="text-lg font-semibold text-white/90 tracking-[-0.01em]">
                    {track.name}
                  </h2>
                  <p className="mt-1 text-sm text-white/40">
                    {track.artists.map(a => a.name).join(', ')}
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  key="no-track"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-white/30"
                >
                  No track playing
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <ProgressBar current={progress} total={duration || track?.durationMs || 0} />

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={prevTrack}
              className="focus-ring rounded-xl p-2.5 text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/50 active:scale-90"
              aria-label="Previous track"
            >
              <SkipBack size={22} />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="focus-ring flex size-14 items-center justify-center rounded-full bg-gold/10 text-gold transition-all hover:bg-gold/20 active:scale-90"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={nextTrack}
              className="focus-ring rounded-xl p-2.5 text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/50 active:scale-90"
              aria-label="Next track"
            >
              <SkipForward size={22} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="focus-ring rounded-lg p-1.5 text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/50"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              <VolumeIcon size={16} />
            </button>
            <div
              className="relative h-1 w-24 cursor-pointer overflow-hidden rounded-full bg-white/5"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                setVolume(Math.max(0, Math.min(1, x / rect.width)))
              }}
              role="slider"
              aria-label="Volume"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((isMuted ? 0 : volume) * 100)}
              tabIndex={0}
            >
              <div
                className="h-full rounded-full bg-gold/50 transition-all duration-150"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <a
              href={playlist?.externalUrl || `https://open.spotify.com/playlist/${PLAY_LIST_ID}`}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] px-4 py-1.5 text-xs text-white/30 transition-all hover:border-white/[0.12] hover:text-white/50"
            >
              <ExternalLink size={12} />
              Open Playlist
            </a>
            <a
              href="https://open.spotify.com/user/"
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] px-4 py-1.5 text-xs text-white/30 transition-all hover:border-white/[0.12] hover:text-white/50"
            >
              <ExternalLink size={12} />
              Spotify Profile
            </a>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowEmbed((v) => !v)}
              className="text-[10px] font-mono text-white/15 transition-colors hover:text-white/30"
            >
              {showEmbed ? 'Hide' : 'Show'} player controls
            </button>

            <AnimatePresence>
              {showEmbed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 80 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 overflow-hidden rounded-xl"
                >
                  <iframe
                    src={`https://open.spotify.com/embed/playlist/${PLAY_LIST_ID}?utm_source=generator&theme=0`}
                    width="100%"
                    height="80"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-xl"
                    title="Spotify player"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
