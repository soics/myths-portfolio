import { motion, useInView } from 'motion/react'
import { learningSkills, strengths } from '../data/site'
import { useTilt } from '../hooks/useTilt'

/* ------------------------------------------------------------------ */
/*  Accent colours (rotating palette for skill dots)                  */
/* ------------------------------------------------------------------ */
const accents = [
  { dot: 'bg-blue-400/70', bar: 'bg-blue-400/20' },
  { dot: 'bg-purple-400/70', bar: 'bg-purple-400/20' },
  { dot: 'bg-emerald-400/70', bar: 'bg-emerald-400/20' },
  { dot: 'bg-amber-400/70', bar: 'bg-amber-400/20' },
  { dot: 'bg-rose-400/70', bar: 'bg-rose-400/20' },
  { dot: 'bg-cyan-400/70', bar: 'bg-cyan-400/20' },
  { dot: 'bg-violet-400/70', bar: 'bg-violet-400/20' },
  { dot: 'bg-teal-400/70', bar: 'bg-teal-400/20' },
  { dot: 'bg-orange-400/70', bar: 'bg-orange-400/20' },
]

/* ------------------------------------------------------------------ */
/*  SkillNode — animated pill with breathing accent dot               */
/* ------------------------------------------------------------------ */
function SkillNode({ item, index, stagger }: { item: string; index: number; stagger: number }) {
  const a = accents[index % accents.length]
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: stagger + index * 0.035, type: 'spring', stiffness: 180, damping: 24 }}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-white/[0.04]"
    >
      <motion.span
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.12 }}
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${a.dot}`}
      />
      <span className="text-sm text-white/60 transition-colors duration-300 group-hover:text-white/85">{item}</span>
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`absolute inset-x-3 -bottom-px h-px origin-left ${a.bar}`}
      />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  SkillPanel — category card with header + staggered nodes          */
/* ------------------------------------------------------------------ */
function SkillPanel({ title, items, panelIndex }: { title: string; items: string[]; panelIndex: number }) {
  const tiltRef = useTilt(6)
  const inView = useInView(tiltRef, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={tiltRef}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: panelIndex * 0.12, type: 'spring', stiffness: 100, damping: 26 }}
      className="glass-lift group relative overflow-hidden rounded-2xl"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-3.5">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">{title}</span>
        <span className="text-[10px] text-white/15">{items.length} items</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-px">
          {items.map((item, i) => (
            <SkillNode key={item} item={item} index={i} stagger={panelIndex * 0.12} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                       */
/* ------------------------------------------------------------------ */

export function Skills() {
  return (
    <section id="skills" className="px-5 py-28">
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
            className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent-dim/60"
          >
            Skills
          </motion.p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">Tools I am learning. Traits I am building.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/55">
            No fake percentages. No &ldquo;expert&rdquo; labels after two tutorials. Just the tools I am actively learning and the personal strengths I am developing alongside them.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SkillPanel title="Learning" items={learningSkills} panelIndex={0} />
          <SkillPanel title="Strengths" items={strengths} panelIndex={1} />
        </div>
      </div>
    </section>
  )
}
