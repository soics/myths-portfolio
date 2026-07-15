import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { Ruler, Wrench } from 'lucide-react'
import { strengths, skillTiers } from '../data/site'
import { LiquidGlass } from './LiquidGlass'

const materialLabels = ['Concrete', 'Rebar', 'Glass', 'Steel', 'Copper', 'Timber', 'Cable', 'Bolt']

function ScaffoldBar({ tier, index, inView }: {
  tier: typeof skillTiers[number]
  index: number
  inView: boolean
}) {
  const heights = [75, 55, 35]
  const height = heights[index] ?? 50
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="flex items-center gap-3 mb-1.5">
        <span className="text-[10px] font-mono text-blueprint/30 w-5 text-right">{index + 1}</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-concrete-light/50">{tier.label}</span>
      </div>
      <div
        className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${height + 10}%` } : {}}
          transition={{ delay: 0.3 + index * 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute left-0 top-0 bottom-0 rounded-xl ${tier.barColor.replace('bg-', 'bg-').replace('/40', '/20')}`}
        />
        <div className="relative flex items-center h-full px-3 gap-2 overflow-x-auto scrollbar-none">
          {tier.skills.map((skill, sIdx) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.1 + sIdx * 0.08, duration: 0.3 }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-white/70 transition-all hover:border-blueprint/20 hover:bg-blueprint/10 active:scale-[0.95]"
            >
              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: tier.barColor.replace('bg-', '').replace('/40', '') }} />
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function Tools() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section ref={sectionRef} id="skills" className="px-5 py-24 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 md:mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-6 bg-gold/30" />
            <Wrench size={14} className="text-construction/50" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-construction/40">MATERIALS</span>
          </div>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
            Tools I&rsquo;m working with.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-concrete-light/60">
            Each skill is a plank on the scaffold.
          </p>
        </motion.div>

        <div className="grid gap-8 md:gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 md:space-y-6">
            {skillTiers.map((tier, tIdx) => (
              <ScaffoldBar key={tier.label} tier={tier} index={tIdx} inView={inView} />
            ))}
          </div>

          <LiquidGlass variant="panel" tilt={4} className="!rounded-[20px] !overflow-hidden">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="border-b border-white/[0.05] px-5 py-3.5 flex items-center gap-2">
                <Ruler size={13} className="text-construction/40" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Strengths</span>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {strengths.map((s, i) => {
                    const mat = materialLabels[i % materialLabels.length]
                    const hues = [
                      'border-blueprint/20 bg-blueprint/5 text-blueprint',
                      'border-construction/20 bg-construction/5 text-construction',
                      'border-hazard/20 bg-hazard/5 text-hazard',
                      'border-concrete-light/20 bg-concrete-dark/30 text-concrete-light',
                    ]
                    const color = hues[i % hues.length]
                    return (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: i * 0.04, type: 'spring', stiffness: 200, damping: 18 }}
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all hover:scale-105 active:scale-[0.95] ${color}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-sm opacity-60" style={{ backgroundColor: 'currentColor' }} />
                        <span className="text-[8px] uppercase tracking-[0.1em] opacity-40">{mat}</span>
                        <span className="opacity-80">{s}</span>
                      </motion.span>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </LiquidGlass>
        </div>
      </div>
    </section>
  )
}
