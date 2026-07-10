import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { BookOpen, Compass, Lightbulb, MessageCircle, Puzzle, Search, Target, Users } from 'lucide-react'
import { strengths } from '../data/site'

const strengthIcon: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  Communication: MessageCircle,
  Teamwork: Users,
  Adaptability: Compass,
  'Creative thinking': Lightbulb,
  'Learning ability': BookOpen,
  'Problem solving': Puzzle,
  Curiosity: Search,
  Persistence: Target,
}

function TiltCard({ children, className, ...props }: Omit<React.ComponentPropsWithoutRef<typeof motion.div>, 'ref'>) {
  const ref = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setRotate({
      x: -((e.clientY - rect.top - rect.height / 2) / rect.height) * 8,
      y: ((e.clientX - rect.left - rect.width / 2) / rect.width) * 8,
    })
  }

  const handleLeave = () => setRotate({ x: 0, y: 0 })

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" className="px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12"
        >
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/60"
          >
            About
          </motion.p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">A beginner, but not casual.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">I am learning full-stack development and scripting with a focus on steady growth, practical projects, and becoming useful enough to build real things.</p>
        </motion.div>
        <motion.div ref={ref} className="group/grid grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {strengths.slice(0, 8).map((strength, i) => {
            const Icon = strengthIcon[strength]
            return (
              <TiltCard
                key={strength}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, type: 'spring' as const, stiffness: 100, damping: 25 }}
                className="glass rounded-3xl p-5 text-white/70 transition-all duration-300 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] [&:not(:hover)]:group-hover/grid:opacity-60"
              >
                <Icon className="mb-5 text-blue-200/60" size={18} style={{ transform: 'translateZ(24px)' }} />
                <span style={{ transform: 'translateZ(16px)' }} className="block text-sm leading-relaxed">{strength}</span>
              </TiltCard>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
