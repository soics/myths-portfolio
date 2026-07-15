import {
  createContext, useContext, useCallback, useEffect, useRef, useState,
  type ReactNode,
} from 'react'
import {
  ACHIEVEMENT_MAP, STORAGE_KEY, FINGERPRINT_KEY,
} from './achievements'

interface UnlockRecord {
  unlockedAt: string
}

type AchievementState = Record<string, UnlockRecord>

interface AchievementContextValue {
  unlocked: AchievementState
  unlockedCount: number
  isUnlocked: (id: string) => boolean
  unlockAchievement: (id: string) => void
  toasts: Array<{ id: string; name: string; description: string }>
  dismissToast: (id: string) => void
}

const AchievementContext = createContext<AchievementContextValue | null>(null)

function loadState(): AchievementState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveState(state: AchievementState) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

export function genFingerprint(): string {
  if (typeof window === 'undefined') return ''
  let fp = localStorage.getItem(FINGERPRINT_KEY)
  if (!fp) {
    fp = crypto.randomUUID()
    localStorage.setItem(FINGERPRINT_KEY, fp)
  }
  return fp
}

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AchievementState>(loadState)
  const [toasts, setToasts] = useState<Array<{ id: string; name: string; description: string }>>([])
  const sessionFlags = useRef<Set<string>>(new Set())
  const queueRef = useRef<string[]>([])
  const flushing = useRef(false)

  const isUnlocked = useCallback((id: string) => !!state[id], [state])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const flushQueue = useCallback(() => {
    if (flushing.current) return
    flushing.current = true
    const process = () => {
      const ids = queueRef.current.splice(0)
      if (ids.length === 0) { flushing.current = false; return }

      setState(prev => {
        const next = { ...prev }
        const newToasts: Array<{ id: string; name: string; description: string }> = []
        for (const id of ids) {
          const def = ACHIEVEMENT_MAP.get(id)
          if (!def || next[id]) continue
          next[id] = { unlockedAt: new Date().toISOString() }
          newToasts.push({ id: def.id, name: def.name, description: def.description })
        }
        saveState(next)
        if (newToasts.length > 0) {
          setToasts(prevToasts => [...prevToasts, ...newToasts])
        }
        return next
      })

      requestAnimationFrame(process)
    }
    requestAnimationFrame(process)
  }, [])

  const unlockAchievement = useCallback((id: string) => {
    if (sessionFlags.current.has(id)) return
    const def = ACHIEVEMENT_MAP.get(id)
    if (!def) return
    const current = loadState()
    if (current[id]) return
    sessionFlags.current.add(id)
    queueRef.current.push(id)
    flushQueue()
  }, [flushQueue])

  useEffect(() => {
    const checkAscension = () => {
      const s = loadState()
      const count = Object.keys(s).length
      if (count >= 50 && !s.ascension) {
        unlockAchievement('ascension')
      }
      if (count >= 45 && !s.apotheosis) {
        unlockAchievement('apotheosis')
      }
      if (count >= 50 && !s.omega) {
        unlockAchievement('omega')
      }
    }
    const interval = setInterval(checkAscension, 1000)
    return () => clearInterval(interval)
  }, [unlockAchievement])

  return (
    <AchievementContext.Provider
      value={{
        unlocked: state,
        unlockedCount: Object.keys(state).length,
        isUnlocked,
        unlockAchievement,
        toasts,
        dismissToast,
      }}
    >
      {children}
    </AchievementContext.Provider>
  )
}

export function useAchievements() {
  const ctx = useContext(AchievementContext)
  if (!ctx) throw new Error('useAchievements must be inside AchievementProvider')
  return ctx
}
