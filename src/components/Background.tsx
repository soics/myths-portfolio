import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

function AuroraMesh() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ x: [0, 80, -50, 100, 0], y: [0, -100, 70, -50, 0], scale: [1, 1.15, 0.9, 1.08, 1] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[10%] top-[5%] h-[40rem] w-[40rem] rounded-full bg-blue-400/5 blur-[160px]"
      />
      <motion.div
        animate={{ x: [0, -60, 90, -40, 0], y: [0, 80, -60, 100, 0], scale: [1, 0.85, 1.15, 0.9, 1] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[15%] top-[25%] h-[32rem] w-[32rem] rounded-full bg-purple-400/4 blur-[140px]"
      />
      <motion.div
        animate={{ x: [0, 50, -80, 30, 0], y: [0, -40, 70, -80, 0], scale: [1, 1.08, 0.92, 1.12, 1] }}
        transition={{ duration: 45, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[50%] top-[55%] h-[25rem] w-[25rem] rounded-full bg-white/3 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -30, 50, -20, 0], y: [0, 50, -30, 60, 0], scale: [1, 1.05, 0.95, 1.1, 1] }}
        transition={{ duration: 50, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[30%] top-[70%] h-[18rem] w-[18rem] rounded-full bg-amber-400/2 blur-[100px]"
      />
    </div>
  )
}

function DotGrid() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
    </div>
  )
}

function Particles() {
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 25 + 20,
      delay: Math.random() * 15,
    })))

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
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
        background: 'radial-gradient(600px at var(--gx, -1000px) var(--gy, -1000px), rgba(160, 196, 255, 0.05), transparent 70%)',
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

    const onMouse = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }
    const tick = () => {
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      if (ref.current) {
        ref.current.style.transform = `translate(calc(${x}px - 16px), calc(${y}px - 16px))`
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
        width: 32, height: 32,
        borderRadius: '50%',
        border: '1px solid rgba(160, 196, 255, 0.2)',
        willChange: 'transform',
        transition: 'width 0.3s, height 0.3s, border-color 0.3s',
      }}
    />
  )
}

export function Background() {
  return (
    <>
      <AuroraMesh />
      <DotGrid />
      <Particles />
      <CursorGlow />
      <CursorRing />
    </>
  )
}
