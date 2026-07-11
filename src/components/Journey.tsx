import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { chapters } from '../data/site'
import { Map } from 'lucide-react'

const phaseData = [
  { phase: 'Foundation', pct: 100, pctLabel: 'SECURED' },
  { phase: 'Framing', pct: 65, pctLabel: 'IN PROGRESS' },
  { phase: 'Finishing', pct: 25, pctLabel: 'INITIALIZED' },
]

function PhaseCard({ chapter, index, inView: sectionInView, isLast }: {
  chapter: typeof chapters[number]; index: number; inView: boolean; isLast: boolean
}) {
  const phase = phaseData[index]

  return (
          <LiquidGlass variant="panel" tilt={4} className="!rounded-[18px] !overflow-hidden">
            <motion.article
              initial={{ opacity: 0, x: -20 }}
              animate={sectionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15, type: 'spring', stiffness: 70, damping: 20 }}
              className="group relative mb-6 last:mb-0"
            >
              {/* Timeline node */}
              <span className="absolute left-[-33px] top-8 md:left-[-45px]">
                <motion.span
                  animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
                  className="absolute -inset-2 rounded-full bg-cyan/15"
                />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={sectionInView ? { scale: 1 } : {}}
                  transition={{ delay: index * 0.12 + 0.1, type: 'spring', stiffness: 300 }}
                  className="relative block h-3.5 w-3.5 rounded-full border-2 border-cyan/30 bg-deep md:h-4 md:w-4"
                />
              </span>

              {/* Phase number watermark */}
              <span className="pointer-events-none absolute right-4 top-2 select-none text-[6rem] font-black leading-[0.75] tracking-[-0.08em] text-white/[0.015] md:text-[8rem]" aria-hidden="true">
                {chapter.number}
              </span>

              <div className="relative p-6 md:p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-[0.25em] text-cyan/35">
                      PHASE.{chapter.number} / {phase.phase.toUpperCase()}
                    </span>
                    <h3 className="text-xl font-semibold tracking-[-0.02em] text-white/90 md:text-2xl">{chapter.title}</h3>
                    <p className="mt-2.5 max-w-xl text-[15px] leading-[1.8] text-white/60">{chapter.text}</p>
                  </div>

                  <div className="ml-4 flex flex-col items-end gap-1 shrink-0">
                    <span className="rounded-md border border-cyan/15 bg-cyan/5 px-2.5 py-1 text-[11px] font-mono text-cyan/50">
                      {phase.pct}%
                    </span>
                    <span className="text-[8px] font-mono text-white/25 tracking-[0.1em]">{phase.pctLabel}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-[2px] rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${phase.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style{{
                      background: `linear-gradient(90deg, rgba(212,212,220,0.3), rgba(136,136,160,0.2))`,
                    }}
                  />
                </div>

                {isLast && (
                  <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-amber/15 bg-amber/5 px-2 py-0.5 text-[9px] font-mono text-amber/50">
                    <span className="h-1 w-1 rounded-full bg-amber/40 signal-pulse" />
                    IN PROGRESS
                  </motion.span>
                )}
              </div>
            </motion.article>
          </LiquidGlass>
  )
}

export function Blueprint() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const lineHeight = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%'])
  const lineOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])

  return (
    <section ref={sectionRef} id="journey" className="px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Map size={14} className="text-amber/50" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber/40">ROADMAP</span>
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">The path ahead.</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">Three phases. Each one builds on the last. The destination moves as I grow.</p>
        </motion.div>

        <div className="relative pl-[44px] md:pl-16">
          {/* Timeline signal line */}
          <motion.div
            style={{ height: lineHeight, opacity: lineOpacity }}
            className="absolute left-[21px] top-0 w-[2px] md:left-[31px]"
          >
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(180deg, rgba(212,212,220,0.2), rgba(136,136,160,0.15), rgba(160,144,128,0.1))',
            }} />
            <div className="absolute inset-x-0 top-0 h-full w-[1px] bg-cyan/10" />
          </motion.div>

          {chapters.map((chapter, i) => (
            <PhaseCard key={chapter.number} chapter={chapter} index={i} inView={inView} isLast={i === chapters.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
