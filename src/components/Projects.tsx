import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { Code2, ExternalLink, GitBranch, Loader2, Star } from 'lucide-react'
import { getGitHubData, type GitHubProfile, type GitHubRepo } from '../lib/github'

type GitHubState = { profile: GitHubProfile | null; repos: GitHubRepo[]; loading: boolean; error: string | null }

const langColors: Record<string, string> = {
  TypeScript: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
  JavaScript: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/25',
  Python: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  HTML: 'bg-orange-500/10 text-orange-300 border-orange-500/25',
  CSS: 'bg-sky-500/10 text-sky-300 border-sky-500/25',
  Lua: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
  Shell: 'bg-green-500/10 text-green-300 border-green-500/25',
}

const langGlows: Record<string, string> = {
  TypeScript: 'shadow-blue-500/10', JavaScript: 'shadow-yellow-500/10',
  Python: 'shadow-emerald-500/10', HTML: 'shadow-orange-500/10',
  CSS: 'shadow-sky-500/10', Lua: 'shadow-blue-500/10', Shell: 'shadow-green-500/10',
}

function langStyle(lang: string | null): string {
  return langColors[lang || ''] || 'bg-white/[0.04] text-white/50 border-white/10'
}

function langGlow(lang: string | null): string {
  return langGlows[lang || ''] || 'shadow-white/5'
}

function FeaturedCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.a
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, type: 'spring' as const, stiffness: 100, damping: 25 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className={`focus-ring glass-xl relative block overflow-hidden rounded-[2rem] p-8 transition-all duration-500 hover:shadow-[0_24px_80px_rgba(0,0,0,0.5)] ${langGlow(repo.language)}`}
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
    >
      <div className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${repo.language === 'TypeScript' ? 'from-blue-400 to-blue-600' : repo.language === 'JavaScript' ? 'from-yellow-400 to-yellow-600' : repo.language === 'Python' ? 'from-emerald-400 to-emerald-600' : repo.language === 'HTML' ? 'from-orange-400 to-orange-600' : repo.language === 'CSS' ? 'from-sky-400 to-sky-600' : 'from-white/30 to-white/10'}`} />
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-3xl font-semibold tracking-[-0.05em] text-white">{repo.name}</h3>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/55">{repo.description || 'A public repository from the building phase.'}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {repo.language && (
              <span className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium ${langStyle(repo.language)}`}>
                {repo.language}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs text-white/35"><Star size={12} /> {repo.stargazers_count}</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/35"><GitBranch size={12} /> {repo.forks_count}</span>
            <span className="text-xs text-white/25">{new Date(repo.updated_at).getFullYear()}</span>
          </div>
        </div>
        <ExternalLink className="mt-2 shrink-0 text-white/25 transition group-hover:text-white" size={18} />
      </div>
    </motion.a>
  )
}

function RepoCard({ repo, inView, index }: { repo: GitHubRepo; inView: boolean; index: number }) {
  return (
    <motion.a
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, type: 'spring' as const, stiffness: 100, damping: 25 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="focus-ring glass relative block overflow-hidden rounded-[2rem] p-6 transition-all duration-400 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
    >
      <div className={`absolute left-0 right-0 top-0 h-[2px] ${repo.language === 'TypeScript' ? 'bg-blue-400' : repo.language === 'JavaScript' ? 'bg-yellow-400' : repo.language === 'Python' ? 'bg-emerald-400' : repo.language === 'HTML' ? 'bg-orange-400' : repo.language === 'CSS' ? 'bg-sky-400' : 'bg-white/10'}`} />
      <div className="mb-6 flex items-center justify-between">
        <div className="rounded-xl bg-white/[0.04] p-2.5">
          <Code2 className="text-blue-200/50" size={20} />
        </div>
        <ExternalLink className="text-white/20 transition group-hover:text-white" size={16} />
      </div>
      <h3 className="text-xl font-semibold tracking-[-0.04em]">{repo.name}</h3>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/50">{repo.description || 'A public repository from the building phase.'}</p>
      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        {repo.language && (
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${langStyle(repo.language)}`}>
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs text-white/35"><Star size={12} /> {repo.stargazers_count}</span>
        )}
        {repo.forks_count > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs text-white/35"><GitBranch size={12} /> {repo.forks_count}</span>
        )}
        <span className="ml-auto text-xs text-white/25">{new Date(repo.updated_at).getFullYear()}</span>
      </div>
    </motion.a>
  )
}

function EmptyProjects({ profile, inView }: { profile: GitHubProfile | null; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring' as const, stiffness: 100, damping: 25 }}
      className="glass-xl rounded-[2rem] p-10 text-center"
    >
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        <Code2 className="mx-auto mb-6 text-blue-200/50" size={32} />
      </motion.div>
      <h3 className="text-3xl font-semibold tracking-[-0.05em]">Building my first projects...</h3>
      <p className="mx-auto mt-4 max-w-xl text-white/55">Currently building my foundation. This empty state is temporary by design. Repositories will appear here automatically from GitHub.</p>
      <p className="mt-6 text-sm text-white/30">Public repos: {profile?.public_repos ?? 0}</p>
    </motion.div>
  )
}

export function ProjectsSection() {
  const [state, setState] = useState<GitHubState>({ profile: null, repos: [], loading: true, error: null })
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    getGitHubData()
      .then((data) => setState({ ...data, loading: false, error: null }))
      .catch((error: Error) => setState({ profile: null, repos: [], loading: false, error: error.message }))
  }, [])

  return (
    <section id="projects" className="px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12"
        >
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/60"
          >
            Projects
          </motion.p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">Projects loading. Foundation first.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">GitHub updates automatically. When new repositories are created, this section grows with the journey.</p>
        </motion.div>

        {state.loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[2rem] p-8 text-white/55">
            <Loader2 className="mb-4 animate-spin" /> Loading GitHub activity...
          </motion.div>
        )}

        {state.error && (
          <div className="glass rounded-[2rem] p-8 text-white/55">GitHub is unavailable right now. The journey still continues.</div>
        )}

        {!state.loading && !state.error && state.repos.length === 0 && <EmptyProjects profile={state.profile} inView={inView} />}

        {!state.loading && !state.error && state.repos.length > 0 && (
          <>
            <div className="mb-6">
              <FeaturedCard repo={state.repos[0]} index={0} />
            </div>
            {state.repos.length > 1 && (
              <motion.div ref={ref} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {state.repos.slice(1).map((repo, i) => (
                  <RepoCard key={repo.id} repo={repo} inView={inView} index={i} />
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
