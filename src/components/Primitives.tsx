import { useEffect, useRef, useState, useCallback } from 'react'
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from 'motion/react'
import { GitBranch, Mail, Command } from 'lucide-react'
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
        <img src="/sackboy.png" alt="" className="block h-8 w-auto transition-transform duration-300 hover:scale-110" />
      </a>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 rounded-xl border border-blueprint/10 bg-deep/90 px-5 py-3 text-xs text-concrete-light/50 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl"
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
        active ? 'text-white/90 bg-blueprint/10' : 'text-concrete-light/55 hover:bg-blueprint/5 hover:text-white/80'
      }`}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute inset-x-2.5 -bottom-px h-[1.5px] rounded-full bg-gradient-to-r from-blueprint/50 to-construction/30"
        />
      )}
    </a>
  )
}

function HeaderIconButton({ children, tone, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'blueprint' }) {
  const ref = useTilt<HTMLButtonElement>(8)
  const base = tone === 'blueprint'
    ? 'text-blueprint/30 hover:bg-blueprint/10 hover:text-blueprint/60'
    : 'text-concrete-light/45 hover:bg-white/[0.04] hover:text-concrete-light/65'
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      className={`focus-ring ui-tilt flex items-center gap-1.5 rounded-lg px-2.5 py-2 transition-all duration-300 ${base}`}
      {...rest}
    >
      {children}
    </button>
  )
}

function HeaderIconLink({ children, external, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { external?: boolean }) {
  const ref = useTilt<HTMLAnchorElement>(10)
  return (
    <a
      ref={ref}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="focus-ring ui-tilt rounded-lg p-2 text-concrete-light/55 transition-all duration-300 hover:bg-white/[0.04] hover:text-white"
      {...rest}
    >
      {children}
    </a>
  )
}

export function Header() {
  const lastY = useRef(0)
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [paletteOpen, setPaletteOpen] = useState(false)


  useMotionValueEvent(scrollY, 'change', (y) => {
    setAtTop(y < 20)
    if (y > 100 && y - lastY.current > 12) setHidden(true)
    else if (y - lastY.current < -5) setHidden(false)
    lastY.current = y
  })

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen((p) => !p)
      }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])

  const activeSection = useActiveSection(['about', 'skills', 'projects', 'journey', 'contact'])

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 right-0 top-0 z-30 px-4 pt-4"
      >
        <div
          className={`mx-auto max-w-6xl rounded-2xl px-5 py-3 transition-all duration-500 ${
            atTop
              ? 'bg-transparent'
              : 'bg-deep/80 border border-white/[0.05] shadow-[0_1px_0_rgba(200,200,200,0.03)] backdrop-blur-xl'
          }`}
        >
          <nav className="flex items-center justify-between gap-4 text-sm text-concrete-light/70">
            <div className="flex items-center gap-2">
              <SackboyButton />
              <span className="hidden items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-mono text-concrete-mid/25 md:inline-flex">
                <span className="safety-beacon h-1.5 w-1.5 rounded-full bg-construction" />
                <span>myths@site:~/construction</span>
              </span>
            </div>

            <div className="hidden items-center gap-0.5 md:flex">
              {navLinks.map(({ label, href }) => {
                const active = activeSection === href.slice(1)
                return (
                  <NavLink key={href} label={label} href={href} active={active} />
                )
              })}
            </div>

            <div className="flex items-center gap-1">
              <HeaderIconButton onClick={() => setPaletteOpen((p) => !p)} aria-label="Command palette">
                <Command size={14} />
                <span className="hidden text-[11px] md:inline">K</span>
              </HeaderIconButton>

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

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </>
  )
}

function PaletteItem({ item, onSelect }: { item: { label: string; desc: string; href: string; external?: boolean }; onSelect: () => void }) {
  const ref = useTilt<HTMLButtonElement>(4)
  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      className="ui-tilt flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.04]"
    >
      <div>
        <span className="text-white/80">{item.label}</span>
        <span className="ml-3 text-xs text-concrete-mid/35">{item.desc}</span>
      </div>
      {item.external && (
        <span className="text-[10px] text-concrete-mid/30">↗</span>
      )}
    </button>
  )
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const items = [
    { label: 'Blueprint', href: '#about', desc: 'Site plan' },
    { label: 'Materials', href: '#skills', desc: 'Tools & traits' },
    { label: 'Builds', href: '#projects', desc: 'Live from GitHub' },
    { label: 'Plan', href: '#journey', desc: 'Construction phases' },
    { label: 'Contact', href: '#contact', desc: 'Leave a note' },
    { label: 'GitHub', href: site.github, desc: 'View source code', external: true },
    { label: 'Email', href: `mailto:${site.email}`, desc: 'Direct message', external: true },
  ]

  const filtered = query
    ? items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()) || i.desc.toLowerCase().includes(query.toLowerCase()))
    : items

  const handleSelect = useCallback(
    (item: (typeof items)[number]) => {
      onClose()
      if (item.external) {
        window.open(item.href, '_blank', 'noopener')
      } else {
        document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [onClose],
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="absolute inset-0 bg-deep/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-blueprint/10 bg-deep shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-3 border-b border-blueprint/10 px-4 py-3.5">
          <Command size={15} className="shrink-0 text-concrete-mid/35" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or section..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-concrete-mid/30"
          />
          <kbd className="rounded-md border border-blueprint/10 bg-white/[0.04] px-1.5 py-0.5 text-[11px] text-concrete-mid/35">ESC</kbd>
        </div>

        <div className="max-h-64 overflow-y-auto py-2">
          {filtered.map((item) => (
            <PaletteItem key={item.label} item={item} onSelect={() => handleSelect(item)} />
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-concrete-mid/35">No results for &ldquo;{query}&rdquo;</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
