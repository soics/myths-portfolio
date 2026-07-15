import { useRef, useEffect, useCallback } from 'react'

export function useLiquidGlass(opts?: { maxTilt?: number; perspective?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const state = useRef({ tiltX: 0.5, tiltY: 0.5, glowX: 0.5, glowY: 0.5, targetX: 0.5, targetY: 0.5 })
  const maxTilt = opts?.maxTilt ?? 8

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf: number
    let paused = false
    const s = state.current

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      s.targetX = (e.clientX - rect.left) / rect.width
      s.targetY = (e.clientY - rect.top) / rect.height
    }

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      const rect = el.getBoundingClientRect()
      s.targetX = (t.clientX - rect.left) / rect.width
      s.targetY = (t.clientY - rect.top) / rect.height
    }

    const onLeave = () => { s.targetX = 0.5; s.targetY = 0.5 }

    const onVisibility = () => { paused = document.hidden }
    document.addEventListener('visibilitychange', onVisibility)

    const tick = () => {
      if (!paused) {
        s.tiltX = lerp(s.tiltX, s.targetX, 0.1)
        s.tiltY = lerp(s.tiltY, s.targetY, 0.1)
        s.glowX = lerp(s.glowX, s.targetX, 0.06)
        s.glowY = lerp(s.glowY, s.targetY, 0.06)

        const rx = (s.tiltY - 0.5) * -maxTilt
        const ry = (s.tiltX - 0.5) * maxTilt

        el.style.setProperty('--lg-tilt-x', `${ry}deg`)
        el.style.setProperty('--lg-tilt-y', `${rx}deg`)
        el.style.setProperty('--lg-glow-x', `${s.glowX * 100}%`)
        el.style.setProperty('--lg-glow-y', `${s.glowY * 100}%`)
      }
      raf = requestAnimationFrame(tick)
    }

    el.addEventListener('mousemove', onMouseMove, { passive: true })
    el.addEventListener('mouseleave', onLeave, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onLeave, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(raf)
      el.style.removeProperty('--lg-tilt-x')
      el.style.removeProperty('--lg-tilt-y')
      el.style.removeProperty('--lg-glow-x')
      el.style.removeProperty('--lg-glow-y')
    }
  }, [maxTilt])

  const triggerRipple = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--lg-ripple-x', `${x}%`)
    el.style.setProperty('--lg-ripple-y', `${y}%`)
    el.classList.remove('lg-ripple')
    void el.offsetWidth
    el.classList.add('lg-ripple')
  }, [])

  return { ref, triggerRipple }
}
