import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

/* ------------------------------------------------------------------ */
/*  Layer 1 – Far Aurora (6 organic blobs, deep blur, ambient glow)   */
/* ------------------------------------------------------------------ */
function AuroraBlobs() {
  const blobs = useMemo(() => [
    { size: 56, x: -8, y: -4, color: 'bg-blue-400/7', blur: 200, dur: 38, s: [1, 1.2, .88, 1.08, 1], dx: [0,140,-80,120,0], dy: [0,-160,110,-70,0] },
    { size: 44, x: 78, y: 18, color: 'bg-purple-400/6', blur: 180, dur: 44, s: [1, .8, 1.18, .9, 1], dx: [0,-100,140,-60,0], dy: [0,120,-90,160,0] },
    { size: 34, x: 42, y: 48, color: 'bg-white/[0.04]', blur: 160, dur: 50, s: [1, 1.1, .92, 1.15, 1], dx: [0,70,-110,50,0], dy: [0,-60,90,-110,0] },
    { size: 38, x: 18, y: 72, color: 'bg-cyan-400/4', blur: 170, dur: 55, s: [1, 1.06, .94, 1.12, 1], dx: [0,-50,80,-40,0], dy: [0,70,-50,90,0] },
    { size: 24, x: 70, y: 8, color: 'bg-violet-400/5', blur: 140, dur: 40, s: [1, .88, 1.14, .94, 1], dx: [0,100,-50,70,0], dy: [0,-80,120,-40,0] },
    { size: 18, x: 28, y: 78, color: 'bg-amber-400/3', blur: 120, dur: 48, s: [1, 1.04, .96, 1.08, 1], dx: [0,-60,40,-80,0], dy: [0,40,-70,30,0] },
  ], [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          animate={{ x: b.dx, y: b.dy, scale: b.s }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute rounded-full ${b.color}`}
          style={{
            left: `${b.x}%`, top: `${b.y}%`, width: `${b.size}rem`, height: `${b.size}rem`,
            filter: `blur(${b.blur}px)`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Layer 2 – Dot Grid (subtle, parallax on scroll)                   */
/* ------------------------------------------------------------------ */
function DotGrid() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, -60])
  const opacity = useTransform(scrollY, [0, 400], [0.03, 0.015])

  return (
    <motion.div
      style={{ y, opacity }}
      className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.25) 0.5px, transparent 0.5px)',
          backgroundSize: '48px 48px',
        }}
      />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Layer 3 – Particles (3 species: dust, glimmer, sparkle)           */
/* ------------------------------------------------------------------ */
type Species = 'dust' | 'glimmer' | 'sparkle'
interface P { id: number; x: number; y: number; size: number; dur: number; del: number; driftX: number; driftY: number; species: Species }

function Particles() {
  const [particles] = useState<P[]>(() =>
    Array.from({ length: 60 }, (_, i): P => {
      const species: Species = i < 30 ? 'dust' : i < 50 ? 'glimmer' : 'sparkle'
      const base = { id: i, x: Math.random() * 100, y: Math.random() * 100, del: Math.random() * 25 }
      if (species === 'dust') return { ...base, size: Math.random() * 1.2 + 0.3, dur: Math.random() * 28 + 22, driftX: 0, driftY: Math.random() * -40 - 10, species }
      if (species === 'glimmer') return { ...base, size: Math.random() * 1.6 + 0.8, dur: Math.random() * 18 + 14, driftX: (Math.random() - 0.5) * 40, driftY: Math.random() * -20 - 5, species }
      return { ...base, size: Math.random() * 1.2 + 0.6, dur: Math.random() * 6 + 3, del: Math.random() * 20, driftX: 0, driftY: 0, species }
    }))

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {particles.map((p) => {
        if (p.species === 'dust')
          return (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-white/15"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{ y: [0, p.driftY, 0], opacity: [0, 0.35, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: 'easeInOut' }}
            />
          )
        if (p.species === 'glimmer')
          return (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-blue-200/20"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{ x: [0, p.driftX, 0], y: [0, p.driftY, 0], opacity: [0, 0.5, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: 'easeInOut' }}
            />
          )
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-blue-200/25 shadow-[0_0_6px_rgba(160,196,255,0.2)]"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ scale: [0, 2, 0], opacity: [0, 0.6, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Layer 4 – Vignette (darkens edges, frames content)                */
/* ------------------------------------------------------------------ */
function Vignette() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true"
      style={{
        background: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Layer 5 – Cursor Glow (dual-colour radial, smooth spring)         */
/* ------------------------------------------------------------------ */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const fade = useTransform(scrollY, [0, 500], [1, 0.3])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf: number, x = -1000, y = -1000, tx = -1000, ty = -1000
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }
    const tick = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08
      const el = ref.current
      if (el) { el.style.setProperty('--cx', `${x}px`); el.style.setProperty('--cy', `${y}px`) }
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <motion.div
      ref={ref} aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        opacity: fade,
        background: 'radial-gradient(600px at var(--cx, -1000px) var(--cy, -1000px), rgba(160,196,255,0.06), rgba(139,92,246,0.02) 45%, transparent 70%)',
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Layer 6 – Cursor Ring (spring follower with hover scale)          */
/* ------------------------------------------------------------------ */
function CursorRing() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf: number, x = -100, y = -100, tx = -100, ty = -100
    let targetSize = 32, currentSize = 32

    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY
      targetSize = (e.target as HTMLElement).closest('a, button, [data-ring]') ? 52 : 32
    }
    const tick = () => {
      x += (tx - x) * 0.1; y += (ty - y) * 0.1
      currentSize += (targetSize - currentSize) * 0.06
      const el = ref.current
      if (el) {
        el.style.transform = `translate(calc(${x}px - ${currentSize / 2}px), calc(${y}px - ${currentSize / 2}px))`
        el.style.width = `${currentSize}px`; el.style.height = `${currentSize}px`
      }
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div
      ref={ref} aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
      style={{
        borderRadius: '50%',
        border: '1px solid rgba(160,196,255,0.12)',
        willChange: 'transform, width, height',
        transition: 'border-color 0.3s',
      }}
    />
  )
}

export function Background() {
  return (
    <>
      <AuroraBlobs />
      <DotGrid />
      <Particles />
      <Vignette />
      <CursorGlow />
      <CursorRing />
    </>
  )
}
