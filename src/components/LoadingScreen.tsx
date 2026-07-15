import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface LoadingScreenProps {
  onFinish: () => void
}

const LOADING_PHASES = [
  { label: 'Initializing build environment', duration: 400 },
  { label: 'Loading blueprints', duration: 500 },
  { label: 'Erecting scaffolding', duration: 600 },
  { label: 'Calibrating instruments', duration: 400 },
  { label: 'Site ready', duration: 300 },
]

function SiteProgress({ progress }: { progress: number }) {
  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[280px]">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-1.5 w-1.5 rounded-full bg-gold safety-beacon" />
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-gold/60">
          SITE PROGRESS
        </span>
      </div>
      <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden border border-white/[0.04]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'repeating-linear-gradient(90deg, rgba(196,164,85,0.5) 0px, rgba(196,164,85,0.5) 8px, rgba(196,164,85,0.2) 8px, rgba(196,164,85,0.2) 16px)',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[7px] font-mono text-white/15">0%</span>
        <span className="text-[7px] font-mono text-white/15">100%</span>
      </div>
    </div>
  )
}

export function LoadingScreen({ onFinish }: LoadingScreenProps) {
  const [phase, setPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const [show, setShow] = useState(true)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  useEffect(() => {
    let cancelled = false
    const totalDuration = LOADING_PHASES.reduce((a, p) => a + p.duration, 0)

    const run = async () => {
      let elapsed = 0
      for (let i = 0; i < LOADING_PHASES.length; i++) {
        if (cancelled) return
        setPhase(i)
        const phaseDuration = LOADING_PHASES[i].duration
        const phaseStart = elapsed
        const startTime = performance.now()

        await new Promise<void>(resolve => {
          const tick = () => {
            const now = performance.now()
            const pct = Math.min((now - startTime) / phaseDuration, 1)
            elapsed = phaseStart + pct * phaseDuration
            setProgress((elapsed / totalDuration) * 100)
            if (pct >= 1) resolve()
            else if (!cancelled) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      }

      if (!cancelled) {
        await new Promise(r => setTimeout(r, 400))
        if (!cancelled) {
          setShow(false)
          setTimeout(() => onFinishRef.current(), 600)
        }
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep"
          aria-label="Loading"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* Blueprint grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Scaffolding corner decorations */}
          <div className="absolute top-8 left-8 w-24 h-24 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-0 w-16 h-px bg-gradient-to-r from-gold/30 to-transparent" />
            <div className="absolute top-0 left-0 h-16 w-px bg-gradient-to-b from-gold/30 to-transparent" />
            <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-gold/20 shadow-[0_0_12px_rgba(196,164,85,0.2)]" />
            <div className="absolute top-8 left-0 w-8 h-px bg-white/5" style={{ transform: 'rotate(45deg)', transformOrigin: 'left center' }} />
          </div>
          <div className="absolute top-8 right-8 w-24 h-24 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-16 h-px bg-gradient-to-l from-gold/30 to-transparent" />
            <div className="absolute top-0 right-0 h-16 w-px bg-gradient-to-b from-gold/30 to-transparent" />
            <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-gold/20 shadow-[0_0_12px_rgba(196,164,85,0.2)]" />
          </div>

          {/* Building crane animation */}
          <div className="absolute left-[15%] top-0 w-px h-[60vh] pointer-events-none" aria-hidden="true">
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'linear-gradient(90deg, transparent, rgba(196,164,85,0.15), transparent)' }}
            />
            <motion.div
              className="absolute w-1 h-1 rounded-full bg-gold/30"
              animate={{ y: ['0%', '100%', '0%'], opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ left: 48, top: '20%' }}
            />
          </div>

          {/* Central content */}
          <div className="relative z-10 text-center px-6">
            {/* Animated logo marks */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {[0, 1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    opacity: [0, 1, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.12,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="w-1 h-1 rounded-full"
                  style={{
                    background: i === 2 ? 'rgba(196,164,85,0.6)' : 'rgba(255,255,255,0.15)',
                    boxShadow: i === 2 ? '0 0 12px rgba(196,164,85,0.3)' : 'none',
                  }}
                />
              ))}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl font-black tracking-[-0.03em] text-white md:text-5xl"
            >
              myths
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
              className="mt-4 text-xs font-mono text-concrete-light/40 tracking-[0.15em]"
            >
              {LOADING_PHASES[phase]?.label || 'Initializing'}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block ml-0.5"
              >
                _
              </motion.span>
            </motion.p>

            {/* Phase dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center justify-center gap-2 mt-6"
            >
              {LOADING_PHASES.map((_p, i) => (
                <motion.div
                  key={i}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: i === phase ? 16 : 6,
                    background: i <= phase
                      ? 'rgba(196,164,85,0.5)'
                      : 'rgba(255,255,255,0.06)',
                    boxShadow: i <= phase ? '0 0 8px rgba(196,164,85,0.15)' : 'none',
                  }}
                />
              ))}
            </motion.div>
          </div>

          <SiteProgress progress={progress} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
