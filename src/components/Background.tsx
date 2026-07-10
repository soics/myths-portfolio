import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

/* ------------------------------------------------------------------ */
/*  Layer 1 – Accent Bloom (visible signature glow)                    */
/* ------------------------------------------------------------------ */
function AccentBloom() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-[10%] -top-[10%] h-[65vh] w-[65vw] rounded-full"
        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(var(--accent-rgb, 160,196,255), 0.3), transparent 70%)', filter: 'blur(90px)' }}
      />
      <motion.div
        animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-[10%] -right-[10%] h-[55vh] w-[55vw] rounded-full"
        style={{ background: 'radial-gradient(circle at 70% 70%, rgba(var(--accent-rgb, 160,196,255), 0.25), transparent 70%)', filter: 'blur(100px)' }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Layer 3 – Constellation Canvas (visible, elegant, reactive)        */
/* ------------------------------------------------------------------ */
function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = 0, h = 0
    const mouse = { x: -1000, y: -1000 }

    interface Star {
      x: number; y: number; baseX: number; baseY: number
      vx: number; vy: number
      size: number; phase: number
    }

    const stars: Star[] = []
    let time = 0

    function resize() {
      w = canvas!.width = window.innerWidth
      h = canvas!.height = window.innerHeight
      if (stars.length === 0) {
        for (let i = 0; i < 120; i++) {
          const x = Math.random() * w
          const y = Math.random() * h
          stars.push({
            x, y, baseX: x, baseY: y,
            vx: 0, vy: 0,
            size: 1 + Math.random() * 2.5,
            phase: Math.random() * Math.PI * 2,
          })
        }
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -1000; mouse.y = -1000 }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave, { passive: true })

    function tick() {
      time += 0.005
      ctx!.clearRect(0, 0, w, h)

      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '160,196,255'

      // Update stars
      for (const s of stars) {
        const dx = mouse.x - s.x
        const dy = mouse.y - s.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Gentle mouse attraction
        if (dist < 250 && dist > 0) {
          const force = (250 - dist) / 250 * 0.08
          s.vx += (dx / dist) * force
          s.vy += (dy / dist) * force
        }

        // Drift back to base position
        s.vx += (s.baseX - s.x) * 0.002
        s.vy += (s.baseY - s.y) * 0.002

        // Damping
        s.vx *= 0.94
        s.vy *= 0.94

        s.x += s.vx
        s.y += s.vy
      }

      // Draw connections (constellation lines)
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < Math.min(i + 15, stars.length); j++) {
          const a = stars[i], b = stars[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.15
            ctx!.globalAlpha = alpha
            ctx!.strokeStyle = `rgba(${accent}, ${0.3 + Math.sin(time + a.phase + b.phase) * 0.15})`
            ctx!.lineWidth = 0.8
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      // Draw stars
      for (const s of stars) {
        const pulse = 0.6 + Math.sin(time * 2 + s.phase) * 0.3
        const radius = s.size * pulse

        // Glow
        const grad = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius * 4)
        grad.addColorStop(0, `rgba(${accent}, 0.15)`)
        grad.addColorStop(1, `rgba(${accent}, 0)`)
        ctx!.globalAlpha = 0.8
        ctx!.fillStyle = grad
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, radius * 4, 0, Math.PI * 2)
        ctx!.fill()

        // Core
        ctx!.globalAlpha = 0.5 + pulse * 0.4
        ctx!.fillStyle = `rgba(${accent}, 0.85)`
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, radius, 0, Math.PI * 2)
        ctx!.fill()
      }

      ctx!.globalAlpha = 1
      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Layer 3b – Matrix Rain Canvas                                     */
/* ------------------------------------------------------------------ */
function MatrixRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = 0, h = 0
    const fontSize = 14
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF'
    let drops: number[] = []

    function resize() {
      w = canvas!.width = window.innerWidth
      h = canvas!.height = window.innerHeight
      const cols = Math.floor(w / fontSize)
      drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -h / fontSize))
    }
    resize()
    window.addEventListener('resize', resize)

    function tick() {
      ctx!.fillStyle = 'rgba(0, 10, 0, 0.05)'
      ctx!.fillRect(0, 0, w, h)
      ctx!.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        ctx!.fillStyle = `rgba(0, 255, 65, ${0.1 + Math.random() * 0.4})`
        ctx!.fillText(char, x, y)
        if (y > h && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  if (!active) return null
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 opacity-30"
      aria-hidden="true"
    />
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
      style={{ borderRadius: '50%', border: '1px solid rgba(var(--accent-rgb, 160,196,255), 0.12)', willChange: 'transform, width, height' }}
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

export function Background({ matrixActive }: { matrixActive?: boolean }) {
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
      <Constellation />
      <AccentBloom />
      <MatrixRain active={!!matrixActive} />
      <Vignette />
      <CursorRing />
      <CRTGlitch active={glitchActive} />
    </>
  )
}
