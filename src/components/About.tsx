import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { site, strengths } from '../data/site'

const emphasizedWords = ['curiosity', 'mistakes', 'making things', 'thousands of juniors', 'unlearn']

const bio = `I am a junior developer who codes because I love building things. I do not pretend to have shipped at scale. I do not pad my resume with technologies I have barely touched. What I have is curiosity — the genuine drive to understand how things work and the patience to actually learn them.

My best lessons have come from mistakes: shipping broken builds, realizing I committed secrets, wrestling with git at 2 AM. Every error message taught me more than any tutorial ever did.

I believe the gap between "beginner" and "professional" is not talent or some innate gift — it is simply the number of mistakes you have made and learned from. I am still early in that process, and I am okay with that.

My goal is honest: keep building, keep breaking things, keep getting better. One day the work will speak for itself. Until then, I will be here — coding, learning, and proving that persistence beats pedigree every time.`

export function About() {
  return (
    <section id="about" className="relative px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative flex flex-col gap-16 lg:flex-row"
        >
          <div className="lg:w-3/5 xl:w-[58%]">
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/60"
            >
              About
            </motion.p>

            <div className="prose-custom space-y-5 leading-[1.75] text-white/55">
              {bio.split('\n\n').map((paragraph, pIdx) => (
                <motion.p
                  key={pIdx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + pIdx * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-[15px] leading-[1.85]"
                >
                  {paragraph.split(' ').map((word, wIdx) => {
                    const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase()
                    const isEmphasized = emphasizedWords.includes(clean)
                    return (
                      <span key={wIdx} className={`transition-colors duration-300 ${isEmphasized ? 'relative text-white/85 font-medium' : ''}`}>
                        {isEmphasized && (
                          <motion.span
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + (pIdx * 0.08) + (wIdx * 0.003), duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="absolute -bottom-px left-0 h-px w-full origin-left bg-blue-300/30"
                          />
                        )}
                        {word}{' '}
                      </span>
                    )
                  })}
                </motion.p>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:w-2/5 xl:w-[38%]"
          >
            <div className="glass rounded-2xl p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/35">What I bring</p>
              <div className="space-y-3">
                {strengths.map((strength, i) => (
                  <motion.div
                    key={strength}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="group flex items-center gap-3"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300/40"
                    />
                    <span className="text-sm text-white/65 transition-colors duration-300 group-hover:text-white/90">{strength}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="focus-ring mt-4 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70"
            >
              <ArrowUpRight size={14} />
              See my GitHub
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
