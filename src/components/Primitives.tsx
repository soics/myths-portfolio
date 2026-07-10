import { useEffect, useRef, useState } from 'react'
import { useScroll, useMotionValueEvent, motion } from 'motion/react'
import { AtSign, GitBranch, Mail, Music2 } from 'lucide-react'
import { site } from '../data/site'

const links = [
  ['01', 'About', '#about'],
  ['02', 'Skills', '#skills'],
  ['03', 'Projects', '#projects'],
  ['04', 'Journey', '#journey'],
  ['05', 'Contact', '#contact'],
] as const

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY + window.innerHeight * 0.3
      let current = ''
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= offset) current = id
      }
      setActive(current)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionIds])

  return active
}

export function Header() {
  const lastY = useRef(0)
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setAtTop(y < 20)
    const dir = y - lastY.current
    if (dir > 12 && y > 100) setHidden(true)
    else if (dir < -5) setHidden(false)
    lastY.current = y
  })

  const activeSection = useActiveSection(['about', 'skills', 'projects', 'journey', 'contact'])

  return (
    <motion.header
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed left-0 right-0 top-0 z-30 px-4 pt-4"
    >
      <div
        className={`mx-auto max-w-6xl rounded-2xl px-5 py-3.5 transition-all duration-500 ${
          atTop ? 'bg-transparent' : 'bg-white/[0.04] shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl'
        }`}
      >
        <nav className="flex items-center justify-between gap-4 text-sm text-white/75">
          <a className="focus-ring block shrink-0" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noreferrer" aria-label="Surprise">
            <img src="/sackboy.png" alt="" className="block h-10 w-auto transition duration-300 hover:scale-105" />
          </a>
          <div className="hidden items-center gap-0.5 md:flex">
            {links.map(([number, label, href]) => {
              const isActive = activeSection === href.slice(1)
              return (
                <a
                  key={href}
                  href={href}
                  className={`focus-ring relative rounded-lg px-3.5 py-2 text-xs font-medium tracking-[0.02em] transition-all duration-300 ${
                    isActive ? 'text-white/95' : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80'
                  }`}
                >
                  <span className="mr-1.5 opacity-40">{number}</span>{label}
                  {isActive && (
                    <motion.span layoutId="nav-indicator" className="absolute inset-x-2.5 -bottom-px h-[1.5px] rounded-full bg-gradient-to-r from-blue-300/60 to-blue-400/20" />
                  )}
                </a>
              )
            })}
          </div>
          <div className="flex items-center gap-1">
            <a className="focus-ring rounded-lg p-2 text-white/50 transition-all hover:bg-white/[0.06] hover:text-white" href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitBranch size={16} /></a>
            <a className="focus-ring rounded-lg p-2 text-white/50 transition-all hover:bg-white/[0.06] hover:text-white" href={`mailto:${site.email}`} aria-label="Email"><Mail size={16} /></a>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}

export function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-3">
      {[
        { icon: GitBranch, label: 'GitHub', href: site.github },
        { icon: AtSign, label: 'Instagram', href: site.instagram },
        { icon: Music2, label: `TikTok: ${site.tiktok}`, href: null },
        { icon: Mail, label: 'Email', href: `mailto:${site.email}` },
      ].map((item) => {
        const Tag = item.href ? 'a' : 'span'
        const props = item.href ? { href: item.href, target: '_blank', rel: 'noreferrer' } : {}
        return (
          <Tag
            key={item.label}
            {...props}
            className={`focus-ring glass inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-white/65 transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${item.href ? '' : 'cursor-default'}`}
          >
            <item.icon size={15} />
            {item.label}
          </Tag>
        )
      })}
    </div>
  )
}
