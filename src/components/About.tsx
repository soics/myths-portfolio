import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowUpRight, Ruler, HardHat } from 'lucide-react'
import { site, bioParagraphs, metrics, logEntries } from '../data/site'
import { LiquidGlass } from './LiquidGlass'

function ProgressMeter() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  // Calculate pseudo-progress: weighted by learning breadth
  const pct = Math.min(62, Math.round(
    (bioParagraphs.length * 8) +
    (metrics.reduce((a, m) => a + Number.parseInt(m.value), 0) / 100)
  ))

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-blueprint/40 tracking-[0.15em]">
          PROGRESS TO FULL-STACK
        </span>
        <span className="text-[11px] font-mono text-construction/60">{pct}%</span>
      </div>
      <div className="progress-tube">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ delay: 0.4, duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="progress-tube-fill"
        />
      </div>
      <div className="flex justify-between text-[8px] font-mono text-concrete-mid/30">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

export function Manifesto() {
  const sectionRef = useRef(null)
  useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} id="about" className="px-5 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <Ruler size={14} className="text-blueprint/50" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blueprint/40">SITE.PLAN</span>
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
            The blueprint behind the build.
          </h2>
        </motion.div>

        <div className="grid gap-14 lg:grid-cols-[1.3fr_0.9fr]">
          {/* Narrative */}
          <div className="space-y-5">
            {bioParagraphs.map((para, pIdx) => (
              <motion.p
                key={pIdx}
                initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + pIdx * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-[15px] leading-[1.85] text-concrete-light/65"
              >
                {para}
              </motion.p>
            ))}

            <motion.a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="focus-ring mt-6 inline-flex items-center gap-2 text-sm text-blueprint/50 transition-colors hover:text-blueprint/70"
            >
              <ArrowUpRight size={14} />
              View site on GitHub
            </motion.a>
          </div>

          {/* Side panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {/* Progress meter */}
            <LiquidGlass variant="panel" tilt={4} className="!rounded-2xl !overflow-hidden">
              <div className="border-b border-white/[0.05] px-5 py-3.5 flex items-center gap-3">
                <HardHat size={13} className="text-construction/40" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Construction Progress</span>
              </div>
              <div className="p-5">
                <ProgressMeter />
              </div>
            </LiquidGlass>

            {/* Site notes (dev log) */}
            <LiquidGlass variant="panel" tilt={4} className="!rounded-2xl !p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-construction/40 safety-beacon" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Site Notes</span>
              </div>
              <div className="space-y-2.5">
                {logEntries.map((entry) => (
                  <div key={entry.date} className="flex gap-2.5 text-[11px]">
                    <span className="shrink-0 font-mono text-blueprint/30">{entry.date.slice(5)}</span>
                    <span className="text-concrete-light/45 leading-[1.5]">{entry.entry}</span>
                  </div>
                ))}
              </div>
            </LiquidGlass>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
