import { motion } from 'motion/react'
import { ArrowUpRight, Terminal } from 'lucide-react'
import { site } from '../data/site'
import { useTilt } from '../hooks/useTilt'

const highlightWords = ['curiosity', 'mistakes', 'building things', 'thousands of juniors', 'unlearn']

const bioParagraphs = [
  'I am a junior developer who codes because I love building things. I do not pretend to have shipped at scale. What I have is curiosity — the drive to understand how things work and the patience to actually learn them.',
  'My best lessons have come from mistakes: shipping broken builds, committing secrets, wrestling with git at 2 AM. Every error message taught me more than any tutorial ever did.',
  'I believe the gap between "beginner" and "professional" is not talent — it is simply the number of mistakes you have made and learned from. I am still early in that process, and I am okay with that.',
  'Keep building. Keep breaking things. Keep getting better. One day the work will speak for itself.',
]

export function About() {
  return (
    <section id="about" className="px-5 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Decorative background letter */}
          <span
            className="pointer-events-none absolute -left-6 -top-16 select-none text-[16rem] font-black leading-none tracking-[-0.08em] text-white/[0.015]"
            aria-hidden="true"
          >
            M
          </span>

          <div className="relative z-10 flex flex-col gap-14 lg:flex-row lg:items-start">
            {/* Narrative column */}
            <div className="lg:w-[58%]">
              <div className="space-y-5">
                {bioParagraphs.map((para, pIdx) => (
                  <motion.p
                    key={pIdx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + pIdx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[15px] leading-[1.85] text-white/55"
                  >
                    {para.split(' ').map((word, wIdx) => {
                      const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase()
                      const isHL = highlightWords.includes(clean)
                      return (
                        <span key={wIdx} className="relative">
                          {isHL && (
                            <motion.span
                              initial={{ scaleX: 0 }}
                              whileInView={{ scaleX: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.3 + pIdx * 0.1 + wIdx * 0.004, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                              className="absolute -bottom-px left-0 h-px w-full origin-left bg-accent/20"
                            />
                          )}
                          <span className={`transition-colors duration-300 ${isHL ? 'text-white/80 font-medium' : ''}`}>
                            {word}{' '}
                          </span>
                        </span>
                      )
                    })}
                  </motion.p>
                ))}
              </div>

              <motion.a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="focus-ring mt-8 inline-flex items-center gap-2 text-sm text-white/35 transition-colors hover:text-white/60"
              >
                <ArrowUpRight size={14} />
                See my GitHub
              </motion.a>
            </div>

            {/* Sidebar — Now card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:w-[38%]"
            >
              <div ref={useTilt(8)} className="glass-lift rounded-2xl p-6" style={{ transformStyle: 'preserve-3d' }}>
                <div className="flex items-center gap-3 border-b border-white/[0.04] pb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/8">
                    <Terminal size={15} className="text-accent-dim/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/90">Now</p>
                    <p className="text-[11px] text-white/30">Current status</p>
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    { label: 'Focus', value: 'Full-stack fundamentals' },
                    { label: 'Building', value: 'Open-source + portfolio' },
                    { label: 'Learning', value: 'React, Node, TypeScript' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="group"
                    >
                      <span className="text-[11px] text-white/25">{item.label}</span>
                      <p className="mt-0.5 text-sm font-medium text-white/75">{item.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
