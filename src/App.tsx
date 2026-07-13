import { useEffect, useState, useCallback } from 'react'
import { useSpring } from 'motion/react'
import { motion, useScroll } from 'motion/react'
import { Header } from './components/Primitives'
import { Hero } from './components/Hero'
import { Manifesto } from './components/About'
import { Tools } from './components/Skills'
import { ProjectsSection } from './components/Projects'
import { Blueprint } from './components/Journey'
import { Contact } from './components/Contact'
import { LiquidGlass } from './components/LiquidGlass'
import { EchoPrism } from './components/easter-eggs/EchoPrism'
import { SignalRoom } from './components/easter-eggs/SignalRoom'
import { ConstructionBackground } from './components/ConstructionBackground'
import { useStore } from './lib/store'
import './styles/globals.css'

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

function App() {
  const echoPrismActive = useStore((s) => s.echoPrismActive)
  const signalRoomActive = useStore((s) => s.signalRoomActive)
  const setEchoPrismActive = useStore((s) => s.setEchoPrismActive)
  const setSignalRoomActive = useStore((s) => s.setSignalRoomActive)
  const [footerClicks, setFooterClicks] = useState(0)

  const handleFooterClick = useCallback(() => {
    const next = footerClicks + 1
    setFooterClicks(next)
    if (next >= 3) {
      setFooterClicks(0)
      setSignalRoomActive(true)
    }
  }, [footerClicks, setSignalRoomActive])

  // Scroll tracker
  useEffect(() => {
    const handle = () => {
      useStore.getState().setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <>
      <ConstructionBackground />
      <SkipLink />
      <ScrollProgress />
      <BackgroundAccent />
      <Header />
      <main id="main-content">
        <LiquidGlass variant="ghost" tilt={6} className="!rounded-none !border-0">
          <Hero />
        </LiquidGlass>
        <LiquidGlass variant="ghost" tilt={6} className="!rounded-none !border-0">
          <Manifesto />
        </LiquidGlass>
        <LiquidGlass variant="ghost" tilt={6} className="!rounded-none !border-0">
          <Tools />
        </LiquidGlass>
        <LiquidGlass variant="ghost" tilt={6} className="!rounded-none !border-0">
          <ProjectsSection />
        </LiquidGlass>
        <LiquidGlass variant="ghost" tilt={6} className="!rounded-none !border-0">
          <Blueprint />
        </LiquidGlass>
        <LiquidGlass variant="ghost" tilt={6} className="!rounded-none !border-0">
          <Contact />
        </LiquidGlass>
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
      <EchoPrism active={echoPrismActive} onClose={() => setEchoPrismActive(false)} />
      <SignalRoom active={signalRoomActive} onClose={() => setSignalRoomActive(false)} />
    </>
  )
}

export default App
