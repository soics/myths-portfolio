import { useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { SocialLinks } from './Primitives'

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
type FormState = 'idle' | 'loading' | 'success' | 'error'

/* ------------------------------------------------------------------ */
/*  Shake animation helper                                            */
/* ------------------------------------------------------------------ */
function shakeAnim() {
  return {
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.45, ease: 'easeInOut' as const },
  }
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                       */
/* ------------------------------------------------------------------ */

export function Contact() {
  const [status, setStatus] = useState<FormState>('idle')
  const [msgLen, setMsgLen] = useState(0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const el = e.currentTarget
    const fd = new FormData(el)

    // Honeypot
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
        {/* Left — heading + social */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">Say something real.</h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-white/55">
              Open to advice, feedback, beginner-friendly opportunities, collaborations, and people who care about building.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <SocialLinks />
          </motion.div>
        </div>

        {/* Right — form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 100, damping: 25, delay: 0.15 }}
          onSubmit={handleSubmit}
          animate={status === 'error' ? shakeAnim() : {}}
          className="glass-lift rounded-[20px] p-7 md:p-8"
          aria-label="Contact form"
        >
          <input className="hidden" name="website" tabIndex={-1} autoComplete="off" />

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs text-white/40">
                Name <span className="text-red-200/35">*</span>
              </label>
              <input
                required minLength={2} maxLength={80} name="name"
                className="focus-ring mt-1.5 w-full rounded-xl border border-white/[0.06] bg-black/50 px-4 py-3.5 text-sm text-white transition-all duration-300 placeholder:text-white/15 focus:border-accent/25 focus:shadow-[0_0_24px_rgba(160,196,255,0.05)]"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-white/40">
                Email <span className="text-red-200/35">*</span>
              </label>
              <input
                required type="email" maxLength={120} name="email"
                className="focus-ring mt-1.5 w-full rounded-xl border border-white/[0.06] bg-black/50 px-4 py-3.5 text-sm text-white transition-all duration-300 placeholder:text-white/15 focus:border-accent/25 focus:shadow-[0_0_24px_rgba(160,196,255,0.05)]"
                placeholder="your@email.com"
              />
            </div>

            {/* Message */}
            <div>
              <div className="flex items-baseline justify-between">
                <label className="block text-xs text-white/40">
                  Message <span className="text-red-200/35">*</span>
                </label>
                <span className="text-[11px] text-white/15">{msgLen}/2000</span>
              </div>
              <textarea
                required minLength={10} maxLength={2000} name="message" rows={5}
                onChange={(e) => setMsgLen(e.target.value.length)}
                className="focus-ring mt-1.5 w-full resize-none rounded-xl border border-white/[0.06] bg-black/50 px-4 py-3.5 text-sm text-white transition-all duration-300 placeholder:text-white/15 focus:border-accent/25 focus:shadow-[0_0_24px_rgba(160,196,255,0.05)]"
                placeholder="What&rsquo;s on your mind?"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.98 }}
            disabled={status === 'loading'}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-4 text-sm font-semibold text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.10)] disabled:opacity-60"
            type="submit"
          >
            {status === 'loading' ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Loader2 size={17} />
              </motion.span>
            ) : (
              <Send size={17} />
            )}
            Send message
          </motion.button>

          {/* Feedback */}
          <div className="relative mt-4 min-h-[2.5rem]">
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute inset-x-0 flex items-center gap-3 rounded-xl bg-green-500/10 px-4 py-3"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <CheckCircle2 size={17} className="text-green-200/70" />
                </motion.span>
                <p className="text-sm text-green-200/60">Message delivered. I will read it.</p>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute inset-x-0 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200/60"
              >
                Could not send. Check the form and try again.
              </motion.p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  )
}
