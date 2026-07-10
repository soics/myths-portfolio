import { useState } from 'react'
import { motion } from 'motion/react'
import { Loader2, Send, ShieldCheck } from 'lucide-react'
import { SocialLinks } from './Primitives'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function Contact() {
  const [status, setStatus] = useState<FormState>('idle')

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
              className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/60"
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
          className="glass rounded-[2rem] p-7"
          aria-label="Contact form"
        >
          <input className="hidden" name="website" tabIndex={-1} autoComplete="off" />
          <label className="mb-5 block text-sm text-white/55">
            Name
            <input
              required minLength={2} maxLength={80} name="name"
              className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-white transition-all duration-200 placeholder:text-white/20 focus:border-blue-300/30 focus:shadow-[0_0_24px_rgba(160,196,255,0.08)]"
              placeholder="Your name"
            />
          </label>
          <label className="mb-5 block text-sm text-white/55">
            Email
            <input
              required type="email" maxLength={120} name="email"
              className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-white transition-all duration-200 placeholder:text-white/20 focus:border-blue-300/30 focus:shadow-[0_0_24px_rgba(160,196,255,0.08)]"
              placeholder="your@email.com"
            />
          </label>
          <label className="mb-6 block text-sm text-white/55">
            Message
            <textarea
              required minLength={10} maxLength={2000} name="message" rows={5}
              className="focus-ring mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-white transition-all duration-200 placeholder:text-white/20 focus:border-blue-300/30 focus:shadow-[0_0_24px_rgba(160,196,255,0.08)]"
              placeholder="What's on your mind?"
            />
          </label>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={status === 'loading'}
            className="focus-ring inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition-all duration-200 hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] disabled:opacity-60"
            type="submit"
          >
            {status === 'loading' ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Loader2 size={18} />
              </motion.span>
            ) : <Send size={18} />}
            Send message
          </motion.button>

          {status === 'success' && (
            <motion.div initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="mt-5 flex items-center gap-2 text-sm text-green-200/80">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}>
                <ShieldCheck size={16} />
              </motion.span>
              Message stored securely.
            </motion.div>
          )}
          {status === 'error' && (
            <motion.p initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }} className="mt-5 text-sm text-red-200/80">
              Check the form and try again.
            </motion.p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
