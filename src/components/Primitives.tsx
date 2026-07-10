import { useEffect, useRef, useState, useCallback } from 'react'
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from 'motion/react'
import { AtSign, GitBranch, Mail, Music2, Command } from 'lucide-react'
import { site } from '../data/site'
import { useStore } from '../lib/store'

const navLinks = [
  ['01', 'Origin', '#about'],
  ['02', 'Capabilities', '#skills'],
  ['03', 'Discoveries', '#projects'],
  ['04', 'Path', '#journey'],
  ['05', 'Signal', '#contact'],
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
        className={`focus-ring block shrink-0 transition-all duration-300 ${glitchTrigger ? 'animate-[glitch_0.3s_ease-in-out_3]' : ''}`}
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
            className="fixed bottom-6 right-6 z-50 rounded-xl border border-white/[0.06] bg-deep/90 px-5 py-3 text-xs text-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            Classic Sackboy!  <span className="text-white/30">— myths</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function BagboyButton() {
  const [pulse, setPulse] = useState(false)
  const setPose = useStore((s) => s.setBagboyPose)

  const handleClick = useCallback(() => {
    setPulse(true)
    setPose('wave')
    setTimeout(() => { setPulse(false); setPose('idle') }, 2000)
  }, [setPose])

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`focus-ring flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-mono transition-all duration-300 ${
        pulse ? 'bg-cyan/8 text-cyan/50' : 'text-white/35 hover:bg-white/[0.04] hover:text-white/55'
      }`}
      aria-label="Say hi to bagboy"
    >
      <span className={`transition-transform duration-300 ${pulse ? 'scale-110' : ''}`}>
        [~]
      </span>
      <span className="hidden md:inline">bagboy</span>
    </button>
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
              : 'bg-deep/80 border border-white/[0.05] shadow-[0_1px_0_rgba(212,212,220,0.03)] backdrop-blur-xl'
          }`}
        >
          <nav className="flex items-center justify-between gap-4 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <SackboyButton />
              <BagboyButton />
            </div>

            <div className="hidden items-center gap-0.5 md:flex">
              {navLinks.map(([num, label, href]) => {
                const active = activeSection === href.slice(1)
                return (
                  <a
                    key={href}
                    href={href}
                    className={`focus-ring relative rounded-lg px-3.5 py-2 text-xs font-medium tracking-[0.02em] transition-all duration-300 ${
                      active ? 'text-white/90' : 'text-white/55 hover:bg-white/[0.04] hover:text-white/80'
                    }`}
                  >
                    <span className="mr-1.5 font-mono text-[9px] opacity-30">{num}</span>
                    {label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-2.5 -bottom-px h-[1.5px] rounded-full bg-gradient-to-r from-cyan/50 to-violet/30"
                      />
                    )}
                  </a>
                )
              })}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPaletteOpen((p) => !p)}
                className="focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-white/45 transition-all hover:bg-white/[0.04] hover:text-white/65"
                aria-label="Command palette"
              >
                <Command size={14} />
                <span className="hidden text-[11px] md:inline">K</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const w = window as unknown as Record<string, () => void>
                  w.__openTerminal?.()
                }}
                className="focus-ring flex items-center gap-1 rounded-lg px-2 py-2 text-cyan/30 transition-all hover:bg-cyan/10 hover:text-cyan/60"
                aria-label="Open terminal"
              >
                <span className="font-mono text-[11px] tracking-[0.1em]">_</span>
                <span className="hidden text-[10px] md:inline">`</span>
              </button>
              <a
                className="focus-ring rounded-lg p-2 text-white/55 transition-all hover:bg-white/[0.04] hover:text-white"
                href={site.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <GitBranch size={15} />
              </a>
              <a
                className="focus-ring rounded-lg p-2 text-white/55 transition-all hover:bg-white/[0.04] hover:text-white"
                href={`mailto:${site.email}`}
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
            </div>
          </nav>
        </div>
      </motion.header>

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </>
  )
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const items = [
    { label: 'Origin', href: '#about', desc: 'The story' },
    { label: 'Capabilities', href: '#skills', desc: 'Tools & traits' },
    { label: 'Discoveries', href: '#projects', desc: 'Live from GitHub' },
    { label: 'Path', href: '#journey', desc: 'Roadmap' },
    { label: 'Signal', href: '#contact', desc: 'Get in touch' },
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
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-deep shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
          <Command size={15} className="shrink-0 text-white/35" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or section..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          />
          <kbd className="rounded-md border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 text-[11px] text-white/35">ESC</kbd>
        </div>

        <div className="max-h-64 overflow-y-auto py-2">
          {filtered.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSelect(item)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.04]"
            >
              <div>
                <span className="text-white/80">{item.label}</span>
                <span className="ml-3 text-xs text-white/35">{item.desc}</span>
              </div>
              {item.external && (
                <span className="text-[10px] text-white/30">↗</span>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-white/35">No results for &ldquo;{query}&rdquo;</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function SocialLinks() {
  const items = [
    { icon: GitBranch, label: 'GitHub', href: site.github },
    { icon: AtSign, label: 'Instagram', href: site.instagram },
    { icon: Music2, label: `TikTok: ${site.tiktok}`, href: null },
    { icon: Mail, label: 'Email', href: `mailto:${site.email}` },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const Tag = item.href ? 'a' : 'span'
        const props = item.href
          ? { href: item.href, target: '_blank' as const, rel: 'noreferrer' as const }
          : {}
        return (
          <Tag
            key={item.label}
            {...props}
            className={`focus-ring glass inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-white/55 transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${item.href ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <item.icon size={15} />
            {item.label}
          </Tag>
        )
      })}
    </div>
  )
}
