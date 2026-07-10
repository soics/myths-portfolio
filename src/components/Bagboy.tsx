import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../lib/store'

const CYAN = new THREE.Color('#00e5ff')
const VIOLET = new THREE.Color('#7c3aed')
const AMBER = new THREE.Color('#f59e0b')
const WHITE = new THREE.Color('#e0e8ff')

function Part({ color, position, scale, rotation }: {
  color: THREE.Color
  position: [number, number, number]
  scale?: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <mesh position={position} scale={scale} rotation={rotation}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.6}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

function Sphere({ color, position, scale, emissiveIntensity = 0.3 }: {
  color: THREE.Color
  position: [number, number, number]
  scale?: number
  emissiveIntensity?: number
}) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.3}
        roughness={0.1}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

export function Bagboy() {
  const groupRef = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const pose = useStore((s) => s.bagboyPose)
  const activeSection = useStore((s) => s.activeSection)

  const armLRef = useRef<THREE.Mesh>(null)
  const armRRef = useRef<THREE.Mesh>(null)
  const bagRef = useRef<THREE.Mesh>(null)

  const sectionColors: Record<string, THREE.Color> = useMemo(() => ({
    top: CYAN,
    about: CYAN,
    skills: VIOLET,
    projects: CYAN,
    journey: AMBER,
    contact: VIOLET,
  }), [])

  const currentColor = sectionColors[activeSection] || CYAN

  const bodyPos: [number, number, number] = [0, 0, 0]
  const headPos: [number, number, number] = [0, 1.2, 0]
  const bagPos: [number, number, number] = [0, 0.2, -0.8]
  const armLPos: [number, number, number] = [-0.7, 0.4, 0]
  const armRPos: [number, number, number] = [0.7, 0.4, 0]
  const legLPos: [number, number, number] = [-0.25, -0.8, 0]
  const legRPos: [number, number, number] = [0.25, -0.8, 0]
  const eyeLPos: [number, number, number] = [-0.2, 1.35, 0.9]
  const eyeRPos: [number, number, number] = [0.2, 1.35, 0.9]
  const earLPos: [number, number, number] = [-0.6, 1.2, 0]
  const earRPos: [number, number, number] = [0.6, 1.2, 0]

  const bodyScale: [number, number, number] = [0.9, 1.0, 0.6]
  const headScale = 0.6
  const bagScale: [number, number, number] = [0.8, 0.7, 0.5]
  const armScale: [number, number, number] = [0.15, 0.6, 0.15]
  const legScale: [number, number, number] = [0.15, 0.5, 0.15]
  const eyeScale = 0.1
  const earScale: [number, number, number] = [0.15, 0.15, 0.1]

  useFrame((state) => {
    if (!groupRef.current) return

    const t = state.clock.elapsedTime

    // Idle float
    const floatY = Math.sin(t * 0.8) * 0.08
    const floatRot = Math.sin(t * 0.5) * 0.02
    groupRef.current.position.y = floatY
    groupRef.current.rotation.y = floatRot + scroll.offset * Math.PI * 0.3

    // Scroll-based elevation
    groupRef.current.position.y += scroll.offset * 0.5

    // Arm animations based on pose
    if (armLRef.current && armRRef.current) {
      switch (pose) {
        case 'idle':
          armLRef.current.rotation.x = Math.sin(t * 1.2) * 0.05
          armRRef.current.rotation.x = Math.sin(t * 1.2 + Math.PI) * 0.05
          break
        case 'wave':
          armRRef.current.rotation.x = -0.5 + Math.sin(t * 4) * 0.3
          armLRef.current.rotation.x = Math.sin(t * 1.2) * 0.05
          break
        case 'point':
          armRRef.current.rotation.x = -0.8
          armRRef.current.rotation.z = -0.3
          armLRef.current.rotation.x = 0.1
          break
        case 'celebrate':
          armLRef.current.rotation.x = -0.8 + Math.sin(t * 3) * 0.2
          armRRef.current.rotation.x = -0.8 + Math.sin(t * 3 + Math.PI) * 0.2
          break
      }
    }

    // Bag glow pulse
    if (bagRef.current) {
      const bagMat = bagRef.current.material as THREE.MeshPhysicalMaterial
      bagMat.emissiveIntensity = 0.1 + Math.sin(t * 1.5) * 0.08
    }

    // Color shift based on section
    const meshes = groupRef.current.children
    meshes.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshPhysicalMaterial
        if (mat.emissive) {
          mat.color.lerp(currentColor, 0.02)
          mat.emissive.lerp(currentColor, 0.02)
        }
      }
    })
  })

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* Body */}
      <Part color={WHITE} position={bodyPos} scale={bodyScale} />
      {/* Bag (backpack) — defining feature */}
      <mesh ref={bagRef} position={bagPos} scale={bagScale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color={CYAN}
          metalness={0.7}
          roughness={0.1}
          emissive={CYAN}
          emissiveIntensity={0.15}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Head */}
      <Sphere color={WHITE} position={headPos} scale={headScale} emissiveIntensity={0.05} />
      {/* Ears */}
      <Part color={WHITE} position={earLPos} scale={earScale} />
      <Part color={WHITE} position={earRPos} scale={earScale} />
      {/* Eyes */}
      <Sphere color={CYAN} position={eyeLPos} scale={eyeScale} emissiveIntensity={0.8} />
      <Sphere color={CYAN} position={eyeRPos} scale={eyeScale} emissiveIntensity={0.8} />
      {/* Arms */}
      <mesh ref={armLRef} position={armLPos} scale={armScale}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshPhysicalMaterial color={WHITE} metalness={0.3} roughness={0.3} transparent opacity={0.8} />
      </mesh>
      <mesh ref={armRRef} position={armRPos} scale={armScale}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshPhysicalMaterial color={WHITE} metalness={0.3} roughness={0.3} transparent opacity={0.8} />
      </mesh>
      {/* Legs */}
      <mesh position={legLPos} scale={legScale}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshPhysicalMaterial color={WHITE} metalness={0.3} roughness={0.3} transparent opacity={0.8} />
      </mesh>
      <mesh position={legRPos} scale={legScale}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshPhysicalMaterial color={WHITE} metalness={0.3} roughness={0.3} transparent opacity={0.8} />
      </mesh>
      {/* Bag strap across body */}
      <mesh position={[0, 0.2, 0.45]} scale={[0.65, 0.05, 0.03]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial color={AMBER} metalness={0.3} roughness={0.5} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}
