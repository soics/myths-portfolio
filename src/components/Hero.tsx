import { useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, HardHat } from 'lucide-react'
import { site } from '../data/site'
import { LiquidGlass } from './LiquidGlass'
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
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-[2px] h-[1em] bg-blueprint/60 ml-0.5 align-middle"
        />
      )}
    </span>
  )
}

function ConstructionLights() {
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="light-sweep absolute left-[-10%] top-[-20px] h-[200px] w-[40%] bg-gradient-to-r from-transparent via-construction/5 to-transparent skew-y-12" />
    </div>
  )
}

function ConcreteName({ children, onClick, mythsClicks, progress }: {
  children: string
  onClick: () => void
  mythsClicks: number
  progress: number
}) {
  const letters = children.split('')
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring relative cursor-pointer transition-all duration-300 hover:opacity-80"
      aria-label="Click myths name (easter egg)"
    >
      <span className="relative inline-flex flex-wrap">
        {letters.map((letter, i) => (
          <span key={i} className="relative inline-block">
            <span
              className="relative inline-block"
              style={{
                textShadow: `
                  0 1px 0 rgba(200,200,200,0.15),
                  0 2px 0 rgba(200,200,200,0.10),
                  0 3px 0 rgba(200,200,200,0.05),
                  0 4px 8px rgba(0,0,0,0.5)
                `,
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
            {/* Measurement line */}
            <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-blueprint/20" />
            <span className="absolute -bottom-[5px] left-1/2 h-[5px] w-px bg-blueprint/15" />
          </span>
        ))}
      </span>
      {mythsClicks > 0 && mythsClicks < 5 && (
        <span
          className="absolute -bottom-3 left-0 h-[2px] rounded-full bg-construction/40 transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      )}
    </button>
  )
}

export function Hero() {
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
      <ConstructionLights />

      <motion.div style={{ y }} className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-[1px] w-8 bg-blueprint/30" />
            <span className="flex items-center gap-2">
              <span className="safety-beacon h-2 w-2 rounded-full bg-construction" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blueprint/50">
                SITE.BLUEPRINT
              </span>
            </span>
            <span className="h-[1px] w-8 bg-blueprint/30" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3rem,12vw,8rem)] font-black leading-[0.88] tracking-[-0.04em] select-none"
          >
            <ConcreteName onClick={handleMythsClick} mythsClicks={mythsClicks} progress={progress}>
              {site.name}
            </ConcreteName>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-lg text-concrete-light/50 font-mono"
          >
            <span className="text-blueprint/40">&gt;</span> {site.realName}
            <span className="ml-3 inline-flex items-center gap-1 rounded border border-construction/20 bg-construction/5 px-1.5 py-0.5 text-[9px] font-mono text-construction/60">
              <span className="safety-beacon h-1.5 w-1.5 rounded-full bg-construction" />
              LIVE
            </span>
          </motion.p>

          <motion.div className="mt-8 max-w-2xl">
            <p className="text-[15px] leading-relaxed text-concrete-light/60 md:text-base">
              <TypeWriter text={site.phrases[2] || 'Building the future, one line at a time.'} delay={1} speed={25} />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <LiquidGlass variant="button" tilt={6} className="!rounded-full !px-7 !py-3.5 !text-sm !font-semibold !text-deep !border-0 relative overflow-hidden">
              <div className="absolute inset-0 hazard-stripe opacity-80" />
              <a href="#projects"
                className="focus-ring group relative inline-flex items-center gap-3 transition-all hover:shadow-[0_0_32px_rgba(150,150,150,0.15)] active:scale-[0.97]"
              >
                <HardHat size={15} />
                <span>View blueprints</span>
                <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </a>
            </LiquidGlass>
            <LiquidGlass variant="button" tilt={6} className="!rounded-full !border !border-concrete-dark !bg-transparent !px-7 !py-3.5 !text-sm !font-medium !text-concrete-light/60">
              <a href="#about"
                className="focus-ring group inline-flex items-center gap-2 transition-all hover:border-concrete-mid hover:text-concrete-light/80 active:scale-[0.97]"
              >
                <HardHat size={14} className="text-construction/50" />
                <span>Site plan</span>
              </a>
            </LiquidGlass>
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
                  className="w-[2px] rounded-full bg-blueprint/30"
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-concrete-mid/30 tracking-[0.15em]">CONSTRUCTION IN PROGRESS</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}
