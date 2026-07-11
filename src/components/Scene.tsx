import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Float, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import * as THREE from 'three'
import { Bagboy } from './Bagboy'

function useParticles(count: number) {
  const geo = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return geo
}

function Particles({ count = 100 }: { count?: number }) {
  const geo = useParticles(count)
  return (
    <points geometry={geo}>
      <pointsMaterial
        size={0.04}
        color="#d4d4dc"
        transparent
        opacity={0.25}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function GroundGrid() {
  return (
    <gridHelper
      args={[20, 20, '#d4d4dc', '#8888a0']}
      position={[0, -3, 0]}
    />
  )
}

function AmbientLighting() {
  return (
    <>
      <ambientLight intensity={0.3} color="#6060ff" />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#8888a0" />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#d4d4dc" distance={10} decay={2} />
    </>
  )
}

function LiquidGlassPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, 0]}> 
      <planeGeometry args={[100, 100]} />
      <meshPhysicalMaterial
        color="#8888a0"
        transmission={0.9}
        roughness={0.1}
        ior={1.5}
        thickness={0.5}
        envMapIntensity={1.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

function FloatingGeometry() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[-4, 1, -6]} scale={0.15}>
          <octahedronGeometry />
          <meshPhysicalMaterial
            color="#d4d4dc"
            transmission={0.85}
            roughness={0.05}
            ior={1.45}
            thickness={0.3}
            envMapIntensity={2}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh position={[5, -1, -7]} scale={0.2}>
          <icosahedronGeometry />
          <meshPhysicalMaterial
            color="#8888a0"
            transmission={0.8}
            roughness={0.08}
            ior={1.4}
            thickness={0.4}
            envMapIntensity={1.8}
            clearcoat={0.4}
            clearcoatRoughness={0.15}
            transparent
            opacity={0.55}
          />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[-3, -0.5, -8]} scale={0.12}>
          <torusGeometry args={[1, 0.3, 8, 16]} />
          <meshPhysicalMaterial
            color="#a09080"
            transmission={0.75}
            roughness={0.1}
            ior={1.35}
            thickness={0.35}
            envMapIntensity={1.6}
            clearcoat={0.3}
            clearcoatRoughness={0.2}
            transparent
            opacity={0.5}
          />
        </mesh>
      </Float>
    </>
  )
}

function SceneContent() {
  return (
    <>
      <AmbientLighting />
      <GroundGrid />
      <Particles count={120} />
      <FloatingGeometry />
      <Bagboy />
    </>
  )
}

export function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" style={{ background: 'transparent' }}>
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ background: 'transparent' }}
        onCreated={(state) => {
          state.gl.setClearColor(0x000000, 0)
        }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Suspense fallback={null}>
          <SceneContent />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  )
}