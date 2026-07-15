import { lazy, Suspense, useEffect, useState, useCallback, useRef } from 'react'
import { useSpring } from 'motion/react'
import { motion, useScroll } from 'motion/react'
import { Header } from './components/Primitives'
import { Hero } from './components/Hero'
import { Manifesto } from './components/About'
import { Tools } from './components/Skills'
import { ProjectsSection } from './components/Projects'
import { Blueprint } from './components/Journey'
import { Contact } from './components/Contact'
import { ConstructionBackground } from './components/ConstructionBackground'
const Scene = lazy(() => import('./components/Scene').then(m => ({ default: m.Scene })))
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingScreen } from './components/LoadingScreen'
import { useStore } from './lib/store'
import { AchievementProvider } from './lib/AchievementContext'
import { UnlockToast } from './components/achievements/UnlockToast'
import { CodexPanel } from './components/achievements/CodexPanel'
import { useAchievementEggs, injectEggStyles } from './lib/achievement-eggs'
import { useAchievements } from './lib/AchievementContext'
import { SpotifyEngine } from './components/music/SpotifyEngine'
import { ExpandedMusicRoom } from './components/music/ExpandedMusicRoom'
import './styles/globals.css'

const EchoPrism = lazy(() => import('./components/easter-eggs/EchoPrism').then(m => ({ default: m.EchoPrism })))
const SignalRoom = lazy(() => import('./components/easter-eggs/SignalRoom').then(m => ({ default: m.SignalRoom })))

const SECTION_ZONES = [
  { id: 'top',     accent: '212,212,212', name: 'blueprint'    },
  { id: 'about',   accent: '212,212,212', name: 'site-plan'    },
  { id: 'skills',  accent: '161,161,170', name: 'materials'    },
  { id: 'projects',accent: '212,212,212', name: 'builds'       },
  { id: 'journey', accent: '161,161,170', name: 'construction' },
  { id: 'contact', accent: '128,128,128', name: 'hazard'       },
] as const

function BackgroundAccent() {
  const [flashKey, setFlashKey] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const found = SECTION_ZONES.find(a => a.id === entry.target.id)
            if (found) {
              const root = document.documentElement
              root.style.setProperty('--accent-rgb', found.accent)
              root.style.setProperty('--accent-glow', `rgba(${found.accent}, 0.1)`)
              setFlashKey(k => k + 1)
            }
          }
        }
      },
      { threshold: 0.2 },
    )
    const targets = SECTION_ZONES.map(a => document.getElementById(a.id)).filter(Boolean) as Element[]
    targets.forEach(t => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.div
        key={flashKey}
        initial={{ opacity: 0.15 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
        style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(${SECTION_ZONES[0].accent}, 0.06), transparent 60%)` }}
      />
    </>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  return (
    <motion.div
      style={{ scaleX, background: 'repeating-linear-gradient(90deg, rgba(200,200,200,0.3) 0px, rgba(200,200,200,0.3) 8px, rgba(150,150,150,0.2) 8px, rgba(150,150,150,0.2) 16px)' }}
      className="fixed left-0 top-0 z-50 h-[1.5px] origin-left"
    />
  )
}

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-xl focus-visible:bg-white focus-visible:px-5 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-black focus-visible:shadow-lg"
    >
      Skip to content
    </a>
  )
}

function HiddenRoutePage({ title, message, achievementId, emoji, onUnlock }: {
  title: string; message: string; achievementId: string; emoji: string; onUnlock: (id: string) => void
}) {
  useEffect(() => { onUnlock(achievementId) }, [achievementId, onUnlock])
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0a0a0c]" role="dialog" aria-label={title}>
      <div className="text-center px-5 max-w-lg">
        <div className="text-5xl mb-6">{emoji}</div>
        <h1 className="text-3xl font-black text-white tracking-[-0.03em]">{title}</h1>
        <p className="mt-4 text-base text-white/40 leading-relaxed">{message}</p>
        <button
          onClick={() => {
            window.history.pushState({}, '', '/')
            window.dispatchEvent(new PopStateEvent('popstate'))
          }}
          className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold-subtle px-6 py-2.5 text-sm text-gold transition-all hover:bg-gold/10"
        >
          Return
        </button>
      </div>
    </div>
  )
}

function MainApp() {
  const echoPrismActive = useStore((s) => s.echoPrismActive)
  const signalRoomActive = useStore((s) => s.signalRoomActive)
  const setEchoPrismActive = useStore((s) => s.setEchoPrismActive)
  const setSignalRoomActive = useStore((s) => s.setSignalRoomActive)
  const [footerClicks, setFooterClicks] = useState(0)
  const [codexOpen, setCodexOpen] = useState(false)
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname)
  const [loading, setLoading] = useState(true)
  const [canRender3D, setCanRender3D] = useState(false)

  const { unlockAchievement } = useAchievements()
  const [musicOpen, setMusicOpen] = useState(false)

  const handleLoadingFinish = useCallback(() => setLoading(false), [])

  const logoRef = useRef<HTMLElement | null>(null)
  const nameRef = useRef<HTMLElement | null>(null)
  const nameInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const handler = () => setCurrentRoute(window.location.pathname)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  const [codexClickCount, setCodexClickCount] = useState(0)
  const codexTimerRef = useRef<number>(0)

  const handleCodexGesture = useCallback(() => {
    setCodexClickCount(prev => {
      const next = prev + 1
      clearTimeout(codexTimerRef.current)
      codexTimerRef.current = window.setTimeout(() => setCodexClickCount(0), 2000)
      return next
    })
  }, [])

  useEffect(() => {
    if (codexClickCount >= 3) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'a' || e.key === 'A') {
          setCodexOpen(true)
          setCodexClickCount(0)
          window.removeEventListener('keydown', handler)
        }
      }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }
  }, [codexClickCount])

  useEffect(() => {
    if (currentRoute === '/codex') {
      setCodexOpen(true)
    }
  }, [currentRoute])

  useEffect(() => { injectEggStyles() }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference)')
    setCanRender3D(mq.matches && window.innerWidth > 768)
    const handler = () => {
      setCanRender3D(window.matchMedia('(prefers-reduced-motion: no-preference)').matches && window.innerWidth > 768)
    }
    mq.addEventListener('change', handler)
    window.addEventListener('resize', handler)
    return () => {
      mq.removeEventListener('change', handler)
      window.removeEventListener('resize', handler)
    }
  }, [])

  const { recordSigil, recordSigilGate } = useAchievementEggs({ logoRef, nameRef, nameInputRef })

  const handleFooterClick = useCallback(() => {
    const next = footerClicks + 1
    setFooterClicks(next)
    if (next >= 3) {
      setFooterClicks(0)
      setSignalRoomActive(true)
    }
  }, [footerClicks, setSignalRoomActive])

  useEffect(() => {
    const handle = () => {
      useStore.getState().setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  const hiddenRoutes: Record<string, { title: string; message: string; achievementId: string; emoji: string }> = {
    '/olympus': {
      title: 'Trespasser of Olympus',
      message: 'Only the bold arrive uninvited. You walk among gods now, mortal.',
      achievementId: 'trespasser',
      emoji: '\u26a1',
    },
    '/forbidden-scroll': {
      title: 'Forbidden Knowledge',
      message: 'You ignored the warnings of robots.txt and ventured where crawlers dare not tread. The gods respect your defiance.',
      achievementId: 'forbidden_knowledge',
      emoji: '\ud83d\udcd6',
    },
    '/silence': {
      title: 'The Silence',
      message: 'What speaks when nothing speaks? You solved the riddle of the Sphinx. The answer was always within.',
      achievementId: 'riddle_of_the_sphinx',
      emoji: '\ud83d\udc09',
    },
    '/the-matrix': {
      title: 'Red Pill',
      message: 'You took the red pill. The rabbit hole goes deeper than you imagined.',
      achievementId: 'red_pill',
      emoji: '\ud83d\udfe1',
    },
    '/echo': {
      title: 'Echo Chamber',
      message: 'Words repeated become truths. What truth did you find in the reflection?',
      achievementId: 'echo_chamber',
      emoji: '\ud83d\udd04',
    },
    '/lighthouse': {
      title: 'The Lighthouse',
      message: 'A guiding light in the dark. You followed it here, but who lit the flame?',
      achievementId: 'lighthouse',
      emoji: '\ud83d\udee1\ufe0f',
    },
    '/abyss': {
      title: 'Into the Abyss',
      message: 'The abyss stared back. And it recognized you.',
      achievementId: 'into_the_abyss',
      emoji: '\ud83d\udd73\ufe0f',
    },
  }

  const hiddenRoute = currentRoute in hiddenRoutes ? hiddenRoutes[currentRoute] : null

  if (hiddenRoute) {
    return (
      <HiddenRoutePage
        title={hiddenRoute.title}
        message={hiddenRoute.message}
        achievementId={hiddenRoute.achievementId}
        emoji={hiddenRoute.emoji}
        onUnlock={(id) => unlockAchievement(id)}
      />
    )
  }

  if (loading) {
    return <LoadingScreen onFinish={handleLoadingFinish} />
  }

  return (
    <>
      {canRender3D && (
        <Suspense fallback={<div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />}>
          <ErrorBoundary>
            <Scene />
          </ErrorBoundary>
        </Suspense>
      )}
      <ConstructionBackground />
      <SkipLink />
      <ScrollProgress />
      <BackgroundAccent />
      <Header logoRef={logoRef} onLogoClick={handleCodexGesture} onCodexOpen={() => setCodexOpen(true)} onMusicOpen={() => setMusicOpen(true)} />
      <main id="main-content">
        <section id="top">
          <Hero nameRef={nameRef} />
        </section>
        <section id="about" data-sigil="about">
          <Manifesto />
          <button type="button" onClick={() => { recordSigil('about'); recordSigilGate('about') }} className="absolute bottom-2 right-2 z-10 size-1 cursor-pointer opacity-0" aria-label="Sigil of Creation" tabIndex={-1} />
        </section>
        <section id="skills" data-sigil="skills">
          <Tools />
          <button type="button" onClick={() => { recordSigil('skills'); recordSigilGate('skills') }} className="absolute bottom-2 right-2 z-10 size-1 cursor-pointer opacity-0" aria-label="Sigil of Wisdom" tabIndex={-1} />
        </section>
        <section id="projects" data-sigil="projects">
          <ProjectsSection />
          <button type="button" onClick={() => { recordSigil('projects'); recordSigilGate('projects') }} className="absolute bottom-2 right-2 z-10 size-1 cursor-pointer opacity-0" aria-label="Sigil of Craft" tabIndex={-1} />
        </section>
        <section id="journey">
          <Blueprint />
        </section>
        <section id="contact" data-sigil="contact">
          <Contact nameInputRef={nameInputRef} />
          <button type="button" onClick={() => { recordSigil('contact'); recordSigilGate('contact') }} className="absolute bottom-2 right-2 z-10 size-1 cursor-pointer opacity-0" aria-label="Sigil of Communion" tabIndex={-1} />
        </section>
      </main>
      <footer className="px-5 py-10 text-center text-sm text-white/35">
        <button
          type="button"
          onClick={handleFooterClick}
          className="focus-ring cursor-pointer transition-all hover:text-white/50"
        >
          &copy; {new Date().getFullYear()} myths.
        </button>
      </footer>
      <Suspense fallback={null}>
        <EchoPrism active={echoPrismActive} onClose={() => setEchoPrismActive(false)} />
      </Suspense>
      <Suspense fallback={null}>
        <SignalRoom active={signalRoomActive} onClose={() => setSignalRoomActive(false)} />
      </Suspense>

      {codexOpen && <CodexPanel onClose={() => {
        setCodexOpen(false)
        if (window.location.pathname === '/codex') {
          window.history.pushState({}, '', '/')
          window.dispatchEvent(new PopStateEvent('popstate'))
        }
      }} />}

      {musicOpen && <ExpandedMusicRoom onClose={() => setMusicOpen(false)} />}

      <SpotifyEngine />
      <UnlockToast />
    </>
  )
}

function AppWrapper() {
  return (
    <AchievementProvider>
      <MainApp />
    </AchievementProvider>
  )
}

export default AppWrapper
