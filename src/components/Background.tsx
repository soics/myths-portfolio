import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

function NoiseOverlay() {
  return (
    <svg className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-[0.025]" aria-hidden="true">
      <defs>
        <filter id="noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" stitchTiles="stitch" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  )
}

function AuroraMesh() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ x: [0, 120, -60, 140, 0], y: [0, -140, 100, -60, 0], scale: [1, 1.18, 0.88, 1.1, 1] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-[10%] -top-[5%] h-[50rem] w-[50rem] rounded-full bg-blue-400/6 blur-[180px]"
      />
      <motion.div
        animate={{ x: [0, -80, 120, -50, 0], y: [0, 100, -80, 140, 0], scale: [1, 0.82, 1.18, 0.88, 1] }}
        transition={{ duration: 45, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-[10%] top-[20%] h-[40rem] w-[40rem] rounded-full bg-purple-400/5 blur-[160px]"
      />
      <motion.div
        animate={{ x: [0, 60, -100, 40, 0], y: [0, -50, 80, -100, 0], scale: [1, 1.1, 0.9, 1.15, 1] }}
        transition={{ duration: 50, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[45%] top-[50%] h-[30rem] w-[30rem] rounded-full bg-white/[0.04] blur-[140px]"
      />
      <motion.div
        animate={{ x: [0, -40, 70, -30, 0], y: [0, 60, -40, 80, 0], scale: [1, 1.06, 0.94, 1.12, 1] }}
        transition={{ duration: 55, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-[10%] left-[20%] h-[35rem] w-[35rem] rounded-full bg-cyan-400/3 blur-[150px]"
      />
      <motion.div
        animate={{ x: [0, 90, -40, 60, 0], y: [0, -70, 110, -30, 0], scale: [1, 0.9, 1.12, 0.95, 1] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[70%] top-[10%] h-[20rem] w-[20rem] rounded-full bg-violet-400/4 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -50, 30, -70, 0], y: [0, 30, -60, 20, 0], scale: [1, 1.04, 0.96, 1.08, 1] }}
        transition={{ duration: 48, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[30%] top-[75%] h-[15rem] w-[15rem] rounded-full bg-amber-400/2 blur-[100px]"
      />
    </div>
  )
}

function DotGrid() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  )
}

type Particle = { id: number; x: number; y: number; size: number; duration: number; delay: number; drift: number; type: 'float' | 'drift' | 'sparkle' }

function Particles() {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 45 }, (_, i) => {
      const type = i < 25 ? 'float' : i < 38 ? 'drift' : 'sparkle'
      return {
        id: i, x: Math.random() * 100, y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        duration: type === 'sparkle' ? Math.random() * 6 + 3 : Math.random() * 30 + 20,
        delay: Math.random() * 20,
        drift: Math.random() * 30 - 15,
        type,
      }
    }))

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {particles.map((p) => {
        if (p.type === 'float') {
          return (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-white/20"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{ y: [0, -50, 0], opacity: [0, 0.4, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            />
          )
        }
        if (p.type === 'drift') {
          return (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-blue-200/25"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size + 1, height: p.size + 1 }}
              animate={{ x: [0, p.drift, 0], y: [0, -20, 0], opacity: [0, 0.5, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            />
          )
        }
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-blue-200/30"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size + 0.5, height: p.size + 0.5 }}
            animate={{ scale: [0, 1.5, 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf: number
    let x = -1000, y = -1000, tx = -1000, ty = -1000

    const onMouse = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }
    const tick = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      ref.current?.style.setProperty('--gx', `${x}px`)
      ref.current?.style.setProperty('--gy', `${y}px`)
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouse, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        opacity,
        background: 'radial-gradient(700px at var(--gx, -1000px) var(--gy, -1000px), rgba(160, 196, 255, 0.06), rgba(160, 140, 255, 0.02) 50%, transparent 80%)',
      }}
    />
  )
}

function CursorRing() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf: number
    let x = -100, y = -100, tx = -100, ty = -100
    let targetSize = 32
    let currentSize = 32

    const onMouse = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY

      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [data-ring]')
      targetSize = interactive ? 56 : 32
    }

    const tick = () => {
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      currentSize += (targetSize - currentSize) * 0.08
      if (ref.current) {
        ref.current.style.transform = `translate(calc(${x}px - ${currentSize / 2}px), calc(${y}px - ${currentSize / 2}px))`
        ref.current.style.width = `${currentSize}px`
        ref.current.style.height = `${currentSize}px`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouse, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
      style={{
        borderRadius: '50%',
        border: '1px solid rgba(160, 196, 255, 0.15)',
        willChange: 'transform, width, height',
        transition: 'border-color 0.4s',
      }}
    />
  )
}

export function Background() {
  return (
    <>
      <NoiseOverlay />
      <AuroraMesh />
      <DotGrid />
      <Particles />
      <CursorGlow />
      <CursorRing />
    </>
  )
}
