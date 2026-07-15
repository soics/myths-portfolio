import { useState, useRef } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Loader2, Send, HardHat } from 'lucide-react'
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative space-y-1.5"
    >
      {children}
    </motion.div>
  )
}

export function Contact({ nameInputRef }: { nameInputRef?: React.RefObject<HTMLInputElement | null> }) {
  const [status, setStatus] = useState<FormState>('idle')
  const [msgLen, setMsgLen] = useState(0)
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; message?: string }>({})
  const formRef = useRef<HTMLFormElement>(null)

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

    const errors: { name?: string; email?: string; message?: string } = {}
    if (!payload.name) errors.name = 'Name is required'
    if (!payload.email.includes('@')) errors.email = 'Valid email required'
    if (payload.message.length < 10) errors.message = 'Message must be at least 10 characters'
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
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
    <section id="contact" className="px-5 py-24 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-6 bg-gold/30" />
              <HardHat size={14} className="text-blueprint/50" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blueprint/40">CONTACT</span>
            </div>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">Leave a note.</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-concrete-light/60">
              Open to advice, feedback, beginner-friendly opportunities, collaborations, and people who care about building.
            </p>
          </motion.div>
          <LiquidGlass variant="panel" tilt={4} className="!rounded-[20px] !p-6 md:!p-8 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 70, damping: 20 }}
            >
              <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-blueprint/40">STATUS</h3>
              <p className="mt-3 text-lg leading-[1.7] text-white/80">
                {site.phrases[2] || 'I am not finished. I am building.'}
              </p>
            </motion.div>
          </LiquidGlass>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            animate={status === 'error' ? shakeAnim() : {}}
            className="glass-lift rounded-[20px] p-6 md:p-8 relative overflow-hidden"
            aria-label="Contact form"
          >
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 30px, rgba(161,161,170,0.1) 30px, rgba(161,161,170,0.1) 31px), repeating-linear-gradient(0deg, transparent 0px, transparent 60px, rgba(161,161,170,0.05) 60px, rgba(161,161,170,0.05) 61px)`,
            }} />

            <input className="hidden" name="website" tabIndex={-1} autoComplete="off" />

            <div className="relative space-y-5">
              <TapeField delay={0.15}>
                <label className="block text-xs text-concrete-light/50 font-medium">
                  Name <span className="text-blueprint/40">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  required minLength={2} maxLength={80} name="name"
                  className="focus-ring mt-1 w-full rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3.5 text-sm text-white transition-all duration-300 placeholder:text-concrete-mid/20 focus:border-gold/30 focus:shadow-[0_0_24px_rgba(196,164,85,0.04)]"
                  placeholder="Your name"
                  onChange={() => setFieldErrors(p => ({ ...p, name: undefined }))}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-[11px] text-hazard/60">{fieldErrors.name}</p>
                )}
              </TapeField>

              <TapeField delay={0.25}>
                <label className="block text-xs text-concrete-light/50 font-medium">
                  Email <span className="text-blueprint/40">*</span>
                </label>
                <input
                  required type="email" maxLength={120} name="email"
                  className="focus-ring mt-1 w-full rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3.5 text-sm text-white transition-all duration-300 placeholder:text-concrete-mid/20 focus:border-gold/30 focus:shadow-[0_0_24px_rgba(196,164,85,0.04)]"
                  placeholder="your@email.com"
                  onChange={() => setFieldErrors(p => ({ ...p, email: undefined }))}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] text-hazard/60">{fieldErrors.email}</p>
                )}
              </TapeField>

              <TapeField delay={0.35}>
                <div className="flex items-baseline justify-between">
                  <label className="block text-xs text-concrete-light/50 font-medium">
                    Message <span className="text-blueprint/40">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-concrete-mid/20">{msgLen}/2000</span>
                </div>
                <textarea
                  required minLength={10} maxLength={2000} name="message" rows={4}
                  onChange={(e) => { setMsgLen(e.target.value.length); setFieldErrors(p => ({ ...p, message: undefined })) }}
                  className="focus-ring mt-1 w-full resize-none rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3.5 text-sm text-white transition-all duration-300 placeholder:text-concrete-mid/20 focus:border-gold/30 focus:shadow-[0_0_24px_rgba(196,164,85,0.04)]"
                  placeholder="What's on your mind?"
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-[11px] text-hazard/60">{fieldErrors.message}</p>
                )}
              </TapeField>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              disabled={status === 'loading'}
              className="focus-ring group mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-gold/80 to-gold/60 px-5 py-4 text-sm font-bold text-white transition-all duration-300 hover:from-gold/90 hover:to-gold/70 hover:shadow-[0_0_32px_rgba(196,164,85,0.2)] active:from-gold/70 active:to-gold/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              type="submit"
            >
              {status === 'loading' ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 size={17} />
                </motion.span>
              ) : (
                <span className="inline-flex items-center gap-3">
                  <span>Send message</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
                    <Send size={11} className="text-white/80" />
                  </span>
                </span>
              )}
            </motion.button>

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
              {status === 'error' && !Object.keys(fieldErrors).length && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute inset-x-0 rounded-xl bg-hazard/10 px-4 py-3 text-sm text-hazard/50 border border-hazard/10"
                >
                  Transmission failed. The server did not accept the message.
                </motion.p>
              )}
              {status === 'error' && Object.keys(fieldErrors).length > 0 && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute inset-x-0 rounded-xl bg-hazard/10 px-4 py-3 text-sm text-hazard/50 border border-hazard/10"
                >
                  Fix the highlighted fields and try again.
                </motion.p>
              )}
            </div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}
