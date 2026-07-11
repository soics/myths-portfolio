import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { Code2, ExternalLink, GitBranch, Loader2, Star, Satellite } from 'lucide-react'
import { getGitHubData, type GitHubProfile, type GitHubRepo } from '../lib/github'
import { projectNotes } from '../data/site'

const langColors: Record<string, string> = {
  TypeScript: 'border-cyan/20 hover:border-cyan/40',
  JavaScript: 'border-amber/20 hover:border-amber/40',
  Python: 'border-emerald/20 hover:border-emerald/40',
  HTML: 'border-orange/20 hover:border-orange/40',
  CSS: 'border-sky/20 hover:border-sky/40',
  Lua: 'border-blue/20 hover:border-blue/40',
  Shell: 'border-green/20 hover:border-green/40',
}

const langAccents: Record<string, string> = {
  TypeScript: 'from-cyan/30 via-cyan/10 to-transparent',
  JavaScript: 'from-amber/30 via-amber/10 to-transparent',
  Python: 'from-emerald/30 via-emerald/10 to-transparent',
  HTML: 'from-orange/30 via-orange/10 to-transparent',
  CSS: 'from-sky/30 via-sky/10 to-transparent',
  Lua: 'from-blue/30 via-blue/10 to-transparent',
  Shell: 'from-green/30 via-green/10 to-transparent',
}

const langBars: Record<string, string> = {
  TypeScript: 'from-cyan to-cyan/50',
  JavaScript: 'from-amber to-amber/50',
  Python: 'from-emerald to-emerald/50',
  HTML: 'from-orange to-orange/50',
  CSS: 'from-sky to-sky/50',
  Lua: 'from-blue to-blue/50',
  Shell: 'from-green to-green/50',
}

function colorStr(lang: string | null, map: Record<string, string>): string {
  return map[lang || ''] || 'from-cyan/20 via-cyan/10 to-transparent'
}

function borderStr(lang: string | null): string {
  return langColors[lang || ''] || 'border-cyan/10 hover:border-cyan/20'
}

function barStr(lang: string | null): string {
  return langBars[lang || ''] || 'from-cyan to-cyan/50'
}

function FeaturedRepo({ repo, index }: { repo: GitHubRepo; index: number }) {
  return (
          <LiquidGlass variant="panel" tilt={4} className="!rounded-[20px] !overflow-hidden">
            <motion.a
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: index * 0.12, type: 'spring', stiffness: 50, damping: 20 }}
              whileHover={{ y: -6, scale: 1.002 }}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="focus-ring group relative block overflow-hidden transition-all duration-500 hover:shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
            >
              <div className={`absolute inset-0 bg-gradient-to-b opacity-40 ${colorStr(repo.language, langAccents)}`} />
              <div className={`absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r ${barStr(repo.language)}`} />

              <div className="glass-lift relative p-8 md:p-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                        <Satellite size={15} className="text-cyan/40" />
                      </div>
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em]">
                        DISCOVERY_{String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white/90 md:text-3xl">{repo.name}</h3>
                    <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-white/60">{repo.description || 'A public repository.'}</p>

                    {projectNotes[repo.name] && (
                      <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-white/5 px-4 py-3 border border-white/5">
                        <Code2 size={13} className="mt-0.5 shrink-0 text-cyan/40" />
                        <div>
                          <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/30">Field Notes</span>
                          <p className="mt-1 text-[13px] leading-[1.6] text-white/45">{projectNotes[repo.name]}</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      {repo.language && (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/60">
                          <span className="h-1.5 w-1.5 rounded-sm bg-current opacity-60" />
                          {repo.language}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-white/40"><Star size={11} /> {repo.stargazers_count}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-white/40"><GitBranch size={11} /> {repo.forks_count}</span>
                      <span className="text-xs text-white/25">{new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 4, opacity: 1 }}
                    className="hidden shrink-0 md:block"
                  >
                    <ExternalLink className="text-white/20 transition-all group-hover:text-white/50" size={18} />
                  </motion.div>
                </div>
              </div>
            </motion.a>
          </LiquidGlass>
  )
}

function RepoCard({ repo, inView, index }: { repo: GitHubRepo; inView: boolean; index: number }) {
  return (
    <motion.a
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.1 + index * 0.06, type: 'spring', stiffness: 80, damping: 20 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className={`focus-ring group relative block overflow-hidden rounded-[16px] border p-6 transition-all duration-400 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${borderStr(repo.language)}`}
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
    >
      <div className={`absolute inset-0 bg-gradient-to-b opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${colorStr(repo.language, langAccents)}`} />
      <div className={`absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r opacity-30 ${barStr(repo.language)}`} />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
            <Code2 className="text-white/40" size={15} />
          </div>
          <ExternalLink className="text-white/15 transition-all group-hover:text-white/45" size={14} />
        </div>
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-white/85">{repo.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-[1.7] text-white/55">{repo.description || 'A public repository.'}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          {repo.language && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/55">
              <span className="h-1.5 w-1.5 rounded-sm bg-current opacity-60" />
              {repo.language}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-white/35"><Star size={11} /> {repo.stargazers_count}</span>
          )}
          {repo.forks_count > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-white/35"><GitBranch size={11} /> {repo.forks_count}</span>
          )}
          <span className="ml-auto text-xs text-white/25">{new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </motion.a>
  )
}

function EmptyProjects({ profile, inView }: { profile: GitHubProfile | null; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 70, damping: 20 }}
      className="glass-lift relative overflow-hidden rounded-[20px] p-14 text-center md:p-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,212,220,0.03),transparent_70%)]" />
      <div className="relative z-10">
        <motion.div
          animate={{ rotate: [0, -3, 3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center"
        >
          <Satellite size={32} className="text-cyan/30" />
        </motion.div>
        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white/85">No signals detected</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-[1.7] text-white/55">Repositories will appear here as they are discovered. The receiver is listening.</p>
        <p className="mt-5 text-xs text-white/30">Public repos: {profile?.public_repos ?? 0}</p>
      </div>
    </motion.div>
  )
}

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
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Satellite size={14} className="text-cyan/50" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan/40">DISCOVERIES</span>
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
            {state.repos.length > 0 ? 'Live from the network.' : 'Scanning the network.'}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">Public repositories pulled in real time. Every push adds to the constellation.</p>
        </motion.div>

        {state.loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-sm flex items-center gap-3 rounded-[18px] p-6 text-sm text-white/50">
            <Loader2 className="animate-spin text-cyan/30" size={16} />
            Scanning GitHub...
          </motion.div>
        )}

        {state.error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-sm rounded-[18px] p-6 text-sm text-white/45">
            Connection interrupted. Retrying...
          </motion.div>
        )}

        {!state.loading && !state.error && state.repos.length === 0 && <EmptyProjects profile={state.profile} inView={inView} />}

        {!state.loading && !state.error && state.repos.length > 0 && (
          <div className="space-y-6">
            <FeaturedRepo repo={state.repos[0]} index={0} />
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
