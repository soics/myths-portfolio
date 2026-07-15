import { useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { site } from '../data/site'
import { useStore } from '../lib/store'

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
        <span className="inline-block w-[2px] h-[1em] bg-gold/60 ml-0.5 align-middle animate-cursor-blink" />
      )}
    </span>
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
        <motion.div
          animate={{ opacity: [0.15, 0.5, 0.15], boxShadow: ['0 0 0px rgba(196,164,85,0.03)', '0 0 40px rgba(196,164,85,0.1)', '0 0 0px rgba(196,164,85,0.03)'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full border border-gold/15"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.4, 0.1], boxShadow: ['0 0 0px rgba(196,164,85,0.02)', '0 0 30px rgba(196,164,85,0.08)', '0 0 0px rgba(196,164,85,0.02)'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute inset-[15%] rounded-full border border-gold/12"
        />
        <motion.div
          animate={{ opacity: [0.08, 0.3, 0.08] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute inset-[30%] rounded-full border border-gold/10"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-gold/60 shadow-[0_0_16px_rgba(196,164,85,0.3)]" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[15%]"
        >
          <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold/40 shadow-[0_0_12px_rgba(196,164,85,0.2)]" />
        </motion.div>
      </div>
    </motion.div>
  )
}

function ButtonInner({ children, showArrow = true }: { children: React.ReactNode; showArrow?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span>{children}</span>
      {showArrow && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-105">
          <ArrowRight size={12} className="text-white/70" />
        </span>
      )}
    </span>
  )
}

export function Hero({ nameRef }: { nameRef?: React.RefObject<HTMLElement | null> }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 40])
  const fade = useTransform(scrollY, [0, 400], [1, 0.1])
  const setEchoPrismActive = useStore((s) => s.setEchoPrismActive)
  const [mythsClicks, setMythsClicks] = useState(0)

  const handleMythsClick = useCallback(() => {
    const next = mythsClicks + 1
    setMythsClicks(next)
    if (next >= 5) {
      setMythsClicks(0)
      setEchoPrismActive(true)
    }
  }, [mythsClicks, setEchoPrismActive])

  const progress = mythsClicks / 5

  return (
    <motion.section id="top" style={{ opacity: fade }}
      className="relative flex min-h-dvh items-center overflow-hidden px-5 pt-28"
    >
      <HolographicRing />

      <motion.div style={{ y }} className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-[1px] w-8 bg-gradient-to-r from-gold/50 to-transparent" />
            <span className="flex items-center gap-2">
              <span className="safety-beacon h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blueprint/40">BUILDING IN PUBLIC</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.9] tracking-[-0.03em] select-none"
          >
            <span
              ref={nameRef as React.RefObject<HTMLSpanElement | null>}
              onClick={handleMythsClick}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleMythsClick() } }}
              role="button"
              tabIndex={0}
              className="cursor-pointer transition-all duration-300 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-deep rounded-md"
            >
              {site.name.split('').map((letter, i) => (
                <span key={i} className="relative inline-block" style={{
                  textShadow: '0 2px 0 rgba(196,164,85,0.08), 0 4px 8px rgba(0,0,0,0.4)',
                }}>
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </span>
            {mythsClicks > 0 && mythsClicks < 5 && (
              <span className="block h-[2px] rounded-full bg-gradient-to-r from-gold/60 to-gold/10 transition-all duration-300"
                style={{ width: `${progress * 100}%`, maxWidth: '100%' }}
              />
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-lg text-concrete-light/50 font-mono"
          >
            <span className="text-blueprint/30">&gt;</span> {site.realName}
            <span className="ml-3 inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold-subtle px-3 py-0.5 text-[9px] font-mono text-gold/70">
              <Sparkles size={9} />
              BUILDING
            </span>
          </motion.p>

          <motion.div className="mt-6 max-w-2xl">
            <p className="text-[15px] leading-relaxed text-concrete-light/60 md:text-base">
              <TypeWriter text={site.phrases[2] || 'I am not finished. I am building.'} delay={1} speed={25} />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <a href="#projects" className="group focus-ring inline-flex items-center gap-3 rounded-full border border-gold/30 bg-gold-subtle px-7 py-3.5 text-sm font-medium text-gold transition-all duration-300 hover:bg-gold/10 hover:border-gold/40 active:scale-[0.97]">
              <ButtonInner>
                View blueprints
              </ButtonInner>
            </a>
            <a href="#about" className="group focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-concrete-light/70 transition-all duration-300 hover:bg-white/[0.06] hover:text-white/80 hover:border-white/20 active:scale-[0.97]">
              Site plan
            </a>
          </motion.div>

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
                  className="w-[2px] rounded-full bg-blueprint/20"
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-concrete-mid/25 tracking-[0.15em]">CONSTRUCTION IN PROGRESS</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}
