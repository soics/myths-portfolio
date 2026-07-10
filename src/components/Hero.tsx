import { useState, useRef, useEffect, useCallback } from 'react'
import {
  motion, useScroll, useTransform, useSpring, useMotionValue,
} from 'motion/react'
import { ArrowRight, GitBranch } from 'lucide-react'
import { site } from '../data/site'

/* ------------------------------------------------------------------ */
/*  Hooks                                                             */
/* ------------------------------------------------------------------ */

function useTypewriter(text: string, speed = 42, delay = 400) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [started, text, speed])

  return displayed
}

function useMouseSpring() {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const springX = useSpring(mx, { stiffness: 50, damping: 30 })
  const springY = useSpring(my, { stiffness: 50, damping: 30 })

  const handle = useCallback((e: MouseEvent) => {
    mx.set(e.clientX / window.innerWidth)
    my.set(e.clientY / window.innerHeight)
  }, [mx, my])

  useEffect(() => {
    window.addEventListener('mousemove', handle, { passive: true })
    return () => window.removeEventListener('mousemove', handle)
  }, [handle])

  return { x: springX, y: springY }
}

/* ------------------------------------------------------------------ */
/*  Components                                                        */
/* ------------------------------------------------------------------ */

function SystemPrompt({ lines }: { lines: string[] }) {
  return (
    <div className="flex flex-col gap-2 text-xs tracking-wide text-accent-dim/60 font-mono">
      {lines.map((line, i) => (
        <Line key={i} line={line} index={i} />
      ))}
    </div>
  )
}

function Line({ line, index }: { line: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex items-center gap-2"
    >
      <motion.span
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
        className="shrink-0 text-accent/50"
      >
        ▸
      </motion.span>
      <span>{line}</span>
    </motion.div>
  )
}

function FloatingStats() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 400], [0, 60])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <motion.div
      style={{ y, opacity }}
      className="pointer-events-none absolute right-4 top-1/4 hidden select-none gap-3 lg:flex lg:flex-col"
    >
      {[
        { label: 'STATUS', value: 'BUILDING' },
        { label: 'MODE', value: 'ACTIVE' },
        { label: 'ITERATION', value: 'v0.5' },
      ].map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 + i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col gap-0.5 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2.5"
        >
          <span className="text-[10px] tracking-[0.25em] text-white/25">{s.label}</span>
          <span className="font-mono text-xs tracking-wider text-accent-dim/70">
            {s.value}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
              className="ml-0.5 inline-block h-3 w-[2px] bg-accent/40 align-middle"
            />
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}

function GeometricOrbit() {
  const mouse = useMouseSpring()
  const { scrollY } = useScroll()
  const scrollOffset = useTransform(scrollY, [0, 600], [0, -80])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        style={{
          x: useTransform(mouse.x, [0, 1], [-60, 60]),
          y: useTransform(mouse.y, [0, 1], [-40, 40]),
        }}
        className="absolute -right-20 top-10"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="h-[30rem] w-[30rem] rounded-full border border-white/[0.02]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-4 rounded-full border border-white/[0.015]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/3 top-1/3 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/8 to-purple-400/8 blur-3xl"
        />
      </motion.div>

      <motion.div
        style={{ y: scrollOffset }}
        className="absolute left-[12%] top-[60%]"
      >
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="h-2 w-2 rounded-full bg-blue-300/15 shadow-[0_0_12px_rgba(160,196,255,0.08)]"
        />
      </motion.div>
    </div>
  )
}

function MagneticAnchor({
  children, className, href, target, rel, ...props
}: React.ComponentPropsWithoutRef<typeof motion.a>) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setPos({
      x: (e.clientX - r.left - r.width / 2) * 0.35,
      y: (e.clientY - r.top - r.height / 2) * 0.35,
    })
  }
  const handleLeave = () => setPos({ x: 0, y: 0 })

  return (
    <motion.a
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 18, mass: 0.5 }}
      className={className}
      href={href}
      target={target}
      rel={rel}
      {...props}
    >
      {children}
    </motion.a>
  )
}

function ScrollIndicator() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-1.5"
      >
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

  return (
    <motion.section
      id="top"
      style={{ opacity: fade }}
      className="relative flex min-h-dvh items-center overflow-hidden px-5 pt-28"
    >
      <GeometricOrbit />
      <FloatingStats />

      <motion.div style={{ y }} className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Status prompt */}
        <div className="mb-8">
          <SystemPrompt lines={['system boot sequence', 'environment ready', `user: ${site.realName}`]} />
        </div>

        {/* Name — cinematic letter-by-letter */}
        <div className="relative">
          <h1 className="flex flex-wrap overflow-hidden">
            {site.name.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.6 + i * 0.08,
                }}
                className="inline-block text-[clamp(4.5rem,16vw,10rem)] font-black leading-[0.82] tracking-[-0.08em] text-white"
                style={{ textShadow: '0 0 60px rgba(160,196,255,0.06)' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>

          {/* Scan-line overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            aria-hidden="true"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)',
            }}
          />
        </div>

        {/* Subtitle with typewriter */}
        <div className="mt-8 flex items-start gap-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-2.5 h-5 w-[2px] shrink-0 rounded-full bg-accent/40"
          />
          <div>
            <p className="font-mono text-base leading-relaxed text-white/45 md:text-lg">
              <span className="text-accent/30">$</span> {title}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                className="ml-0.5 inline-block h-[1em] w-[2px] bg-accent/50 align-middle"
              />
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8 }}
              className="mt-2 text-sm text-white/25"
            >
              {site.phrases[2]}
            </motion.p>
          </div>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticAnchor
            href="#projects"
            className="focus-ring group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black shadow-lg shadow-white/5 transition-shadow hover:shadow-[0_0_60px_rgba(255,255,255,0.10)]"
          >
            <span>See the work</span>
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </MagneticAnchor>
          <MagneticAnchor
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="focus-ring glass inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold text-white/70 transition-all hover:text-white"
          >
            <GitBranch size={16} />
            <span>Source</span>
          </MagneticAnchor>
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </motion.section>
  )
}
