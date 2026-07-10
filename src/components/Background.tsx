import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

function AuroraMesh() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ x: [0, 60, -40, 80, 0], y: [0, -80, 60, -40, 0], scale: [1, 1.1, 0.95, 1.05, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[15%] top-[10%] h-[35rem] w-[35rem] rounded-full bg-blue-400/6 blur-[140px]"
      />
      <motion.div
        animate={{ x: [0, -50, 70, -30, 0], y: [0, 60, -50, 80, 0], scale: [1, 0.9, 1.1, 0.95, 1] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[20%] top-[30%] h-[28rem] w-[28rem] rounded-full bg-purple-400/5 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, 40, -60, 20, 0], y: [0, -30, 50, -60, 0], scale: [1, 1.05, 0.9, 1.08, 1] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[55%] top-[60%] h-[22rem] w-[22rem] rounded-full bg-white/3 blur-[100px]"
      />
    </div>
  )
}

function DotGrid() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  )
}

function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId: number
    let x = -1000, y = -1000
    let tx = -1000, ty = -1000

    const onMouse = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }
    const tick = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      ref.current?.style.setProperty('--gx', `${x}px`)
      ref.current?.style.setProperty('--gy', `${y}px`)
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouse, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        opacity,
        background: 'radial-gradient(600px at var(--gx, -1000px) var(--gy, -1000px), rgba(122, 167, 255, 0.06), transparent 70%)',
      }}
    />
  )
}

export function Background() {
  return (
    <>
      <AuroraMesh />
      <DotGrid />
      <CursorGlow />
    </>
  )
}
