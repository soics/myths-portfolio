import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react'

/* ------------------------------------------------------------------ */
/*  Layer 1 – Far Aurora                                              */
/* ------------------------------------------------------------------ */
function AuroraBlobs() {
  const blobs = [
    [56, -8, -4, 'bg-blue-400/7', 200, 38, [1,1.2,.88,1.08,1], [0,140,-80,120,0], [0,-160,110,-70,0]],
    [44, 78, 18, 'bg-purple-400/6', 180, 44, [1,.8,1.18,.9,1], [0,-100,140,-60,0], [0,120,-90,160,0]],
    [34, 42, 48, 'bg-white/[0.04]', 160, 50, [1,1.1,.92,1.15,1], [0,70,-110,50,0], [0,-60,90,-110,0]],
    [38, 18, 72, 'bg-cyan-400/4', 170, 55, [1,1.06,.94,1.12,1], [0,-50,80,-40,0], [0,70,-50,90,0]],
    [24, 70, 8, 'bg-violet-400/5', 140, 40, [1,.88,1.14,.94,1], [0,100,-50,70,0], [0,-80,120,-40,0]],
    [18, 28, 78, 'bg-amber-400/3', 120, 48, [1,1.04,.96,1.08,1], [0,-60,40,-80,0], [0,40,-70,30,0]],
  ] as const

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {blobs.map(([size, x, y, color, blur, dur, scale, dx, dy], i) => (
        <motion.div
          key={i}
          animate={{ x: [...dx], y: [...dy], scale: [...scale] }}
          transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute rounded-full ${color}`}
          style={{ left: `${x}%`, top: `${y}%`, width: `${size}rem`, height: `${size}rem`, filter: `blur(${blur}px)` }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Layer 2 – Dot Grid                                                */
/* ------------------------------------------------------------------ */
function DotGrid() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, -60])
  return (
    <motion.div style={{ y }} className="pointer-events-none fixed inset-0 -z-10 opacity-[0.025]" aria-hidden="true">
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.25)0.5px,transparent 0.5px)', backgroundSize: '48px 48px' }} />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  3D Rotating Geometric Shape                                       */
/* ------------------------------------------------------------------ */
function GeometricShape() {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 30, damping: 25 })
  const sy = useSpring(my, { stiffness: 30, damping: 25 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mx.set(e.clientX / window.innerWidth); my.set(e.clientY / window.innerHeight) }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  const rx = useTransform(sx, [0, 1], [-15, 15])
  const ry = useTransform(sy, [0, 1], [-15, 15])

  return (
    <motion.div style={{ rotateX: rx, rotateY: ry }} className="pointer-events-none fixed right-[-10vw] top-[15vh] -z-10 hidden md:block" aria-hidden="true">
      <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="h-[50vh] w-[50vh] rounded-full border border-white/[0.03]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-white/[0.06]"
            style={{ transformOrigin: '50% 25vh', rotate: `${i * 45}deg` }} />
        ))}
      </motion.div>
      <motion.div animate={{ rotateZ: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[15%] rounded-full border border-white/[0.02]" />
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-1/2 h-[20vh] w-[20vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl" />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Layer 3 – Poppable Particles                                      */
/* ------------------------------------------------------------------ */
interface PopParticle { id: number; x: number; y: number; size: number; popped: boolean; delay: number; popX: number; popY: number }

function Particles() {
  const [particles, setParticles] = useState<PopParticle[]>(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4, popped: false, delay: Math.random() * 20,
      popX: 0, popY: 0,
    }))
  )

  const popCount = useRef(0)

  const pop = useCallback((id: number) => {
    setParticles(prev => prev.map(p =>
      p.id === id ? { ...p, popped: true, popX: (Math.random() - 0.5) * 60, popY: (Math.random() - 0.5) * 60 } : p
    ))
    popCount.current++
    if (popCount.current >= 5) {
      setTimeout(() => {
        setParticles(prev => prev.map(p => ({ ...p, popped: false })))
        popCount.current = 0
      }, 1500)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {particles.map((p) => {
        if (p.popped) {
          return (
            <motion.div
              key={p.id}
              initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              animate={{ scale: 3, opacity: 0, x: p.popX, y: p.popY }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute rounded-full bg-blue-200/30 shadow-[0_0_6px_rgba(160,196,255,0.3)]"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size * 2, height: p.size * 2 }}
            />
          )
        }
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/15"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -30 - (p.id % 20), 0], opacity: [0, 0.4, 0] }}
            transition={{ duration: 18 + (p.id % 20), repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            onClick={() => pop(p.id)}
          />
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Layer 4 – Vignette                                                */
/* ------------------------------------------------------------------ */
function Vignette() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true"
      style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)' }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Layer 5 – Cursor Glow                                             */
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
    <motion.div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10"
      style={{ opacity: fade, background: 'radial-gradient(700px at var(--cx, -1000px) var(--cy, -1000px), rgba(160,196,255,0.06), rgba(139,92,246,0.02) 45%, transparent 70%)' }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Layer 6 – Cursor Ring                                             */
/* ------------------------------------------------------------------ */
function CursorRing() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf: number, x = -100, y = -100, tx = -100, ty = -100, targetSize = 32, currentSize = 32
    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY
      targetSize = (e.target as HTMLElement).closest('a, button, [data-ring]') ? 56 : 32
    }
    const tick = () => {
      x += (tx - x) * 0.1; y += (ty - y) * 0.1; currentSize += (targetSize - currentSize) * 0.06
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
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
      style={{ borderRadius: '50%', border: '1px solid rgba(160,196,255,0.12)', willChange: 'transform, width, height' }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Layer 7 – CRT Glitch                                              */
/* ------------------------------------------------------------------ */
function CRTGlitch({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-0 z-40" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)' }} />
      <motion.div animate={{ x: [0, 3, -2, 1, 0] }} transition={{ duration: 0.3, repeat: 3 }}
        className="absolute inset-0 mix-blend-screen opacity-[0.04]"
        style={{ background: 'linear-gradient(90deg, rgba(255,0,0,0.3), transparent 30%, transparent 70%, rgba(0,0,255,0.3))' }} />
      <motion.div animate={{ opacity: [0, 0.1, 0, 0.05, 0] }} transition={{ duration: 0.6, repeat: 2 }}
        className="absolute inset-0 bg-white" />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                       */
/* ------------------------------------------------------------------ */

export function Background() {
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    (window as unknown as Record<string, () => void>).__triggerGlitch = () => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 3000)
    }
    return () => { delete (window as unknown as Record<string, unknown>).__triggerGlitch }
  }, [])

  return (
    <>
      <AuroraBlobs />
      <DotGrid />
      <GeometricShape />
      <Particles />
      <Vignette />
      <CursorGlow />
      <CursorRing />
      <CRTGlitch active={glitchActive} />
    </>
  )
}
