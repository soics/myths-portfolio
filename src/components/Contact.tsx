import { useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Loader2, Stamp, HardHat } from 'lucide-react'
import { site } from '../data/site'
import { LiquidGlass } from './LiquidGlass'

type FormState = 'idle' | 'loading' | 'success' | 'error'

function shakeAnim() {
  return {
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.45, ease: 'easeInOut' as const },
  }
}

function TapeField({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const rotations = [-0.3, 0.2, -0.1]
  const rot = rotations[Math.floor(delay * 10) % rotations.length]
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="taped-note relative rounded-xl bg-white/[0.02] border border-white/[0.04] p-4"
      style={{ transform: `rotate(${rot}deg)` }}
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
              <HardHat size={14} className="text-blueprint/50" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blueprint/40">CONTACT.SITE</span>
            </div>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">Leave a note.</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-concrete-light/60">
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
              <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-blueprint/40">CURRENT STATUS</h3>
              <p className="mt-3 text-lg leading-[1.7] text-white/80">
                {site.phrases[2] || 'I am not finished. I am building.'}
              </p>
            </motion.div>
          </LiquidGlass>
        </div>

        {/* Right — plywood form */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <motion.form
            onSubmit={handleSubmit}
            animate={status === 'error' ? shakeAnim() : {}}
            className="plywood glass-lift rounded-[20px] p-7 md:p-8 relative overflow-hidden"
            aria-label="Contact form"
          >
            {/* Plywood grain overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 30px, rgba(161,161,170,0.1) 30px, rgba(161,161,170,0.1) 31px), repeating-linear-gradient(0deg, transparent 0px, transparent 60px, rgba(161,161,170,0.05) 60px, rgba(161,161,170,0.05) 61px)`,
            }} />
            {/* Nail holes at corners */}
            <div className="absolute left-3 top-3 h-2 w-2 rounded-full bg-concrete-dark/30" />
            <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-concrete-dark/30" />
            <div className="absolute left-3 bottom-3 h-2 w-2 rounded-full bg-concrete-dark/30" />
            <div className="absolute right-3 bottom-3 h-2 w-2 rounded-full bg-concrete-dark/30" />

            <input className="hidden" name="website" tabIndex={-1} autoComplete="off" />

            <div className="relative space-y-5">
              {/* Name */}
              <TapeField delay={0.15}>
                <label className="block text-xs text-concrete-light/50">
                  Name <span className="text-blueprint/40">*</span>
                </label>
                <input
                  required minLength={2} maxLength={80} name="name"
                  className="focus-ring mt-1.5 w-full rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3 text-sm text-white transition-all duration-300 placeholder:text-concrete-mid/20 focus:border-blueprint/15 focus:shadow-[0_0_24px_rgba(56,189,248,0.04)]"
                  placeholder="Your name"
                />
              </TapeField>

              {/* Email */}
              <TapeField delay={0.25}>
                <label className="block text-xs text-concrete-light/50">
                  Email <span className="text-blueprint/40">*</span>
                </label>
                <input
                  required type="email" maxLength={120} name="email"
                  className="focus-ring mt-1.5 w-full rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3 text-sm text-white transition-all duration-300 placeholder:text-concrete-mid/20 focus:border-blueprint/15 focus:shadow-[0_0_24px_rgba(56,189,248,0.04)]"
                  placeholder="your@email.com"
                />
              </TapeField>

              {/* Message */}
              <TapeField delay={0.35}>
                <div className="flex items-baseline justify-between">
                  <label className="block text-xs text-concrete-light/50">
                    Message <span className="text-blueprint/40">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-concrete-mid/15">{msgLen}/2000</span>
                </div>
                <textarea
                  required minLength={10} maxLength={2000} name="message" rows={5}
                  onChange={(e) => setMsgLen(e.target.value.length)}
                  className="focus-ring mt-1.5 w-full resize-none rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3 text-sm text-white transition-all duration-300 placeholder:text-concrete-mid/20 focus:border-blueprint/15 focus:shadow-[0_0_24px_rgba(56,189,248,0.04)]"
                  placeholder="What's on your mind?"
                />
              </TapeField>
            </div>

            {/* PUSH button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={status === 'loading'}
              className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-hazard/80 to-hazard/60 px-5 py-4 text-sm font-bold text-white transition-all hover:from-hazard/90 hover:to-hazard/70 hover:shadow-[0_0_32px_rgba(239,68,68,0.2)] active:from-hazard/70 active:to-hazard/50 disabled:opacity-60 relative overflow-hidden"
              type="submit"
            >
              {/* Hazard stripe top border */}
              <div className="absolute top-0 left-0 right-0 h-[3px] hazard-stripe opacity-50" />
              {status === 'loading' ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 size={17} />
                </motion.span>
              ) : (
                <span className="flex items-center gap-2">
                  <Stamp size={14} />
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
                  className="absolute inset-x-0 flex items-center gap-3 rounded-xl bg-blueprint/10 px-4 py-3 border border-blueprint/10"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <CheckCircle2 size={17} className="text-blueprint/60" />
                  </motion.span>
                  <p className="text-sm text-blueprint/50">Message stamped and delivered.</p>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute inset-x-0 rounded-xl bg-hazard/10 px-4 py-3 text-sm text-hazard/50 border border-hazard/10"
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
