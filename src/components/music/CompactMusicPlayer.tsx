import { motion, AnimatePresence } from 'motion/react'
import { Disc, Play, Pause } from 'lucide-react'
import { useMusicStore } from '../../lib/music-store'

function AlbumArt({ src, isPlaying }: { src: string; isPlaying: boolean }) {
  return (
    <div className="relative size-7 shrink-0">
      <div
        className={`size-full rounded-full overflow-hidden border border-white/[0.08]`}
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
          animation: isPlaying ? 'spin 3s linear infinite' : 'none',
          animationPlayState: isPlaying ? 'running' : 'paused',
        }}
      >
        <div className="size-full rounded-full bg-zinc-800/50 overflow-hidden">
          <img
            src={src}
            alt=""
            className="size-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow: isPlaying
            ? 'inset 0 0 8px rgba(196,164,85,0.15), 0 0 12px rgba(196,164,85,0.06)'
            : 'inset 0 0 4px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  )
}

function PlaceholderDisc() {
  return (
    <div className="relative size-7 shrink-0">
      <div className="size-full rounded-full bg-zinc-800/60 border border-white/[0.06] flex items-center justify-center">
        <Disc size={12} className="text-zinc-600" />
      </div>
    </div>
  )
}

export function CompactMusicPlayer({ onClick }: { onClick: () => void }) {
  const playlist = useMusicStore((s) => s.playlist)
  const isPlaying = useMusicStore((s) => s.isPlaying)
  const playbackMode = useMusicStore((s) => s.playbackMode)
  const error = useMusicStore((s) => s.error)

  const albumImage = playlist?.images?.[0]?.url
  const ready = playbackMode !== 'idle' && playbackMode !== 'loading'

  return (
    <button
      type="button"
      onClick={ready ? onClick : undefined}
      className="focus-ring group relative flex cursor-pointer items-center gap-2 rounded-lg px-1 py-2 transition-all duration-300 hover:bg-white/[0.03] active:scale-[0.97]"
      aria-label={ready ? `Open music player` : 'Music player loading'}
    >
      <AnimatePresence mode="wait">
        {ready && albumImage ? (
          <motion.div
            key="album"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <AlbumArt src={albumImage} isPlaying={isPlaying} />
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <PlaceholderDisc />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden flex-col items-start md:flex">
        <AnimatePresence mode="wait">
          {ready && playlist ? (
            <motion.span
              key="ready"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 max-w-[160px]"
            >
              <span className="truncate text-[11px] font-mono text-concrete-mid/35 transition-colors group-hover:text-concrete-mid/55">
                {playlist.name}
              </span>
              {isPlaying ? (
                <Pause size={10} className="shrink-0 text-gold/40" />
              ) : (
                <Play size={10} className="shrink-0 text-concrete-mid/25" />
              )}
            </motion.span>
          ) : (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[11px] font-mono text-concrete-mid/20"
            >
              {playbackMode === 'loading' ? 'connecting...' : error ? 'offline' : 'music'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isPlaying && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="safety-beacon absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-gold"
          />
        )}
      </AnimatePresence>
    </button>
  )
}
