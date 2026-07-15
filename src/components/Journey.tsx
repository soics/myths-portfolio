import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { chapters, phaseData } from '../data/site'
import { Ruler } from 'lucide-react'
import { LiquidGlass } from './LiquidGlass'

const phaseIcons = ['⬡', '△', '□']

function PhaseCard({ chapter, index, inView: sectionInView, isLast }: {
  chapter: typeof chapters[number]; index: number; inView: boolean; isLast: boolean
}) {
  const phase = phaseData[index]
  const phaseLetter = phaseIcons[index] || '○'

  return (
    <LiquidGlass variant="panel" tilt={4} className="!rounded-[20px] !overflow-hidden">
      <motion.article
        initial={{ opacity: 0, x: -20 }}
        animate={sectionInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: index * 0.15, type: 'spring', stiffness: 70, damping: 20 }}
        className="group relative mb-6 last:mb-0"
      >
        <span className="absolute left-[-33px] top-8 md:left-[-45px]">
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
            className="absolute -inset-2 rounded-full bg-blueprint/15"
          />
          <motion.span
            initial={{ scale: 0 }}
            animate={sectionInView ? { scale: 1 } : {}}
            transition={{ delay: index * 0.12 + 0.1, type: 'spring', stiffness: 300 }}
            className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-blueprint/30 bg-deep md:h-4 md:w-4"
          >
            <span className="text-[6px] text-blueprint/50">{phaseLetter}</span>
          </motion.span>
        </span>

        <span className="pointer-events-none absolute right-4 top-2 select-none text-[5rem] font-black leading-[0.75] tracking-[-0.08em] text-white/[0.015] md:text-[8rem]" aria-hidden="true">
          {chapter.number}
        </span>

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1 min-w-0">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-[0.25em] text-blueprint/35">
                PHASE.{chapter.number} / {phase.phase.toUpperCase()}
              </span>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-white/90 md:text-2xl">{chapter.title}</h3>
              <p className="mt-2.5 max-w-xl text-[15px] leading-[1.8] text-concrete-light/60">{chapter.text}</p>
            </div>

            <div className="mt-3 md:mt-0 md:ml-4 flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1 shrink-0">
              <span className="rounded-md border border-blueprint/15 bg-blueprint/5 px-2.5 py-1 text-[11px] font-mono text-blueprint/50">
                {phase.pct}%
              </span>
              <span className="text-[8px] font-mono text-concrete-mid/25 tracking-[0.1em]">{phase.pctLabel}</span>
            </div>
          </div>

          <div className="mt-4 relative">
            <div className="h-[6px] rounded-full bg-white/[0.04] overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${phase.pct}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full relative"
                style={{
                  background: `repeating-linear-gradient(90deg, rgba(150,150,150,0.3) 0px, rgba(150,150,150,0.3) 8px, rgba(200,200,200,0.2) 8px, rgba(200,200,200,0.2) 16px)`,
                }}
              />
            </div>
            <div className="flex justify-between mt-1 px-0.5">
              {[0, 25, 50, 75, 100].map((m) => (
                <span key={m} className="text-[7px] font-mono text-concrete-mid/20">{m}</span>
              ))}
            </div>
          </div>

          {isLast && (
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-construction/15 bg-construction/5 px-2 py-0.5 text-[9px] font-mono text-construction/50">
              <span className="h-1 w-1 rounded-full bg-construction/40 safety-beacon" />
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
    <section ref={sectionRef} id="journey" className="px-5 py-24 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-6 bg-gold/30" />
            <Ruler size={14} className="text-concrete-light/50" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-concrete-light/40">PHASES</span>
          </div>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">The architectural plan.</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-concrete-light/60">Foundation → Framing → Finishing. Each phase is load-bearing.</p>
        </motion.div>

        <div className="relative pl-[44px] md:pl-16">
          <motion.div
            style={{ height: lineHeight, opacity: lineOpacity }}
            className="absolute left-[21px] top-0 w-[6px] md:left-[31px] rounded-full overflow-hidden"
          >
            <div className="absolute inset-0" style={{
              background: 'repeating-linear-gradient(180deg, rgba(150,150,150,0.25) 0px, rgba(150,150,150,0.25) 4px, rgba(200,200,200,0.15) 4px, rgba(200,200,200,0.15) 8px)',
            }} />
            <div className="absolute left-full top-0 bottom-0 w-4">
              <div className="h-full" style={{
                background: `repeating-linear-gradient(180deg, transparent 0px, transparent 7px, rgba(200,200,200,0.1) 7px, rgba(200,200,200,0.1) 8px)`,
              }} />
            </div>
          </motion.div>

          {chapters.map((chapter, i) => (
            <PhaseCard key={chapter.number} chapter={chapter} index={i} inView={inView} isLast={i === chapters.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
