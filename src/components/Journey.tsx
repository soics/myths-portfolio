import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { chapters } from '../data/site'
import { useTilt } from '../hooks/useTilt'

function ChapterCard({ chapter, index, inView, isLast }: {
  chapter: typeof chapters[number]; index: number; inView: boolean; isLast: boolean
}) {
  const tiltRef = useTilt(6)
  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, type: 'spring', stiffness: 100, damping: 26 }}
      className="group relative mb-6 last:mb-0"
    >
      <span className="absolute left-[-33px] top-8 md:left-[-45px]">
        <motion.span
          animate={{ scale: [1, 1.6, 1], opacity: [0.08, 0.25, 0.08] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 }}
          className="absolute -inset-2 rounded-full bg-accent/15"
        />
        <motion.span
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.1, type: 'spring', stiffness: 300 }}
          className="relative block h-3.5 w-3.5 rounded-full border-2 border-accent/35 bg-black md:h-4 md:w-4"
        />
      </span>

      <div ref={tiltRef} className="glass-lift relative overflow-hidden rounded-[18px] transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]" style={{ transformStyle: 'preserve-3d' }}>
        <span className="pointer-events-none absolute right-4 top-2 select-none text-[6rem] font-black leading-[0.75] tracking-[-0.08em] text-white/[0.015] md:text-[8rem]" aria-hidden="true">
          {chapter.number}
        </span>
        <div className="relative p-6 md:p-8">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-dim/40">
            Chapter {chapter.number}
          </span>
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-white/95 md:text-2xl">{chapter.title}</h3>
          <p className="mt-2.5 max-w-xl text-[15px] leading-[1.8] text-white/50">{chapter.text}</p>
          {isLast && (
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1 }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-accent-dim/40">
              <span className="h-1 w-1 rounded-full bg-accent/40" />
              In progress
            </motion.span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export function Journey() {
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
            Journey
          </motion.p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">A timeline for becoming.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">The path is intentionally simple: learn, build, connect the pieces, repeat.</p>
        </motion.div>

        <div className="relative pl-[44px] md:pl-16">
          {/* Scroll-linked timeline line */}
          <motion.div
            style={{ height: lineHeight, opacity: lineOpacity }}
            className="absolute left-[21px] top-0 w-[1.5px] bg-gradient-to-b from-accent/25 via-accent/12 to-transparent shadow-[0_0_8px_rgba(160,196,255,0.06)] md:left-[31px]"
          />

          {chapters.map((chapter, i) => (
            <ChapterCard key={chapter.number} chapter={chapter} index={i} inView={inView} isLast={i === chapters.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
