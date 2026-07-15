import { useEffect, useRef } from 'react'
import { useMusicStore } from '../../lib/music-store'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  hue: number
  pulsePhase: number
}

function getEnergyFactor(store: ReturnType<typeof useMusicStore.getState>): number {
  return store.currentTrack()?.audioFeatures?.energy ?? 0.5
}

function getTempoFactor(store: ReturnType<typeof useMusicStore.getState>): number {
  return store.currentTrack()?.audioFeatures?.tempo ?? 120
}

export function AudioVisualizer({ intensity = 1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const context = el.getContext('2d')
    if (!context) return

    const c = context
    const cv = el
    let width = 0
    let height = 0

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      cv.width = width * devicePixelRatio
      cv.height = height * devicePixelRatio
      cv.style.width = `${width}px`
      cv.style.height = `${height}px`
      c.scale(devicePixelRatio, devicePixelRatio)
    }

    resize()
    window.addEventListener('resize', resize)

    const numParticles = Math.min(80, Math.floor(width * 0.04))
    particlesRef.current = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5 - 0.2,
      size: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.4 + 0.1,
      hue: 35 + Math.random() * 25,
      pulsePhase: Math.random() * Math.PI * 2,
    }))

    function draw(timestamp: number) {
      const dt = Math.min((timestamp - timeRef.current) / 1000, 0.05)
      timeRef.current = timestamp

      const store = useMusicStore.getState()
      const isPlaying = store.isPlaying
      const energy = getEnergyFactor(store)
      const tempo = getTempoFactor(store)
      const bps = tempo / 60

      const energyMult = isPlaying ? energy * intensity : 0.15
      const pulseFreq = isPlaying ? bps : 0.5

      c.clearRect(0, 0, width, height)

      const particles = particlesRef.current

      for (const p of particles) {
        p.pulsePhase += dt * pulseFreq * Math.PI * 2 * 0.25
        const pulse = (Math.sin(p.pulsePhase) * 0.5 + 0.5) * energyMult

        p.vx += (Math.random() - 0.5) * 0.08 * energyMult
        p.vy += (Math.random() - 0.5) * 0.08 * energyMult - 0.01 * energyMult
        p.vx *= 0.98
        p.vy *= 0.98

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        const maxSpeed = 1.5 * energyMult
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed
          p.vy = (p.vy / speed) * maxSpeed
        }

        p.x += p.vx * dt * 60
        p.y += p.vy * dt * 60

        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20

        const alpha = p.alpha * (0.3 + pulse * 0.7)
        const size = p.size * (1 + pulse * 0.8)

        c.beginPath()
        c.arc(p.x, p.y, size, 0, Math.PI * 2)

        const grad = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 2)
        const hue = p.hue + pulse * 15
        grad.addColorStop(0, `hsla(${hue}, 40%, ${60 + pulse * 20}%, ${alpha})`)
        grad.addColorStop(1, `hsla(${hue}, 30%, 40%, 0)`)
        c.fillStyle = grad
        c.fill()
      }

      if (isPlaying && energyMult > 0.2) {
        for (const p of particles) {
          const dx = p.x - width / 2
          const dy = p.y - height / 2
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 1) continue

          const angle = Math.atan2(dy, dx)
          const force = energyMult * 0.02
          p.vx += Math.cos(angle) * force
          p.vy += Math.sin(angle) * force
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    />
  )
}
