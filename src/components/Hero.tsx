import { useState, useRef, useEffect, useCallback } from 'react'
import {
  motion, useScroll, useTransform, useSpring, useMotionValue,
} from 'motion/react'
import { ArrowRight, GitBranch } from 'lucide-react'
import { site } from '../data/site'

/* ------------------------------------------------------------------ */
/*  3D Live-Code Terminal                                              */
/* ------------------------------------------------------------------ */
function useCodeTyper(lines: string[]) {
  const [displayed, setDisplayed] = useState<string[]>(lines.map(() => ''))
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phase === 0) {
        const lineIdx = displayed.findIndex((d, i) => d.length < lines[i].length)
        if (lineIdx === -1) { setPhase(1); return }
        setDisplayed(prev => {
          const next = [...prev]
          next[lineIdx] = lines[lineIdx].slice(0, next[lineIdx].length + 1)
          return next
        })
      } else if (phase === 1) {
        setTimeout(() => setPhase(2), 2000)
      } else {
        const allEmpty = displayed.every(d => d.length === 0)
        if (allEmpty) { setPhase(0); return }
        setDisplayed(prev => {
          const next = [...prev]
          for (let i = next.length - 1; i >= 0; i--) {
            if (next[i].length > 0) { next[i] = next[i].slice(0, -1); break }
          }
          return next
        })
      }
    }, phase === 0 ? 35 : 20)
    return () => clearTimeout(timer)
  }, [phase, displayed, lines])

  return displayed
}

function LiveCodeTerminal() {
  const lines = [
    'const portfolio = new Portfolio()',
    'portfolio.theme = "dark"',
    'portfolio.build()',
    '// → deploying...',
  ]
  const displayed = useCodeTyper(lines)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 2.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute bottom-8 right-4 z-20 hidden w-72 select-none overflow-hidden rounded-xl border border-white/[0.06] bg-black/60 backdrop-blur-xl lg:block"
    >
      <div className="flex items-center gap-1.5 border-b border-white/[0.04] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400/40" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/40" />
        <span className="h-2 w-2 rounded-full bg-green-400/40" />
        <span className="ml-2 text-[10px] text-white/20">build.sh</span>
      </div>
      <div className="px-3 py-2.5 font-mono text-[11px] leading-[1.7] text-white/40">
        {displayed.map((line, i) => (
          <div key={i}>
            <span className="text-white/20">$ </span>
            {line}
            {i === displayed.reduce((last, d, idx) => d.length > 0 ? idx : last, -1) && (
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                className="ml-0.5 inline-block h-3 w-[2px] bg-accent/40 align-middle" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  3D Parallax Layer System                                          */
/* ------------------------------------------------------------------ */
function useParallaxLayer(factor = 1) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 40, damping: 30 })
  const sy = useSpring(my, { stiffness: 40, damping: 30 })

  const handle = useCallback((e: MouseEvent) => {
    mx.set(e.clientX / window.innerWidth)
    my.set(e.clientY / window.innerHeight)
  }, [mx, my])

  useEffect(() => {
    window.addEventListener('mousemove', handle, { passive: true })
    return () => window.removeEventListener('mousemove', handle)
  }, [handle])

  const x = useTransform(sx, [0, 1], [-20 * factor, 20 * factor])
  const y = useTransform(sy, [0, 1], [-15 * factor, 15 * factor])
  return { x, y }
}

/* ------------------------------------------------------------------ */
/*  Floating Orb Elements                                              */
/* ------------------------------------------------------------------ */
function FloatingOrbs() {
  const deep = useParallaxLayer(0.3)
  const mid = useParallaxLayer(0.5)

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <motion.div style={{ x: deep.x, y: deep.y }} className="absolute inset-0">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-32 top-10 h-[35rem] w-[35rem] rounded-full border border-white/[0.015]" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-24 top-20 h-[28rem] w-[28rem] rounded-full border border-white/[0.01]" />
      </motion.div>

      <motion.div style={{ x: mid.x, y: mid.y }} className="absolute inset-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div key={i} animate={{ y: [0, -20 - i * 5, 0], opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            className="absolute h-2 w-2 rounded-full bg-blue-300/15"
            style={{ left: `${30 + i * 15}%`, top: `${40 + i * 8}%` }} />
        ))}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Magnetic Anchor                                                   */
/* ------------------------------------------------------------------ */
function MagneticAnchor({
  children, className, href, target, rel, ...props
}: React.ComponentPropsWithoutRef<typeof motion.a>) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const handleMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setPos({ x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35 })
  }
  const handleLeave = () => setPos({ x: 0, y: 0 })
  return (
    <motion.a ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 18, mass: 0.5 }}
      className={className} href={href} target={target} rel={rel} {...props}
    >
      {children}
    </motion.a>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                       */
/* ------------------------------------------------------------------ */

export function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 60])
  const fade = useTransform(scrollY, [0, 400], [1, 0])

  const [mWobble, setMWobble] = useState(false)
  const wobbleRef = useRef(0)
  const handleMClick = useCallback(() => {
    wobbleRef.current++
    setMWobble(true)
    setTimeout(() => setMWobble(false), 600)
    if (wobbleRef.current >= 5) {
      wobbleRef.current = 0
      const w = window as unknown as Record<string, () => void>
      w.__triggerGlitch?.()
    }
  }, [])

  return (
    <motion.section id="top" style={{ opacity: fade }}
      className="relative flex min-h-dvh items-center overflow-hidden px-5 pt-28"
    >
      <FloatingOrbs />
      <LiveCodeTerminal />

      <motion.div style={{ y, perspective: 800 }} className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Massive left-aligned name */}
        <div className="relative max-w-[85%] md:max-w-[70%]">
          <h1 className="flex flex-wrap overflow-hidden gap-1">
            {site.name.split('').map((char, i) => {
              const isM = i === 0
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 120, scale: 0.7, filter: 'blur(10px)' }}
                  animate={{
                    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
                    rotateZ: isM && mWobble ? [0, -10, 10, -5, 5, 0] : 0,
                  }}
                  transition={{
                    duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 + i * 0.07,
                    rotateZ: mWobble ? { duration: 0.6, ease: 'easeInOut' } : undefined,
                  }}
                  className={`inline-block text-[clamp(5rem,18vw,11rem)] font-black leading-[0.85] text-white ${isM ? 'cursor-pointer select-none' : ''}`}
                  onClick={isM ? handleMClick : undefined}
                  style={{ textShadow: '0 0 80px rgba(160,196,255,0.05), 0 1px 0 rgba(255,255,255,0.04), 0 2px 0 rgba(255,255,255,0.03), 0 4px 0 rgba(255,255,255,0.02), 0 8px 20px rgba(0,0,0,0.3)' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              )
            })}
          </h1>
        </div>

        {/* Single strong tagline — the honest truth */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-white/40 md:text-xl"
        >
          {site.phrases[2]}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticAnchor href="#projects"
            className="focus-ring group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black shadow-lg shadow-white/5 transition-shadow hover:shadow-[0_0_60px_rgba(255,255,255,0.10)]">
            <span>See the work</span>
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </MagneticAnchor>
          <MagneticAnchor href={site.github} target="_blank" rel="noreferrer"
            className="focus-ring glass inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold text-white/70 transition-all hover:text-white">
            <GitBranch size={16} />
            <span>Source</span>
          </MagneticAnchor>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
