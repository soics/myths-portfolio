import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'motion/react'

type Orb = {
  id: number
  pos: THREE.Vector3
  target: THREE.Vector3
  speed: number
  size: number
  color: string
}

function randomColor() {
  const colors = ['#d4d4dc', '#8888a0', '#a09080']
  return colors[Math.floor(Math.random() * colors.length)]
}

function PlayerSphere({ pos }: { pos: THREE.Vector3 }) {
  const ref = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!ref.current || !glowRef.current) return
    ref.current.position.copy(pos)
    ref.current.position.z = -2
    glowRef.current.position.copy(ref.current.position)
    glowRef.current.position.z = -2.01
    glowRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.15)
  })

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshPhysicalMaterial
          color="#d4d4dc"
          metalness={0.1}
          roughness={0.1}
          emissive="#d4d4dc"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#d4d4dc" transparent opacity={0.1} />
      </mesh>
    </>
  )
}

function EnemyOrb({ orb, onHit }: { orb: Orb; onHit: () => void }) {
  const ref = useRef<THREE.Mesh>(null)
  const alive = useRef(true)

  useFrame(() => {
    if (!ref.current || !alive.current) return
    const dir = new THREE.Vector3().subVectors(orb.target, orb.pos).normalize()
    orb.pos.add(dir.multiplyScalar(orb.speed))
    ref.current.position.copy(orb.pos)

    const dist = orb.pos.distanceTo(orb.target)
    if (dist < 0.4 && alive.current) {
      alive.current = false
      onHit()
    }
  })

  return (
    <mesh ref={ref} position={orb.pos}>
      <sphereGeometry args={[orb.size, 12, 12]} />
      <meshPhysicalMaterial
        color={orb.color}
        emissive={orb.color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

function Arena() {
  return (
    <>
      <ambientLight intensity={0.2} color="#8888a0" />
      <directionalLight position={[0, 5, 5]} intensity={0.5} color="#ffffff" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -2]}>
        <ringGeometry args={[2.5, 5, 64]} />
        <meshBasicMaterial color="#d4d4dc" transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, -2]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial color="#121214" />
      </mesh>
    </>
  )
}

function GameCanvas({ onGameOver }: { onGameOver: (score: number) => void }) {
  const [orbs, setOrbs] = useState<Orb[]>([])
  const [time, setTime] = useState(0)
  const orbId = useRef(0)
  const spawnTimer = useRef(0)
  const [playerPos, setPlayerPos] = useState(() => new THREE.Vector3(0, 0, -2))
  const gameOver = useRef(false)
  const difficulty = useRef(1)
  const { pointer } = useThree()

  const addOrb = useCallback(() => {
    const angle = Math.random() * Math.PI * 2
    const radius = 5 + Math.random() * 3
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    const pos = new THREE.Vector3(x, y, -2)
    const target = new THREE.Vector3(
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 1.5,
      -2,
    )
    const id = ++orbId.current
    setOrbs(prev => [...prev, {
      id, pos, target,
      speed: 0.02 + Math.random() * 0.02 * difficulty.current,
      size: 0.08 + Math.random() * 0.08,
      color: randomColor(),
    }])
  }, [])

  const handleHit = useCallback(() => {
    if (gameOver.current) return
    gameOver.current = true
    onGameOver(time)
  }, [onGameOver, time])

  useFrame(() => {
    if (gameOver.current) return

    setPlayerPos(new THREE.Vector3(
      (pointer.x - 0.5) * 6,
      (pointer.y - 0.5) * 4,
      -2,
    ))

    setTime(t => t + 0.016)

    difficulty.current = 1 + Math.floor(time / 10) * 0.5

    spawnTimer.current += 0.016
    const interval = Math.max(0.3, 1.2 - difficulty.current * 0.08)
    if (spawnTimer.current > interval) {
      spawnTimer.current = 0
      addOrb()
    }

    setOrbs(prev => prev.filter(o => {
      const dist = o.pos.distanceTo(o.target)
      return dist >= 0.4
    }))
  })

  return (
    <>
      <Arena />
      <PlayerSphere pos={playerPos} />
      {orbs.map(o => (
        <EnemyOrb key={o.id} orb={o} onHit={handleHit} />
      ))}
    </>
  )
}

function GameOverScreen({ score, onRestart, onClose }: { score: number; onRestart: () => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-deep/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="rounded-2xl border border-white/[0.08] bg-surface/90 px-10 py-12 text-center shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan/40">SIGNAL LOST</p>
        <p className="mt-4 text-5xl font-bold text-white tracking-[-0.03em]">{score.toFixed(1)}s</p>
        <p className="mt-2 text-sm text-white/40">survival time</p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={onRestart}
            className="focus-ring rounded-xl bg-cyan/10 px-6 py-3 text-sm font-semibold text-cyan/70 transition-all hover:bg-cyan/20 hover:text-cyan/90 active:scale-[0.97]"
          >
            RETRY
          </button>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-xl border border-white/10 px-6 py-3 text-sm text-white/50 transition-all hover:border-white/20 hover:text-white/70 active:scale-[0.97]"
          >
            EXIT
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function GameContent({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<'playing' | 'gameover'>('playing')
  const [score, setScore] = useState(0)

  const handleGameOver = useCallback((s: number) => {
    setScore(s)
    setState('gameover')
  }, [])

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', position: 'absolute', inset: 0 }}
      >
        <GameCanvas onGameOver={handleGameOver} />
      </Canvas>

      <AnimatePresence>
        {state === 'gameover' && (
          <GameOverScreen
            score={score}
            onRestart={() => {
              setState('playing')
              setScore(0)
            }}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export function SecretGame({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[80vh] w-[80vw] max-h-[700px] max-w-[900px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-deep shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan/30">SIGNAL SURVIVOR</span>
              <span className="text-[10px] font-mono text-white/20">ESC to exit</span>
            </div>
            <GameContent onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
