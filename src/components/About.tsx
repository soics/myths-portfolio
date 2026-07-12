import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowUpRight, Signal, Cpu } from 'lucide-react'
import { site, bioParagraphs, metrics, logEntries } from '../data/site'
import { LiquidGlass } from './LiquidGlass'

export function Manifesto() {
  const sectionRef = useRef(null)
  useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} id="about" className="px-5 py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <Signal size={14} className="text-cyan/50" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan/40">ORIGIN.SIGNAL</span>
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
            This is the story behind the code.
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
                className="text-[15px] leading-[1.85] text-white/65"
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
              className="focus-ring mt-6 inline-flex items-center gap-2 text-sm text-cyan/50 transition-colors hover:text-cyan/70"
            >
              <ArrowUpRight size={14} />
              View GitHub signal
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
            {/* Metrics dashboard */}
            <LiquidGlass variant="panel" tilt={4} className="!rounded-2xl !overflow-hidden">
              <div className="border-b border-white/[0.05] px-5 py-3.5 flex items-center gap-3">
                <Cpu size={13} className="text-cyan/40" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">System Metrics</span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-white/[0.05]">
                {metrics.map((m) => (
                  <div key={m.label} className="px-4 py-5 text-center">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
                      className="block text-2xl font-bold tracking-tight text-cyan"
                    >
                      {m.value}
                    </motion.span>
                    <span className="mt-1 block text-[10px] text-white/35 uppercase tracking-[0.1em]">{m.label}</span>
                    <span className="block text-[9px] text-white/20 mt-0.5">{m.sub}</span>
                  </div>
                ))}
              </div>
            </LiquidGlass>

            {/* Dev log */}
            <LiquidGlass variant="panel" tilt={4} className="!rounded-2xl !p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan/40 signal-pulse" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Dev Log</span>
              </div>
              <div className="space-y-2.5">
                {logEntries.map((entry) => (
                  <div key={entry.date} className="flex gap-2.5 text-[11px]">
                    <span className="shrink-0 font-mono text-cyan/30">{entry.date.slice(5)}</span>
                    <span className="text-white/45 leading-[1.5]">{entry.entry}</span>
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
