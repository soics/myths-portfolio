import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { learningSkills, strengths } from '../data/site'

const accentColors = [
  { dot: 'bg-blue-400/60', glow: 'shadow-blue-400/20' },
  { dot: 'bg-purple-400/60', glow: 'shadow-purple-400/20' },
  { dot: 'bg-emerald-400/60', glow: 'shadow-emerald-400/20' },
  { dot: 'bg-amber-400/60', glow: 'shadow-amber-400/20' },
  { dot: 'bg-rose-400/60', glow: 'shadow-rose-400/20' },
  { dot: 'bg-cyan-400/60', glow: 'shadow-cyan-400/20' },
  { dot: 'bg-violet-400/60', glow: 'shadow-violet-400/20' },
  { dot: 'bg-teal-400/60', glow: 'shadow-teal-400/20' },
  { dot: 'bg-orange-400/60', glow: 'shadow-orange-400/20' },
]

function TerminalHeader({ title, panelIndex }: { title: string; panelIndex: number }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: panelIndex * 0.3 }}
        className="h-2.5 w-2.5 rounded-full bg-red-400/50"
      />
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 + panelIndex * 0.3 }}
        className="h-2.5 w-2.5 rounded-full bg-yellow-400/50"
      />
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 + panelIndex * 0.3 }}
        className="h-2.5 w-2.5 rounded-full bg-green-400/50"
      />
      <span className="ml-3 text-xs uppercase tracking-[0.25em] text-white/30">{title}</span>
    </div>
  )
}

function SkillDot({ index }: { index: number }) {
  const color = accentColors[index % accentColors.length]
  return (
    <motion.span
      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.15 }}
      className={`inline-block h-1.5 w-1.5 rounded-full ${color.dot}`}
    />
  )
}

export function Skills() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

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
            className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/60"
          >
            Skills
          </motion.p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">Learning the stack without pretending mastery.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/55">No fake percentages. Just the tools I am actively learning and the personal strengths I am building around them.</p>
        </motion.div>

        <motion.div ref={sectionRef} className="grid gap-6 lg:grid-cols-2">
          {[
            { title: 'Learning', items: learningSkills },
            { title: 'Personal strengths', items: strengths },
          ].map((panel, panelIndex) => (
            <motion.div
              key={panel.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: panelIndex * 0.15, type: 'spring' as const, stiffness: 100, damping: 25 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <TerminalHeader title={panel.title} panelIndex={panelIndex} />
              <div className="grid grid-cols-2 gap-px bg-white/[0.02] p-4">
                {panel.items.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: panelIndex * 0.15 + i * 0.04, type: 'spring' as const, stiffness: 200, damping: 25 }}
                    className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-white/[0.04]"
                  >
                    <SkillDot index={i} />
                    <span className="text-sm text-white/65 transition-colors duration-300 group-hover:text-white/90">{item}</span>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="absolute inset-x-3 -bottom-px h-px origin-left bg-gradient-to-r from-white/10 to-transparent"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
