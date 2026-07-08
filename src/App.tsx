import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Code2, ExternalLink, GitBranch, Loader2, Send, ShieldCheck, Star } from 'lucide-react'
import { chapters, learningSkills, site, strengths } from './data/site'
import { getGitHubData, type GitHubProfile, type GitHubRepo } from './lib/github'
import { supabase } from './lib/supabase'
import { Header, SectionTitle, SocialLinks } from './components/Primitives'
import './styles/globals.css'

type GitHubState = { profile: GitHubProfile | null; repos: GitHubRepo[]; loading: boolean; error: string | null }

type FormState = 'idle' | 'loading' | 'success' | 'error'

function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.08, 1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
    </div>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 120])

  return (
    <section id="top" className="relative flex min-h-screen items-center px-5 pt-28">
      <motion.div style={{ y }} className="mx-auto grid max-w-6xl gap-10 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-5 text-sm uppercase tracking-[0.45em] text-white/45">Richard Germain</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.8 }} className="text-balance text-7xl font-black tracking-[-0.1em] text-white sm:text-8xl md:text-9xl">{site.name}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-6 max-w-2xl text-xl leading-8 text-white/64 md:text-2xl">{site.title}. {site.phrases[0]}</motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-10 flex flex-wrap gap-4">
            <a className="focus-ring group inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 font-semibold text-black transition hover:scale-[1.02]" href="#journey">View the journey <ArrowRight className="transition group-hover:translate-x-1" size={18} /></a>
            <a className="focus-ring glass inline-flex items-center gap-3 rounded-full px-6 py-4 font-semibold text-white/85 transition hover:text-white" href={site.github} target="_blank" rel="noreferrer"><GitBranch size={18} /> GitHub</a>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-white/35">Status</p>
          <p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-white">I am not finished. I am building.</p>
          <div className="mt-8 grid gap-3 text-sm text-white/60">
            {['Learning full-stack development', 'Writing scripts and experiments', 'Building a foundation publicly'].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"><span className="h-2 w-2 rounded-full bg-blue-300" />{item}</div>)}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="About" title="A beginner, but not casual." text="I am learning full-stack development and scripting with a focus on steady growth, practical projects, and becoming useful enough to build real things." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {strengths.slice(0, 8).map((strength) => <motion.div key={strength} whileHover={{ y: -6 }} className="glass rounded-3xl p-5 text-white/75"><Star className="mb-6 text-blue-200/70" size={18} />{strength}</motion.div>)}
        </div>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="Skills" title="Learning the stack without pretending mastery." text="No fake percentages. Just the tools I am actively learning and the personal strengths I am building around them." />
        <div className="grid gap-6 lg:grid-cols-2">
          <SkillPanel title="Learning" items={learningSkills} />
          <SkillPanel title="Personal strengths" items={strengths} />
        </div>
      </div>
    </section>
  )
}

function SkillPanel({ title, items }: { title: string; items: string[] }) {
  return <div className="glass rounded-[2rem] p-6"><h3 className="mb-5 text-2xl font-semibold tracking-[-0.04em]">{title}</h3><div className="flex flex-wrap gap-3">{items.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">{item}</span>)}</div></div>
}

function Projects() {
  const [state, setState] = useState<GitHubState>({ profile: null, repos: [], loading: true, error: null })

  useEffect(() => {
    getGitHubData().then((data) => setState({ ...data, loading: false, error: null })).catch((error: Error) => setState({ profile: null, repos: [], loading: false, error: error.message }))
  }, [])

  return (
    <section id="projects" className="px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="Projects" title="Projects loading. Foundation first." text="GitHub updates automatically. When new repositories are created, this section grows with the journey." />
        {state.loading && <div className="glass rounded-[2rem] p-8 text-white/60"><Loader2 className="mb-4 animate-spin" /> Loading GitHub activity...</div>}
        {state.error && <div className="glass rounded-[2rem] p-8 text-white/60">GitHub is unavailable right now. The journey still continues.</div>}
        {!state.loading && !state.error && state.repos.length === 0 && <EmptyProjects profile={state.profile} />}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {state.repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
        </div>
      </div>
    </section>
  )
}

function EmptyProjects({ profile }: { profile: GitHubProfile | null }) {
  return <div className="glass rounded-[2rem] p-8"><Code2 className="mb-6 text-blue-200/70" /><h3 className="text-3xl font-semibold tracking-[-0.05em]">Building my first projects...</h3><p className="mt-4 max-w-2xl text-white/58">Currently building my foundation. This empty state is temporary by design. Repositories will appear here automatically from GitHub.</p><p className="mt-6 text-sm text-white/35">Public repos: {profile?.public_repos ?? 0}</p></div>
}

function RepoCard({ repo }: { repo: GitHubRepo }) {
  return <motion.a whileHover={{ y: -8 }} className="focus-ring glass block rounded-[2rem] p-6" href={repo.html_url} target="_blank" rel="noreferrer"><div className="mb-10 flex items-center justify-between"><Code2 className="text-blue-200/70" /><ExternalLink className="text-white/35" size={18} /></div><h3 className="text-2xl font-semibold tracking-[-0.05em]">{repo.name}</h3><p className="mt-3 min-h-14 text-sm leading-6 text-white/55">{repo.description || 'A public repository from the building phase.'}</p><div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/35"><span>{repo.language || 'Code'}</span><span>{new Date(repo.updated_at).getFullYear()}</span></div></motion.a>
}

function Journey() {
  return (
    <section id="journey" className="px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="Journey" title="A timeline for becoming." text="The path is intentionally simple: learn, build, connect the pieces, repeat." />
        <div className="grid gap-5">
          {chapters.map((chapter) => <motion.article key={chapter.number} whileHover={{ x: 8 }} className="glass grid gap-5 rounded-[2rem] p-6 md:grid-cols-[140px_1fr]"><span className="text-5xl font-black tracking-[-0.08em] text-white/18">{chapter.number}</span><div><h3 className="text-2xl font-semibold tracking-[-0.04em]">{chapter.title}</h3><p className="mt-3 text-white/58">{chapter.text}</p></div></motion.article>)}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [status, setStatus] = useState<FormState>('idle')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (String(form.get('company') || '').trim()) return
    const payload = {
      name: String(form.get('name') || '').trim().slice(0, 80),
      email: String(form.get('email') || '').trim().slice(0, 120),
      message: String(form.get('message') || '').trim().slice(0, 2000),
    }
    if (!payload.name || !payload.email.includes('@') || payload.message.length < 10) {
      setStatus('error')
      return
    }
    if (!supabase) {
      window.location.href = `mailto:${site.email}?subject=Portfolio contact from ${encodeURIComponent(payload.name)}&body=${encodeURIComponent(payload.message)}`
      return
    }
    setStatus('loading')
    const { error } = await supabase.from('contact_messages').insert(payload)
    setStatus(error ? 'error' : 'success')
    if (!error) event.currentTarget.reset()
  }

  return (
    <section id="contact" className="px-5 py-24">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div><SectionTitle eyebrow="Contact" title="Say something real." text="Open to advice, feedback, beginner-friendly opportunities, collaborations, and people who care about building." /><SocialLinks /></div>
        <form onSubmit={submit} className="glass rounded-[2rem] p-6" aria-label="Contact form">
          <input className="hidden" name="company" tabIndex={-1} autoComplete="off" />
          <label className="mb-4 block text-sm text-white/60">Name<input required minLength={2} maxLength={80} name="name" className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white" /></label>
          <label className="mb-4 block text-sm text-white/60">Email<input required type="email" maxLength={120} name="email" className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white" /></label>
          <label className="mb-5 block text-sm text-white/60">Message<textarea required minLength={10} maxLength={2000} name="message" rows={6} className="focus-ring mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white" /></label>
          <button disabled={status === 'loading'} className="focus-ring inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 font-semibold text-black transition hover:scale-[1.01] disabled:opacity-60" type="submit">{status === 'loading' ? <Loader2 className="animate-spin" /> : <Send size={18} />} Send message</button>
          {status === 'success' && <p className="mt-4 flex items-center gap-2 text-sm text-green-200"><ShieldCheck size={16} /> Message stored securely.</p>}
          {status === 'error' && <p className="mt-4 text-sm text-red-200">Check the form and try again.</p>}
        </form>
      </div>
    </section>
  )
}

function App() {
  return (
    <>
      <AnimatedBackground />
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <footer className="px-5 py-10 text-center text-sm text-white/35">© {new Date().getFullYear()} myths. Built, not finished.</footer>
    </>
  )
}

export default App
