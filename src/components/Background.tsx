import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

function CRTGlitch({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-0 z-40" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)' }} />
      <motion.div animate={{ x: [0, 3, -2, 1, 0] }} transition={{ duration: 0.3, repeat: 3 }}
        className="absolute inset-0 mix-blend-screen opacity-[0.04]"
        style={{ background: 'linear-gradient(90deg, rgba(212,212,220,0.15), transparent 30%, transparent 70%, rgba(136,136,160,0.15))' }} />
      <motion.div animate={{ opacity: [0, 0.1, 0, 0.05, 0] }} transition={{ duration: 0.6, repeat: 2 }}
        className="absolute inset-0 bg-white" />
    </motion.div>
  )
}

function Vignette() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true"
      style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 35%, rgba(18,18,20,0.6) 100%)' }}
    />
  )
}

export function Background() {
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    (window as unknown as Record<string, () => void>).__triggerGlitch = () => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 3000)
    }
    return () => { delete (window as unknown as Record<string, unknown>).__triggerGlitch }
  }, [])

  return (
    <>
      <Vignette />
      <CRTGlitch active={glitchActive} />
    </>
  )
}
