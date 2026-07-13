import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'motion/react'

function useParticleData(count: number) {
  /* eslint-disable react-hooks/purity */
  return useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 2
      p[i * 3] = Math.cos(theta) * Math.sin(phi) * radius
      p[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * radius
      p[i * 3 + 2] = Math.cos(phi) * radius
    }
    return p
  }, [count])
  /* eslint-enable react-hooks/purity */
}

function GlowingOrb() {
  const ref = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta * 0.1
    ref.current.rotation.y += delta * 0.15
  })

  return (
    <group>
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.3}>
        <Sphere ref={ref} args={[1, 64, 64]} scale={1.2}>
          <MeshDistortMaterial
            color="#d4d4dc"
            emissive="#c4a455"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.3}
            distort={0.15}
            speed={1.5}
          />
        </Sphere>
      </Float>
      <mesh ref={glowRef} scale={2.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#c4a455" transparent opacity={0.06} wireframe />
      </mesh>
      <mesh scale={3.0}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#d4d4dc" transparent opacity={0.02} wireframe />
      </mesh>
    </group>
  )
}

function Particles({ count = 160 }) {
  const ref = useRef<THREE.Points>(null)
  const data = useParticleData(count)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.04
    ref.current.rotation.x += delta * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#a1a1aa" transparent opacity={0.35} sizeAttenuation />
    </points>
  )
}

function Rings() {
  const groupRef = useRef<THREE.Group>(null)
  const groupRef2 = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.08
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.1

    if (!groupRef2.current) return
    groupRef2.current.rotation.y -= delta * 0.05
    groupRef2.current.rotation.z = Math.cos(Date.now() * 0.0002) * 0.08
  })

  const radii = [2.8, 3.4, 4.0, 4.6]
  const opacity = [0.06, 0.08, 0.05, 0.03]
  const colors = ['#d4d4dc', '#c4a455', '#d4d4dc', '#8888a0']

  return (
    <>
      <group ref={groupRef}>
        {radii.map((radius, i) => (
          <mesh key={i} rotation={[Math.PI / 3 + i * 0.15, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[radius - 0.01, radius, 64]} />
            <meshBasicMaterial
              color={colors[i]}
              transparent
              opacity={opacity[i]}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      <group ref={groupRef2}>
        {radii.map((radius, i) => (
          <mesh key={i} rotation={[-Math.PI / 4 + i * 0.1, 0.3, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[radius - 0.01, radius, 64]} />
            <meshBasicMaterial
              color={colors[i]}
              transparent
              opacity={opacity[i] * 0.6}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </>
  )
}

function SignalScene() {
  return (
    <>
      <color attach="background" args={['#08080a']} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 3, 5]} intensity={1.2} color="#d4d4dc" />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#c4a455" distance={8} />
      <GlowingOrb />
      <Rings />
      <Particles />
      <Text
        position={[0, -2.3, 0]}
        fontSize={0.15}
        color="#c4a455"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.25}
      >
        still listening
      </Text>
    </>
  )
}

export function SignalRoom({ active, onClose }: { active: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="signal-room"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 cursor-pointer"
          onClick={onClose}
        >
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 50 }}>
            <SignalScene />
          </Canvas>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs font-mono text-white/15 tracking-[0.15em]"
          >
            click to dismiss
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
