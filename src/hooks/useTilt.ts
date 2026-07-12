import { useEffect, useRef } from 'react'

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
