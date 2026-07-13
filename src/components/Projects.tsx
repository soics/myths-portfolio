import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { ExternalLink, GitBranch, Loader2, Star, Construction, Wrench } from 'lucide-react'
import { getGitHubData, type GitHubProfile, type GitHubRepo } from '../lib/github'
import { projectNotes } from '../data/site'
import { useTilt } from '../hooks/useTilt'
import { LiquidGlass } from './LiquidGlass'

const langMaterials: Record<string, { material: string; bar: string; accent: string }> = {
  TypeScript: { material: 'Steel', bar: 'from-blueprint to-blueprint/50', accent: 'from-blueprint/30 via-blueprint/10 to-transparent' },
  JavaScript: { material: 'Copper', bar: 'from-construction to-construction/50', accent: 'from-construction/30 via-construction/10 to-transparent' },
  Python: { material: 'Titanium', bar: 'from-hazard to-hazard/50', accent: 'from-hazard/30 via-hazard/10 to-transparent' },
  HTML: { material: 'Brick', bar: 'from-orange/60 to-orange/30', accent: 'from-orange/30 via-orange/10 to-transparent' },
  CSS: { material: 'Glass', bar: 'from-sky/60 to-sky/30', accent: 'from-sky/30 via-sky/10 to-transparent' },
  Lua: { material: 'Alloy', bar: 'from-blue/60 to-blue/30', accent: 'from-blue/30 via-blue/10 to-transparent' },
  Shell: { material: 'Cable', bar: 'from-green/60 to-green/30', accent: 'from-green/30 via-green/10 to-transparent' },
}

function materialFor(lang: string | null) {
  return langMaterials[lang || ''] || { material: 'Concrete', bar: 'from-blueprint/30 to-blueprint/15', accent: 'from-blueprint/20 via-blueprint/10 to-transparent' }
}

function FeaturedRepo({ repo, index }: { repo: GitHubRepo; index: number }) {
  const ref = useTilt<HTMLAnchorElement>(4)
  const mat = materialFor(repo.language)
  return (
    <LiquidGlass variant="panel" tilt={4} className="!rounded-[20px] !overflow-hidden">
      <motion.a
        ref={ref}
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ delay: index * 0.12, type: 'spring', stiffness: 50, damping: 20 }}
        whileHover={{ y: -6, scale: 1.002 }}
        href={repo.html_url}
        target="_blank"
        rel="noreferrer"
        className="focus-ring ui-tilt-soft group relative block overflow-hidden transition-all duration-500 hover:shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
      >
        <div className={`absolute inset-0 bg-gradient-to-b opacity-30 ${mat.accent}`} />
        <div className={`absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r ${mat.bar}`} />

        <div className="glass-lift relative p-8 md:p-10">
          {/* Blueprint measurement marks */}
          <div className="absolute left-0 top-0 bottom-0 w-3 opacity-10 measure-mark" />
          <div className="absolute bottom-0 left-0 right-0 h-3 opacity-10">
            <div className="h-full w-full" style={{ background: `repeating-linear-gradient(90deg, rgba(200,200,200,0.1) 0px, rgba(200,200,200,0.1) 2px, transparent 2px, transparent 20px)` }} />
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blueprint/10">
                  <Wrench size={15} className="text-blueprint/40" />
                </div>
                <span className="text-[10px] font-mono text-blueprint/30 uppercase tracking-[0.15em]">
                  BUILD_{String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-mono text-concrete-mid/30 border border-concrete-dark/30 rounded px-1 py-0.5">
                  {mat.material}
                </span>
              </div>
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white/90 md:text-3xl">{repo.name}</h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-concrete-light/60">{repo.description || 'A public repository.'}</p>

              {projectNotes[repo.name] && (
                <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-blueprint/5 px-4 py-3 border border-blueprint/10">
                  <Wrench size={13} className="mt-0.5 shrink-0 text-blueprint/40" />
                  <div>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-blueprint/30">Field Notes</span>
                    <p className="mt-1 text-[13px] leading-[1.6] text-concrete-light/45">{projectNotes[repo.name]}</p>
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {repo.language && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-concrete-light/60">
                    <span className="h-1.5 w-1.5 rounded-sm bg-current opacity-60" />
                    {repo.language}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-concrete-light/40"><Star size={11} /> {repo.stargazers_count}</span>
                <span className="inline-flex items-center gap-1 text-xs text-concrete-light/40"><GitBranch size={11} /> {repo.forks_count}</span>
                <span className="text-xs text-concrete-mid/25">{new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 4, opacity: 1 }}
              className="hidden shrink-0 md:block"
            >
              <ExternalLink className="text-concrete-light/20 transition-all group-hover:text-concrete-light/50" size={18} />
            </motion.div>
          </div>
        </div>
      </motion.a>
    </LiquidGlass>
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,200,200,0.03),transparent_70%)]" />
      <div className="relative z-10">
        <motion.div
          animate={{ rotate: [0, -3, 3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center"
        >
          <Construction size={36} className="text-construction/30" />
        </motion.div>
        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white/85">Site prepared. Foundation pending.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-[1.7] text-concrete-light/55">Projects will be framed here as they take shape. The build site is ready.</p>
        <p className="mt-5 text-xs text-concrete-mid/30">Public repos: {profile?.public_repos ?? 0}</p>
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
            <Construction size={14} className="text-construction/50" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-construction/40">BUILD.LIST</span>
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
            {state.repos.length > 0 ? 'Projects.' : 'Loading projects.'}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-concrete-light/60">Every push adds to the structure.</p>
        </motion.div>

        {state.loading && (
          <motion.div role="status" aria-live="polite" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-sm flex items-center gap-3 rounded-[18px] p-6 text-sm text-concrete-light/50">
            <Loader2 className="animate-spin text-blueprint/30" size={16} />
            <span>Measuring site...</span>
          </motion.div>
        )}

        {state.error && (
          <motion.div role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-sm rounded-[18px] p-6 text-sm text-concrete-light/45">
            Survey interrupted. Retrying...
          </motion.div>
        )}

        {!state.loading && !state.error && state.repos.length === 0 && <EmptyProjects profile={state.profile} inView={inView} />}

        {!state.loading && !state.error && state.repos.length > 0 && (
          <div ref={ref} className="space-y-6">
            {state.repos.map((repo, i) => (
              <FeaturedRepo key={repo.id} repo={repo} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
