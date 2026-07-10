import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { learningSkills, strengths } from '../data/site'

const tagAccents = [
  'hover:border-blue-300/30 hover:bg-blue-500/6 hover:text-blue-200',
  'hover:border-purple-300/30 hover:bg-purple-500/6 hover:text-purple-200',
  'hover:border-emerald-300/30 hover:bg-emerald-500/6 hover:text-emerald-200',
  'hover:border-amber-300/30 hover:bg-amber-500/6 hover:text-amber-200',
  'hover:border-rose-300/30 hover:bg-rose-500/6 hover:text-rose-200',
  'hover:border-cyan-300/30 hover:bg-cyan-500/6 hover:text-cyan-200',
  'hover:border-violet-300/30 hover:bg-violet-500/6 hover:text-violet-200',
  'hover:border-teal-300/30 hover:bg-teal-500/6 hover:text-teal-200',
  'hover:border-orange-300/30 hover:bg-orange-500/6 hover:text-orange-200',
]

function SkillTag({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.15,
      y: (e.clientY - rect.top - rect.height / 2) * 0.15,
    })
  }

  const handleLeave = () => setPos({ x: 0, y: 0 })

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={className}
    >
      {children}
    </motion.span>
  )
}

function SkillPanel({ title, items, inView, panelIndex }: { title: string; items: string[]; inView: boolean; panelIndex: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: panelIndex * 0.15, type: 'spring' as const, stiffness: 100, damping: 25 }}
      className="glass rounded-[2rem] p-7"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/8" />
        <h3 className="text-sm font-medium tracking-[0.2em] uppercase text-white/45">{title}</h3>
        <span className="h-px flex-1 bg-white/8" />
      </div>
      <div className="flex flex-wrap justify-center gap-2.5">
        {items.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: panelIndex * 0.15 + i * 0.04, type: 'spring' as const, stiffness: 100, damping: 25 }}
          >
            <SkillTag
              className={`rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-white/65 transition-all duration-300 ${tagAccents[i % tagAccents.length]}`}
            >
              {item}
            </SkillTag>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function Skills() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="skills" className="px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12 text-center"
        >
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/60"
          >
            Skills
          </motion.p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">Learning the stack without pretending mastery.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/55">No fake percentages. Just the tools I am actively learning and the personal strengths I am building around them.</p>
        </motion.div>
        <motion.div ref={ref} className="grid gap-6 lg:grid-cols-2">
          <SkillPanel title="Learning" items={learningSkills} inView={inView} panelIndex={0} />
          <SkillPanel title="Personal strengths" items={strengths} inView={inView} panelIndex={1} />
        </motion.div>
      </div>
    </section>
  )
}
