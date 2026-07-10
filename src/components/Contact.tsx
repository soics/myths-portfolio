import { useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { SocialLinks } from './Primitives'

type FormState = 'idle' | 'loading' | 'success' | 'error'

function shakeTransition() {
  return {
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.4, ease: 'easeInOut' as const },
  }
}

export function Contact() {
  const [status, setStatus] = useState<FormState>('idle')
  const [messageLen, setMessageLen] = useState(0)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const el = event.currentTarget
    const form = new FormData(el)
    if (String(form.get('website') || '').trim()) return
    const payload = {
      name: String(form.get('name') || '').trim().slice(0, 80),
      email: String(form.get('email') || '').trim().slice(0, 120),
      message: String(form.get('message') || '').trim().slice(0, 2000),
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
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        console.warn('Contact API error', res.status, text)
        throw new Error()
      }
      setStatus('success')
      setMessageLen(0)
      el.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="px-5 py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/60"
            >
              Contact
            </motion.p>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">Say something real.</h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-white/55">Open to advice, feedback, beginner-friendly opportunities, collaborations, and people who care about building.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-8"
          >
            <SocialLinks />
          </motion.div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring' as const, stiffness: 100, damping: 25, delay: 0.15 }}
          onSubmit={submit}
          animate={status === 'error' ? shakeTransition() : {}}
          className="glass rounded-[24px] p-7 md:p-8"
          aria-label="Contact form"
        >
          <input className="hidden" name="website" tabIndex={-1} autoComplete="off" />
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-white/45">
                Name <span className="text-red-200/40">*</span>
              </label>
              <input
                required minLength={2} maxLength={80} name="name"
                className="focus-ring mt-1.5 w-full rounded-2xl border border-white/[0.06] bg-black/40 px-4 py-3.5 text-sm text-white transition-all duration-300 placeholder:text-white/20 focus:border-blue-300/30 focus:shadow-[0_0_24px_rgba(160,196,255,0.06)]"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm text-white/45">
                Email <span className="text-red-200/40">*</span>
              </label>
              <input
                required type="email" maxLength={120} name="email"
                className="focus-ring mt-1.5 w-full rounded-2xl border border-white/[0.06] bg-black/40 px-4 py-3.5 text-sm text-white transition-all duration-300 placeholder:text-white/20 focus:border-blue-300/30 focus:shadow-[0_0_24px_rgba(160,196,255,0.06)]"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <label className="block text-sm text-white/45">
                  Message <span className="text-red-200/40">*</span>
                </label>
                <span className="text-xs text-white/20">{messageLen}/2000</span>
              </div>
              <textarea
                required minLength={10} maxLength={2000} name="message" rows={5}
                onChange={(e) => setMessageLen(e.target.value.length)}
                className="focus-ring mt-1.5 w-full resize-none rounded-2xl border border-white/[0.06] bg-black/40 px-4 py-3.5 text-sm text-white transition-all duration-300 placeholder:text-white/20 focus:border-blue-300/30 focus:shadow-[0_0_24px_rgba(160,196,255,0.06)]"
                placeholder="What's on your mind?"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.98 }}
            disabled={status === 'loading'}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] disabled:opacity-60"
            type="submit"
          >
            {status === 'loading' ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Loader2 size={18} />
              </motion.span>
            ) : <Send size={18} />}
            Send message
          </motion.button>

          <div className="relative mt-5 min-h-[2.5rem]">
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute inset-x-0 flex items-center gap-3 rounded-2xl bg-green-500/10 px-4 py-3"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring' as const, stiffness: 400, damping: 15 }}
                >
                  <CheckCircle2 size={18} className="text-green-200/80" />
                </motion.span>
                <p className="text-sm text-green-200/70">Message delivered. I will read it.</p>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute inset-x-0 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200/70"
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
