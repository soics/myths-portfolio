import { useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X, ExternalLink, Disc3,
} from 'lucide-react'
import { useMusicStore } from '../../lib/music-store'
import { AudioVisualizer } from './AudioVisualizer'

const PLAYLIST_ID = '66NGizgGbDz1c6P5WO3EQB'

export function ExpandedMusicRoom({ onClose }: { onClose: () => void }) {
  const playlist = useMusicStore((s) => s.playlist)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

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
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex w-full max-w-lg flex-col items-center gap-5 px-5 py-8"
        >
          <button
            type="button"
            onClick={onClose}
            className="focus-ring absolute right-5 top-5 flex size-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/50"
            aria-label="Close player"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center gap-3">
            <div className="relative size-32 sm:size-40 rounded-full overflow-hidden border border-white/[0.08]"
              style={{
                boxShadow: '0 0 40px rgba(196,164,85,0.06), 0 0 80px rgba(196,164,85,0.03)',
              }}
            >
              {playlist?.images?.[0]?.url ? (
                <img
                  src={playlist.images[0].url}
                  alt="Playlist cover"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-zinc-800/60">
                  <Disc3 size={40} className="text-zinc-700/50" />
                </div>
              )}
            </div>

            <div className="text-center">
              <h2 className="text-base font-semibold text-white/80">
                {playlist?.name || 'Old School'}
              </h2>
              <p className="mt-0.5 text-xs text-white/30">
                Click play below to start the playlist
              </p>
            </div>
          </div>

          <div className="w-full max-w-md">
            <iframe
              src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`}
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="eager"
              className="rounded-2xl"
              title="Spotify player"
            />
          </div>

          <div className="flex items-center gap-3">
            <a
              href={playlist?.externalUrl || `https://open.spotify.com/playlist/${PLAYLIST_ID}`}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] px-4 py-1.5 text-xs text-white/30 transition-all hover:border-white/[0.12] hover:text-white/50"
            >
              <ExternalLink size={12} />
              Open in Spotify
            </a>
          </div>

          <p className="text-[10px] font-mono text-white/10 text-center max-w-xs leading-relaxed">
            Press <kbd className="rounded bg-white/[0.04] px-1 py-0.5 text-white/20">Esc</kbd> to close
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
