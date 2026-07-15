import { useEffect, useRef, useState, useCallback } from 'react'
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from 'motion/react'
import { GitBranch, Mail } from 'lucide-react'
import { CompactMusicPlayer } from './music/CompactMusicPlayer'
import { site } from '../data/site'
import { useTilt } from '../hooks/useTilt'

const navLinks = [
  { label: 'Blueprint', href: '#about' },
  { label: 'Materials', href: '#skills' },
  { label: 'Builds', href: '#projects' },
  { label: 'Plan', href: '#journey' },
  { label: 'Contact', href: '#contact' },
] as const

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const handle = () => {
      const off = window.scrollY + window.innerHeight * 0.3
      let cur = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= off) cur = id
      }
      setActive(cur)
    }
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [ids])
  return active
}

function SackboyButton() {
  const countRef = useRef(0)
  const [glitchTrigger, setGlitchTrigger] = useState(false)
  const [show, setShow] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const ref = useTilt<HTMLAnchorElement>(12)

  const handleClick = useCallback(() => {
    countRef.current++
    if (countRef.current >= 3) {
      countRef.current = 0
      setGlitchTrigger(true)
      const w = window as unknown as Record<string, () => void>
      w.__triggerGlitch?.()
      setShow(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setShow(false), 4000)
      setTimeout(() => setGlitchTrigger(false), 1000)
    }
  }, [])

  return (
    <>
      <a
        ref={ref}
        className={`focus-ring ui-tilt block shrink-0 transition-all duration-300 ${glitchTrigger ? 'animate-[glitch_0.3s_ease-in-out_3]' : ''}`}
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        target="_blank"
        rel="noreferrer"
        aria-label="Surprise"
        onClick={handleClick}
      >
        <img src="/sackboy.png" alt="" className="block h-7 w-auto transition-transform duration-300 hover:scale-110" />
      </a>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 rounded-xl border border-white/[0.06] bg-deep-elevated/90 px-5 py-3 text-xs text-concrete-light/50 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            Classic Sackboy!  <span className="text-concrete-mid/30">myths</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  const ref = useTilt<HTMLAnchorElement>(5)
  return (
    <a
      ref={ref}
      href={href}
      className={`focus-ring ui-tilt relative rounded-lg px-3.5 py-2 text-xs font-medium tracking-[0.02em] transition-all duration-300 ${
        active ? 'text-white/90 bg-gold-subtle' : 'text-concrete-light/55 hover:bg-white/[0.03] hover:text-white/80'
      }`}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute inset-x-2.5 -bottom-px h-[1.5px] rounded-full bg-gradient-to-r from-gold/60 to-gold/20"
        />
      )}
    </a>
  )
}

function HeaderIconLink({ children, external, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { external?: boolean }) {
  const ref = useTilt<HTMLAnchorElement>(10)
  return (
    <a
      ref={ref}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="focus-ring ui-tilt rounded-lg p-2 text-concrete-light/55 transition-all duration-300 hover:bg-white/[0.04] hover:text-white active:scale-[0.97]"
      {...rest}
    >
      {children}
    </a>
  )
}

export function Header({ onCodexOpen, onMusicOpen }: { onCodexOpen?: () => void; onMusicOpen?: () => void }) {
  const lastY = useRef(0)
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setAtTop(y < 20)
    if (y > 100 && y - lastY.current > 12) setHidden(true)
    else if (y - lastY.current < -5) setHidden(false)
    lastY.current = y
  })

  const activeSection = useActiveSection(['about', 'skills', 'projects', 'journey', 'contact'])

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="fixed left-0 right-0 top-0 z-30 px-4 pt-4"
      >
        <div
          className={`mx-auto max-w-6xl rounded-2xl px-5 py-3 transition-all duration-700 ${
            atTop
              ? 'bg-transparent'
              : 'bg-deep-elevated/85 border border-white/[0.05] shadow-[0_1px_0_rgba(200,200,200,0.03)] backdrop-blur-2xl'
          }`}
        >
          <nav className="flex items-center justify-between gap-4 text-sm text-concrete-light/70">
            <div className="flex items-center gap-2">
              <SackboyButton />
              <CompactMusicPlayer onClick={onMusicOpen!} />
            </div>

            <div className="hidden items-center gap-0.5 md:flex">
              {navLinks.map(({ label, href }) => {
                const active = activeSection === href.slice(1)
                return (
                  <NavLink key={href} label={label} href={href} active={active} />
                )
              })}
              <div className="mx-2 h-4 w-px bg-white/[0.06]" />
              <button
                onClick={onCodexOpen}
                className="focus-ring ui-tilt rounded-lg px-3.5 py-2 text-xs font-medium tracking-[0.02em] text-gold/50 transition-all duration-300 hover:bg-gold-subtle hover:text-gold"
              >
                Secrets
              </button>
            </div>

            <div className="flex items-center gap-1">
              <HeaderIconLink href={site.github} external aria-label="GitHub">
                <GitBranch size={15} />
              </HeaderIconLink>
              <HeaderIconLink href={`mailto:${site.email}`} aria-label="Email">
                <Mail size={15} />
              </HeaderIconLink>
            </div>
          </nav>
        </div>
      </motion.header>
    </>
  )
}


