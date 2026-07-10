import { useSpring } from 'motion/react'
import { motion, useScroll } from 'motion/react'
import { Background } from './components/Background'
import { Header } from './components/Primitives'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { ProjectsSection } from './components/Projects'
import { Journey } from './components/Journey'
import { Contact } from './components/Contact'
import './styles/globals.css'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-blue-300/60 to-transparent"
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

function SectionDivider() {
  return (
    <div className="mx-auto max-w-6xl px-5" aria-hidden="true">
      <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </div>
  )
}

function App() {
  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <Background />
      <Header />
      <main id="main-content">
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <ProjectsSection />
        <SectionDivider />
        <Journey />
        <SectionDivider />
        <Contact />
      </main>
      <footer className="px-5 py-10 text-center text-sm text-white/30">
        &copy; {new Date().getFullYear()} myths. Built, not finished.
      </footer>
    </>
  )
}

export default App
