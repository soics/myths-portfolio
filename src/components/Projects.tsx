import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { BookOpen, Code2, ExternalLink, GitBranch, Loader2, Star } from 'lucide-react'
import { getGitHubData, type GitHubProfile, type GitHubRepo } from '../lib/github'
import { projectNotes } from '../data/site'


/* ------------------------------------------------------------------ */
/*  Language colour maps                                               */
/* ------------------------------------------------------------------ */
const langColors: Record<string, string> = {
  TypeScript: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
  JavaScript: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/25',
  Python: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  HTML: 'bg-orange-500/10 text-orange-300 border-orange-500/25',
  CSS: 'bg-sky-500/10 text-sky-300 border-sky-500/25',
  Lua: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
  Shell: 'bg-green-500/10 text-green-300 border-green-500/25',
}

const langGradients: Record<string, string> = {
  TypeScript: 'from-blue-500/12 via-blue-500/5 to-transparent',
  JavaScript: 'from-yellow-500/12 via-yellow-500/5 to-transparent',
  Python: 'from-emerald-500/12 via-emerald-500/5 to-transparent',
  HTML: 'from-orange-500/12 via-orange-500/5 to-transparent',
  CSS: 'from-sky-500/12 via-sky-500/5 to-transparent',
  Lua: 'from-blue-500/12 via-blue-500/5 to-transparent',
  Shell: 'from-green-500/12 via-green-500/5 to-transparent',
}

const langBars: Record<string, string> = {
  TypeScript: 'from-blue-400 to-blue-600/70',
  JavaScript: 'from-yellow-400 to-yellow-600/70',
  Python: 'from-emerald-400 to-emerald-600/70',
  HTML: 'from-orange-400 to-orange-600/70',
  CSS: 'from-sky-400 to-sky-600/70',
  Lua: 'from-blue-400 to-blue-600/70',
  Shell: 'from-green-400 to-green-600/70',
}

const langBorders: Record<string, string> = {
  TypeScript: 'border-blue-500/10 hover:border-blue-500/20',
  JavaScript: 'border-yellow-500/10 hover:border-yellow-500/20',
  Python: 'border-emerald-500/10 hover:border-emerald-500/20',
  HTML: 'border-orange-500/10 hover:border-orange-500/20',
  CSS: 'border-sky-500/10 hover:border-sky-500/20',
  Lua: 'border-blue-500/10 hover:border-blue-500/20',
  Shell: 'border-green-500/10 hover:border-green-500/20',
}

function color(lang: string | null, map: Record<string, string>): string {
  return map[lang || ''] || Object.values(map)[0]
}

/* ------------------------------------------------------------------ */
/*  FeaturedCard — product showcase for pinned repo                   */
/* ------------------------------------------------------------------ */
function FeaturedCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.a
      ref={ref}
      initial={{ opacity: 0, y: 80, scale: 0.88 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.12, type: 'spring', stiffness: 50, damping: 22 }}
      whileHover={{ y: -8, scale: 1.002 }}
      className="focus-ring group relative block overflow-hidden rounded-[20px] transition-all duration-500 hover:shadow-[0_32px_100px_rgba(0,0,0,0.6)]"
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
    >
      {/* Gradient backdrop */}
      <div className={`absolute inset-0 bg-gradient-to-b opacity-60 ${color(repo.language, langGradients)}`} />

      {/* Colour bar */}
      <div className={`absolute left-0 right-0 top-0 h-[5px] bg-gradient-to-r ${color(repo.language, langBars)}`} />

      <div className="glass-lift relative z-10 p-8 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06]">
                <Code2 className="text-blue-200/40" size={17} />
              </div>
              <span className="text-xs text-white/40 font-mono">Featured</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white/95 md:text-3xl">{repo.name}</h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-white/65">{repo.description || 'A public repository.'}</p>

            {projectNotes[repo.name] && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-white/[0.04] px-4 py-3">
                <BookOpen size={13} className="mt-0.5 shrink-0 text-accent-dim/60" />
                <p className="text-[13px] leading-[1.6] text-white/50">{projectNotes[repo.name]}</p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {repo.language && (
                <span className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-[11px] font-medium ${color(repo.language, langColors)}`}>
                  {repo.language}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs text-white/45"><Star size={11} /> {repo.stargazers_count}</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/45"><GitBranch size={11} /> {repo.forks_count}</span>
              <span className="text-xs text-white/35">{new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 4, opacity: 1 }}
            className="hidden shrink-0 md:block"
          >
            <ExternalLink className="text-white/25 transition-all group-hover:text-white/60" size={18} />
          </motion.div>
        </div>
      </div>
    </motion.a>
  )
}

/* ------------------------------------------------------------------ */
/*  RepoCard — standard grid card                                     */
/* ------------------------------------------------------------------ */
function RepoCard({ repo, inView, index }: { repo: GitHubRepo; inView: boolean; index: number }) {
  return (
    <motion.a
      initial={{ opacity: 0, y: 50, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.1 + index * 0.08, type: 'spring', stiffness: 80, damping: 22 }}
      whileHover={{ y: -12, scale: 1.015 }}
      className={`focus-ring group relative block overflow-hidden rounded-[18px] border p-6 transition-all duration-400 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${color(repo.language, langBorders)}`}
      style={{ borderWidth: 1 }}
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
    >
      {/* Hover gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${color(repo.language, langGradients)}`} />
      <div className={`absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r opacity-40 ${color(repo.language, langBars)}`} />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
            <Code2 className="text-blue-200/35" size={16} />
          </div>
          <ExternalLink className="text-white/20 transition-all group-hover:text-white/55" size={15} />
        </div>
        <h3 className="text-lg font-semibold tracking-[-0.03em] text-white/90">{repo.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-[1.7] text-white/60">{repo.description || 'A public repository.'}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          {repo.language && (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${color(repo.language, langColors)}`}>
              {repo.language}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-white/45"><Star size={11} /> {repo.stargazers_count}</span>
          )}
          {repo.forks_count > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-white/45"><GitBranch size={11} /> {repo.forks_count}</span>
          )}
          <span className="ml-auto text-xs text-white/30">{new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </motion.a>
  )
}

/* ------------------------------------------------------------------ */
/*  EmptyProjects — intentional empty state                           */
/* ------------------------------------------------------------------ */
function EmptyProjects({ profile, inView }: { profile: GitHubProfile | null; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 70, damping: 22 }}
      className="glass-lift relative overflow-hidden rounded-[20px] p-14 text-center md:p-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.04),transparent_70%)]" />
      <div className="relative z-10">
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, -2, 2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]"
        >
          <Code2 className="text-blue-200/35" size={30} />
        </motion.div>
        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white/90">More code, less noise</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-[1.7] text-white/60">This section fills automatically from GitHub as new repositories are created. The canvas is ready — work in progress.</p>
        <p className="mt-5 text-xs text-white/35">Public repos: {profile?.public_repos ?? 0}</p>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                       */
/* ------------------------------------------------------------------ */

type GitHubState = { profile: GitHubProfile | null; repos: GitHubRepo[]; loading: boolean; error: string | null }

export function ProjectsSection() {
  const [state, setState] = useState<GitHubState>({ profile: null, repos: [], loading: true, error: null })
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    getGitHubData()
      .then((data) => setState({ ...data, loading: false, error: null }))
      .catch((err: Error) => setState({ profile: null, repos: [], loading: false, error: err.message }))
  }, [])

  return (
    <section id="projects" className="px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">
            {state.repos.length > 0 ? 'Live from GitHub.' : 'Loaded from GitHub.'}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">Public repositories pulled in real time. This section grows with every push.</p>
        </motion.div>

        {state.loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-sm flex items-center gap-3 rounded-[18px] p-6 text-sm text-white/55">
            <Loader2 className="animate-spin text-blue-300/30" size={16} />
            Loading GitHub repositories&hellip;
          </motion.div>
        )}

        {state.error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-sm rounded-[18px] p-6 text-sm text-white/50">
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
