import { useState, useEffect, useRef, useCallback } from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { Text, OrbitControls, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../lib/store'

const LETTERS = ['M', 'Y', 'T', 'H', 'S']
const TARGET_X = [-3.6, -1.8, 0, 1.8, 3.6]
const FP = { fontSize: 2.5, fontWeight: 900 as const, anchorX: 'center' as const, anchorY: 'middle' as const, outlineWidth: '4%' as const }

function useSound() {
  const enabled = useStore((s) => s.soundEnabled)
  const ctxRef = useRef<AudioContext | null>(null)
  const ctx = useCallback(() => ctxRef.current || (ctxRef.current = new AudioContext()), [])
  return {
    boom: useCallback(() => {
      if (!enabled) return
      try {
        const c = ctx(), len = c.sampleRate * 0.6, buf = c.createBuffer(1, len, c.sampleRate)
        const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
        const n = c.createBufferSource(); n.buffer = buf
        const g = c.createGain(); g.gain.setValueAtTime(0.25, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6)
        const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(3000, c.currentTime); f.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.6)
        n.connect(f); f.connect(g); g.connect(c.destination); n.start(); n.stop(c.currentTime + 0.6)
      } catch { /* no audio */ }
    }, [enabled, ctx]),
    snap: useCallback(() => {
      if (!enabled) return
      try {
        const c = ctx(), o = c.createOscillator(), g = c.createGain()
        o.type = 'sine'; o.frequency.setValueAtTime(800, c.currentTime); o.frequency.exponentialRampToValueAtTime(1600, c.currentTime + 0.08)
        g.gain.setValueAtTime(0.12, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12)
        o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.12)
      } catch { /* no audio */ }
    }, [enabled, ctx]),
    fanfare: useCallback(() => {
      if (!enabled) return
      try {
        const c = ctx()
        ;[523, 659, 784, 1047].forEach((freq, i) => {
          const o = c.createOscillator(), g = c.createGain()
          o.type = 'sine'; o.frequency.value = freq
          g.gain.setValueAtTime(0, c.currentTime + i * 0.15); g.gain.linearRampToValueAtTime(0.1, c.currentTime + i * 0.15 + 0.04)
          g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.15 + 0.35)
          o.connect(g); g.connect(c.destination); o.start(c.currentTime + i * 0.15); o.stop(c.currentTime + i * 0.15 + 0.35)
        })
      } catch { /* no audio */ }
    }, [enabled, ctx]),
  }
}

/* -------------------- COLLAPSE -------------------- */
function CollapsePhase({ onComplete }: { onComplete: () => void }) {
  const meshes = useRef<(THREE.Mesh | null)[]>([])
  const t = useRef(0)
  const [explode, setExplode] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const sound = useSound()

  useEffect(() => { const s = setTimeout(() => { sound.boom(); setExplode(true) }, 1200); return () => clearTimeout(s) }, [sound])
  useEffect(() => { if (!explode) return; const s = setTimeout(() => setFadeOut(true), 1800); return () => clearTimeout(s) }, [explode])
  useEffect(() => { if (!fadeOut) return; const s = setTimeout(onComplete, 1000); return () => clearTimeout(s) }, [fadeOut, onComplete])

  useFrame((st, delta) => {
    t.current += delta
    if (t.current < 1.2) {
      st.camera.position.z = 8 - t.current * 2.5
      st.camera.position.y = 0.5 - t.current * 0.3
      st.camera.lookAt(0, 0, 0)
    }
    if (!explode) return
    meshes.current.forEach((m, i) => {
      if (!m) return
      const et = t.current - 1.2 + i * 0.08
      const spd = 2 + i * 0.4
      m.position.x += Math.sin(et * spd + i * 1.2) * delta * 3
      m.position.y += Math.cos(et * spd * 0.7 + i * 0.8) * delta * 3 - delta * 1.2
      m.position.z += Math.sin(et * spd * 0.5 + i * 1.5) * delta * 2.5
      m.rotation.x += delta * (2 + i * 0.3)
      m.rotation.y += delta * (3 + i * 0.5)
      m.rotation.z += delta * (1 + i * 0.4)
      const mat = m.material as THREE.MeshPhysicalMaterial | null
      if (mat) mat.opacity = Math.max(0, 1 - Math.max(0, et - 0.5) * 0.5)
    })
  })

  return (
    <>
      <ambientLight intensity={0.15} color="#6060ff" />
      <directionalLight position={[0, 5, 3]} intensity={3} color="#d4d4dc" />
      <pointLight position={[0, 0, 2]} intensity={12} color="#ffffff" distance={12} decay={2} />
      {LETTERS.map((c, i) => (
        <mesh key={c} ref={(el) => { meshes.current[i] = el }} position={[TARGET_X[i], 0, 0]}>
          <Text {...FP} color="#ececf0" outlineColor="#d4d4dc" outlineOpacity={0.3}>{c}</Text>
        </mesh>
      ))}
    </>
  )
}

/* -------------------- REBUILD -------------------- */
function initLetters() {
  return LETTERS.map((char, i) => ({
    char,
    target: new THREE.Vector3(TARGET_X[i], 0, 0),
    current: new THREE.Vector3(
      TARGET_X[i] + (Math.random() - 0.5) * 7,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 4 - 2,
    ),
    snapped: false,
  }))
}

function RebuildPhase({ onComplete }: { onComplete: () => void }) {
  const [letters] = useState(initLetters)
  const [snappedArr, setSnappedArr] = useState<boolean[]>(() => LETTERS.map(() => false))
  const snappedRef = useRef<boolean[]>(LETTERS.map(() => false))
  const dragIdx = useRef(-1)
  const dragPos = useRef(new THREE.Vector3())
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0))
  const intersectPt = useRef(new THREE.Vector3())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null)
  const ray = useRef(new THREE.Raycaster())
  const ptr = useRef(new THREE.Vector2())
  const meshes = useRef<(THREE.Object3D | null)[]>([])
  const sound = useSound()

  const hitIdx = useCallback((obj: THREE.Object3D): number => {
    let cur: THREE.Object3D | null = obj
    while (cur) {
      const idx = meshes.current.indexOf(cur)
      if (idx >= 0) return idx
      cur = cur.parent
    }
    return -1
  }, [])

  const pd = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (controlsRef.current) controlsRef.current.enabled = false
    ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1
    ptr.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    ray.current.setFromCamera(ptr.current, e.camera)
    const hits = ray.current.intersectObjects(meshes.current.filter(Boolean) as THREE.Object3D[], true)
    if (!hits.length) return
    const found = hitIdx(hits[0].object)
    if (found >= 0 && !snappedRef.current[found]) {
      dragIdx.current = found
      const m = meshes.current[found]
      if (m) dragPos.current.copy(m.position as THREE.Vector3)
      dragPlane.current.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), dragPos.current)
      ray.current.ray.intersectPlane(dragPlane.current, intersectPt.current)
    }
  }, [hitIdx])

  const pm = useCallback((e: ThreeEvent<PointerEvent>) => {
    ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1
    ptr.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    if (dragIdx.current < 0) return
    ray.current.setFromCamera(ptr.current, e.camera)
    ray.current.ray.intersectPlane(dragPlane.current, intersectPt.current)
    if (intersectPt.current) dragPos.current.copy(intersectPt.current)
  }, [])

  const pu = useCallback(() => {
    const did = dragIdx.current
    dragIdx.current = -1
    if (did >= 0) {
      const m = meshes.current[did]
      if (m) {
        const t = letters[did].target
        const dx = m.position.x - t.x, dy = m.position.y - t.y, dz = m.position.z - t.z
        if (dx * dx + dy * dy + dz * dz < 0.64) {
          m.position.copy(t)
          sound.snap()
          snappedRef.current[did] = true
          setSnappedArr((p) => {
            const n = [...p]; n[did] = true
            if (n.every(Boolean)) setTimeout(() => { sound.fanfare(); setTimeout(onComplete, 800) }, 400)
            return n
          })
        }
      }
    }
    if (controlsRef.current) controlsRef.current.enabled = true
  }, [sound, onComplete, letters])

  useFrame(() => {
    letters.forEach((l, i) => {
      const m = meshes.current[i]
      if (!m) return
      const isDrag = i === dragIdx.current
      const target = isDrag ? dragPos.current : l.current
      ;(m.position as THREE.Vector3).lerp(target, isDrag ? 0.8 : 0.15)
      if (!l.snapped) {
        const t = Date.now() * 0.001
        m.rotation.x += (Math.sin(t + i) * 0.01 - m.rotation.x) * 0.02
        m.rotation.y += (Math.cos(t * 0.8 + i * 0.5) * 0.01 - m.rotation.y) * 0.02
      }
    })
  })

  return (
    <>
      <ambientLight intensity={0.2} color="#6060ff" />
      <directionalLight position={[0, 5, 3]} intensity={1.5} color="#d4d4dc" />
      <pointLight position={[0, 1, 2]} intensity={4} color="#d4d4dc" distance={10} decay={2} />
      <OrbitControls ref={controlsRef} enablePan={false} minDistance={3} maxDistance={14} autoRotate autoRotateSpeed={0.3} makeDefault />
      {letters.map((l) => (
        <mesh key={`g-${l.char}`} position={l.target}>
          <Text {...FP} color="#8888a0" fillOpacity={0.12}>{l.char}</Text>
        </mesh>
      ))}
      <group onPointerDown={pd} onPointerMove={pm} onPointerUp={pu} onPointerLeave={pu}>
        {LETTERS.map((c, i) => (
          <mesh key={c} ref={(el) => { meshes.current[i] = el }} position={letters[i].current}>
            <Text {...FP} color="#ececf0" outlineColor="#d4d4dc" outlineOpacity={snappedArr[i] ? 0.5 : 0.15} fillOpacity={snappedArr[i] ? 0.5 : 1}>{c}</Text>
          </mesh>
        ))}
      </group>
    </>
  )
}

/* -------------------- REWARD -------------------- */
function RewardPhase() {
  const [geo] = useState(() => {
    const g = new THREE.BufferGeometry()
    const p = new Float32Array(400 * 3)
    for (let i = 0; i < 400; i++) {
      p[i * 3] = (Math.random() - 0.5) * 14
      p[i * 3 + 1] = (Math.random() - 0.5) * 10
      p[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    return g
  })
  const particlesRef = useRef<THREE.Points>(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    t.current += delta
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < pos.length; i += 3) {
        pos[i] += Math.sin(t.current * 0.6 + i * 0.1) * delta * 0.04
        pos[i + 1] += Math.cos(t.current * 0.4 + i * 0.15) * delta * 0.04
        pos[i + 2] += Math.sin(t.current * 0.3 + i * 0.05) * delta * 0.02
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} color="#6060ff" />
      <directionalLight position={[0, 5, 3]} intensity={2.5} color="#ffffff" />
      <pointLight position={[0, 0, 3]} intensity={15} color="#d4d4dc" distance={12} decay={2} />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={14} autoRotate autoRotateSpeed={0.6} makeDefault />
      {LETTERS.map((c, i) => (
        <mesh key={c} position={[TARGET_X[i], 0, 0]}>
          <Text {...FP} color="#ececf0" outlineColor="#d4d4dc" outlineOpacity={0.5}>{c}</Text>
        </mesh>
      ))}
      <points ref={particlesRef} geometry={geo}>
        <pointsMaterial size={0.05} color="#d4d4dc" transparent opacity={0.35} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
    </>
  )
}

/* -------------------- MAIN -------------------- */
export function MythsCollapse({ onExit }: { onExit?: () => void }) {
  const phase = useStore((s) => s.mythsEggPhase)
  const setPhase = useStore((s) => s.setMythsEggPhase)
  const setActive = useStore((s) => s.setMythsEggActive)
  const setBagboyPose = useStore((s) => s.setBagboyPose)
  const [showMessage, setShowMessage] = useState(false)

  const handleCollapseDone = useCallback(() => setPhase('rebuild'), [setPhase])
  const handleRebuildDone = useCallback(() => {
    setPhase('reward')
    setBagboyPose('celebrate')
    setTimeout(() => setShowMessage(true), 1000)
  }, [setPhase, setBagboyPose])
  const handleExit = useCallback(() => {
    setActive(false)
    setPhase('idle')
    setBagboyPose('idle')
    onExit?.()
  }, [setActive, setPhase, setBagboyPose, onExit])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') handleExit() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [handleExit])

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <button type="button" onClick={handleExit} className="fixed top-4 right-4 z-[110] rounded-xl border border-white/10 bg-deep/80 px-4 py-2 text-xs font-mono text-white/40 backdrop-blur-md transition-all hover:border-white/20 hover:text-white/70">ESC &mdash; exit</button>
      <div className="fixed top-4 left-4 z-[110] text-[10px] font-mono tracking-[0.2em] text-white/20 select-none">
        {phase === 'collapse' && '>> COLLAPSING'}
        {phase === 'rebuild' && '>> RECONSTRUCT'}
        {phase === 'reward' && '>> RESTORED'}
      </div>
      {phase === 'rebuild' && (
        <div className="pointer-events-none fixed inset-0 z-[105] flex items-center justify-center">
          <p className="text-xs font-mono tracking-[0.2em] text-cyan/30 animate-pulse">reconstruct the signal</p>
        </div>
      )}
      {phase === 'rebuild' && (
        <div className="fixed bottom-4 left-4 z-[110] text-[10px] font-mono tracking-[0.1em] text-white/15 select-none">bagboy is watching</div>
      )}
      {showMessage && (
        <div className="pointer-events-none fixed inset-0 z-[105] flex items-center justify-center">
          <div className="max-w-md text-center">
            <p className="text-[2.5rem] font-black tracking-[-0.03em] text-white mb-3">MYTHS</p>
            <p className="text-sm leading-relaxed text-white/40 font-mono">{'\u201C'}nothing is ever truly broken.{'\u201D'}</p>
            <p className="mt-6 text-[10px] text-white/20 font-mono tracking-[0.2em]">YOU FOUND THE HIDDEN WORLD</p>
            <p className="mt-10 text-xs text-white/15 font-mono">press ESC to return</p>
          </div>
        </div>
      )}
      <div className="fixed inset-0">
        <Canvas camera={{ position: [0, 0.5, 8], fov: 50, near: 0.1, far: 30 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} onCreated={(s) => s.gl.setClearColor(0x000000, 1)}>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          {phase === 'collapse' && <CollapsePhase onComplete={handleCollapseDone} />}
          {phase === 'rebuild' && <RebuildPhase onComplete={handleRebuildDone} />}
          {phase === 'reward' && <RewardPhase />}
        </Canvas>
      </div>
    </div>
  )
}
