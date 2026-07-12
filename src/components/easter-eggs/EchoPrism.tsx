import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'motion/react'

function genParticles(n: number) {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    p[i * 3] = (Math.random() - 0.5) * 8
    p[i * 3 + 1] = (Math.random() - 0.5) * 8
    p[i * 3 + 2] = (Math.random() - 0.5) * 8
  }
  return p
}

function Prism({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!meshRef.current || !groupRef.current) return
    groupRef.current.rotation.x += delta * 0.15
    groupRef.current.rotation.y += delta * 0.25
    const targetX = mouse.current.x * 0.3
    const targetY = mouse.current.y * 0.3
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.05
    groupRef.current.position.y += (-targetY - groupRef.current.position.y) * 0.05
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
        <mesh ref={meshRef} scale={1.5}>
          <octahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            backside
            thickness={0.8}
            roughness={0.05}
            metalness={0.1}
            ior={1.5}
            chromaticAberration={0.3}
            color="#d4d4dc"
            clearcoat={1}
            envMapIntensity={1.5}
          />
        </mesh>
        <mesh scale={1.8}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#d4d4dc" transparent opacity={0.04} wireframe />
        </mesh>
      </Float>
    </group>
  )
}

function Particles({ count = 80 }) {
  const ref = useRef<THREE.Points>(null)
  const data = genParticles(count)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#8888a0" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

function PrismScene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#d4d4dc" />
      <directionalLight position={[-3, -2, 4]} intensity={0.8} color="#8888a0" />
      <Prism mouse={mouse} />
      <Particles />
      <Environment preset="night" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#0a0a0c" transparent opacity={0.3} />
      </mesh>
    </>
  )
}

export function EchoPrism({ active, onClose }: { active: boolean; onClose: () => void }) {
  const mouse = useRef({ x: 0, y: 0 })

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="echo-prism"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep/80 backdrop-blur-sm"
          onClick={onClose}
          onPointerMove={(e) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-[60vh] w-[60vh] max-h-[600px] max-w-[600px] cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
              <PrismScene mouse={mouse} />
            </Canvas>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-xs font-mono text-white/20 tracking-[0.15em]"
          >
            click anywhere to dismiss
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
