import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { Cpu, Zap, Code2 } from 'lucide-react'
import { strengths } from '../data/site'

const skillTiers = [
  { label: 'Building', skills: ['HTML', 'CSS', 'JavaScript'], color: 'from-cyan/20 to-cyan/5', barColor: 'bg-cyan/40' },
  { label: 'Growing', skills: ['TypeScript', 'React', 'Node.js'], color: 'from-violet/20 to-violet/5', barColor: 'bg-violet/40' },
  { label: 'Exploring', skills: ['Git', 'GitHub', 'Supabase'], color: 'from-amber/20 to-amber/5', barColor: 'bg-amber/40' },
]

const strengthColors = [
  { name: 'Core', color: 'border-cyan/20 bg-cyan/5 text-cyan' },
  { name: 'Logic', color: 'border-violet/20 bg-violet/5 text-violet' },
  { name: 'Flow', color: 'border-amber/20 bg-amber/5 text-amber' },
  { name: 'Force', color: 'border-white/10 bg-white/5 text-white/70' },
]

export function Tools() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section ref={sectionRef} id="skills" className="px-5 py-28">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <Cpu size={14} className="text-violet/50" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-violet/40">CAPABILITY.MATRIX</span>
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
            Tools I work with. Traits I build with.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">
            No fake percentages. No &ldquo;expert&rdquo; labels after two tutorials. Just what I know and who I am.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Skill tiers */}
          <div className="space-y-4">
            {skillTiers.map((tier, tIdx) => (
              <motion.div
                key={tier.label}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: tIdx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`glass-lift rounded-2xl overflow-hidden bg-gradient-to-r ${tier.color}`}
              >
                <div className="px-5 py-3 border-b border-white/[0.05]">
                  <span className="text-xs font-mono text-white/50">
                    <span className="text-cyan/40">&gt;</span> {tier.label}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {tier.skills.map((skill, sIdx) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: tIdx * 0.1 + sIdx * 0.05, type: 'spring', stiffness: 200, damping: 18 }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/10"
                      >
                        <Code2 size={11} className="opacity-40" />
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Strengths */}
          <LiquidGlass variant="panel" tilt={4} className="!rounded-2xl !overflow-hidden">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="border-b border-white/[0.05] px-5 py-3.5 flex items-center gap-2">
                <Zap size={13} className="text-amber/40" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Traits</span>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {strengths.map((s, i) => {
                    const sc = strengthColors[i % strengthColors.length]
                    return (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: i * 0.04, type: 'spring', stiffness: 200, damping: 18 }}
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all hover:scale-105 ${sc.color}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-sm opacity-60" style={{ backgroundColor: 'currentColor' }} />
                        <span className="text-[8px] uppercase tracking-[0.1em] opacity-40">{sc.name}</span>
                        <span className="opacity-80">{s}</span>
                      </motion.span>
                    )
                  })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
