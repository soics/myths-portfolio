import { useState } from 'react'
import { motion } from 'motion/react'
import { Trophy, X, HelpCircle, Shield, Flame, Star, Crown, Skull, Eye, EyeOff } from 'lucide-react'
import { useAchievements } from '../../lib/AchievementContext'
import {
  ACHIEVEMENTS, TIER_ORDER, TIER_LABELS, TIER_COLORS, TIER_BG,
  rankFromCount, type Tier,
} from '../../lib/achievements'

type FilterMode = 'all' | 'unlocked' | 'locked'

const TIER_ICONS: Record<Tier, typeof Trophy> = {
  mortal: Shield,
  hero: Star,
  demigod: Flame,
  olympian: Crown,
  primordial: Skull,
}

function TierSection({ tier, filter }: { tier: Tier; filter: FilterMode }) {
  const { isUnlocked, unlocked: unlockedRecords } = useAchievements()
  const [hintsVisible, setHintsVisible] = useState<Set<string>>(new Set())

  const tierAchievements = ACHIEVEMENTS.filter(a => a.tier === tier)
  const unlockedInTier = tierAchievements.filter(a => isUnlocked(a.id)).length
  const Icon = TIER_ICONS[tier]

  const filtered = tierAchievements.filter(a => {
    if (filter === 'unlocked') return isUnlocked(a.id)
    if (filter === 'locked') return !isUnlocked(a.id)
    return true
  })

  if (filtered.length === 0) return null

  const toggleHint = (id: string) => {
    setHintsVisible(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-3">
        <Icon size={18} className={TIER_COLORS[tier]} />
        <h3 className={`text-sm font-semibold uppercase tracking-[0.15em] ${TIER_COLORS[tier]}`}>
          {TIER_LABELS[tier]}
        </h3>
        <span className={`text-xs font-mono ${TIER_COLORS[tier]} opacity-60`}>
          {unlockedInTier}/{tierAchievements.length}
        </span>
        <div className="ml-auto h-px flex-1 bg-white/5" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(a => {
          const isUnlocked_ = isUnlocked(a.id)
          const record = isUnlocked_ ? unlockedRecords[a.id] : null
          const hintShown = hintsVisible.has(a.id)

          return (
            <div
              key={a.id}
              className={`group relative rounded-xl border p-4 transition-all duration-300 ${
                isUnlocked_
                  ? `${TIER_BG[tier]} border-opacity-60`
                  : 'border-zinc-800/40 bg-zinc-900/20 hover:border-zinc-700/60 hover:bg-zinc-900/30'
              }`}
              role="listitem"
              aria-label={isUnlocked_ ? `${a.name}: ${a.description}` : 'Locked achievement'}
            >
              {isUnlocked_ ? (
                <>
                  <div className="flex items-start justify-between">
                    <span className="text-xl">{a.icon}</span>
                    <span className={`text-[10px] font-mono ${TIER_COLORS[tier]} opacity-60`}>
                      {record ? new Date(record.unlockedAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <h4 className={`mt-2 text-sm font-semibold ${TIER_COLORS[tier]}`}>{a.name}</h4>
                  <p className="mt-1 text-xs text-white/40 leading-relaxed">{a.description}</p>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <span className="text-xl opacity-20">
                      <HelpCircle size={24} />
                    </span>
                    <button
                      onClick={() => toggleHint(a.id)}
                      className="text-concrete-mid/30 transition-colors hover:text-gold/60"
                      aria-label={hintShown ? 'Hide hint' : 'Show hint'}
                    >
                      {hintShown ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-white/20">???</h4>
                  {hintShown && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs text-white/30 italic leading-relaxed border-t border-white/[0.04] pt-2"
                    >
                      {a.hint}
                    </motion.p>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function CodexPanel({ onClose }: { onClose: () => void }) {
  const { unlockedCount } = useAchievements()
  const [filter, setFilter] = useState<FilterMode>('all')
  const rank = rankFromCount(unlockedCount)
  const total = ACHIEVEMENTS.length
  const pct = Math.round((unlockedCount / total) * 100)

  const handleFilter = (f: FilterMode) => {
    setFilter(prev => prev === f ? 'all' : f)
  }

  const FILTERS: Array<{ mode: FilterMode; label: string }> = [
    { mode: 'all', label: 'All' },
    { mode: 'unlocked', label: `Unlocked (${unlockedCount})` },
    { mode: 'locked', label: `Locked (${total - unlockedCount})` },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm pt-12 pb-24"
      role="dialog"
      aria-label="Codex of the Gods — achievements panel"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl mx-auto px-5"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="focus-ring fixed right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-black/60 text-gold/50 transition-all hover:bg-gold/10 hover:text-gold"
          aria-label="Close Codex"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <Trophy size={32} className="mx-auto text-gold" />
          <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] text-white">
            Codex of the Gods
          </h1>
          <p className="mt-2 text-sm text-white/40">
            {unlockedCount} of {total} feats recorded
          </p>

          {/* Rank badge */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-5 py-2">
            <span className="text-lg">{rank.tier === 'primordial' ? '👑' : rank.tier === 'olympian' ? '🏆' : rank.tier === 'demigod' ? '🔥' : rank.tier === 'hero' ? '⭐' : '🛡️'}</span>
            <span className="text-sm font-semibold text-gold">{rank.title}</span>
          </div>

          {/* Progress bar */}
          <div className="mx-auto mt-6 h-2 w-full max-w-md overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-gold/40 to-gold"
            />
          </div>

          {/* Rank milestones */}
          <div className="mx-auto mt-3 flex max-w-md justify-between text-[10px] font-mono text-white/20">
            <span>Mortal</span>
            <span>Hero</span>
            <span>Demigod</span>
            <span>Olympian</span>
            <span>Primordial</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {FILTERS.map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => handleFilter(mode)}
              className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all duration-300 ${
                filter === mode
                  ? 'bg-gold/15 text-gold border border-gold/25'
                  : 'text-concrete-light/40 border border-white/[0.06] hover:border-white/[0.12] hover:text-white/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Achievement tiers */}
        {TIER_ORDER.map(tier => (
          <TierSection key={tier} tier={tier} filter={filter} />
        ))}
      </motion.div>
    </motion.div>
  )
}
