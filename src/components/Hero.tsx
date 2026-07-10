import { useState, useRef, useEffect, useCallback } from 'react'
import {
  motion, useScroll, useTransform, useSpring, useMotionValue,
} from 'motion/react'
import { ArrowRight, GitBranch } from 'lucide-react'
import { site } from '../data/site'

/* ------------------------------------------------------------------ */
/*  Hooks                                                             */
/* ------------------------------------------------------------------ */

function useTypewriter(text: string, speed = 38, delay = 400) {
  const [d, s] = useState('')
  const [started, setStarted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setStarted(true), delay); return () => clearTimeout(t) }, [delay])
  useEffect(() => {
    if (!started) return
    let i = 0
    const id = setInterval(() => { i++; s(text.slice(0, i)); if (i >= text.length) clearInterval(id) }, speed)
    return () => clearInterval(id)
  }, [started, text, speed])
  return d
}

/* ------------------------------------------------------------------ */
/*  3D Live-Code Terminal (floating window, animated typing)          */
/* ------------------------------------------------------------------ */
function useCodeTyper(lines: string[]) {
  const [displayed, setDisplayed] = useState<string[]>(lines.map(() => ''))
  const [phase, setPhase] = useState(0) // 0=typing, 1=holding, 2=deleting

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phase === 0) {
        // Type current line
        const lineIdx = displayed.findIndex((d, i) => d.length < lines[i].length)
        if (lineIdx === -1) { setPhase(1); return }
        setDisplayed(prev => {
          const next = [...prev]
          next[lineIdx] = lines[lineIdx].slice(0, next[lineIdx].length + 1)
          return next
        })
      } else if (phase === 1) {
        // Hold for a moment, then start deleting
        setTimeout(() => setPhase(2), 2000)
      } else {
        // Delete all lines
        const allEmpty = displayed.every(d => d.length === 0)
        if (allEmpty) { setPhase(0); return }
        setDisplayed(prev => {
          const next = [...prev]
          // Find last non-empty line
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
      transition={{ delay: 2.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute -bottom-4 left-4 z-20 hidden w-72 select-none overflow-hidden rounded-xl border border-white/[0.06] bg-black/60 backdrop-blur-xl md:block"
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
/*  Floating Orb Elements (parallax layered)                          */
/* ------------------------------------------------------------------ */
function FloatingOrbs() {
  const deep = useParallaxLayer(0.3)
  const mid = useParallaxLayer(0.5)

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* Far layer — slow parallax */}
      <motion.div style={{ x: deep.x, y: deep.y }} className="absolute inset-0">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-32 top-10 h-[35rem] w-[35rem] rounded-full border border-white/[0.015]" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-24 top-20 h-[28rem] w-[28rem] rounded-full border border-white/[0.01]" />
      </motion.div>

      {/* Mid layer — medium parallax */}
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
/*  Scroll Indicator                                                  */
/* ------------------------------------------------------------------ */
function ScrollIndicator() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2">
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.35em] text-white/12">Scroll</span>
        <svg width="12" height="12" viewBox="0 0 12 12" className="text-white/12">
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                       */
/* ------------------------------------------------------------------ */

export function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 60])
  const fade = useTransform(scrollY, [0, 400], [1, 0])
  const title = useTypewriter(site.title, 38, 1400)

  // Easter egg: clicking the 'm' in myths
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

  // Near parallax for CTAs
  const nearP = useParallaxLayer(0.8)
  const nearX = useTransform(nearP.x, [-16, 16], [-8, 8])
  const nearY = useTransform(nearP.y, [-12, 12], [-6, 6])

  return (
    <motion.section id="top" style={{ opacity: fade }}
      className="relative flex min-h-dvh items-center overflow-hidden px-5 pt-28"
    >
      {/* 3D background layers */}
      <FloatingOrbs />

      {/* Live-code terminal (pinned to bottom-left) */}
      <LiveCodeTerminal />

      <motion.div style={{ y, perspective: 800 }} className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Prompt (appears first) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-10 flex flex-col gap-1.5 font-mono text-xs tracking-wide text-accent-dim/50"
        >
          {[
            'system boot sequence',
            'environment ready',
            `user: ${site.realName}`,
          ].map((line, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center gap-2"
            >
              <motion.span animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="shrink-0 text-accent/40"
              >▸</motion.span>
              <span>{line}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* 3D Extruded Name */}
        <div className="relative">
          <h1 className="flex flex-wrap overflow-hidden">
            {site.name.split('').map((char, i) => {
              const isM = i === 0
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(8px)' }}
                  animate={{
                    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
                    rotateZ: isM && mWobble ? [0, -8, 8, -4, 4, 0] : 0,
                  }}
                  transition={{
                    duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.8 + i * 0.07,
                    rotateZ: mWobble ? { duration: 0.6, ease: 'easeInOut' } : undefined,
                  }}
                  className={`inline-block text-[clamp(4.5rem,16vw,10rem)] font-black leading-[0.82] tracking-[-0.08em] text-white ${isM ? 'cursor-pointer' : ''}`}
                  onClick={isM ? handleMClick : undefined}
                  style={{ textShadow: '0 0 60px rgba(160,196,255,0.06), 0 1px 0 rgba(255,255,255,0.04), 0 2px 0 rgba(255,255,255,0.03), 0 4px 0 rgba(255,255,255,0.02), 0 8px 15px rgba(0,0,0,0.3)' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              )
            })}
          </h1>
          <div className="pointer-events-none absolute inset-0 opacity-[0.02]" aria-hidden="true"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)' }}
          />
        </div>

        {/* Subtitle */}
        <div className="mt-8 flex items-start gap-4" style={{ transformStyle: 'preserve-3d' }}>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
            className="mt-2.5 h-5 w-[2px] shrink-0 rounded-full bg-accent/40" />
          <div>
            <p className="font-mono text-base leading-relaxed text-white/45 md:text-lg">
              <span className="text-accent/30">$</span> {title}
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                className="ml-0.5 inline-block h-[1em] w-[2px] bg-accent/50 align-middle" />
            </p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.0 }}
              className="mt-2 text-sm text-white/25">{site.phrases[2]}</motion.p>
          </div>
        </div>

        {/* CTAs (near layer — follows mouse more) */}
        <motion.div style={{ x: nearX, y: nearY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
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

      <ScrollIndicator />
    </motion.section>
  )
}
