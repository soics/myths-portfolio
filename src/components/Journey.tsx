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
  const lineHeight = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%'])

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
            className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/60"
          >
            Journey
          </motion.p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">A timeline for becoming.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">The path is intentionally simple: learn, build, connect the pieces, repeat.</p>
        </motion.div>

        <div className="relative pl-[44px] md:pl-16">
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-[21px] top-0 w-[1px] bg-gradient-to-b from-blue-300/25 via-blue-200/15 to-transparent md:left-[31px]"
          />

          {chapters.map((chapter, i) => (
            <motion.article
              key={chapter.number}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15, type: 'spring' as const, stiffness: 100, damping: 25 }}
              className="group relative mb-6 last:mb-0"
            >
              <span className="absolute left-[-33px] top-8 md:left-[-45px]">
                <motion.span
                  animate={{ scale: [1, 1.8, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                  className="absolute -inset-2 rounded-full bg-blue-200/15"
                />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: i * 0.15 + 0.1, type: 'spring' as const, stiffness: 300 }}
                  className="relative block h-3.5 w-3.5 rounded-full border-2 border-blue-200/40 bg-black md:h-4 md:w-4"
                />
              </span>

              <div className="glass relative overflow-hidden rounded-[20px] transition-all duration-300 hover:border-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <span className="absolute right-4 top-2 select-none text-[6rem] font-black leading-[0.8] tracking-[-0.08em] text-white/[0.02] md:text-[8rem]">
                  {chapter.number}
                </span>
                <div className="relative p-6 md:p-8">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/40">
                    Chapter {chapter.number}
                  </span>
                  <h3 className="text-xl font-semibold tracking-[-0.04em] text-white/95 md:text-2xl">{chapter.title}</h3>
                  <p className="mt-3 max-w-xl leading-[1.8] text-white/50 md:text-[15px]">{chapter.text}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
