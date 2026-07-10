import { useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { useSpring } from 'motion/react'
import { motion, useScroll, AnimatePresence } from 'motion/react'

const Scene = lazy(() => import('./components/Scene').then(m => ({ default: m.Scene })))
import { Background } from './components/Background'
import { Terminal } from './components/Terminal'
import { Header } from './components/Primitives'
import { Hero } from './components/Hero'
import { Manifesto } from './components/About'
import { Tools } from './components/Skills'
import { ProjectsSection } from './components/Projects'
import { Blueprint } from './components/Journey'
import { Contact } from './components/Contact'
import { useStore } from './lib/store'
import { useKonamiCode } from './hooks/useKonamiCode'
import { useTypedSequence } from './hooks/useTilt'
import type { SideEffects } from './hooks/useTerminal'
import './styles/globals.css'

const SECTION_ZONES = [
  { id: 'top',     accent: '0,229,255',  name: 'cyber'     },
  { id: 'about',   accent: '0,229,255',  name: 'origin'    },
  { id: 'skills',  accent: '124,58,237', name: 'violet'    },
  { id: 'projects',accent: '0,229,255',  name: 'discover'  },
  { id: 'journey', accent: '245,158,11', name: 'amber'     },
  { id: 'contact', accent: '124,58,237', name: 'signal'    },
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
        style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(${SECTION_ZONES[0].accent}, 0.08), transparent 60%)` }}
      />
    </>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  return (
    <motion.div
      style={{ scaleX, background: 'linear-gradient(90deg, rgba(0,229,255,0.4), rgba(124,58,237,0.3), rgba(0,229,255,0.2))' }}
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

const EASTER_MSG = `You found me. Type 'help' in the terminal (backtick).`

const KONAMI_MSG = `
  ██╗  ██╗ ██████╗ ███╗   ██╗ █████╗ ███╗   ███╗██╗
  ██║ ██╔╝██╔═══██╗████╗  ██║██╔══██╗████╗ ████║██║
  █████╔╝ ██║   ██║██╔██╗ ██║███████║██╔████╔██║██║
  ██╔═██╗ ██║   ██║██║╚██╗██║██╔══██║██║╚██╔╝██║██║
  ██║  ██╗╚██████╔╝██║ ╚████║██║  ██║██║ ╚═╝ ██║███████╗
  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
  You found me. — myths
`

function FooterSecret() {
  const [revealed, setRevealed] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  const handleClick = () => {
    const next = clickCount + 1
    setClickCount(next)
    if (next >= 3) {
      setRevealed(true)
      setTimeout(() => setRevealed(false), 5000)
    }
  }

  return (
    <footer className="px-5 py-10 text-center text-sm text-white/35">
      <p>&copy; {new Date().getFullYear()} myths.</p>
      <button type="button" onClick={handleClick} className="text-[10px] text-white/15 transition-colors hover:text-white/30 cursor-pointer">
        {clickCount === 0 ? '— signal lost —' : clickCount === 1 ? 'searching...' : 'almost there...'}
      </button>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md rounded-2xl border border-white/[0.08] bg-deep/95 px-6 py-4 text-center shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <p className="text-xs leading-relaxed text-white/50">
              &ldquo;The signal is faint but still burning.&rdquo;
            </p>
            <p className="mt-2 text-[10px] text-white/25">&mdash; bagboy</p>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}

const THEMES: Record<string, { accent: string; bg: string; raised: string; text: string }> = {
  dark:   { accent: '0,229,255',  bg: '#06060e', raised: '#0c0c1a', text: '#e0e8ff' },
  amber:  { accent: '245,158,11', bg: '#060603', raised: '#0c0a04', text: '#f5f0e8' },
  matrix: { accent: '0,255,65',   bg: '#000500', raised: '#000a00', text: '#00ff41' },
  mono:   { accent: '180,180,200', bg: '#050508', raised: '#0a0a0d', text: '#d0d0e0' },
}

function App() {
  const [terminalOpen, setTerminalOpen] = useState(false)

  const glitch = useCallback(() => {
    const w = window as unknown as Record<string, () => void>
    w.__triggerGlitch?.()
  }, [])

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const setTheme = useCallback((name: string) => {
    const t = THEMES[name]
    if (!t) return
    const root = document.documentElement
    root.style.setProperty('--accent-rgb', t.accent)
    root.style.setProperty('--bg-color', t.bg)
    root.style.setProperty('--raised-color', t.raised)
    root.style.setProperty('--text-color', t.text)
  }, [])

  const sideEffects: SideEffects = { glitch, scrollTo, matrix: glitch, setTheme }

  // Scroll tracker for bagboy
  useEffect(() => {
    const handle = () => {
      useStore.getState().setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  // Escape to close terminal
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTerminalOpen(false)
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])

  // Backtick to toggle terminal
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === 'Backquote' || (e.ctrlKey && e.key === '`')) {
        e.preventDefault()
        setTerminalOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])

  useKonamiCode(() => {
    glitch()
    setTerminalOpen(true)
    console.log(KONAMI_MSG)
  })

  useTypedSequence('myths', () => {
    console.log(EASTER_MSG)
    setTerminalOpen(true)
    document.title = '⚡ myths — hidden mode'
    setTimeout(() => { document.title = 'myths — digital universe' }, 2000)
  })

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>
    w.__openTerminal = () => setTerminalOpen(true)
    return () => { delete w.__openTerminal }
  }, [])

  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <BackgroundAccent />
      <Background />
      <Suspense fallback={null}><Scene /></Suspense>
      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} sideEffects={sideEffects} />
      <Header />
      <main id="main-content">
        <Hero />
        <Manifesto />
        <Tools />
        <ProjectsSection />
        <Blueprint />
        <Contact />
      </main>
      <FooterSecret />
    </>
  )
}

export default App
