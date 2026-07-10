import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, GitBranch, ChevronDown } from 'lucide-react'
import { site } from '../data/site'

function MagneticAnchor({ children, className, ...props }: Omit<React.ComponentPropsWithoutRef<typeof motion.a>, 'ref'>) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.25,
      y: (e.clientY - rect.top - rect.height / 2) * 0.25,
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

function AnimatedCircles() {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="h-72 w-72 rounded-full border border-white/[0.06]"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="absolute h-56 w-56 rounded-full border border-white/[0.08]"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute h-40 w-40 rounded-full border border-white/[0.06]"
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute h-20 w-20 rounded-full bg-gradient-to-br from-blue-400/15 to-purple-400/15 blur-lg"
      />
    </div>
  )
}

function ScrollIndicator() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2">
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.35em] text-white/20">Scroll</span>
        <ChevronDown size={12} className="text-white/20" />
      </motion.div>
    </motion.div>
  )
}

export function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 120])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])

  return (
    <motion.section id="top" style={{ opacity }} className="relative flex min-h-dvh items-center overflow-hidden px-5 pt-28">
      <motion.div style={{ y }} className="mx-auto grid w-full max-w-6xl items-center gap-12 py-20 lg:grid-cols-[1.3fr_1fr] lg:py-28">
        <div className="relative">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
            className="mb-6 text-xs uppercase tracking-[0.4em] text-white/35"
          >
            {site.realName}
          </motion.p>

          <h1 className="overflow-hidden">
            <span className="flex flex-wrap">
              {site.name.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 60, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 + i * 0.06 }}
                  className="inline-block text-[clamp(4rem,15vw,8rem)] font-black tracking-[-0.12em] text-white"
                  style={{ transformStyle: 'preserve-3d', perspective: 600 }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.6 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl"
          >
            {site.title}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.75 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <MagneticAnchor
              className="focus-ring group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_40px_rgba(255,255,255,0.12)]"
              href="#journey"
            >
              View the journey
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </MagneticAnchor>
            <MagneticAnchor
              className="focus-ring glass inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold text-white/80 transition-all hover:text-white"
              href={site.github}
              target="_blank"
              rel="noreferrer"
            >
              <GitBranch size={16} />
              GitHub
            </MagneticAnchor>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10 text-sm leading-relaxed text-white/35 max-w-md"
          >
            {site.phrases[2]}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
          className="hidden justify-center lg:flex"
        >
          <AnimatedCircles />
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </motion.section>
  )
}
