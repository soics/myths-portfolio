import { useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Loader2, Radio } from 'lucide-react'
import { site } from '../data/site'
import { LiquidGlass } from './LiquidGlass'

type FormState = 'idle' | 'loading' | 'success' | 'error'

function shakeAnim() {
  return {
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.45, ease: 'easeInOut' as const },
  }
}

function SignalField({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-xl bg-white/[0.02] border border-white/[0.04] p-4"
    >
      {children}
    </motion.div>
  )
}

export function Contact() {
  const [status, setStatus] = useState<FormState>('idle')
  const [msgLen, setMsgLen] = useState(0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const el = e.currentTarget
    const fd = new FormData(el)

    if (String(fd.get('website') || '').trim()) return

    const payload = {
      name: String(fd.get('name') || '').trim().slice(0, 80),
      email: String(fd.get('email') || '').trim().slice(0, 120),
      message: String(fd.get('message') || '').trim().slice(0, 2000),
    }

    if (!payload.name || !payload.email.includes('@') || payload.message.length < 10) {
      setStatus('error')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setMsgLen(0)
      el.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="px-5 py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left — heading */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Radio size={14} className="text-violet/50" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-violet/40">TRANSMISSION</span>
            </div>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">Send a message.</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-white/60">
              Open to advice, feedback, beginner-friendly opportunities, collaborations, and people who care about building.
            </p>
          </motion.div>
          <LiquidGlass variant="panel" tilt={4} className="!rounded-[18px] !p-6 md:!p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 70, damping: 20 }}
            >
              <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan/40">ORIGIN STORY</h3>
              <p className="mt-3 text-lg leading-[1.7] text-white/80">
                {site.phrases[2] || 'I am not finished. I am building.'}
              </p>
            </motion.div>
          </LiquidGlass>
        </div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <motion.form
            onSubmit={handleSubmit}
            animate={status === 'error' ? shakeAnim() : {}}
            className="glass-lift rounded-[20px] p-7 md:p-8"
            aria-label="Contact form"
          >
            <input className="hidden" name="website" tabIndex={-1} autoComplete="off" />

            <div className="space-y-4">
              {/* Name */}
              <SignalField delay={0.15}>
                <label className="block text-xs text-white/50">
                  Name <span className="text-violet/40">*</span>
                </label>
                <input
                  required minLength={2} maxLength={80} name="name"
                  className="focus-ring mt-1.5 w-full rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3 text-sm text-white transition-all duration-300 placeholder:text-white/20 focus:border-white/15 focus:shadow-[0_0_24px_rgba(212,212,220,0.04)]"
                  placeholder="Your name"
                />
              </SignalField>

              {/* Email */}
              <SignalField delay={0.25}>
                <label className="block text-xs text-white/50">
                  Email <span className="text-violet/40">*</span>
                </label>
                <input
                  required type="email" maxLength={120} name="email"
                  className="focus-ring mt-1.5 w-full rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3 text-sm text-white transition-all duration-300 placeholder:text-white/20 focus:border-white/15 focus:shadow-[0_0_24px_rgba(212,212,220,0.04)]"
                  placeholder="your@email.com"
                />
              </SignalField>

              {/* Message */}
              <SignalField delay={0.35}>
                <div className="flex items-baseline justify-between">
                  <label className="block text-xs text-white/50">
                    Message <span className="text-violet/40">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-white/15">{msgLen}/2000</span>
                </div>
                <textarea
                  required minLength={10} maxLength={2000} name="message" rows={5}
                  onChange={(e) => setMsgLen(e.target.value.length)}
                  className="focus-ring mt-1.5 w-full resize-none rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3 text-sm text-white transition-all duration-300 placeholder:text-white/20 focus:border-white/15 focus:shadow-[0_0_24px_rgba(212,212,220,0.04)]"
                  placeholder="What&rsquo;s on your mind?"
                />
              </SignalField>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={status === 'loading'}
              className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-white/10 px-5 py-4 text-sm font-semibold text-white transition-all hover:bg-white/15 hover:shadow-[0_0_32px_rgba(212,212,220,0.08)] disabled:opacity-60"
              type="submit"
            >
              {status === 'loading' ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 size={17} />
                </motion.span>
              ) : (
                <span className="flex items-center gap-2">
                  <Radio size={14} />
                  Send message
                </span>
              )}
            </motion.button>

            {/* Feedback */}
            <div className="relative mt-4 min-h-[2.5rem]">
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute inset-x-0 flex items-center gap-3 rounded-xl bg-cyan/10 px-4 py-3 border border-cyan/10"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <CheckCircle2 size={17} className="text-cyan/60" />
                  </motion.span>
                  <p className="text-sm text-cyan/50">Signal transmitted. Expect a response.</p>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute inset-x-0 rounded-xl bg-violet/10 px-4 py-3 text-sm text-violet/50 border border-violet/10"
                >
                  Transmission failed. Check your input and try again.
                </motion.p>
              )}
            </div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}
