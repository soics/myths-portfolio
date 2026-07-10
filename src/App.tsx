import { useEffect, useState } from 'react'
import { useSpring } from 'motion/react'
import { motion, useScroll, AnimatePresence } from 'motion/react'
import { Background } from './components/Background'
import { Header } from './components/Primitives'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { ProjectsSection } from './components/Projects'
import { Journey } from './components/Journey'
import { Contact } from './components/Contact'
import { useKonamiCode } from './hooks/useKonamiCode'
import { useTypedSequence } from './hooks/useTilt'
import './styles/globals.css'

/* ------------------------------------------------------------------ */
/*  Signature: scroll-reactive accent shift                           */
/* ------------------------------------------------------------------ */

const SECTION_ACCENTS = [
  { id: 'top',    accent: '160,196,255', name: 'blue' },
  { id: 'about',  accent: '167,139,250', name: 'purple' },
  { id: 'skills', accent: '52,211,153',  name: 'emerald' },
  { id: 'projects', accent: '251,191,36', name: 'amber' },
  { id: 'journey', accent: '103,232,249', name: 'cyan' },
  { id: 'contact', accent: '251,191,36', name: 'warm' },
] as const

function BackgroundAccent() {
  const [activeAccent, setActiveAccent] = useState('160,196,255')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id
            const found = SECTION_ACCENTS.find(a => a.id === sectionId)
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

const EASTER_MSG = `👋 You found me. Type 'myths' anywhere for a surprise.`

const KONAMI_MSG = `
  ██╗  ██╗ ██████╗ ███╗   ██╗ █████╗ ███╗   ███╗██╗
  ██║ ██╔╝██╔═══██╗████╗  ██║██╔══██╗████╗ ████║██║
  █████╔╝ ██║   ██║██╔██╗ ██║███████║██╔████╔██║██║
  ██╔═██╗ ██║   ██║██║╚██╗██║██╔══██║██║╚██╔╝██║██║
  ██║  ██╗╚██████╔╝██║ ╚████║██║  ██║██║ ╚═╝ ██║███████╗
  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
  You found me. — myths
`

function EasterEggEngine() {
  useKonamiCode(() => {
    const w = window as unknown as Record<string, () => void>
    w.__triggerGlitch?.()
    console.log(KONAMI_MSG)
  })

  useTypedSequence('myths', () => {
    console.log(EASTER_MSG)
    document.title = '⚡ myths — hidden mode'
    setTimeout(() => { document.title = 'myths — developer portfolio' }, 2000)
  })

  return null
}

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

function App() {
  useEffect(() => {
    console.log('👀 Looking for secrets? Try ↑↑↓↓←→←→BA')
  }, [])

  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <BackgroundAccent />
      <Background />
      <EasterEggEngine />
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
