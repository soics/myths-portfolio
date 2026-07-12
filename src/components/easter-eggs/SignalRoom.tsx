import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Text, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'motion/react'

function genParticles(n: number) {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const radius = 2 + Math.random() * 4
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI * 2
    p[i * 3] = Math.cos(theta) * Math.sin(phi) * radius
    p[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * radius
    p[i * 3 + 2] = Math.cos(phi) * radius
  }
  return p
}

function GlowingOrb() {
  const ref = useRef<THREE.Mesh>(null)

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
            emissive="#8888a0"
            emissiveIntensity={0.4}
            roughness={0.3}
            metalness={0.2}
            distort={0.15}
            speed={1.5}
          />
        </Sphere>
      </Float>
      <mesh scale={2.2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#d4d4dc" transparent opacity={0.04} wireframe />
      </mesh>
    </group>
  )
}

function Particles({ count = 120 }) {
  const ref = useRef<THREE.Points>(null)
  const data = genParticles(count)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.03
    ref.current.rotation.x += delta * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#d4d4dc" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

function Rings() {
  const ref = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.08
    ref.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.1
  })

  return (
    <group ref={ref}>
      {[2.8, 3.4, 4.0].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 3 + i * 0.2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[radius - 0.01, radius, 64]} />
          <meshBasicMaterial
            color="#d4d4dc"
            transparent
            opacity={0.06 + i * 0.02}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function SignalScene() {
  return (
    <>
      <color attach="background" args={['#08080a']} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 3, 5]} intensity={1.2} color="#d4d4dc" />
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#8888a0" distance={8} />
      <GlowingOrb />
      <Rings />
      <Particles />
      <Text
        position={[0, -2.2, 0]}
        fontSize={0.15}
        color="#8888a0"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        still listening
      </Text>
      <Environment preset="night" />
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
