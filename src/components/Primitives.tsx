import { useScroll, useTransform, motion } from 'motion/react'
import { AtSign, GitBranch, Mail, Music2, Sparkles } from 'lucide-react'
import { site } from '../data/site'

const links = [
  ['01', 'About', '#about'],
  ['02', 'Skills', '#skills'],
  ['03', 'Projects', '#projects'],
  ['04', 'Journey', '#journey'],
  ['05', 'Contact', '#contact'],
]

export function Header() {
  const { scrollY } = useScroll()
  const bg = useTransform(scrollY, [0, 100], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.04)'])
  const border = useTransform(scrollY, [0, 100], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)'])

  return (
    <motion.header style={{ backgroundColor: bg, borderColor: border }} className="fixed left-0 right-0 top-0 z-30 border-b border-transparent px-4 py-4 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-3 text-sm text-white/80">
        <a className="focus-ring flex items-center gap-2 rounded-full font-semibold tracking-[-0.04em] text-white" href="#top" aria-label="Back to top"><img src="/sackboy.png" alt="" className="h-8 w-8 rounded-full object-cover" />{site.name}</a>
        <div className="hidden items-center gap-1 md:flex">
          {links.map(([number, label, href]) => (
            <a key={href} href={href} className="focus-ring rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white">
              <span className="mr-1 text-white/35">{number}</span>{label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a className="focus-ring rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white" href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitBranch size={18} /></a>
          <a className="focus-ring rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white" href={`mailto:${site.email}`} aria-label="Email"><Mail size={18} /></a>
        </div>
      </nav>
    </motion.header>
  )
}

export function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-3">
      <a className="focus-ring glass inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-white/80 transition-all hover:-translate-y-0.5 hover:text-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]" href={site.github} target="_blank" rel="noreferrer"><GitBranch size={16} /> GitHub</a>
      <a className="focus-ring glass inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-white/80 transition-all hover:-translate-y-0.5 hover:text-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]" href={site.instagram} target="_blank" rel="noreferrer"><AtSign size={16} /> Instagram</a>
      <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-white/80"><Music2 size={16} /> TikTok: {site.tiktok}</span>
      <a className="focus-ring glass inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-white/80 transition-all hover:-translate-y-0.5 hover:text-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]" href={`mailto:${site.email}`}><Mail size={16} /> Email</a>
    </div>
  )
}

export function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} className="mb-10 max-w-3xl">
      <motion.p
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/70"
      >
        <Sparkles size={14} /> {eyebrow}
      </motion.p>
      <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-6xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-white/58">{text}</p>
    </motion.div>
  )
}
