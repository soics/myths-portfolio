import { useEffect } from 'react'

function hash(n: number, min: number, max: number) {
  const h = ((n * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
  return min + h * (max - min)
}

function DustParticle({ seed }: { seed: number }) {
  const style: React.CSSProperties = {
    left: `${hash(seed * 3, 0, 100)}%`,
    bottom: '-4px',
    width: `${hash(seed * 7, 1, 3)}px`,
    height: `${hash(seed * 7, 1, 3)}px`,
    animation: `dust-float ${hash(seed * 11, 8, 20)}s ease-in-out ${hash(seed * 13, 0, 8)}s infinite`,
  }
  return <div className="dust-particle" style={style} />
}

function BlueprintGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20" aria-hidden="true">
      <div className="absolute inset-0 blueprint-grid-lg" />
      <div className="absolute inset-0 blueprint-grid opacity-60" />
      {/* Measurement marks on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-5 opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex items-center gap-1" style={{ position: 'absolute', top: `${i * 5}%`, left: 2 }}>
            <span className="text-[6px] font-mono text-blueprint">{i * 50}</span>
            <div className="h-px w-2 bg-blueprint/30" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-5 opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex items-end gap-1" style={{ position: 'absolute', bottom: 2, left: `${i * 5}%` }}>
            <div className="h-2 w-px bg-blueprint/30" />
            <span className="text-[6px] font-mono text-blueprint">{i * 50}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScaffoldingFrames() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      {/* Top-left corner frame */}
      <div className="scaffold-corner absolute left-0 top-0 h-32 w-32" />
      {/* Top-right corner frame */}
      <div className="absolute right-0 top-0 h-32 w-32">
        <div className="scaffold-corner absolute right-0 top-0 h-full w-full [transform:scaleX(-1)]" />
      </div>
      {/* Bottom-left corner frame */}
      <div className="absolute bottom-0 left-0 h-32 w-32">
        <div className="scaffold-corner absolute bottom-0 left-0 h-full w-full [transform:scaleY(-1)]" />
      </div>
      {/* Bottom-right corner frame */}
      <div className="absolute bottom-0 right-0 h-32 w-32">
        <div className="scaffold-corner absolute bottom-0 right-0 h-full w-full [transform:scale(-1)]" />
      </div>
      {/* Diagonal brace - left */}
      <div className="absolute left-20 top-20 h-px w-40 origin-left rotate-45 bg-gradient-to-r from-blueprint/5 to-transparent" />
      {/* Diagonal brace - right */}
      <div className="absolute right-20 top-20 h-px w-40 origin-right -rotate-45 bg-gradient-to-l from-blueprint/5 to-transparent" />
    </div>
  )
}

function SafetyBeacons() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      {/* Top-left beacon */}
      <div className="absolute left-6 top-6 flex items-center gap-2">
        <div className="safety-beacon h-3 w-3 rounded-full bg-white/90" />
        <span className="text-[7px] font-mono tracking-[0.2em] text-white/20">SITE ACTIVE</span>
      </div>
      {/* Top-right beacon */}
      <div className="absolute right-6 top-6 flex items-center gap-2">
        <div className="safety-beacon-delayed h-3 w-3 rounded-full bg-white/90" />
        <span className="text-[7px] font-mono tracking-[0.2em] text-white/20">WORKING</span>
      </div>
      {/* Bottom-left beacon */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        <div className="safety-beacon-delayed h-2 w-2 rounded-full bg-white/60" />
        <span className="text-[6px] font-mono tracking-[0.15em] text-white/10">CAUTION</span>
      </div>
    </div>
  )
}

const DUST_COUNT = 20
const dustIds = Array.from({ length: DUST_COUNT }, (_, i) => i)

function FloatingDust() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
      {dustIds.map((i) => (
        <DustParticle key={i} seed={i} />
      ))}
    </div>
  )
}

function CursorLevel() {
  useEffect(() => {
    let raf: number
    let mx = 0, my = 0
    let bx = 0, by = 0
    let speed = 0
    let paused = false

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    const onVisibility = () => { paused = document.hidden }
    document.addEventListener('visibilitychange', onVisibility)

    const tick = () => {
      if (!paused) {
        const dx = mx - bx
        const dy = my - by
        bx += dx * 0.15
        by += dy * 0.15
        speed = Math.sqrt(dx * dx + dy * dy) * 0.08

        const el = document.getElementById('cursor-level')
        if (el) {
          el.style.transform = `translate(${bx}px, ${by}px)`
          const bubble = el.querySelector('.level-bubble') as HTMLElement
          if (bubble) {
            const shift = Math.min(speed, 6)
            bubble.style.transform = `translate(-50%, -50%) translateX(${(dx > 0 ? shift : -shift) * 0.3}px) translateY(${(dy > 0 ? shift : -shift) * 0.3}px)`
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      id="cursor-level"
      className="pointer-events-none fixed -z-10 hidden md:block"
      style={{ left: 0, top: 0, width: 80, height: 80, marginLeft: -40, marginTop: -40 }}
      aria-hidden="true"
    >
      {/* Spirit level ring */}
      <div className="absolute inset-2 rounded-full border border-blueprint/10" />
      <div className="absolute inset-0 rounded-full border border-blueprint/5" />
      {/* Crosshair */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blueprint/5 -translate-x-1/2" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-blueprint/5 -translate-y-1/2" />
      {/* Center mark */}
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blueprint/10" />
      {/* Bubble */}
      <div className="level-bubble absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blueprint/20 transition-transform duration-100" />
    </div>
  )
}

export function ConstructionBackground() {
  return (
    <>
      <BlueprintGrid />
      <ScaffoldingFrames />
      <SafetyBeacons />
      <FloatingDust />
      <CursorLevel />
    </>
  )
}
