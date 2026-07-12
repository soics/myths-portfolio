import { useEffect, useRef } from 'react'

/**
 * True 3D perspective tilt — directly manipulates DOM at 60fps
 * via requestAnimationFrame, bypassing React render cycle.
 * Also exposes a CSS variable for an optional light highlight
 * via the `.ui-tilt` class.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 10) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf: number
    let cx = 0.5, cy = 0.5, tx = 0.5, ty = 0.5
    let lx = 50, ly = 50
    let active = false

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      tx = (e.clientX - rect.left) / rect.width
      ty = (e.clientY - rect.top) / rect.height
      lx = tx * 100
      ly = ty * 100
      active = true
    }
    const onLeave = () => {
      tx = 0.5
      ty = 0.5
      lx = 50
      ly = 50
      active = false
    }

    const tick = () => {
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
      el.style.setProperty('--tilt-x', `${(cx - 0.5) * maxDeg}deg`)
      el.style.setProperty('--tilt-y', `${(cy - 0.5) * -maxDeg}deg`)
      el.style.setProperty('--tilt-active', active ? '1' : '0')
      el.style.setProperty('--light-x', `${lx}%`)
      el.style.setProperty('--light-y', `${ly}%`)
      raf = requestAnimationFrame(tick)
    }

    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
      el.style.removeProperty('--tilt-x')
      el.style.removeProperty('--tilt-y')
      el.style.removeProperty('--tilt-active')
      el.style.removeProperty('--light-x')
      el.style.removeProperty('--light-y')
    }
  }, [maxDeg])

  return ref
}

/**
 * Hook to detect when the user types a specific string sequence.
 * Fires `onMatch` when the sequence is typed in order.
 */
export function useTypedSequence(seq: string, onMatch: () => void) {
  const buf = useRef('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      buf.current += e.key.toLowerCase()
      if (buf.current.length > seq.length) {
        buf.current = buf.current.slice(-seq.length)
      }
      if (buf.current === seq) {
        buf.current = ''
        onMatch()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [seq, onMatch])
}
