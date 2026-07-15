import { useEffect } from 'react'
import { useMusicStore } from '../../lib/music-store'

const PLAYLIST_ID = '66NGizgGbDz1c6P5WO3EQB'

export function PersistentEmbed() {
  const playbackMode = useMusicStore((s) => s.playbackMode)

  useEffect(() => {
    if (playbackMode === 'embed') {
      useMusicStore.getState().setIsPlaying(true)
    }
  }, [playbackMode])

  if (playbackMode !== 'embed') return null

  return (
    <div
      className="fixed left-[-9999px] top-0"
      aria-hidden="true"
    >
      <iframe
        src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`}
        width="300"
        height="80"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="eager"
        title="Spotify background player"
      />
    </div>
  )
}
