import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Trophy, X } from 'lucide-react'
import { useAchievements } from '../../lib/AchievementContext'

const TOAST_DURATION = 5000

export function UnlockToast() {
  const { toasts, dismissToast } = useAchievements()
  const timers = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    for (const t of toasts) {
      if (!timers.current.has(t.id)) {
        const id = window.setTimeout(() => dismissToast(t.id), TOAST_DURATION)
        timers.current.set(t.id, id)
      }
    }
    return () => {
      for (const [, id] of timers.current) clearTimeout(id)
    }
  }, [toasts, dismissToast])

  return (
    <div
      className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-3 items-end"
      aria-live="polite"
      aria-label="Achievement notifications"
    >
      <AnimatePresence>
        {toasts.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
            className="pointer-events-auto relative w-[340px] rounded-xl border border-gold/30 bg-[#1a1508] shadow-[0_0_40px_rgba(196,164,85,0.15)]"
            role="status"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
            <button
              onClick={() => dismissToast(t.id)}
              className="focus-ring absolute right-2 top-2 rounded-full p-1 text-gold/40 transition-colors hover:text-gold/70"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
            <div className="flex items-start gap-3 p-4 pr-8">
              <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-sm">
                <Trophy size={16} className="text-gold" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gold">{t.name}</p>
                <p className="mt-0.5 text-xs text-gold/60 leading-relaxed">{t.description}</p>
              </div>
            </div>
            <div className="h-[2px] rounded-full bg-gradient-to-r from-gold/40 to-gold/10 overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: TOAST_DURATION / 1000, ease: 'linear' }}
                className="h-full rounded-full bg-gold/50"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
