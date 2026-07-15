import { useMemo, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAchievements } from '../../lib/AchievementContext'

const TIER_CONFIGS = [
  { count: 0,  peaks: 1, lights: 0, scale: 0.3, color: '#333340', emissive: '#222230' },
  { count: 7,  peaks: 2, lights: 1, scale: 0.5, color: '#444458', emissive: '#333348' },
  { count: 15, peaks: 3, lights: 3, scale: 0.7, color: '#5a5a78', emissive: '#444460' },
  { count: 23, peaks: 4, lights: 5, scale: 0.9, color: '#7878a0', emissive: '#606088' },
  { count: 29, peaks: 5, lights: 8, scale: 1.0, color: '#c4a455', emissive: '#c4a455' },
]

function Peak({ position, scale, color, emissive, lightIntensity, peakIndex, onPeakClick }: {
  position: [number, number, number]
  scale: number
  color: string
  emissive: string
  lightIntensity: number
  peakIndex: number
  onPeakClick?: (index: number) => void
}) {
  const ref = useRef<THREE.Mesh>(null)
  const pulseTime = useRef(-1)

  const handleClick = useCallback((e: any) => {
    e.stopPropagation()
    pulseTime.current = 0
    onPeakClick?.(peakIndex)
  }, [peakIndex, onPeakClick])

  const handleOver = useCallback((e: any) => {
    const mat = (e.object as THREE.Mesh).material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.4
  }, [])

  const handleOut = useCallback((e: any) => {
    if (pulseTime.current < 0) {
      const mat = (e.object as THREE.Mesh).material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.15
    }
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    if (pulseTime.current >= 0) {
      pulseTime.current += delta
      const t = pulseTime.current
      const mat = ref.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.15 + Math.sin(t * 4) * 0.6 * Math.max(0, 1 - t)
      if (t > 1.5) {
        mat.emissiveIntensity = 0.15
        pulseTime.current = -1
      }
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={ref}
        position={[0, scale * 0.5, 0]}
        scale={[scale, scale, scale]}
        onClick={handleClick}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
      >
        <coneGeometry args={[1, 1.5, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.15}
          metalness={0.3}
          roughness={0.7}
          flatShading
        />
      </mesh>
      {lightIntensity > 0 && (
        <pointLight
          position={[0, scale * 1.2, 0]}
          intensity={lightIntensity}
          color="#c4a455"
          distance={3}
          decay={2}
        />
      )}
    </group>
  )
}

export function MountOlympus({ onPeakClick }: { onPeakClick?: (index: number) => void }) {
  const { unlockedCount } = useAchievements()
  const groupRef = useRef<THREE.Group>(null)
  const config = TIER_CONFIGS.filter(c => unlockedCount >= c.count).pop() ?? TIER_CONFIGS[0]

  const peaks = useMemo(() => {
    const positions: Array<{ pos: [number, number, number]; s: number; li: number }> = [
      { pos: [0, 0, 0], s: 1.0, li: config.lights > 0 ? 0.15 : 0 },
    ]
    if (config.peaks >= 2) {
      positions.push({ pos: [-1.2, -0.2, 0.6], s: 0.7, li: config.lights > 1 ? 0.12 : 0 })
    }
    if (config.peaks >= 3) {
      positions.push({ pos: [1.0, -0.15, -0.5], s: 0.65, li: config.lights > 2 ? 0.12 : 0 })
    }
    if (config.peaks >= 4) {
      positions.push({ pos: [-0.8, -0.3, -0.8], s: 0.5, li: config.lights > 3 ? 0.1 : 0 })
    }
    if (config.peaks >= 5) {
      positions.push({ pos: [0.9, -0.25, 1.0], s: 0.55, li: config.lights > 4 ? 0.1 : 0 })
    }
    return positions
  }, [config])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime
    groupRef.current.position.y = Math.sin(t * 0.3) * 0.04
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.05
  })

  const baseY = -2.5
  const baseX = 3.5

  return (
    <group ref={groupRef} position={[baseX, baseY, -3]}>
      <mesh position={[0, -0.2, 0]} scale={[2.5, 0.1, 2.5]}>
        <cylinderGeometry args={[1, 1.4, 1, 8]} />
        <meshStandardMaterial color="#222230" metalness={0.2} roughness={0.8} />
      </mesh>

      {peaks.map((p, i) => (
        <Peak
          key={i}
          position={p.pos}
          scale={p.s * config.scale}
          color={config.color}
          emissive={config.emissive}
          lightIntensity={p.li}
          peakIndex={i}
          onPeakClick={onPeakClick}
        />
      ))}
    </group>
  )
}
