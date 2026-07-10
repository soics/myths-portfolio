import { useEffect, useState, useCallback } from 'react'
import { useSpring } from 'motion/react'
import { motion, useScroll, AnimatePresence } from 'motion/react'
import { Background } from './components/Background'
import { Terminal } from './components/Terminal'
import { Header } from './components/Primitives'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { ProjectsSection } from './components/Projects'
import { Journey } from './components/Journey'
import { Contact } from './components/Contact'
import { useKonamiCode } from './hooks/useKonamiCode'
import { useTypedSequence } from './hooks/useTilt'
import type { SideEffects } from './hooks/useTerminal'
import './styles/globals.css'

/* ------------------------------------------------------------------ */
/*  Signature: scroll-reactive accent shift                           */
/* ------------------------------------------------------------------ */

const SECTION_ACCENTS = [
  { id: 'top',    accent: '160,196,255' },
  { id: 'about',  accent: '167,139,250' },
  { id: 'skills', accent: '52,211,153'  },
  { id: 'projects', accent: '251,191,36' },
  { id: 'journey', accent: '103,232,249' },
  { id: 'contact', accent: '251,191,36' },
] as const

function BackgroundAccent() {
  const [activeAccent, setActiveAccent] = useState('160,196,255')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const found = SECTION_ACCENTS.find(a => a.id === entry.target.id)
            if (found) setActiveAccent(found.accent)
          }
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -20% 0px' },
    )
    const targets = SECTION_ACCENTS.map(a => document.getElementById(a.id)).filter(Boolean) as Element[]
    targets.forEach(t => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-rgb', activeAccent)
  }, [activeAccent])

  return null
}

/* ------------------------------------------------------------------ */
/*  Utility Components                                                */
/* ------------------------------------------------------------------ */

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-accent/60 to-transparent"
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

/* ------------------------------------------------------------------ */
/*  Footer Secret (3-click rabbit hole)                                */
/* ------------------------------------------------------------------ */

function FooterSecret() {
  const [revealed, setRevealed] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  const handleClick = () => {
    const next = clickCount + 1
    setClickCount(next)
    if (next >= 3) {
      setRevealed(true)
      const w = window as unknown as Record<string, () => void>
      w.__triggerGlitch?.()
      setTimeout(() => setRevealed(false), 5000)
    }
  }

  return (
    <footer className="px-5 py-10 text-center text-sm text-white/30">
      <p>&copy; {new Date().getFullYear()} myths. Built, not finished.</p>
      <button type="button" onClick={handleClick} className="text-[10px] text-white/10 transition-colors hover:text-white/25 cursor-pointer">
        {clickCount === 0 ? 'find the rabbit hole' : clickCount === 1 ? 'deeper...' : 'almost there...'}
      </button>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md rounded-2xl border border-white/[0.08] bg-[#0c0c0e]/95 px-6 py-4 text-center shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <p className="text-xs leading-relaxed text-white/60">
              &ldquo;The rabbit hole has no bottom. Keep falling.&rdquo;
            </p>
            <p className="mt-2 text-[10px] text-white/20">&mdash; myths, probably</p>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/*  App                                                               */
/* ------------------------------------------------------------------ */

const THEMES: Record<string, { accent: string; bg: string; raised: string; text: string }> = {
  dark:   { accent: '160,196,255', bg: '#030303', raised: '#08080a', text: '#f3f3f0' },
  amber:  { accent: '251,191,36',  bg: '#0a0803', raised: '#0f0d08', text: '#f5f0e8' },
  matrix: { accent: '0,255,65',    bg: '#000a00', raised: '#001400', text: '#00ff41' },
  mono:   { accent: '200,200,200', bg: '#050505', raised: '#0a0a0a', text: '#e0e0e0' },
}

function App() {
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [matrixActive, setMatrixActive] = useState(false)

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

  const sideEffects: SideEffects = { glitch, scrollTo, matrix: () => setMatrixActive(a => !a), setTheme }

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

  // Konami code → opens terminal + glitch
  useKonamiCode(() => {
    glitch()
    setTerminalOpen(true)
    console.log(KONAMI_MSG)
  })

  // "myths" typing → terminal opens
  useTypedSequence('myths', () => {
    console.log(EASTER_MSG)
    setTerminalOpen(true)
    document.title = '⚡ myths — hidden mode'
    setTimeout(() => { document.title = 'myths — developer portfolio' }, 2000)
  })

  // Expose side effects to window for other components
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
      <Background matrixActive={matrixActive} />
      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} sideEffects={sideEffects} />
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <ProjectsSection />
        <Journey />
        <Contact />
      </main>
      <FooterSecret />
    </>
  )
}

export default App
