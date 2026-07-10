import { useEffect, useRef } from 'react'

/**
 * True 3D perspective tilt — directly manipulates DOM at 60fps
 * via requestAnimationFrame, bypassing React render cycle.
 */
export function useTilt(maxDeg = 10) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf: number
    let cx = 0.5, cy = 0.5, tx = 0.5, ty = 0.5

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      tx = (e.clientX - rect.left) / rect.width
      ty = (e.clientY - rect.top) / rect.height
    }
    const onLeave = () => { tx = 0.5; ty = 0.5 }

    const tick = () => {
      cx += (tx - cx) * 0.1
      cy += (ty - cy) * 0.1
      el.style.transform = `perspective(800px) rotateX(${(cy - 0.5) * -maxDeg}deg) rotateY(${(cx - 0.5) * maxDeg}deg) translateZ(0)`
      raf = requestAnimationFrame(tick)
    }

    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
      el.style.transform = ''
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
