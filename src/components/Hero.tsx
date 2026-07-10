import { useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { ArrowRight, Terminal, Sparkles } from 'lucide-react'
import { site } from '../data/site'

function TypeWriter({ text, delay = 0, speed = 40 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay * 1000)
    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1))
      }, speed)
      return () => clearTimeout(timer)
    }
  }, [started, displayed, text, speed])

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-[2px] h-[1em] bg-cyan/60 ml-0.5 align-middle"
        />
      )}
    </span>
  )
}

function DataStreams() {
  const streams = [
    { label: 'STATUS', value: 'ACTIVE', color: 'text-cyan' },
    { label: 'MODE', value: 'BUILD', color: 'text-amber' },
    { label: 'SIGNAL', value: 'STABLE', color: 'text-cyan' },
    { label: 'UPTIME', value: 'ONLINE', color: 'text-cyan' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 0.8 }}
      className="pointer-events-none absolute right-6 top-24 z-10 hidden md:block"
    >
      <div className="space-y-2 text-right">
        {streams.map((s) => (
          <div key={s.label} className="group flex items-center gap-3 justify-end">
            <span className="text-[10px] font-mono text-white/20 tracking-[0.15em]">{s.label}</span>
            <span className={`text-[11px] font-mono font-semibold ${s.color}`}>
              {s.value}
            </span>
            <span className={`h-1.5 w-1.5 rounded-full ${s.color.replace('text-', 'bg-')} signal-pulse`} />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function HolographicRing() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
      aria-hidden="true"
    >
      <div className="relative h-[500px] w-[500px] md:h-[700px] md:w-[700px]">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-cyan/5" />
        <div className="absolute inset-[15%] rounded-full border border-cyan/8" />
        <div className="absolute inset-[30%] rounded-full border border-violet/5" />
        {/* Animated orbit dots */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan/20 shadow-[0_0_8px_rgba(212,212,220,0.15)]" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[15%]"
        >
          <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-violet/15 shadow-[0_0_6px_rgba(136,136,160,0.15)]" />
        </motion.div>
      </div>
    </motion.div>
  )
}

function CommandPrompt() {
  const openTerminal = () => {
    const w = window as unknown as Record<string, () => void>
    w.__openTerminal?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.8, duration: 0.6 }}
      className="pointer-events-none absolute bottom-8 left-6 z-10 hidden md:block"
    >
      <button
        type="button"
        onClick={openTerminal}
        className="pointer-events-auto group flex items-center gap-2 rounded-full border border-cyan/10 bg-deep/60 px-4 py-2 text-[11px] font-mono text-white/40 backdrop-blur-sm transition-all hover:border-cyan/20 hover:text-white/70"
      >
        <Terminal size={12} className="text-cyan/40" />
        <span className="text-white/30">_</span>
        <span className="tracking-[0.1em]">type ` to access systems</span>
        <kbd className="ml-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] text-white/30">`</kbd>
      </button>
    </motion.div>
  )
}

export function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 40])
  const fade = useTransform(scrollY, [0, 400], [1, 0])

  const phrases = site.phrases
  const clickRef = { current: 0 }
  const [showQuote, setShowQuote] = useState(false)

  const handleNameClick = useCallback(() => {
    clickRef.current++
    if (clickRef.current >= 3) {
      clickRef.current = 0
      setShowQuote(true)
      setTimeout(() => setShowQuote(false), 5000)
      ;(window as unknown as { __triggerGlitch?: () => void }).__triggerGlitch?.()
      ;(window as unknown as { __addEasterEgg?: (key: string) => void }).__addEasterEgg?.('mythsClick')
    }
  }, [])

  return (
    <motion.section id="top" style={{ opacity: fade }}
      className="relative flex min-h-dvh items-center overflow-hidden px-5 pt-28"
    >
      <HolographicRing />
      <DataStreams />
      <CommandPrompt />

      <motion.div style={{ y }} className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-[1px] w-8 bg-cyan/30" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan/50">
              SYSTEM.BOOT.SEQUENCE
            </span>
            <span className="h-[1px] w-8 bg-cyan/30" />
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3rem,12vw,8rem)] font-black leading-[0.88] tracking-[-0.04em]"
          >
            <button
              type="button"
              onClick={handleNameClick}
              className="cursor-pointer bg-transparent border-none p-0 inline"
              aria-label="Click for a secret"
            >
              <span className="bg-gradient-to-r from-white via-white to-cyan/60 bg-clip-text text-transparent transition-all duration-300 hover:to-cyan/40">
                {site.name}
              </span>
            </button>
          </motion.h1>

          <AnimatePresence>
            {showQuote && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg rounded-2xl border border-white/[0.08] bg-deep/95 px-6 py-5 text-center shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl"
              >
                <p className="text-sm leading-relaxed text-white/55 italic">
                  &ldquo;all change is not growth, as all movement is not forward&rdquo;
                </p>
                <p className="mt-2 text-[10px] text-white/25">myths</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Real name */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-lg text-white/50 font-mono"
          >
            <span className="text-cyan/40">&gt;</span> {site.realName}
          </motion.p>

          {/* Typewriter tagline */}
          <motion.div className="mt-8 max-w-2xl">
            <p className="text-[15px] leading-relaxed text-white/60 md:text-base">
              <TypeWriter text={phrases[2] || 'Building the future, one line at a time.'} delay={1} speed={25} />
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <a href="#projects"
              className="focus-ring group inline-flex items-center gap-3 rounded-full bg-cyan px-7 py-3.5 text-sm font-semibold text-deep transition-all hover:bg-white hover:shadow-[0_0_32px_rgba(212,212,220,0.15)] active:scale-[0.97]"
            >
              <span>Explore the world</span>
              <ArrowRight size={15} className="transition group-hover:translate-x-1" />
            </a>
            <a href="#about"
              className="focus-ring group inline-flex items-center gap-2 rounded-full border border-white/10 px-7 py-3.5 text-sm font-medium text-white/60 transition-all hover:border-white/20 hover:text-white/80 active:scale-[0.97]"
            >
              <Sparkles size={14} className="text-violet/50" />
              <span>Origin story</span>
            </a>
          </motion.div>

          {/* Signal bars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.6 }}
            className="mt-16 flex items-center gap-4"
          >
            <div className="flex items-end gap-[2px] h-4">
              {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${h * 25}%` }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.15, ease: 'easeInOut' }}
                  className="w-[2px] rounded-full bg-cyan/30"
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-white/20 tracking-[0.15em]">SIGNAL ACTIVE</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}
