import { motion } from 'motion/react'
import { ArrowUpRight, Terminal } from 'lucide-react'
import { site, strengths } from '../data/site'

const highlightWords = ['curiosity', 'mistakes', 'building things', 'thousands of juniors', 'unlearn']

const bioParagraphs = [
  'I am a junior developer who codes because I love building things. I do not pretend to have shipped at scale. What I have is curiosity — the drive to understand how things work and the patience to actually learn them.',
  'My best lessons have come from mistakes: shipping broken builds, committing secrets, wrestling with git at 2 AM. Every error message taught me more than any tutorial ever did.',
  'I believe the gap between "beginner" and "professional" is not talent — it is simply the number of mistakes you have made and learned from. I am still early in that process, and I am okay with that.',
  'Keep building. Keep breaking things. Keep getting better. One day the work will speak for itself.',
]

export function About() {
  return (
    <section id="about" className="px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent-dim/60"
          >
            About
          </motion.p>

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
                    transition={{ delay: 0.15 + pIdx * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                              transition={{ delay: 0.3 + pIdx * 0.1 + wIdx * 0.004, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
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

            {/* Sidebar — Status + Strengths */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:w-[38%]"
            >
              {/* Now card */}
              <div className="glass-lift rounded-2xl p-5">
                <div className="flex items-center gap-3 border-b border-white/[0.04] pb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/8">
                    <Terminal size={14} className="text-accent-dim/60" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/90">Now</p>
                    <p className="text-[11px] text-white/30">Current status</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Focus', value: 'Full-stack fundamentals' },
                    { label: 'Building', value: 'Open-source + portfolio' },
                    { label: 'Learning', value: 'React, Node, TypeScript' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-xs text-white/30">{item.label}</span>
                      <span className="text-xs font-medium text-white/70">{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div className="glass-sm mt-4 rounded-2xl p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/25">Strengths</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {strengths.map((s, i) => (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.04, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="group flex items-center gap-2.5"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                        className="h-1 w-1 shrink-0 rounded-full bg-accent/40"
                      />
                      <span className="text-xs text-white/55 transition-colors duration-300 group-hover:text-white/80">{s}</span>
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
