import { useEffect, useState } from 'react'
import { useScroll, useTransform, motion } from 'motion/react'
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
  const { scrollY } = useScroll()
  const bg = useTransform(scrollY, [0, 100], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.04)'])
  const border = useTransform(scrollY, [0, 100], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)'])
  const blur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(16px)'])
  const activeSection = useActiveSection(['about', 'skills', 'projects', 'journey', 'contact'])

  return (
    <motion.header
      style={{ backgroundColor: bg, borderColor: border, backdropFilter: blur, WebkitBackdropFilter: blur }}
      className="fixed left-0 right-0 top-0 z-30 border-b border-transparent px-4 py-4"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-3 text-sm text-white/75">
        <a className="focus-ring block" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noreferrer" aria-label="Surprise">
          <img src="/sackboy.png" alt="" className="block max-h-20 w-auto transition hover:scale-105" />
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {links.map(([number, label, href]) => {
            const isActive = activeSection === href.slice(1)
            return (
              <a
                key={href}
                href={href}
                className={`focus-ring relative rounded-full px-3 py-2 transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-white/60 hover:bg-white/10 hover:text-white/85'
                }`}
              >
                <span className="mr-1 text-white/25">{number}</span>{label}
                {isActive && (
                  <motion.span layoutId="nav-indicator" className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-blue-300/60 to-transparent" />
                )}
              </a>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <a className="focus-ring rounded-full p-2 text-white/65 transition hover:bg-white/10 hover:text-white" href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitBranch size={18} /></a>
          <a className="focus-ring rounded-full p-2 text-white/65 transition hover:bg-white/10 hover:text-white" href={`mailto:${site.email}`} aria-label="Email"><Mail size={18} /></a>
        </div>
      </nav>
    </motion.header>
  )
}

export function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-3">
      <a className="focus-ring glass inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-white/75 transition-all hover:-translate-y-0.5 hover:text-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]" href={site.github} target="_blank" rel="noreferrer"><GitBranch size={16} /> GitHub</a>
      <a className="focus-ring glass inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-white/75 transition-all hover:-translate-y-0.5 hover:text-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]" href={site.instagram} target="_blank" rel="noreferrer"><AtSign size={16} /> Instagram</a>
      <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-white/75"><Music2 size={16} /> TikTok: {site.tiktok}</span>
      <a className="focus-ring glass inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-white/75 transition-all hover:-translate-y-0.5 hover:text-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]" href={`mailto:${site.email}`}><Mail size={16} /> Email</a>
    </div>
  )
}
