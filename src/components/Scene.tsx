import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, AdaptiveDpr, AdaptiveEvents, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Bagboy } from './Bagboy'
import { MountOlympus } from './achievements/MountOlympus'

function useParticles(count: number) {
  return useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5

      const palette = Math.random()
      if (palette < 0.33) {
        colors[i * 3] = 0.77; colors[i * 3 + 1] = 0.64; colors[i * 3 + 2] = 0.33
      } else if (palette < 0.66) {
        colors[i * 3] = 0.83; colors[i * 3 + 1] = 0.83; colors[i * 3 + 2] = 0.87
      } else {
        colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1
      }

      sizes[i] = 0.02 + Math.random() * 0.06
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    return geo
  }, [count])
}

function Particles({ count = 150 }: { count?: number }) {
  const geo = useParticles(count)
  const ref = useRef<THREE.Points>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = 0.2 + Math.sin(clock.elapsedTime * 0.3 + count) * 0.08
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.25}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function GroundGrid() {
  return (
    <gridHelper
      args={[20, 20, '#d4d4d4', '#888888']}
      position={[0, -3, 0]}
    />
  )
}

function GoldenPointLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 0.4 + Math.sin(clock.elapsedTime * 2) * 0.25 + (Math.sin(clock.elapsedTime * 5) > 0.85 ? 0.2 : 0)
    }
  })
  return (
    <pointLight
      ref={lightRef}
      position={[0, 2, 0]}
      intensity={0.5}
      color="#c4a455"
      distance={10}
      decay={2}
    />
  )
}

function AmbientLighting() {
  return (
    <>
      <ambientLight intensity={0.3} color="#a0a0a0" />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#888888" />
      <GoldenPointLight />
    </>
  )
}

function FloatingGeometry() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[-4, 1, -6]} scale={0.15}>
          <octahedronGeometry />
          <meshPhysicalMaterial
            color="#d4d4d4"
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
            color="#888888"
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
            color="#909090"
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
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={2}
        maxDistance={12}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
      <AmbientLighting />
      <GroundGrid />
      <Particles count={150} />
      <FloatingGeometry />
      <Bagboy />
      <MountOlympus />
    </>
  )
}

export function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
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
