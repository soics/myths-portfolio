/**
 * All achievement egg implementations.
 * Each hook sets up listeners and cleans up on unmount.
 * Use useAchievementEggs() in the app root to activate all eggs.
 */

import { useEffect, useRef, useCallback } from 'react'
import { useAchievements } from './AchievementContext'
import { WHISPER_KEY, VISITED_PAGES_KEY, DEVOTEE_KEY, SIGIL_KEY } from './achievements'

// ────────────────────────────────────────────────────────────
// #1 — Curious Mind (DevTools open detection via console getter)
// ────────────────────────────────────────────────────────────
function useCuriousMind() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  useEffect(() => {
    if (isUnlocked('curious_mind')) return
    const obj: Record<string, string> = {}
    Object.defineProperty(obj, 'inspect', {
      get() {
        if (!isUnlocked('curious_mind')) {
          unlockAchievement('curious_mind')
          const wreath = `
        █████████████████████████████████
        █  Welcome, mortal.             █
        █  Type help() if you're brave. █
        █████████████████████████████████`
          console.log(`%c${wreath}`, 'color: #c4a455')
          defineHelp()
        }
        return 'curious'
      },
      configurable: true,
    })
    console.log('%c ', obj)
    return () => { delete (window as any).help }
  }, [unlockAchievement, isUnlocked])
}

function defineHelp() {
  const w = window as any
  if (w.help) return
  w.help = () => {
    console.log(`%c
━━━ GOD COMMANDS ━━━
  enterLabyrinth()  — Descend into the maze
  These are the only commands you have.
  Use them wisely, mortal.
━━━━━━━━━━━━━━━━━━━
`, 'color: #c4a455')
  }
}

// ────────────────────────────────────────────────────────────
// #2 — Konami Code (↑ ↑ ↓ ↓ ← → ← → B A)
// ────────────────────────────────────────────────────────────
function useKonami() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const buffer = useRef<string[]>([])
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
  const achTriggered = useRef(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key === 'b' || e.key === 'B' ? 'b' : e.key === 'a' || e.key === 'A' ? 'a' : e.key
      buffer.current.push(key)
      if (buffer.current.length > 10) buffer.current.shift()
      if (buffer.current.length === 10 && buffer.current.every((k, i) => k === konami[i])) {
        // Always fire event for triple-threat tracking
        window.dispatchEvent(new CustomEvent('myths:konami'))

        if (!achTriggered.current) {
          achTriggered.current = true
          unlockAchievement('konami')
          // Gold particle burst
          const burst = document.createElement('div')
          burst.className = 'fixed inset-0 pointer-events-none z-[80]'
          burst.style.background =
            'radial-gradient(circle at 50% 50%, rgba(196,164,85,0.4) 0%, transparent 60%)'
          burst.style.animation = 'confetti-burst 2s ease-out forwards'
          document.body.appendChild(burst)
          setTimeout(() => burst.remove(), 2000)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #3 — Persistent Mortal (7 clicks on logo in 3s)
// ────────────────────────────────────────────────────────────
function usePersistentMortal(logoRef: React.RefObject<HTMLElement | null>) {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const timestamps = useRef<number[]>([])

  useEffect(() => {
    if (isUnlocked('persistent_mortal') || !logoRef.current) return
    const el = logoRef.current
    const handler = () => {
      const now = Date.now()
      timestamps.current = [...timestamps.current.filter(t => now - t < 3000), now]
      if (timestamps.current.length >= 7) {
        unlockAchievement('persistent_mortal')
        el.style.animation = 'shake 0.5s ease-out'
        setTimeout(() => { el.style.animation = '' }, 500)
        timestamps.current = []
      }
    }
    el.addEventListener('click', handler)
    return () => el.removeEventListener('click', handler)
  }, [unlockAchievement, isUnlocked, logoRef])
}

// ────────────────────────────────────────────────────────────
// #4 — Seeker of Titles (hover name 3s)
// ────────────────────────────────────────────────────────────
function useSeekerOfTitles(nameRef: React.RefObject<HTMLElement | null>) {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const timer = useRef<number>(0)

  useEffect(() => {
    if (isUnlocked('seeker_of_titles') || !nameRef.current) return
    const el = nameRef.current
    const start = () => {
      timer.current = window.setTimeout(() => {
        unlockAchievement('seeker_of_titles')
      }, 3000)
    }
    const cancel = () => clearTimeout(timer.current)
    el.addEventListener('mouseenter', start)
    el.addEventListener('mouseleave', cancel)
    return () => {
      el.removeEventListener('mouseenter', start)
      el.removeEventListener('mouseleave', cancel)
      clearTimeout(timer.current)
    }
  }, [unlockAchievement, isUnlocked, nameRef])
}

// ────────────────────────────────────────────────────────────
// #5 — Descent to Hades (scroll past footer)
// ────────────────────────────────────────────────────────────
function useDescentToHades() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isUnlocked('descent_to_hades')) return
    const sentinel = document.createElement('div')
    sentinel.id = 'hades-sentinel'
    sentinel.style.height = '1px'
    sentinel.style.width = '100%'
    document.body.appendChild(sentinel)
    sentinelRef.current = sentinel

    // Add a hidden underworld section
    const underworld = document.createElement('div')
    underworld.id = 'underworld'
    underworld.style.cssText = `
      height: 400px; background: #050508; display: flex; align-items: center;
      justify-content: center; opacity: 0; transition: opacity 1s ease;
      border-top: 1px solid rgba(196,164,85,0.1);
    `
    underworld.innerHTML = `<span style="color:#c4a455; font-size:14px; font-family:monospace; letter-spacing:0.2em;">
      You have reached the Underworld. Few return.
    </span>`
    document.body.appendChild(underworld)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          underworld.style.opacity = '1'
          unlockAchievement('descent_to_hades')
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(underworld)

    return () => {
      observer.disconnect()
      sentinel.remove()
      underworld.remove()
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #6 — Heeded the Call (tab visibility change)
// ────────────────────────────────────────────────────────────
function useHeededTheCall() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const origTitle = useRef('')

  useEffect(() => {
    if (isUnlocked('heeded_the_call')) return
    origTitle.current = document.title

    const handle = () => {
      if (document.hidden) {
        document.title = 'The Oracle awaits your return…'
      } else {
        document.title = origTitle.current
        unlockAchievement('heeded_the_call')
      }
    }
    document.addEventListener('visibilitychange', handle)
    return () => {
      document.removeEventListener('visibilitychange', handle)
      document.title = origTitle.current
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #7 — Trespasser of Olympus — done via route in App
// ────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────
// #8 — Invoke Zeus (right-click context menu)
// ────────────────────────────────────────────────────────────
function useInvokeZeus() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isUnlocked('invoke_zeus')) return

    const handler = (e: MouseEvent) => {
      e.preventDefault()
      // Remove existing custom menu
      menuRef.current?.remove()

      const menu = document.createElement('div')
      menuRef.current = menu
      menu.style.cssText = `
        position: fixed; left: ${e.clientX}px; top: ${e.clientY}px;
        z-index: 999; border-radius: 8px; border: 1px solid rgba(196,164,85,0.3);
        background: #0d0d0d; min-width: 180px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        font-family: monospace; font-size: 12px; color: rgba(255,255,255,0.6);
        overflow: hidden;
      `

      const items = [
        { label: 'Back', icon: '◁' },
        { label: 'Reload', icon: '↻' },
        { label: 'Save as…', icon: '↓' },
        { label: '⚡ Invoke Zeus', icon: '', isZeus: true },
      ]

      for (const item of items) {
        const div = document.createElement('div')
        div.style.cssText = `
          padding: 8px 16px; cursor: pointer; display: flex; align-items: center;
          gap: 8px; transition: background 0.15s;
        `
        if (item.isZeus) {
          div.style.borderTop = '1px solid rgba(196,164,85,0.15)'
          div.style.color = '#c4a455'
          div.onmouseenter = () => { div.style.background = 'rgba(196,164,85,0.1)' }
          div.onmouseleave = () => { div.style.background = '' }
          div.onclick = () => {
            menu.remove()
            menuRef.current = null
            unlockAchievement('invoke_zeus')
            // Lightning flash
            const flash = document.createElement('div')
            flash.className = 'fixed inset-0 pointer-events-none z-[80]'
            flash.style.cssText = `
              background: radial-gradient(ellipse at ${e.clientX}px ${e.clientY}px,
                rgba(196,164,85,0.6) 0%, rgba(200,200,255,0.2) 30%, transparent 60%);
              animation: flash-fade 0.8s ease-out forwards;
            `
            document.body.appendChild(flash)
            setTimeout(() => flash.remove(), 800)
          }
        } else {
          div.onmouseenter = () => { div.style.background = 'rgba(255,255,255,0.05)' }
          div.onmouseleave = () => { div.style.background = '' }
        }
        div.innerHTML = item.label
        menu.appendChild(div)
      }

      document.body.appendChild(menu)

      const close = (ev: MouseEvent) => {
        if (!menu.contains(ev.target as Node)) {
          menu.remove()
          menuRef.current = null
          document.removeEventListener('click', close)
        }
      }
      setTimeout(() => document.addEventListener('click', close), 0)
    }

    document.addEventListener('contextmenu', handler)
    return () => {
      document.removeEventListener('contextmenu', handler)
      menuRef.current?.remove()
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #9 — Word of Power (type "olympus")
// ────────────────────────────────────────────────────────────
function useWordOfPower() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const buffer = useRef<string[]>([])

  useEffect(() => {
    if (isUnlocked('word_of_power')) return
    const target = 'olympus'

    const handler = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA') return
      buffer.current.push(e.key.toLowerCase())
      if (buffer.current.length > target.length) buffer.current.shift()
      if (buffer.current.join('') === target) {
        unlockAchievement('word_of_power')
        // Gold flash
        const flash = document.createElement('div')
        flash.className = 'fixed inset-0 pointer-events-none z-[80]'
        flash.style.animation = 'flash-fade 0.6s ease-out forwards'
        flash.style.background = 'rgba(196,164,85,0.15)'
        document.body.appendChild(flash)
        setTimeout(() => flash.remove(), 600)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #10 — Full Circle (track pointer circular motion)
// ────────────────────────────────────────────────────────────
function useFullCircleGesture() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const state = useRef({ centerX: 0, centerY: 0, totalAngle: 0, prevAngle: 0, tracking: false, triggered: false })

  useEffect(() => {
    if (isUnlocked('full_circle')) return

    const onDown = (e: PointerEvent) => {
      if (state.current.triggered) return
      state.current.centerX = e.clientX
      state.current.centerY = e.clientY
      state.current.totalAngle = 0
      state.current.prevAngle = 0
      state.current.tracking = true
    }

    const onMove = (e: PointerEvent) => {
      if (!state.current.tracking || state.current.triggered) return
      const dx = e.clientX - state.current.centerX
      const dy = e.clientY - state.current.centerY
      if (Math.sqrt(dx * dx + dy * dy) < 30) return

      const angle = Math.atan2(dy, dx)
      let delta = angle - state.current.prevAngle
      if (delta > Math.PI) delta -= Math.PI * 2
      if (delta < -Math.PI) delta += Math.PI * 2
      state.current.totalAngle += Math.abs(delta)
      state.current.prevAngle = angle

      if (state.current.totalAngle >= Math.PI * 2) {
        state.current.triggered = true
        state.current.tracking = false
        unlockAchievement('full_circle')
        // Gold ripple
        const ripple = document.createElement('div')
        ripple.className = 'fixed inset-0 pointer-events-none z-[80]'
        ripple.style.cssText = `
          background: radial-gradient(circle at ${e.clientX}px ${e.clientY}px, rgba(196,164,85,0.3) 0%, transparent 40%);
          animation: flash-fade 1s ease-out forwards;
        `
        document.body.appendChild(ripple)
        setTimeout(() => ripple.remove(), 1000)
      }
    }

    const onUp = () => { state.current.tracking = false }

    document.addEventListener('pointerdown', onDown)
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #11 — Athena's Owl (floating clickable owl element)
// ────────────────────────────────────────────────────────────
function useAthenasOwlElement() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const elRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isUnlocked('athenas_owl')) return

    const el = document.createElement('div')
    elRef.current = el
    el.innerHTML = '🦉'
    el.style.cssText = `
      position: fixed; bottom: 40px; right: 40px; z-index: 50;
      font-size: 18px; cursor: pointer; opacity: 0;
      transition: opacity 0.8s ease, transform 0.3s ease;
      pointer-events: auto; user-select: none;
      filter: drop-shadow(0 0 6px rgba(196,164,85,0.3));
    `
    el.title = 'A wise presence watches…'
    el.setAttribute('aria-label', 'Hidden owl — click to reveal')
    document.body.appendChild(el)

    const showTimer = setTimeout(() => { el.style.opacity = '0.7' }, 4000)

    const handleClick = () => {
      if (isUnlocked('athenas_owl')) return
      el.textContent = '✨'
      el.style.transform = 'scale(1.3)'
      el.style.opacity = '0'
      unlockAchievement('athenas_owl')
    }
    el.addEventListener('click', handleClick)

    // Float animation via CSS
    let animFrame: number
    let start = Date.now()
    const float = () => {
      const t = (Date.now() - start) / 1000
      const dx = Math.sin(t * 0.3) * 6
      const dy = Math.sin(t * 0.5 + 1) * 4
      el.style.transform = `translate(${dx}px, ${dy}px)`
      if (!isUnlocked('athenas_owl')) animFrame = requestAnimationFrame(float)
    }
    animFrame = requestAnimationFrame(float)

    return () => {
      clearTimeout(showTimer)
      cancelAnimationFrame(animFrame)
      el.remove()
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #12 — Between Worlds (resize to ~999px)
// ────────────────────────────────────────────────────────────
function useBetweenWorlds() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const triggered = useRef(false)

  useEffect(() => {
    if (isUnlocked('between_worlds')) return
    let timer: number

    const handler = () => {
      clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (triggered.current) return
        const w = window.innerWidth
        if (w >= 997 && w <= 1001) {
          triggered.current = true
          unlockAchievement('between_worlds')
        }
      }, 150)
    }
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
      clearTimeout(timer)
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #13 — Child of Night (visit between midnight-1am)
// ────────────────────────────────────────────────────────────
function useChildOfNight() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  useEffect(() => {
    if (isUnlocked('child_of_night')) return
    const hour = new Date().getHours()
    if (hour === 0) {
      unlockAchievement('child_of_night')
      document.documentElement.style.setProperty('--starfield-opacity', '1')
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #14 — Inscribed in Stone (print)
// ────────────────────────────────────────────────────────────
function useInscribedInStone() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const printedRef = useRef(false)

  useEffect(() => {
    if (isUnlocked('inscribed_in_stone')) return

    const style = document.createElement('style')
    style.textContent = `
      @media print {
        body > :not(#print-message) { display: none !important; }
        #print-message { display: flex !important; }
      }
      #print-message { display: none; }
    `
    document.head.appendChild(style)

    const msg = document.createElement('div')
    msg.id = 'print-message'
    msg.style.cssText = `
      display: none; align-items: center; justify-content: center;
      height: 100vh; background: #0a0a0c; color: #c4a455;
      font-family: monospace; font-size: 18px; text-align: center;
      flex-direction: column; gap: 16px;
    `
    msg.innerHTML = `
      <pre style="font-size:10px; line-height:1.2; opacity:0.6;">
  ╔══════════════════════════════╗
  ║     INSCRIBED IN STONE      ║
  ║   "The builder becomes the   ║
  ║    built. The seeker finds   ║
  ║    what was always within."  ║
  ╚══════════════════════════════╝
      </pre>
    `
    document.body.appendChild(msg)

    const handler = () => {
      if (printedRef.current) return
      printedRef.current = true
      unlockAchievement('inscribed_in_stone')
    }
    window.addEventListener('beforeprint', handler)
    return () => {
      style.remove()
      msg.remove()
      window.removeEventListener('beforeprint', handler)
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #15 — Riddle of the Sphinx — route-based, handled in entry
// ────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────
// #16 — Whispers in the Wire — fetch interceptor
// ────────────────────────────────────────────────────────────
function useWhispersInTheWire() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const origFetch = useRef<typeof fetch | null>(null)

  useEffect(() => {
    if (isUnlocked('whispers_in_the_wire')) return
    if (origFetch.current) return

    origFetch.current = window.fetch
    const { unlockAchievement: unlock } = { unlockAchievement }
    const unlocked = { value: false }

    window.fetch = new Proxy(window.fetch, {
      apply(target, thisArg, args: [RequestInfo | URL, RequestInit?]) {
        const res = Reflect.apply(target, thisArg, args as any) as Promise<Response>
        return res.then(async response => {
          if (!unlocked.value && response.headers.get('X-Blessing')) {
            unlocked.value = true
            unlock('whispers_in_the_wire')
          }
          return response
        })
      },
    })

    return () => {
      if (origFetch.current) {
        window.fetch = origFetch.current
        origFetch.current = null
      }
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #17 — Forbidden Knowledge — route-based
// ────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────
// #18 — Codebreaker (localStorage whisper decode)
// ────────────────────────────────────────────────────────────
function useCodebreaker() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const triggered = useRef(false)

  useEffect(() => {
    if (isUnlocked('codebreaker')) return

    if (typeof window === 'undefined') return
    const existing = localStorage.getItem(WHISPER_KEY)
    if (!existing) {
      const encoded = btoa('decode this and paste it back to prove you found it. the password is "olympus"')
      localStorage.setItem(WHISPER_KEY, encoded)
    }

    const handler = (e: StorageEvent) => {
      if (triggered.current) return
      if (e.key === WHISPER_KEY && e.newValue) {
        try {
          const decoded = atob(e.newValue)
          if (decoded.includes('prove') && decoded.includes('olympus')) {
            triggered.current = true
            unlockAchievement('codebreaker')
          }
        } catch {}
      }
    }

    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #19 — Delta of the Gods ($1 Unistroke triangle)
// ────────────────────────────────────────────────────────────
function useDeltaOfTheGods() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const points = useRef<Array<{ x: number; y: number }>>([])
  const drawing = useRef(false)
  const triggered = useRef(false)

  useEffect(() => {
    if (isUnlocked('delta_of_the_gods')) return

    const onDown = (e: PointerEvent) => {
      if (triggered.current) return
      drawing.current = true
      points.current = [{ x: e.clientX, y: e.clientY }]
    }
    const onMove = (e: PointerEvent) => {
      if (!drawing.current) return
      points.current.push({ x: e.clientX, y: e.clientY })
    }
    const onUp = () => {
      if (!drawing.current || triggered.current) return
      drawing.current = false
      if (points.current.length < 20) return

      // Downsample to ~30 points
      const pts = points.current
      const step = Math.max(1, Math.floor(pts.length / 30))
      const sampled: Array<{ x: number; y: number }> = []
      for (let i = 0; i < pts.length; i += step) sampled.push(pts[i])
      if (sampled.length < 3) return

      // Simple triangle detection: check if we made 3 distinct directional strokes
      // by analyzing angle changes
      const dx = sampled[sampled.length - 1].x - sampled[0].x
      const dy = sampled[sampled.length - 1].y - sampled[0].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 100) return

      // Check for 3 directional changes (triangle = 3 turns)
      let turns = 0
      let hasAngle = false
      for (let i = 1; i < sampled.length - 1; i++) {
        const a = { x: sampled[i].x - sampled[i - 1].x, y: sampled[i].y - sampled[i - 1].y }
        const b = { x: sampled[i + 1].x - sampled[i].x, y: sampled[i + 1].y - sampled[i].y }
        const angle = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x)
        if (hasAngle && Math.abs(angle) > 0.8) turns++
        hasAngle = true
      }

      if (turns >= 2 && turns <= 5) {
        triggered.current = true
        unlockAchievement('delta_of_the_gods')
      }
    }

    document.addEventListener('pointerdown', onDown)
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #20 — Stargazer (click floating star elements)
// ────────────────────────────────────────────────────────────
function useStargazerElement() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const clicked = useRef(new Set<number>())
  const elsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (isUnlocked('stargazer')) return
    if (elsRef.current.length > 0) return

    const positions = [
      { x: '15%', y: '20%', delay: 0 },
      { x: '75%', y: '35%', delay: 1 },
      { x: '45%', y: '70%', delay: 2 },
    ]

    const stars: HTMLDivElement[] = []

    for (const [i, pos] of positions.entries()) {
      const el = document.createElement('div')
      el.innerHTML = '✦'
      el.style.cssText = `
        position: fixed; top: ${pos.y}; left: ${pos.x}; z-index: 45;
        font-size: 14px; color: rgba(196,164,85,0.4); cursor: pointer;
        opacity: 0; transition: opacity 0.6s ease, color 0.3s ease, transform 0.3s ease;
        pointer-events: auto; user-select: none;
        animation: star-pulse ${2 + Math.random() * 2}s ease-in-out ${pos.delay}s infinite;
      `
      el.title = 'A star waiting to be acknowledged…'
      el.setAttribute('aria-label', 'Hidden star — click to collect')
      document.body.appendChild(el)
      stars.push(el)

      setTimeout(() => { el.style.opacity = '1' }, 3000 + pos.delay * 1000)

      el.addEventListener('click', () => {
        if (clicked.current.has(i)) return
        clicked.current.add(i)
        el.style.color = 'rgba(196,164,85,0.9)'
        el.style.transform = 'scale(1.5)'
        setTimeout(() => { el.style.opacity = '0' }, 400)

        if (clicked.current.size >= 3) {
          unlockAchievement('stargazer')
        }
      })
    }

    elsRef.current = stars

    return () => {
      for (const el of stars) el.remove()
      elsRef.current = []
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #21 — Fire Bringer (type "prometheus" in name field)
// ────────────────────────────────────────────────────────────
function useFireBringer(inputRef: React.RefObject<HTMLInputElement | null>) {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const triggered = useRef(false)

  useEffect(() => {
    if (isUnlocked('fire_bringer') || !inputRef.current) return

    const handler = () => {
      if (triggered.current) return
      const val = inputRef.current?.value?.trim().toLowerCase()
      if (val === 'prometheus') {
        triggered.current = true
        unlockAchievement('fire_bringer')
      }
    }

    const el = inputRef.current
    el.addEventListener('blur', handler)
    el.addEventListener('change', handler)
    return () => {
      el.removeEventListener('blur', handler)
      el.removeEventListener('change', handler)
    }
  }, [unlockAchievement, isUnlocked, inputRef])
}

// ────────────────────────────────────────────────────────────
// #22 — Wanderer's Path (visit all pages)
// ────────────────────────────────────────────────────────────
function useWanderersPath() {
  const { unlockAchievement, isUnlocked } = useAchievements()

  useEffect(() => {
    if (isUnlocked('wanderers_path')) return
    if (typeof window === 'undefined') return

    // All known pages
    const ALL_ROUTES = new Set(['/', '/codex', '/olympus', '/forbidden-scroll', '/silence', '/the-matrix', '/echo', '/lighthouse', '/abyss'])

    const visited = new Set(JSON.parse(localStorage.getItem(VISITED_PAGES_KEY) || '[]'))
    const current = window.location.pathname
    visited.add(current)
    localStorage.setItem(VISITED_PAGES_KEY, JSON.stringify([...visited]))

    // Check if all routes visited
    let allVisited = true
    for (const route of ALL_ROUTES) {
      if (!visited.has(route)) { allVisited = false; break }
    }
    if (allVisited) {
      unlockAchievement('wanderers_path')
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #23 — Pantheon Key (4 sigils, correct order)
// ────────────────────────────────────────────────────────────
function usePantheonKey() {
  const { unlockAchievement, isUnlocked } = useAchievements()

  const recordSigil = useCallback((pageId: string) => {
    if (isUnlocked('pantheon_key')) return
    const raw = localStorage.getItem(SIGIL_KEY)
    const order: string[] = raw ? JSON.parse(raw) : []
    order.push(pageId)
    localStorage.setItem(SIGIL_KEY, JSON.stringify(order))

    const correct = ['contact', 'skills', 'about', 'projects']
    if (order.length === correct.length && order.every((id, i) => id === correct[i])) {
      unlockAchievement('pantheon_key')
      localStorage.removeItem(SIGIL_KEY)
    } else if (order.length >= correct.length) {
      localStorage.removeItem(SIGIL_KEY)
    }
  }, [unlockAchievement, isUnlocked])

  return { recordSigil }
}

// ────────────────────────────────────────────────────────────
// #24 — Devotee (return 3 different days)
// ────────────────────────────────────────────────────────────
function useDevotee() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  useEffect(() => {
    if (isUnlocked('devotee')) return
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(DEVOTEE_KEY)
    const dates: string[] = raw ? JSON.parse(raw) : []
    const today = new Date().toISOString().slice(0, 10)
    if (!dates.includes(today)) dates.push(today)
    localStorage.setItem(DEVOTEE_KEY, JSON.stringify(dates))
    if (dates.length >= 3) unlockAchievement('devotee')
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #25 — Double Invocation (konami + word of power in same session)
// ────────────────────────────────────────────────────────────
function useDoubleInvocation() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const flags = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (isUnlocked('double_invocation')) return
    sessionStorage.setItem('myths:double_check', '1')

    const konamiCheck = setInterval(() => {
      if (isUnlocked('konami')) flags.current.add('konami')
      if (isUnlocked('word_of_power')) flags.current.add('word')
      if (flags.current.has('konami') && flags.current.has('word')) {
        unlockAchievement('double_invocation')
        clearInterval(konamiCheck)
      }
    }, 2000)

    return () => clearInterval(konamiCheck)
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #26 — Trojan Horse (hidden element inside form)
// ────────────────────────────────────────────────────────────
function useTrojanHorseElement() {
  const { unlockAchievement, isUnlocked } = useAchievements()

  useEffect(() => {
    if (isUnlocked('trojan_horse')) return

    const el = document.createElement('span')
    el.textContent = '🐴'
    el.style.cssText = `
      position: absolute; bottom: 8px; right: 8px; z-index: 1;
      font-size: 10px; cursor: pointer; opacity: 0.08;
      transition: opacity 0.3s ease; pointer-events: auto;
      user-select: none;
    `
    el.title = 'Something is hidden inside…'
    el.setAttribute('aria-label', 'Trojan Horse — hidden inside form')

    const checkContainer = setInterval(() => {
      const contactSection = document.getElementById('contact')
      if (contactSection && !el.parentElement) {
        const form = contactSection.querySelector('form')
        if (form) {
          form.style.position = 'relative'
          form.appendChild(el)
          clearInterval(checkContainer)
        }
      }
    }, 500)

    const hoverIn = () => { el.style.opacity = '0.4' }
    const hoverOut = () => { el.style.opacity = '0.08' }
    el.addEventListener('mouseenter', hoverIn)
    el.addEventListener('mouseleave', hoverOut)

    el.addEventListener('click', () => {
      if (isUnlocked('trojan_horse')) return
      el.style.opacity = '0'
      unlockAchievement('trojan_horse')
    })

    return () => {
      clearInterval(checkContainer)
      el.remove()
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #27 — Blessed by Machines (Lighthouse UA detection)
// ────────────────────────────────────────────────────────────
function useBlessedByMachines() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  useEffect(() => {
    if (isUnlocked('blessed_by_machines')) return
    const ua = navigator.userAgent
    if (/Lighthouse|Speed.Insights|HeadlessChrome/i.test(ua)) {
      unlockAchievement('blessed_by_machines')
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #28 — Slayer of the Minotaur (console labyrinth)
// ────────────────────────────────────────────────────────────
function useSlayerOfMinotaur() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const timeoutRef = useRef<number>(0)

  useEffect(() => {
    const w = window as any
    if (w.enterLabyrinth || isUnlocked('slayer_of_minotaur')) return

    w.enterLabyrinth = () => {
      if (isUnlocked('slayer_of_minotaur')) {
        console.log('%cThe labyrinth has already been conquered.', 'color: #c4a455')
        return
      }

      console.log(`%c
═══════════════════════════════════════
  THE LABYRINTH OF THE MINOTAUR

  You stand at the entrance of a dark,
  winding maze. Somewhere inside, the
  Minotaur waits.

  Commands:
    goLeft()     — Take the left passage
    goRight()    — Take the right passage
    goForward()  — Press deeper into the maze
    escape()     — Try to climb out (coward)

  Choose wisely, mortal.
═══════════════════════════════════════
`, 'color: #c4a455')

      w.goLeft = () => { cleanup(); w._labyrinthState = 'step1'; leftPath() }
      w.goRight = () => { cleanup(); w._labyrinthState = 'step1'; rightPath() }
      w.goForward = () => { cleanup(); w._labyrinthState = 'none' }
      w.escape = () => { cleanup(); console.log('%cYou scramble up the wall and escape into the sunlight. The labyrinth remains unconquered.', 'color: #888') }

      resetTimeout()
    }

    function cleanup() {
      clearTimeout(timeoutRef.current)
    }

    function leftPath() {
      console.log(`%c
  You take the left passage. The air grows cold.
  Faint echoes reverberate off stone walls.
  The path forks again.

  Commands:
    goLeft()     — Follow the sound of dripping water
    goRight()    — Follow the warm draft
    goForward()  — Continue straight
`, 'color: #888')
      w.goLeft = () => { cleanup(); midPath() }
      w.goRight = () => { cleanup(); console.log('%cThe warm draft leads to a dead end. The Minotaur\'s breath is close behind. You backtrack.', 'color: #c4a455'); leftPath() }
      w.goForward = () => { cleanup(); console.log('%cThe straight path collapses into a pit. You fall… and land hard. The labyrinth claims another.', 'color: #a00'); setDead() }
      w.escape = () => { cleanup(); console.log('%cThere is no escape from this deep.', 'color: #888') }
      resetTimeout()
    }

    function rightPath() {
      console.log(`%c
  The right passage glows faintly with
  an ethereal golden light. The walls
  are marked with ancient symbols.

  Commands:
    goLeft()     — Inspect the glowing symbols
    goRight()    — Follow the light
    goForward()  — Press past the glow
`, 'color: #888')
      w.goLeft = () => { cleanup(); console.log('%cThe symbols tell a story of a hero who slew the beast. Inspired, you press on.', 'color: #c4a455'); midPath() }
      w.goRight = () => { cleanup(); finalPath() }
      w.goForward = () => { cleanup(); console.log('%cThe glow fades behind you. You wander in darkness until the Minotaur finds you.', 'color: #a00'); setDead() }
      w.escape = () => { cleanup(); console.log('%cToo deep now. No escape.', 'color: #888') }
      resetTimeout()
    }

    function midPath() {
      console.log(`%c
  The passages converge into a vast chamber.
  In the center, a massive stone labyrinth
  map is carved into the floor. One path
  is marked with a star.

  Commands:
    goLeft()     — Follow the starred path
    goRight()    — Take the unmarked path
`, 'color: #888')
      w.goLeft = () => { cleanup(); finalPath() }
      w.goRight = () => { cleanup(); console.log('%cThe unmarked path winds endlessly. You are lost. The Minotaur\'s roar echoes nearby.', 'color: #a00'); setDead() }
      w.goForward = () => { cleanup(); console.log('%cYou step into a pit trap. The labyrinth claims you.', 'color: #a00'); setDead() }
      w.escape = () => { cleanup(); console.log('%cNo escape from the heart of the maze.', 'color: #888') }
      resetTimeout()
    }

    function finalPath() {
      console.log(`%c
═══════════════════════════════════════
  THE MINOTAUR'S LAIR

  Before you stands the Minotaur —
  a hulking beast of bronze and shadow.
  It snorts, lowering its horns.

  Commands:
    attack()     — Charge the beast
    trick()      — Try to outsmart it
    flee()       — Run (you know what happens)
═══════════════════════════════════════
`, 'color: #c4a455')
      w.attack = () => { cleanup(); victoryPath() }
      w.trick = () => { cleanup(); victoryPath() }
      w.flee = () => { cleanup(); console.log('%cYou run. The Minotaur is faster. The labyrinth claims another soul.', 'color: #a00'); setDead() }
      w.goLeft = () => { cleanup(); console.log('%cThere is nowhere left to go but forward.', 'color: #888') }
      w.goRight = () => { cleanup(); console.log('%cThere is nowhere left to go but forward.', 'color: #888') }
      resetTimeout()
    }

    function victoryPath() {
      const w2 = window as any
      console.log(`%c
═══════════════════════════════════════
  VICTORY!

  You slay the Minotaur and emerge from
  the labyrinth, blinking in the sun.
  The gods take notice.

  Achievement unlocked: Slayer of the Minotaur
═══════════════════════════════════════
`, 'color: #c4a455; font-weight: bold')
      unlockAchievement('slayer_of_minotaur')
      w2._labyrinthCleaned = true
      eliminateGlobals()
    }

    function setDead() {
      console.log('%c[YOU HAVE PERISHED] The labyrinth claims another soul. Type enterLabyrinth() to try again.', 'color: #a00')
      eliminateGlobals()
    }

    function eliminateGlobals() {
      const w2 = window as any
      delete w2.goLeft; delete w2.goRight; delete w2.goForward
      delete w2.escape; delete w2.attack; delete w2.trick; delete w2.flee
      delete w2._labyrinthState
      w2.enterLabyrinth = undefined
      setTimeout(() => {
        if (!w2._labyrinthCleaned) {
          w2.enterLabyrinth = original
        }
      }, 5 * 60 * 1000)
    }

    function resetTimeout() {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => {
        console.log('%cThe labyrinth fades from memory. Type enterLabyrinth() to re-enter.', 'color: #888')
        eliminateGlobals()
      }, 5 * 60 * 1000)
    }

    const original = w.enterLabyrinth

    return () => {
      clearTimeout(timeoutRef.current)
      if (!isUnlocked('slayer_of_minotaur')) {
        w.enterLabyrinth = undefined
        delete w.goLeft; delete w.goRight; delete w.goForward
        delete w.escape; delete w.attack; delete w.trick; delete w.flee
      }
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #29 — Mouse Tracker (track total cursor distance > 5000px)
// ────────────────────────────────────────────────────────────
function useMouseTracker() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const state = useRef({ total: 0, lastX: 0, lastY: 0, init: false })

  useEffect(() => {
    if (isUnlocked('mouse_tracker')) return

    const handler = (e: MouseEvent) => {
      const s = state.current
      if (!s.init) {
        s.lastX = e.clientX
        s.lastY = e.clientY
        s.init = true
        return
      }
      const dx = e.clientX - s.lastX
      const dy = e.clientY - s.lastY
      s.total += Math.sqrt(dx * dx + dy * dy)
      s.lastX = e.clientX
      s.lastY = e.clientY

      if (s.total > 5000) {
        unlockAchievement('mouse_tracker')
      }
    }

    document.addEventListener('mousemove', handler, { passive: true })
    return () => document.removeEventListener('mousemove', handler)
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #30 — Double Tap (same key twice in 300ms)
// ────────────────────────────────────────────────────────────
function useDoubleTap() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const last = useRef({ key: '', time: 0 })

  useEffect(() => {
    if (isUnlocked('double_tap')) return

    const handler = (e: KeyboardEvent) => {
      const now = Date.now()
      if (e.key === last.current.key && now - last.current.time < 300) {
        unlockAchievement('double_tap')
      }
      last.current = { key: e.key, time: now }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #31 — Bat Signal (click safety beacon 5 times)
// ────────────────────────────────────────────────────────────
function useBatSignal() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const count = useRef(0)

  useEffect(() => {
    if (isUnlocked('bat_signal')) return

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.safety-beacon') || target.closest('[class*="safety-beacon"]')) {
        count.current++
        if (count.current >= 5) {
          unlockAchievement('bat_signal')
          // Flash
          const flash = document.createElement('div')
          flash.className = 'fixed inset-0 pointer-events-none z-[80]'
          flash.style.cssText = 'background: rgba(196,164,85,0.2); animation: flash-fade 0.8s ease-out forwards;'
          document.body.appendChild(flash)
          setTimeout(() => flash.remove(), 800)
        }
      }
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #32 — Sleeper Agent (idle 60s without interaction)
// ────────────────────────────────────────────────────────────
function useSleeperAgent() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const timer = useRef<number>(0)

  useEffect(() => {
    if (isUnlocked('sleeper_agent')) return

    const reset = () => {
      clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        unlockAchievement('sleeper_agent')
      }, 60000)
    }

    reset()
    window.addEventListener('mousemove', reset, { passive: true })
    window.addEventListener('keydown', reset, { passive: true })
    window.addEventListener('scroll', reset, { passive: true })
    window.addEventListener('click', reset, { passive: true })

    return () => {
      clearTimeout(timer.current)
      window.removeEventListener('mousemove', reset)
      window.removeEventListener('keydown', reset)
      window.removeEventListener('scroll', reset)
      window.removeEventListener('click', reset)
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #33 — Code Master (console.log incantation detection)
// ────────────────────────────────────────────────────────────
function useCodeMaster() {
  const { unlockAchievement, isUnlocked } = useAchievements()

  useEffect(() => {
    if (isUnlocked('code_master')) return

    const origLog = console.log
    const check = (args: any[]) => {
      const str = args.map(String).join(' ')
      if (str.includes('hello myths') || str.includes('hello') && str.includes('myths')) {
        setTimeout(() => {
          if (!isUnlocked('code_master')) {
            unlockAchievement('code_master')
            console.log('%c🌀 The console whispers back: "You speak the language of the gods."', 'color: #c4a455')
          }
        }, 100)
      }
    }

    console.log = (...args: any[]) => {
      check(args)
      origLog.apply(console, args)
    }

    return () => { console.log = origLog }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #34 — Night Owl (visit between 2-3am)
// ────────────────────────────────────────────────────────────
function useNightOwl() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  useEffect(() => {
    if (isUnlocked('night_owl')) return
    const hour = new Date().getHours()
    if (hour >= 2 && hour < 3) {
      unlockAchievement('night_owl')
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #35 — Pixel Perfect (resize to exactly 1440px)
// ────────────────────────────────────────────────────────────
function usePixelPerfect() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const triggered = useRef(false)

  useEffect(() => {
    if (isUnlocked('pixel_perfect')) return
    let timer: number

    const handler = () => {
      clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (triggered.current) return
        const w = window.innerWidth
        if (w >= 1438 && w <= 1442) {
          triggered.current = true
          unlockAchievement('pixel_perfect')
        }
      }, 150)
    }
    window.addEventListener('resize', handler)
    return () => { window.removeEventListener('resize', handler); clearTimeout(timer) }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #36 — Golden Touch (100 clicks total)
// ────────────────────────────────────────────────────────────
function useGoldenTouch() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const count = useRef(0)
  const element = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isUnlocked('golden_touch')) return

    // Click counter display
    const el = document.createElement('div')
    element.current = el
    el.style.cssText = `
      position: fixed; bottom: 80px; right: 20px; z-index: 40;
      font-family: monospace; font-size: 9px; color: rgba(196,164,85,0.15);
      pointer-events: none; user-select: none; transition: opacity 0.3s;
    `
    el.textContent = 'clicks: 0'
    document.body.appendChild(el)

    const handler = () => {
      count.current++
      el.textContent = `clicks: ${count.current}`
      if (count.current >= 100) {
        unlockAchievement('golden_touch')
        el.style.opacity = '0'
        const flash = document.createElement('div')
        flash.className = 'fixed inset-0 pointer-events-none z-[80]'
        flash.style.cssText = 'background: radial-gradient(circle at 50% 50%, rgba(196,164,85,0.3) 0%, transparent 60%); animation: flash-fade 1s ease-out forwards;'
        document.body.appendChild(flash)
        setTimeout(() => flash.remove(), 1000)
      }
    }

    document.addEventListener('click', handler)
    return () => {
      document.removeEventListener('click', handler)
      el.remove()
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #37 — Panta Rhei (scroll to exact midpoint)
// ────────────────────────────────────────────────────────────
function usePantaRhei() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const triggered = useRef(false)

  useEffect(() => {
    if (isUnlocked('panta_rhei')) return
    let timer: number

    const handler = () => {
      clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (triggered.current) return
        const docH = document.documentElement.scrollHeight - window.innerHeight
        const mid = docH / 2
        const current = window.scrollY
        if (Math.abs(current - mid) < 30) {
          triggered.current = true
          unlockAchievement('panta_rhei')
        }
      }, 200)
    }

    window.addEventListener('scroll', handler, { passive: true })
    return () => { window.removeEventListener('scroll', handler); clearTimeout(timer) }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #38 — Hermetic Message (type "as above so below" in message)
// ────────────────────────────────────────────────────────────
function useHermeticMessage() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const triggered = useRef(false)

  useEffect(() => {
    if (isUnlocked('hermetic_message')) return

    const handler = () => {
      if (triggered.current) return
      const textarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement | null
      if (textarea && textarea.value.toLowerCase().includes('as above so below')) {
        triggered.current = true
        unlockAchievement('hermetic_message')
      }
    }

    document.addEventListener('input', handler, { passive: true })
    return () => document.removeEventListener('input', handler)
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #39 — Triple Threat (3 Konami codes)
// ────────────────────────────────────────────────────────────
function useTripleThreat() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const count = useRef(0)

  useEffect(() => {
    if (isUnlocked('triple_threat')) return

    const handler = () => {
      count.current++
      if (count.current >= 3) {
        unlockAchievement('triple_threat')
      }
    }

    window.addEventListener('myths:konami', handler)
    return () => window.removeEventListener('myths:konami', handler)
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #40 — Silent Type (type "silence" on keyboard)
// ────────────────────────────────────────────────────────────
function useSilentType() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const buffer = useRef<string[]>([])

  useEffect(() => {
    if (isUnlocked('silent_type')) return
    const target = 'silence'

    const handler = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA') return
      buffer.current.push(e.key.toLowerCase())
      if (buffer.current.length > target.length) buffer.current.shift()
      if (buffer.current.join('') === target) {
        unlockAchievement('silent_type')
        // Subtle fade
        document.documentElement.style.transition = 'opacity 1s ease'
        document.documentElement.style.opacity = '0.5'
        setTimeout(() => { document.documentElement.style.opacity = '1' }, 1000)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #41 — Polymath (all 3 egg overlays in one session)
// ────────────────────────────────────────────────────────────
function usePolymath() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const flags = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (isUnlocked('polymath')) return

    const check = setInterval(() => {
      if (isUnlocked('polymath')) { clearInterval(check); return }
      if (isUnlocked('stargazer')) flags.current.add('stargazer')
      if (isUnlocked('athenas_owl')) flags.current.add('owl')
      if (isUnlocked('trojan_horse')) flags.current.add('horse')
      if (flags.current.size >= 3) {
        unlockAchievement('polymath')
      }
    }, 3000)

    return () => clearInterval(check)
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #42 — Eye of Providence (detect OG image loaded, then decode steganography)
// ────────────────────────────────────────────────────────────
function useEyeOfProvidence() {
  const { unlockAchievement, isUnlocked } = useAchievements()
  const unlocked = useRef(false)

  useEffect(() => {
    if (isUnlocked('eye_of_providence')) return

    // Inject a hidden 1×1 pixel with steganographic hex data
    const pixel = document.createElement('span')
    pixel.style.cssText = 'position:fixed;top:-1px;left:-1px;width:1px;height:1px;opacity:0;pointer-events:none;user-select:none'
    pixel.setAttribute('data-build-hex', '6275696c642066726f6d207468652067726f756e64207570')
    document.body.appendChild(pixel)

    // Expose decoder in console — calling it correctly earns the achievement
    const w = window as any
    w._decodeHex = (hex: string) => {
      if (unlocked.current) return ''
      if (!hex || typeof hex !== 'string') return 'provide a hex string'
      let out = ''
      for (let i = 0; i < hex.length; i += 2) out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16))
      if (out.includes('ground')) {
        unlocked.current = true
        unlockAchievement('eye_of_providence')
        console.log('%c🜁 You have peeled back the veil of the image. The pixel holds the key.', 'color: #c4a455')
      }
      return out
    }

    return () => {
      pixel.remove()
      delete w._decodeHex
    }
  }, [unlockAchievement, isUnlocked])
}

// ────────────────────────────────────────────────────────────
// #44 — Mnemosyne (visit /silence route after finding riddle)
// ────────────────────────────────────────────────────────────
// Handled by the riddle route in App.tsx — the achievement ID
// is shared with riddle_of_the_sphinx
// ────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────
// #43 — Sigil Gate (sigils in correct order about,skills,projects,contact)
// ────────────────────────────────────────────────────────────
function useSigilGate() {
  const { unlockAchievement, isUnlocked } = useAchievements()

  const recordSigilGate = useCallback((pageId: string) => {
    if (isUnlocked('sigil_gate')) return
    const raw = localStorage.getItem('myths-portfolio:sigil-gate')
    const order: string[] = raw ? JSON.parse(raw) : []
    order.push(pageId)
    localStorage.setItem('myths-portfolio:sigil-gate', JSON.stringify(order))

    const correct = ['about', 'skills', 'projects', 'contact']
    if (order.length === correct.length && order.every((id, i) => id === correct[i])) {
      unlockAchievement('sigil_gate')
      localStorage.removeItem('myths-portfolio:sigil-gate')
    } else if (order.length >= correct.length) {
      localStorage.removeItem('myths-portfolio:sigil-gate')
    }
  }, [unlockAchievement, isUnlocked])

  return { recordSigilGate }
}

// ────────────────────────────────────────────────────────────
// Main hook — activates all eggs
// ────────────────────────────────────────────────────────────
export function useAchievementEggs(options?: {
  logoRef?: React.RefObject<HTMLElement | null>
  nameRef?: React.RefObject<HTMLElement | null>
  nameInputRef?: React.RefObject<HTMLInputElement | null>
}) {
  useCuriousMind()
  useKonami()
  usePersistentMortal(options?.logoRef ?? { current: null })
  useSeekerOfTitles(options?.nameRef ?? { current: null })
  useDescentToHades()
  useHeededTheCall()
  useInvokeZeus()
  useWordOfPower()
  useBetweenWorlds()
  useChildOfNight()
  useInscribedInStone()
  useWhispersInTheWire()
  useCodebreaker()
  useDeltaOfTheGods()
  useFireBringer(options?.nameInputRef ?? { current: null })
  useWanderersPath()
  useDevotee()
  useDoubleInvocation()
  useBlessedByMachines()
  useSlayerOfMinotaur()
  useFullCircleGesture()
  useAthenasOwlElement()
  useStargazerElement()
  useTrojanHorseElement()
  useMouseTracker()
  useDoubleTap()
  useBatSignal()
  useSleeperAgent()
  useCodeMaster()
  useNightOwl()
  usePixelPerfect()
  useGoldenTouch()
  usePantaRhei()
  useHermeticMessage()
  useTripleThreat()
  useSilentType()
  usePolymath()
  useEyeOfProvidence()

  // Return externally wired helpers
  const { recordSigil } = usePantheonKey()
  const { recordSigilGate } = useSigilGate()
  return { recordSigil, recordSigilGate }
}

// ────────────────────────────────────────────────────────────
// Global CSS for egg animations (injected once)
// ────────────────────────────────────────────────────────────
export function injectEggStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById('egg-styles')) return
  const style = document.createElement('style')
  style.id = 'egg-styles'
  style.textContent = `
    @keyframes confetti-burst {
      0% { opacity: 0; transform: scale(0.5); }
      20% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(1.5); }
    }
    @keyframes flash-fade {
      0% { opacity: 0; }
      10% { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10% { transform: translateX(-4px) rotate(-1deg); }
      30% { transform: translateX(4px) rotate(1deg); }
      50% { transform: translateX(-3px) rotate(-0.5deg); }
      70% { transform: translateX(3px) rotate(0.5deg); }
      90% { transform: translateX(-1px); }
    }
    @keyframes star-pulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.2); }
    }
    @keyframes dust-float {
      0% { transform: translateY(0) translateX(0); opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.4; }
      100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
    }
    .dust-particle { position: fixed; border-radius: 50%; background: rgba(196,164,85,0.3); pointer-events: none; }
    .blueprint-grid { background-image: linear-gradient(rgba(161,161,170,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(161,161,170,0.03) 1px, transparent 1px); background-size: 40px 40px; }
    .blueprint-grid-lg { background-image: linear-gradient(rgba(161,161,170,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(161,161,170,0.02) 1px, transparent 1px); background-size: 160px 160px; }
    .scaffold-corner { background: linear-gradient(to right, rgba(161,161,170,0.04) 1px, transparent 1px) 0 0 / 100% 8px, linear-gradient(to bottom, rgba(161,161,170,0.04) 1px, transparent 1px) 0 0 / 8px 100%, repeating-linear-gradient(45deg, transparent 0px, transparent 8px, rgba(161,161,170,0.02) 8px, rgba(161,161,170,0.02) 9px); }
    .safety-beacon { animation: beacon-pulse 2s ease-in-out infinite; }
    .safety-beacon-delayed { animation: beacon-pulse 2s ease-in-out 1s infinite; }
    @keyframes beacon-pulse {
      0%, 100% { opacity: 0.4; box-shadow: 0 0 8px rgba(196,164,85,0.2); }
      50% { opacity: 0.9; box-shadow: 0 0 16px rgba(196,164,85,0.5); }
    }
  `
  document.head.appendChild(style)
}
