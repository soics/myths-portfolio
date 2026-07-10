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

const langGradients: Record<string, string> = {
  TypeScript: 'from-blue-500/10 via-blue-500/5 to-transparent',
  JavaScript: 'from-yellow-500/10 via-yellow-500/5 to-transparent',
  Python: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
  HTML: 'from-orange-500/10 via-orange-500/5 to-transparent',
  CSS: 'from-sky-500/10 via-sky-500/5 to-transparent',
  Lua: 'from-blue-500/10 via-blue-500/5 to-transparent',
  Shell: 'from-green-500/10 via-green-500/5 to-transparent',
}

const langGradientBars: Record<string, string> = {
  TypeScript: 'from-blue-400 to-blue-600/80',
  JavaScript: 'from-yellow-400 to-yellow-600/80',
  Python: 'from-emerald-400 to-emerald-600/80',
  HTML: 'from-orange-400 to-orange-600/80',
  CSS: 'from-sky-400 to-sky-600/80',
  Lua: 'from-blue-400 to-blue-600/80',
  Shell: 'from-green-400 to-green-600/80',
}

function langStyle(lang: string | null): string {
  return langColors[lang || ''] || 'bg-white/[0.04] text-white/50 border-white/10'
}

function langGlow(lang: string | null): string {
  return langGlows[lang || ''] || 'shadow-white/5'
}

function langGradient(lang: string | null): string {
  return langGradients[lang || ''] || 'from-white/[0.03] via-transparent to-transparent'
}

function langBar(lang: string | null): string {
  return langGradientBars[lang || ''] || 'from-white/30 to-white/10'
}

function FeaturedCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.a
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.1, type: 'spring' as const, stiffness: 80, damping: 22 }}
      whileHover={{ y: -10, scale: 1.005 }}
      className={`focus-ring glass-xl group relative block overflow-hidden rounded-[24px] p-10 transition-all duration-500 hover:shadow-[0_32px_100px_rgba(0,0,0,0.6)] ${langGlow(repo.language)}`}
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
    >
      <div className="absolute inset-0 bg-gradient-to-b opacity-60" style={{ backgroundImage: `linear-gradient(to bottom, ${langGradient(repo.language)})` }} />
      <div className={`absolute left-0 right-0 top-0 h-[6px] bg-gradient-to-r ${langBar(repo.language)}`} />
      <div className="relative z-10 flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
              <Code2 className="text-blue-200/50" size={18} />
            </div>
          </div>
          <h3 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-white/95">{repo.name}</h3>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-white/50">{repo.description || 'A public repository from the building phase.'}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {repo.language && (
              <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium ${langStyle(repo.language)}`}>
                {repo.language}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs text-white/35"><Star size={12} /> {repo.stargazers_count}</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/35"><GitBranch size={12} /> {repo.forks_count}</span>
            <span className="text-xs text-white/20">{new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
        <motion.div
          initial={{ x: 0 }}
          whileHover={{ x: 4, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-1 shrink-0"
        >
          <ExternalLink className="text-white/20 transition-all group-hover:text-white/60" size={20} />
        </motion.div>
      </div>
    </motion.a>
  )
}

function RepoCard({ repo, inView, index }: { repo: GitHubRepo; inView: boolean; index: number }) {
  return (
    <motion.a
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.06, type: 'spring' as const, stiffness: 120, damping: 24 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className={`focus-ring group relative block overflow-hidden rounded-[20px] p-6 transition-all duration-400 hover:border-white/15 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${repo.language === 'TypeScript' ? 'border-blue-500/10' : repo.language === 'JavaScript' ? 'border-yellow-500/10' : repo.language === 'Python' ? 'border-emerald-500/10' : repo.language === 'HTML' ? 'border-orange-500/10' : repo.language === 'CSS' ? 'border-sky-500/10' : 'border-white/5'} border`}
      style={{ borderWidth: 1 }}
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
    >
      <div className={`absolute inset-0 bg-gradient-to-b opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${langGradient(repo.language)}`} />
      <div className={`absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r opacity-60 ${langBar(repo.language)}`} />
      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
            <Code2 className="text-blue-200/40" size={18} />
          </div>
          <ExternalLink className="text-white/15 transition-all group-hover:text-white/50" size={16} />
        </div>
        <h3 className="text-lg font-semibold tracking-[-0.03em] text-white/90">{repo.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.7] text-white/45">{repo.description || 'A public repository from the building phase.'}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
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
          <span className="ml-auto text-xs text-white/20">{new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </motion.a>
  )
}

function EmptyProjects({ profile, inView }: { profile: GitHubProfile | null; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ type: 'spring' as const, stiffness: 80, damping: 22 }}
      className="glass relative overflow-hidden rounded-[24px] p-16 text-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.04),transparent_70%)]" />
      <div className="relative z-10">
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, -2, 2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.04]"
        >
          <Code2 className="text-blue-200/40" size={36} />
        </motion.div>
        <h3 className="text-3xl font-semibold tracking-[-0.05em] text-white/95">Less code, more learning</h3>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-[1.7] text-white/50">This section will populate automatically from GitHub as new repositories are created. The empty state is intentional — the journey is still unfolding.</p>
        <p className="mt-6 text-sm text-white/25">Public repos: {profile?.public_repos ?? 0}</p>
      </div>
    </motion.div>
  )
}

export function ProjectsSection() {
  const [state, setState] = useState<GitHubState>({ profile: null, repos: [], loading: true, error: null })
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

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
            className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/60"
          >
            Projects
          </motion.p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">
            {state.repos.length > 0 ? 'Live from GitHub.' : 'Loaded from GitHub.'}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">Public repositories pulled in real time. This section grows with every push.</p>
        </motion.div>

        {state.loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass flex items-center gap-4 rounded-[20px] p-8 text-sm text-white/45">
            <Loader2 className="animate-spin text-blue-300/40" size={18} />
            Loading GitHub repositories...
          </motion.div>
        )}

        {state.error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[20px] p-8 text-sm text-white/40">
            Could not reach GitHub. Trying again later.
          </motion.div>
        )}

        {!state.loading && !state.error && state.repos.length === 0 && <EmptyProjects profile={state.profile} inView={inView} />}

        {!state.loading && !state.error && state.repos.length > 0 && (
          <div className="space-y-6">
            <FeaturedCard repo={state.repos[0]} index={0} />
            {state.repos.length > 1 && (
              <motion.div ref={ref} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {state.repos.slice(1).map((repo, i) => (
                  <RepoCard key={repo.id} repo={repo} inView={inView} index={i} />
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
