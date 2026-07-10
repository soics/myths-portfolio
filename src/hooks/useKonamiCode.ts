import { useEffect, useRef } from 'react'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

/**
 * Konami code Easter egg.
 * Fires `onActivate` when the sequence is entered.
 * Also returns `progress` via callback for UI feedback.
 */
export function useKonamiCode(onActivate: () => void) {
  const keys = useRef<string[]>([])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      keys.current.push(e.key)
      if (keys.current.length > KONAMI.length) {
        keys.current.shift()
      }
      if (keys.current.length === KONAMI.length &&
          keys.current.every((k, i) => k === KONAMI[i])) {
        keys.current = []
        onActivate()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onActivate])
}
