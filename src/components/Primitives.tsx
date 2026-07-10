import { useEffect, useRef, useState, useCallback } from 'react'
import { useScroll, useMotionValueEvent, motion } from 'motion/react'
import { AtSign, GitBranch, Mail, Music2, Command } from 'lucide-react'
import { site } from '../data/site'

/* ------------------------------------------------------------------ */
/*  Navigation data                                                   */
/* ------------------------------------------------------------------ */
const navLinks = [
  ['01', 'About', '#about'],
  ['02', 'Skills', '#skills'],
  ['03', 'Projects', '#projects'],
  ['04', 'Journey', '#journey'],
  ['05', 'Contact', '#contact'],
] as const

/* ------------------------------------------------------------------ */
/*  Hooks                                                             */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Sackboy secret (click 10 times → glitch)                          */
/* ------------------------------------------------------------------ */
function SackboyButton() {
  const countRef = useRef(0)

  const handleClick = useCallback(() => {
    countRef.current++
    if (countRef.current >= 10) {
      countRef.current = 0
      const w = window as unknown as Record<string, () => void>
      w.__triggerGlitch?.()
    }
  }, [])

  return (
    <a
      className="focus-ring block shrink-0"
      href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      target="_blank"
      rel="noreferrer"
      aria-label="Surprise"
      onClick={handleClick}
    >
      <img src="/sackboy.png" alt="" className="block h-9 w-auto transition duration-300 hover:scale-105" />
    </a>
  )
}

/* ------------------------------------------------------------------ */
/*  Header                                                            */
/* ------------------------------------------------------------------ */

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

  // ⌘K toggle
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
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed left-0 right-0 top-0 z-30 px-4 pt-4"
      >
        <div
          className={`mx-auto max-w-6xl rounded-2xl px-5 py-3 transition-all duration-500 ${
            atTop
              ? 'bg-transparent'
              : 'bg-white/[0.04] shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl'
          }`}
        >
          <nav className="flex items-center justify-between gap-4 text-sm text-white/75">
            {/* Sackboy */}
            <SackboyButton />

            {/* Desktop nav */}
            <div className="hidden items-center gap-0.5 md:flex">
              {navLinks.map(([num, label, href]) => {
                const active = activeSection === href.slice(1)
                return (
                  <a
                    key={href}
                    href={href}
                    className={`focus-ring relative rounded-lg px-3.5 py-2 text-xs font-medium tracking-[0.02em] transition-all duration-300 ${
                      active ? 'text-white/95' : 'text-white/45 hover:bg-white/[0.06] hover:text-white/80'
                    }`}
                  >
                    <span className="mr-1.5 opacity-30">{num}</span>
                    {label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-2.5 -bottom-px h-[1.5px] rounded-full bg-gradient-to-r from-accent/60 to-accent/20"
                      />
                    )}
                  </a>
                )
              })}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPaletteOpen((p) => !p)}
                className="focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-white/35 transition-all hover:bg-white/[0.06] hover:text-white/60"
                aria-label="Command palette"
              >
                <Command size={14} />
                <span className="hidden text-[11px] md:inline">K</span>
              </button>
              <a
                className="focus-ring rounded-lg p-2 text-white/45 transition-all hover:bg-white/[0.06] hover:text-white"
                href={site.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <GitBranch size={15} />
              </a>
              <a
                className="focus-ring rounded-lg p-2 text-white/45 transition-all hover:bg-white/[0.06] hover:text-white"
                href={`mailto:${site.email}`}
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Command Palette */}
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Command Palette  (signature feature: ⌘K)                          */
/* ------------------------------------------------------------------ */

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const items = [
    { label: 'About', href: '#about', desc: 'Who I am' },
    { label: 'Skills', href: '#skills', desc: 'Tools & traits' },
    { label: 'Projects', href: '#projects', desc: 'Live from GitHub' },
    { label: 'Journey', href: '#journey', desc: 'Timeline' },
    { label: 'Contact', href: '#contact', desc: 'Get in touch' },
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0e] shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
      >
        {/* Search */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
          <Command size={15} className="shrink-0 text-white/25" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or section name&hellip;"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
          />
          <kbd className="rounded-md border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 text-[11px] text-white/25">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-64 overflow-y-auto py-2">
          {filtered.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSelect(item)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.04]"
            >
              <div>
                <span className="text-white/85">{item.label}</span>
                <span className="ml-3 text-xs text-white/25">{item.desc}</span>
              </div>
              {item.external && (
                <span className="text-[10px] text-white/20">↗</span>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-white/25">No results for &ldquo;{query}&rdquo;</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  SocialLinks                                                       */
/* ------------------------------------------------------------------ */

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
            className={`focus-ring glass inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${item.href ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <item.icon size={15} />
            {item.label}
          </Tag>
        )
      })}
    </div>
  )
}
