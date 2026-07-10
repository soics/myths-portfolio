import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react'
import { ArrowRight, GitBranch, ChevronDown } from 'lucide-react'
import { site } from '../data/site'

function useTypewriter(text: string, speed = 45, delay = 800) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [started, text, speed])

  return displayed
}

function MagneticAnchor({ children, className, ...props }: Omit<React.ComponentPropsWithoutRef<typeof motion.a>, 'ref'>) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.3,
      y: (e.clientY - rect.top - rect.height / 2) * 0.3,
    })
  }

  const handleLeave = () => setPos({ x: 0, y: 0 })

  return (
    <motion.a
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 18, mass: 0.5 }}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  )
}

function FloatingShapes() {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 })

  const handleMouse = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX / window.innerWidth)
    mouseY.set(e.clientY / window.innerHeight)
  }, [mouseX, mouseY])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [handleMouse])

  const { scrollY } = useScroll()
  const scrollOffset = useTransform(scrollY, [0, 600], [0, -120])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        style={{
          x: useTransform(springX, [0, 1], [-40, 40]),
          y: useTransform(springY, [0, 1], [-30, 30]),
        }}
        className="absolute -right-16 top-10 h-[28rem] w-[28rem] rounded-[3rem] border border-white/[0.04]"
      />
      <motion.div
        style={{
          x: useTransform(springX, [0, 1], [30, -30]),
          y: useTransform(springY, [0, 1], [20, -20]),
        }}
        className="absolute -right-8 top-24 h-[24rem] w-[24rem] rounded-full border border-white/[0.03]"
      />
      <motion.div
        style={{ y: scrollOffset }}
        className="absolute right-[15%] top-[20%]"
      >
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-2xl"
        />
      </motion.div>
      <motion.div
        style={{
          x: useTransform(springX, [0, 1], [-20, 20]),
          y: useTransform(springY, [0, 1], [10, -10]),
        }}
        className="absolute right-[30%] top-[55%]"
      >
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="h-3 w-3 rounded-full bg-blue-300/20"
        />
      </motion.div>
    </div>
  )
}

function ScrollIndicator() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2">
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.35em] text-white/15">Scroll</span>
        <ChevronDown size={12} className="text-white/15" />
      </motion.div>
    </motion.div>
  )
}

export function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 80])
  const fade = useTransform(scrollY, [0, 500], [1, 0])
  const title = useTypewriter(site.title, 40, 1200)

  return (
    <motion.section style={{ opacity: fade }} id="top" className="relative flex min-h-dvh items-center overflow-hidden px-5 pt-28">
      <FloatingShapes />

      <motion.div style={{ y }} className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          className="mb-6 text-xs uppercase tracking-[0.4em] text-white/30"
        >
          {site.realName}
        </motion.p>

        <div className="relative">
          <h1 className="flex flex-wrap overflow-hidden">
            {site.name.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 80, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 + i * 0.07 }}
                className="inline-block text-[clamp(5rem,18vw,10rem)] font-black leading-[0.85] tracking-[-0.08em] text-white"
                style={{ transformStyle: 'preserve-3d', perspective: 800 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            aria-hidden="true"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)',
              backgroundSize: '100% 4px',
            }}
          />
        </div>

        <div className="mt-8 flex items-start gap-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-2 h-5 w-[3px] shrink-0 rounded-full bg-blue-300/50"
          />
          <div>
            <motion.p className="text-lg leading-relaxed text-white/55 md:text-xl">
              {title}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                className="ml-0.5 inline-block h-[1em] w-[2px] bg-blue-300/60 align-middle"
              />
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="mt-2 text-sm text-white/30"
            >
              {site.phrases[2]}
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.8 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticAnchor
            className="focus-ring group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_50px_rgba(255,255,255,0.12)]"
            href="#projects"
          >
            See the work
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </MagneticAnchor>
          <MagneticAnchor
            className="focus-ring glass inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold text-white/75 transition-all hover:text-white"
            href={site.github}
            target="_blank"
            rel="noreferrer"
          >
            <GitBranch size={16} />
            Source
          </MagneticAnchor>
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </motion.section>
  )
}
