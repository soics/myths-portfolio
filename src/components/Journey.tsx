import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { chapters } from '../data/site'

export function Journey() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

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
            className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/60"
          >
            Journey
          </motion.p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">A timeline for becoming.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">The path is intentionally simple: learn, build, connect the pieces, repeat.</p>
        </motion.div>

        <div className="relative grid gap-6 pl-10 md:pl-0">
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-[22px] top-12 w-px bg-gradient-to-b from-blue-300/30 via-blue-200/15 to-transparent md:left-[22px]"
          />

          {chapters.map((chapter, i) => (
            <motion.article
              key={chapter.number}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15, type: 'spring' as const, stiffness: 100, damping: 25 }}
              whileHover={{ x: 8 }}
              className="glass relative rounded-[2rem] p-6 transition-all hover:border-white/20 md:grid md:grid-cols-[140px_1fr] md:gap-5"
            >
              <span className="absolute left-[-22px] top-[22px] hidden md:block">
                <motion.span
                  animate={{ scale: [1, 1.6, 1], opacity: [0.15, 0.4, 0.15] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                  className="absolute -inset-2 rounded-full bg-blue-200/15"
                />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: i * 0.15 + 0.1, type: 'spring', stiffness: 300 }}
                  className="relative block h-4 w-4 rounded-full border-2 border-blue-200/40 bg-blue-200/15"
                />
              </span>

              <span className="block text-5xl font-black tracking-[-0.08em] text-white/15 md:pl-8">{chapter.number}</span>
              <div className="mt-3 md:mt-0">
                <h3 className="text-2xl font-semibold tracking-[-0.04em]">{chapter.title}</h3>
                <p className="mt-3 leading-relaxed text-white/55">{chapter.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
