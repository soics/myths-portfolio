import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

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
/*  Layer 3 – Physics Canvas Particles (replaces React DOM particles)  */
/* ------------------------------------------------------------------ */
function PhysicsParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = 0, h = 0
    const mouse = { x: -1000, y: -1000, px: -1000, py: -1000 }

    interface Part {
      x: number; y: number; vx: number; vy: number; size: number
      alpha: number; life: number; maxLife: number
    }

    const particles: Part[] = []

    function resize() {
      w = canvas!.width = window.innerWidth
      h = canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function spawnBurst(cx: number, cy: number, count: number) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1 + Math.random() * 3
        const maxLife = 80 + Math.random() * 120
        particles.push({
          x: cx + (Math.random() - 0.5) * 4,
          y: cy + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1 + Math.random() * 2.5,
          alpha: 0.3 + Math.random() * 0.4,
          life: 0,
          maxLife,
        })
      }
    }

    // Initial ambient particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 0.5 + Math.random() * 1.5,
        alpha: 0.1 + Math.random() * 0.3,
        life: Math.random() * 200,
        maxLife: 200 + Math.random() * 200,
      })
    }

    const onMove = (e: MouseEvent) => {
      mouse.px = mouse.x; mouse.py = mouse.y
      mouse.x = e.clientX; mouse.y = e.clientY
      const dx = mouse.x - mouse.px
      const dy = mouse.y - mouse.py
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 3) spawnBurst(mouse.x, mouse.y, 2)
    }
    const onClick = (e: MouseEvent) => spawnBurst(e.clientX, e.clientY, 25)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('click', onClick, { passive: true })

    function tick() {
      ctx!.clearRect(0, 0, w, h)

      // Get accent color from CSS
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '160,196,255'

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy

        // Friction
        p.vx *= 0.98
        p.vy *= 0.98

        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120 * 0.5
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        // Wrap around edges
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20

        // Fade out and remove dead particles
        const lifeRatio = p.life / p.maxLife
        if (lifeRatio > 0.7) p.alpha *= 0.97
        if (lifeRatio >= 1 || p.alpha < 0.01) {
          particles.splice(i, 1)
          continue
        }

        // Draw particle
        ctx!.globalAlpha = p.alpha
        ctx!.fillStyle = `rgba(${accent}, 0.6)`
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fill()

        // Draw connection lines between close particles
        for (let j = i - 1; j >= 0 && j > i - 10; j--) {
          const p2 = particles[j]
          const ldx = p.x - p2.x
          const ldy = p.y - p2.y
          const ldist = Math.sqrt(ldx * ldx + ldy * ldy)
          if (ldist < 100) {
            ctx!.globalAlpha = (1 - ldist / 100) * 0.08
            ctx!.strokeStyle = `rgba(${accent}, 0.3)`
            ctx!.lineWidth = 0.5
            ctx!.beginPath()
            ctx!.moveTo(p.x, p.y)
            ctx!.lineTo(p2.x, p2.y)
            ctx!.stroke()
          }
        }
      }

      ctx!.globalAlpha = 1
      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
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
      style={{ opacity: fade, background: 'radial-gradient(700px at var(--cx, -1000px) var(--cy, -1000px), rgba(var(--accent-rgb, 160,196,255), 0.06), rgba(var(--accent-rgb, 160,196,255), 0.02) 45%, transparent 70%)' }}
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
      <AccentBloom />
      <PhysicsParticles />
      <MatrixRain active={!!matrixActive} />
      <Vignette />
      <CursorGlow />
      <CursorRing />
      <CRTGlitch active={glitchActive} />
    </>
  )
}
