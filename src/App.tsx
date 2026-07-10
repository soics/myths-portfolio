import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react'
import { ArrowRight, BookOpen, ChevronDown, Code2, Compass, ExternalLink, GitBranch, Lightbulb, Loader2, MessageCircle, Puzzle, Search, Send, ShieldCheck, Star, Target, Users } from 'lucide-react'
import { chapters, learningSkills, site, strengths } from './data/site'
import { getGitHubData, type GitHubProfile, type GitHubRepo } from './lib/github'

import { Background } from './components/Background'
import { Header, SectionTitle, SocialLinks } from './components/Primitives'
import './styles/globals.css'

type GitHubState = { profile: GitHubProfile | null; repos: GitHubRepo[]; loading: boolean; error: string | null }
type FormState = 'idle' | 'loading' | 'success' | 'error'

const spring = { type: 'spring' as const, stiffness: 200, damping: 20 }
const softSpring = { type: 'spring' as const, stiffness: 100, damping: 25 }

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  return <motion.div style={{ scaleX }} className="fixed left-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-blue-300 to-blue-100" />
}

function MagneticAnchor({ children, className, ...props }: Omit<React.ComponentPropsWithoutRef<typeof motion.a>, 'ref'>) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.25,
      y: (e.clientY - rect.top - rect.height / 2) * 0.25,
    })
  }

  const handleLeave = () => setPos({ x: 0, y: 0 })

  return (
    <motion.a
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 18, mass: 0.5 }}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  )
}

function ScrollIndicator() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
      <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-[0.3em] text-white/25">Scroll</span>
        <ChevronDown size={14} className="text-white/25" />
      </motion.div>
    </motion.div>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 120])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const scale = useTransform(scrollY, [0, 500], [1, 0.92])

  return (
    <motion.section id="top" style={{ opacity, scale }} className="relative flex min-h-screen items-center px-5 pt-28">
      <motion.div style={{ y }} className="mx-auto grid max-w-6xl gap-10 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }} className="mb-5 text-sm uppercase tracking-[0.45em] text-white/45">{site.realName}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30, filter: 'blur(14px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }} className="text-balance text-7xl font-black tracking-[-0.1em] text-white sm:text-8xl md:text-9xl">{site.name}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 max-w-2xl text-xl leading-8 text-white/64 md:text-2xl">{site.title}</motion.p>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="mt-2 text-base text-white/40">{site.phrases[2]}</motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-10 flex flex-wrap gap-4">
            <MagneticAnchor className="focus-ring group inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 font-semibold text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]" href="#journey">View the journey <ArrowRight className="transition group-hover:translate-x-1" size={18} /></MagneticAnchor>
            <MagneticAnchor className="focus-ring glass inline-flex items-center gap-3 rounded-full px-6 py-4 font-semibold text-white/85 hover:text-white" href={site.github} target="_blank" rel="noreferrer"><GitBranch size={18} /> GitHub</MagneticAnchor>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...softSpring, delay: 0.35 }} className="glass rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-white/35">Status</p>
          <p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-white">I am not finished. I am building.</p>
          <div className="mt-8 grid gap-3 text-sm text-white/60">
            {['Learning full-stack development', 'Writing scripts and experiments', 'Building a foundation publicly'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.12 }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                <motion.span
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                  className="block h-2 w-2 rounded-full bg-blue-300 shrink-0"
                />{item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      <ScrollIndicator />
    </motion.section>
  )
}

const strengthIcon: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  Communication: MessageCircle,
  Teamwork: Users,
  Adaptability: Compass,
  'Creative thinking': Lightbulb,
  'Learning ability': BookOpen,
  'Problem solving': Puzzle,
  Curiosity: Search,
  Persistence: Target,
}

function TiltCard({ children, className, ...props }: Omit<React.ComponentPropsWithoutRef<typeof motion.div>, 'ref'>) {
  const ref = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setRotate({
      x: -((e.clientY - rect.top - rect.height / 2) / rect.height) * 10,
      y: ((e.clientX - rect.left - rect.width / 2) / rect.width) * 10,
    })
  }

  const handleLeave = () => setRotate({ x: 0, y: 0 })

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" className="px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="About" title="A beginner, but not casual." text="I am learning full-stack development and scripting with a focus on steady growth, practical projects, and becoming useful enough to build real things." />
        <motion.div ref={ref} className="group/grid grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {strengths.slice(0, 8).map((strength, i) => {
            const Icon = strengthIcon[strength]
            return (
              <TiltCard
                key={strength}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, ...softSpring }}
                className="glass rounded-3xl p-5 text-white/75 transition-all duration-300 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] [&:not(:hover)]:group-hover/grid:opacity-70"
              >
                <Icon className="mb-6 text-blue-200/70" size={18} style={{ transform: 'translateZ(24px)' }} />
                <span style={{ transform: 'translateZ(16px)' }} className="block">{strength}</span>
              </TiltCard>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function Skills() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="skills" className="px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="Skills" title="Learning the stack without pretending mastery." text="No fake percentages. Just the tools I am actively learning and the personal strengths I am building around them." />
        <motion.div ref={ref} className="grid gap-6 lg:grid-cols-2">
          <SkillPanel title="Learning" items={learningSkills} inView={inView} index={0} />
          <SkillPanel title="Personal strengths" items={strengths} inView={inView} index={1} />
        </motion.div>
      </div>
    </section>
  )
}

const tagAccents = [
  'hover:border-blue-200/30 hover:bg-blue-500/8',
  'hover:border-purple-200/30 hover:bg-purple-500/8',
  'hover:border-emerald-200/30 hover:bg-emerald-500/8',
  'hover:border-amber-200/30 hover:bg-amber-500/8',
  'hover:border-rose-200/30 hover:bg-rose-500/8',
  'hover:border-cyan-200/30 hover:bg-cyan-500/8',
  'hover:border-violet-200/30 hover:bg-violet-500/8',
  'hover:border-teal-200/30 hover:bg-teal-500/8',
  'hover:border-orange-200/30 hover:bg-orange-500/8',
]

function SkillTag({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.15,
      y: (e.clientY - rect.top - rect.height / 2) * 0.15,
    })
  }

  const handleLeave = () => setPos({ x: 0, y: 0 })

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={className}
    >
      {children}
    </motion.span>
  )
}

function SkillPanel({ title, items, inView, index }: { title: string; items: string[]; inView: boolean; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, ...softSpring }}
      className="glass rounded-[2rem] p-6"
    >
      <h3 className="mb-5 text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.15 + i * 0.05, ...softSpring }}
          >
            <SkillTag
              className={`rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 transition-all duration-300 ${
                tagAccents[i % tagAccents.length]
              }`}
            >
              {item}
            </SkillTag>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function ProjectsSection() {
  const [state, setState] = useState<GitHubState>({ profile: null, repos: [], loading: true, error: null })
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    getGitHubData().then((data) => setState({ ...data, loading: false, error: null })).catch((error: Error) => setState({ profile: null, repos: [], loading: false, error: error.message }))
  }, [])

  return (
    <section id="projects" className="px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="Projects" title="Projects loading. Foundation first." text="GitHub updates automatically. When new repositories are created, this section grows with the journey." />
        {state.loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[2rem] p-8 text-white/60">
            <Loader2 className="mb-4 animate-spin" /> Loading GitHub activity...
          </motion.div>
        )}
        {state.error && <div className="glass rounded-[2rem] p-8 text-white/60">GitHub is unavailable right now. The journey still continues.</div>}
        {!state.loading && !state.error && state.repos.length === 0 && <EmptyProjects profile={state.profile} inView={inView} />}
        <motion.div ref={ref} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {state.repos.map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} inView={inView} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const langColors: Record<string, string> = {
  TypeScript: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
  JavaScript: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/25',
  Python: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  HTML: 'bg-orange-500/10 text-orange-300 border-orange-500/25',
  CSS: 'bg-sky-500/10 text-sky-300 border-sky-500/25',
  Lua: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
  Shell: 'bg-green-500/10 text-green-300 border-green-500/25',
}

const langAccentBars: Record<string, string> = {
  TypeScript: 'bg-blue-400', JavaScript: 'bg-yellow-400', Python: 'bg-emerald-400',
  HTML: 'bg-orange-400', CSS: 'bg-sky-400', Lua: 'bg-blue-400', Shell: 'bg-green-400',
}

function langStyle(lang: string | null): string {
  return langColors[lang || ''] || 'bg-white/[0.04] text-white/50 border-white/10'
}

function langBar(lang: string | null): string {
  return langAccentBars[lang || ''] || 'bg-white/10'
}

function EmptyProjects({ profile, inView }: { profile: GitHubProfile | null; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={softSpring}
      className="glass rounded-[2rem] p-8"
    >
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        <Code2 className="mb-6 text-blue-200/60" size={28} />
      </motion.div>
      <h3 className="text-3xl font-semibold tracking-[-0.05em]">Building my first projects...</h3>
      <p className="mt-4 max-w-2xl text-white/58">Currently building my foundation. This empty state is temporary by design. Repositories will appear here automatically from GitHub.</p>
      <p className="mt-6 text-sm text-white/35">Public repos: {profile?.public_repos ?? 0}</p>
    </motion.div>
  )
}

function RepoCard({ repo, inView, index }: { repo: GitHubRepo; inView: boolean; index: number }) {
  return (
    <motion.a
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, ...softSpring }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="focus-ring glass relative block overflow-hidden rounded-[2rem] p-6 transition-all hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
    >
      <div className={`absolute left-0 right-0 top-0 h-[2px] ${langBar(repo.language)}`} />
      <div className="mb-8 flex items-center justify-between">
        <div className="rounded-xl bg-white/[0.04] p-2.5">
          <Code2 className="text-blue-200/60" size={20} />
        </div>
        <ExternalLink className="text-white/25 transition group-hover:text-white" size={16} />
      </div>
      <h3 className="text-2xl font-semibold tracking-[-0.05em]">{repo.name}</h3>
      <p className="mt-3 min-h-14 text-sm leading-6 text-white/55">{repo.description || 'A public repository from the building phase.'}</p>
      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        {repo.language && (
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${langStyle(repo.language)}`}>
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
            <Star size={12} /> {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
            <GitBranch size={12} /> {repo.forks_count}
          </span>
        )}
        <span className="ml-auto text-xs text-white/30">{new Date(repo.updated_at).getFullYear()}</span>
      </div>
    </motion.a>
  )
}

function Journey() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="journey" className="px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="Journey" title="A timeline for becoming." text="The path is intentionally simple: learn, build, connect the pieces, repeat." />
        <div ref={ref} className="relative grid gap-5 before:absolute before:left-[22px] before:top-12 before:h-[calc(100%-6rem)] before:w-px before:bg-gradient-to-b before:from-white/20 before:via-white/10 before:to-transparent">
          {chapters.map((chapter, i) => (
            <motion.article
              key={chapter.number}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15, ...softSpring }}
              whileHover={{ x: 12 }}
              className="glass relative grid gap-5 rounded-[2rem] p-6 transition-all hover:border-white/20 md:grid-cols-[140px_1fr]"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ delay: i * 0.15 + 0.1, type: 'spring', stiffness: 300 }}
                className="absolute left-3 top-6 hidden h-4 w-4 rounded-full border-2 border-blue-200/50 bg-blue-200/20 md:block"
              />
              <span className="text-5xl font-black tracking-[-0.08em] text-white/18 md:pl-8">{chapter.number}</span>
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.04em]">{chapter.title}</h3>
                <p className="mt-3 text-white/58">{chapter.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [status, setStatus] = useState<FormState>('idle')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const el = event.currentTarget
    const form = new FormData(el)
    if (String(form.get('website') || '').trim()) return
    const payload = {
      name: String(form.get('name') || '').trim().slice(0, 80),
      email: String(form.get('email') || '').trim().slice(0, 120),
      message: String(form.get('message') || '').trim().slice(0, 2000),
    }
    if (!payload.name || !payload.email.includes('@') || payload.message.length < 10) {
      setStatus('error')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        console.warn('Contact API error', res.status, text)
        throw new Error()
      }
      setStatus('success')
      el.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="px-5 py-24">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div><SectionTitle eyebrow="Contact" title="Say something real." text="Open to advice, feedback, beginner-friendly opportunities, collaborations, and people who care about building." /><SocialLinks /></div>
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={softSpring}
          onSubmit={submit}
          className="glass rounded-[2rem] p-6"
          aria-label="Contact form"
        >
          <input className="hidden" name="website" tabIndex={-1} autoComplete="off" />
          <label className="mb-4 block text-sm text-white/60">Name
            <input required minLength={2} maxLength={80} name="name" className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white transition focus:border-blue-200/40 focus:shadow-[0_0_20px_rgba(122,167,255,0.08)]" />
          </label>
          <label className="mb-4 block text-sm text-white/60">Email
            <input required type="email" maxLength={120} name="email" className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white transition focus:border-blue-200/40 focus:shadow-[0_0_20px_rgba(122,167,255,0.08)]" />
          </label>
          <label className="mb-5 block text-sm text-white/60">Message
            <textarea required minLength={10} maxLength={2000} name="message" rows={6} className="focus-ring mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white transition focus:border-blue-200/40 focus:shadow-[0_0_20px_rgba(122,167,255,0.08)]" />
          </label>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={status === 'loading'}
            className="focus-ring inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 font-semibold text-black transition hover:shadow-[0_0_30px_rgba(255,255,255,0.12)] disabled:opacity-60"
            type="submit"
          >
            {status === 'loading' ? <Loader2 className="animate-spin" /> : <Send size={18} />} Send message
          </motion.button>
          {status === 'success' && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-2 text-sm text-green-200"><ShieldCheck size={16} /> Message stored securely.</motion.p>}
          {status === 'error' && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm text-red-200">Check the form and try again.</motion.p>}
        </motion.form>
      </div>
    </section>
  )
}

function App() {
  return (
    <>
      <ScrollProgress />
      <Background />
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <ProjectsSection />
        <Journey />
        <Contact />
      </main>
      <footer className="px-5 py-10 text-center text-sm text-white/35">© {new Date().getFullYear()} myths. Built, not finished.</footer>
    </>
  )
}

export default App
