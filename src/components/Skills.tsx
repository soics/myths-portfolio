import { motion, useInView } from 'motion/react'
import { learningSkills, strengths } from '../data/site'
import { useTilt } from '../hooks/useTilt'

/* ------------------------------------------------------------------ */
/*  Accent palette                                                     */
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
/*  Panel 1 — Learning (numbered terminal-style list)                  */
/* ------------------------------------------------------------------ */
function LearningPanel() {
  const ref = useTilt(5)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -60, skewY: 2 }}
      animate={inView ? { opacity: 1, x: 0, skewY: 0 } : {}}
      transition={{ type: 'spring', stiffness: 60, damping: 22 }}
      className="glass-lift relative overflow-hidden rounded-2xl"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="border-b border-white/[0.05] px-5 py-3.5">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Learning</span>
      </div>
      <div className="p-5">
        <div className="space-y-0.5 font-mono text-sm">
          {learningSkills.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white/90"
            >
              <span className="w-5 text-right text-[11px] text-white/25">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-accent/30">&gt;</span>
              <span>{s}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Panel 2 — Strengths (tag cloud / mosaic)                          */
/* ------------------------------------------------------------------ */
function StrengthsPanel() {
  const ref = useTilt(5)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 60, skewY: -2 }}
      animate={inView ? { opacity: 1, x: 0, skewY: 0 } : {}}
      transition={{ type: 'spring', stiffness: 60, damping: 22, delay: 0.1 }}
      className="glass-lift relative overflow-hidden rounded-2xl"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="border-b border-white/[0.05] px-5 py-3.5">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Strengths</span>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {strengths.map((s, i) => {
            const a = accents[i % accents.length]
            return (
              <motion.span
                key={s}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 ${a.dot.replace('/70', '/15')}`}
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <span className={`h-1 w-1 rounded-full ${a.dot}`} />
                {s}
              </motion.span>
            )
          })}
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
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">Tools I am learning. Traits I am building.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            No fake percentages. No &ldquo;expert&rdquo; labels after two tutorials. Just the tools I am actively learning and the personal strengths I am developing alongside them.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <LearningPanel />
          <StrengthsPanel />
        </div>
      </div>
    </section>
  )
}
