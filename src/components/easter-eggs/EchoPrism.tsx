import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'motion/react'

const AMBIENT_COUNT = 360
const CONNECT_DIST = 18
const MOUSE_RADIUS = 26
const POOL_SIZE = 2700
const COMBO_WINDOW = 700
const BASE_CAM_Z = 60

function makeGlowTexture() {
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.7)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(c)
}

function makeStarTexture() {
  const size = 64
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const cx = size / 2, cy = size / 2
  const spikes = 4
  const outerR = size / 2
  const innerR = size / 6
  ctx.beginPath()
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = (i * Math.PI) / spikes - Math.PI / 2
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.3, 'rgba(255,255,255,0.6)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fill()
  return new THREE.CanvasTexture(c)
}

interface Spark {
  active: boolean
  pos: THREE.Vector3
  vel: THREE.Vector3
  life: number
  maxLife: number
  color: THREE.Color
  size: number
  trail: THREE.Vector3[]
}

interface RingData {
  mesh: THREE.Mesh
  life: number
  maxScale: number
  color: THREE.Color
}

type BurstPattern = 'sphere' | 'ring' | 'spiral' | 'starburst' | 'helix'

function pickPattern(combo: number): BurstPattern {
  if (combo >= 6) return Math.random() > 0.5 ? 'helix' : 'starburst'
  if (combo >= 3) return (['ring', 'spiral', 'starburst'] as BurstPattern[])[Math.floor(Math.random() * 3)]
  return (['sphere', 'sphere', 'ring', 'starburst'] as BurstPattern[])[Math.floor(Math.random() * 4)]
}

function spawnBurstPattern(
  pattern: BurstPattern,
  origin: THREE.Vector3,
  count: number,
  intensity: number,
  baseHue: number,
  spawnSpark: (origin: THREE.Vector3, vel: THREE.Vector3, life: number, color: THREE.Color, size?: number) => void,
) {
  switch (pattern) {
    case 'sphere':
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(Math.random() * 2 - 1)
        const speed = (0.6 + Math.random() * 2.4) * intensity * 0.5
        const vel = new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed * 0.4,
        )
        const hue = (baseHue + i / count * 0.5) % 1
        const color = new THREE.Color().setHSL(hue, 0.95, 0.55 + Math.random() * 0.25)
        spawnSpark(origin, vel, 0.6 + Math.random() * 1.0, color, 0.8 + Math.random() * 2.2)
      }
      break

    case 'ring':
      for (let i = 0; i < Math.min(count, 160); i++) {
        const angle = (i / Math.min(count, 160)) * Math.PI * 2
        const tilt = (Math.random() - 0.5) * 0.2
        const speed = (1.0 + Math.random() * 1.6) * intensity * 0.45
        const vel = new THREE.Vector3(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed * 0.6,
          tilt * speed,
        )
        const hue = (baseHue + i / 160) % 1
        spawnSpark(origin, vel, 0.5 + Math.random() * 0.8, new THREE.Color().setHSL(hue, 0.9, 0.7), 1.2 + Math.random() * 1.8)
      }
      break

    case 'spiral': {
      const turns = 3 + Math.random() * 2
      const arms = 2 + Math.floor(intensity * 2)
      for (let i = 0; i < Math.min(count, 200); i++) {
        const t = i / Math.min(count, 200)
        const angle = t * turns * Math.PI * 2 + (i % arms) * (Math.PI * 2 / arms)
        const speed = intensity * 0.8
        const vel = new THREE.Vector3(
          Math.cos(angle) * speed * 0.8,
          Math.sin(angle) * speed * 0.8 + t * 0.5,
          (Math.random() - 0.5) * t * 0.6,
        )
        const hue = (baseHue + t * 0.8) % 1
        spawnSpark(origin, vel, 0.8 + t * 0.6, new THREE.Color().setHSL(hue, 0.85, 0.65), 1.5 + t * 1.5)
      }
      break
    }

    case 'starburst': {
      const rays = 8 + comboCountRef.current
      const perRay = Math.floor(count / rays)
      for (let r = 0; r < rays; r++) {
        const angle = (r / rays) * Math.PI * 2 + Math.random() * 0.15
        for (let i = 0; i < perRay; i++) {
          const spread = (Math.random() - 0.5) * 0.15
          const dist = Math.random() * intensity * 6
          const speed = (0.5 + Math.random() * 2.0) * intensity * 0.5
          const vel = new THREE.Vector3(
            Math.cos(angle + spread) * speed * (1 + dist * 0.05),
            Math.sin(angle + spread) * speed * 0.6 * (1 + dist * 0.05),
            (Math.random() - 0.5) * speed * 0.3,
          )
          const hue = (baseHue + r / rays) % 1
          spawnSpark(origin, vel, 0.5 + Math.random() * 0.7, new THREE.Color().setHSL(hue, 0.95, 0.7), 1.0 + Math.random() * 2.0)
        }
      }
      break
    }

    case 'helix': {
      const coils = 4
      const particles = Math.min(count, 250)
      for (let i = 0; i < particles; i++) {
        const t = i / particles
        const angle = t * coils * Math.PI * 2
        const speed = intensity * 0.7
        const vel = new THREE.Vector3(
          Math.cos(angle) * speed * 0.7,
          t * intensity * 1.5 - 1,
          Math.sin(angle) * speed * 0.7,
        )
        const hue = (baseHue + t) % 1
        spawnSpark(origin, vel, 0.6 + t * 0.8, new THREE.Color().setHSL(hue, 0.9, 0.65), 1.2 + t * 1.8)
      }
      break
    }
  }
}

const comboCountRef = { current: 0 }

function AmbientParticles({
  mouse, mouseWorld, detonateRef, comboRef,
}: {
  mouse: React.MutableRefObject<THREE.Vector2>
  mouseWorld: React.MutableRefObject<THREE.Vector3>
  detonateRef: React.MutableRefObject<((x: number, y: number) => void) | null>
  comboRef: React.MutableRefObject<number>
}) {
  const { camera } = useThree()
  const pointsRef = useRef<THREE.Points>(null)
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null)
  const timeRef = useRef(0)
  const hueShift = useRef(0)

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const ripples = useRef<Array<{ origin: THREE.Vector3; radius: number; strength: number }>>([])

  const { baseArr, velArr, linePosArr, lineGeo, particleGeo, particleMat, lineMat } = useMemo(() => {
    const positions = new Float32Array(AMBIENT_COUNT * 3)
    const base = new Float32Array(AMBIENT_COUNT * 3)
    const vel = new Float32Array(AMBIENT_COUNT * 3)
    const colors = new Float32Array(AMBIENT_COUNT * 3)
    const sizes = new Float32Array(AMBIENT_COUNT)

    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const x = (Math.random() - 0.5) * 150
      const y = (Math.random() - 0.5) * 100
      const z = (Math.random() - 0.5) * 100
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      base[i * 3] = x
      base[i * 3 + 1] = y
      base[i * 3 + 2] = z
      vel[i * 3] = (Math.random() - 0.5) * 0.06
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.06
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.06
      const hue = Math.random() * 0.15 + 0.05
      const c = new THREE.Color().setHSL(hue, 0.6, 0.4 + Math.random() * 0.4)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
      sizes[i] = 0.8 + Math.random() * 2.4
    }

    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    pGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const pMat = new THREE.PointsMaterial({
      size: 1.6,
      map: makeGlowTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const lPos = new Float32Array(AMBIENT_COUNT * 8 * 2 * 3)
    const lGeo = new THREE.BufferGeometry()
    lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3))
    const lMat = new THREE.LineBasicMaterial({
      color: 0xff8888,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    })

    return {
      baseArr: base, velArr: vel, sizeArr: sizes,
      linePosArr: lPos, lineGeo: lGeo,
      particleGeo: pGeo, particleMat: pMat, lineMat: lMat,
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const cam = camera as THREE.PerspectiveCamera
      cam.aspect = window.innerWidth / window.innerHeight
      cam.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [camera])

  detonateRef.current = (clientX: number, clientY: number) => {
    const ndc = new THREE.Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1,
    )
    raycaster.setFromCamera(ndc, camera)
    const target = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, target)
    ripples.current.push({ origin: target.clone(), radius: 0, strength: 2.5 })
  }

  useFrame(() => {
    timeRef.current += 0.016
    hueShift.current += 0.003

    raycaster.setFromCamera(mouse.current, camera)
    raycaster.ray.intersectPlane(plane, mouseWorld.current)

    const pos = particleGeo.attributes.position.array as Float32Array
    const col = particleGeo.attributes.color.array as Float32Array

    const combo = comboRef.current
    const comboBoost = 1 + combo * 0.15

    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const ix = i * 3
      let x = pos[ix], y = pos[ix + 1], z = pos[ix + 2]

      x += velArr[ix] * comboBoost
      y += velArr[ix + 1] * comboBoost
      z += velArr[ix + 2] * comboBoost

      x += (baseArr[ix] - x) * 0.001
      y += (baseArr[ix + 1] - y) * 0.001
      z += (baseArr[ix + 2] - z) * 0.001

      tmp.set(x, y, z)
      const dToMouse = tmp.distanceTo(mouseWorld.current)
      if (dToMouse < MOUSE_RADIUS) {
        const force = ((MOUSE_RADIUS - dToMouse) / MOUSE_RADIUS) * 0.8 * comboBoost
        x += (x - mouseWorld.current.x) / (dToMouse || 1) * force
        y += (y - mouseWorld.current.y) / (dToMouse || 1) * force
      }

      for (const r of ripples.current) {
        const dr = tmp.distanceTo(r.origin)
        const band = 8
        if (Math.abs(dr - r.radius) < band) {
          const f = (1 - Math.abs(dr - r.radius) / band) * r.strength * 1.8 * comboBoost
          x += (x - r.origin.x) / (dr || 1) * f
          y += (y - r.origin.y) / (dr || 1) * f
          z += (z - r.origin.z) / (dr || 1) * f
        }
      }

      const baseHue = (baseArr[ix] / 150) * 0.2 + hueShift.current
      const c = new THREE.Color().setHSL((baseHue + Math.sin(timeRef.current * 0.1 + i) * 0.05) % 1, 0.7, 0.5)
      col[ix] = c.r
      col[ix + 1] = c.g
      col[ix + 2] = c.b

      pos[ix] = x
      pos[ix + 1] = y
      pos[ix + 2] = z
    }
    particleGeo.attributes.position.needsUpdate = true
    particleGeo.attributes.color.needsUpdate = true

    for (let i = ripples.current.length - 1; i >= 0; i--) {
      ripples.current[i].radius += 1.5 * comboBoost
      ripples.current[i].strength *= 0.975
      if (ripples.current[i].radius > 110) ripples.current.splice(i, 1)
    }

    let lineIdx = 0
    const maxLines = AMBIENT_COUNT * 8
    outer:
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const ix = i * 3
      for (let j = i + 1; j < AMBIENT_COUNT; j++) {
        if (lineIdx >= maxLines) break outer
        const jx = j * 3
        const dx = pos[ix] - pos[jx]
        const dy = pos[ix + 1] - pos[jx + 1]
        const dz = pos[ix + 2] - pos[jx + 2]
        const distSq = dx * dx + dy * dy + dz * dz
        if (distSq < CONNECT_DIST * CONNECT_DIST) {
          const li = lineIdx * 6
          linePosArr[li] = pos[ix]
          linePosArr[li + 1] = pos[ix + 1]
          linePosArr[li + 2] = pos[ix + 2]
          linePosArr[li + 3] = pos[jx]
          linePosArr[li + 4] = pos[jx + 1]
          linePosArr[li + 5] = pos[jx + 2]
          lineIdx++
        }
      }
    }
    lineGeo.attributes.position.needsUpdate = true
    lineGeo.setDrawRange(0, lineIdx * 2)

    if (lineMatRef.current) {
      lineMatRef.current.opacity = 0.05 + combo * 0.03
    }

    if (pointsRef.current) {
      const spinSpeed = 0.0004 + combo * 0.0003
      pointsRef.current.rotation.y += spinSpeed
      pointsRef.current.rotation.x += (mouse.current.y * 0.12 - pointsRef.current.rotation.x) * 0.025
    }
  })

  return (
    <group>
      <points ref={pointsRef} geometry={particleGeo} material={particleMat} />
      <lineSegments ref={lineMatRef as any} geometry={lineGeo} material={lineMat} />
    </group>
  )
}

function RingSystem({ spawnRef, comboRef }: {
  spawnRef: React.MutableRefObject<((origin: THREE.Vector3, color: THREE.Color, maxScale: number) => void) | null>
  comboRef: React.MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const rings = useRef<RingData[]>([])

  spawnRef.current = (origin, color, maxScale) => {
    const geo = new THREE.RingGeometry(0.8, 1.6, 64)
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.copy(origin)
    groupRef.current?.add(mesh)
    rings.current.push({ mesh, life: 1, maxScale, color: color.clone() })
  }

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const combo = comboRef.current
    for (let i = rings.current.length - 1; i >= 0; i--) {
      const r = rings.current[i]
      r.life -= dt * (1.2 + combo * 0.05)
      if (r.life <= 0) {
        groupRef.current?.remove(r.mesh)
        r.mesh.geometry.dispose()
        ;(r.mesh.material as THREE.MeshBasicMaterial).dispose()
        rings.current.splice(i, 1)
        continue
      }
      const t = 1 - r.life
      const scaleAmt = 1 + t * r.maxScale
      r.mesh.scale.set(scaleAmt, scaleAmt, scaleAmt)
      const mat = r.mesh.material as THREE.MeshBasicMaterial
      mat.opacity = r.life * 0.8
      const hue = (r.color.getHSL({} as any).h + dt * 0.2 * combo) % 1
      mat.color.setHSL(hue, 1, 0.7)
    }
  })

  return <group ref={groupRef} />
}

function SparkSystem({
  mouse, mouseWorld, ringSpawnRef, comboCallback,
}: {
  mouse: React.MutableRefObject<THREE.Vector2>
  mouseWorld: React.MutableRefObject<THREE.Vector3>
  ringSpawnRef: React.MutableRefObject<((origin: THREE.Vector3, color: THREE.Color, maxScale: number) => void) | null>
  comboCallback: React.MutableRefObject<((combo: number, x: number, y: number) => void) | null>
}) {
  const { camera, gl } = useThree()
  const lastTrailSpawn = useRef(0)
  const hasMoved = useRef(false)
  const shakeRef = useRef(0)
  const flashRef = useRef(0)
  const comboCount = useRef(0)
  const lastClickTime = useRef(0)
  const flashEl = useRef<HTMLDivElement | null>(null)
  const prevMouseWorld = useRef(new THREE.Vector3())
  const nextSlot = useRef(0)
  const invertEl = useRef<HTMLDivElement | null>(null)
  const colorShiftEl = useRef<HTMLDivElement | null>(null)

  comboCountRef.current = comboCount.current

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])

  const pool = useRef<Spark[]>([])

  const starTex = useMemo(() => makeStarTexture(), [])

  const { burstGeo, burstMat } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(POOL_SIZE * 3)
    const col = new Float32Array(POOL_SIZE * 3)
    const sizes = new Float32Array(POOL_SIZE)
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    const mat = new THREE.PointsMaterial({
      size: 2.4,
      map: starTex,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { burstGeo: geo, burstMat: mat }
  }, [starTex])

  useEffect(() => {
    pool.current = Array.from({ length: POOL_SIZE }, () => ({
      active: false,
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      life: 0,
      maxLife: 1,
      color: new THREE.Color(),
      size: 1,
      trail: [],
    }))
  }, [])

  useEffect(() => {
    const el = document.createElement('div')
    el.style.cssText = `
      position: fixed; inset: 0; pointer-events: none; z-index: 60;
      background: radial-gradient(circle at 50% 50%, rgba(255,220,180,0) 0%, rgba(255,120,160,0) 35%, transparent 70%);
      transition: background 0.05s;
    `
    document.body.appendChild(el)
    flashEl.current = el

    const inv = document.createElement('div')
    inv.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:59;mix-blend-mode:difference;opacity:0;background:white;transition:opacity 0.1s'
    document.body.appendChild(inv)
    invertEl.current = inv

    const cs = document.createElement('div')
    cs.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:58;mix-blend-mode:hue;opacity:0;background:conic-gradient(red,yellow,lime,cyan,blue,magenta,red);transition:opacity 0.15s'
    document.body.appendChild(cs)
    colorShiftEl.current = cs

    return () => { el.remove(); inv.remove(); cs.remove() }
  }, [])

  const spawnSpark = useCallback((origin: THREE.Vector3, vel: THREE.Vector3, life: number, color: THREE.Color, size = 1) => {
    const p = pool.current[nextSlot.current]
    nextSlot.current = (nextSlot.current + 1) % POOL_SIZE
    p.active = true
    p.pos.copy(origin)
    p.vel.copy(vel)
    p.life = life
    p.maxLife = life
    p.color.copy(color)
    p.size = size
    p.trail = []
  }, [])

  const detonate = useCallback((clientX: number, clientY: number) => {
    const ndc = new THREE.Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1,
    )
    raycaster.setFromCamera(ndc, camera)
    const origin = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, origin)

    const now = performance.now()
    if (now - lastClickTime.current < COMBO_WINDOW) {
      comboCount.current = Math.min(comboCount.current + 1, 20)
    } else {
      comboCount.current = 1
    }
    lastClickTime.current = now
    comboCountRef.current = comboCount.current

    const combo = comboCount.current
    const intensity = 1 + combo * 0.4
    const count = Math.min(50 + combo * 20, 350)
    const baseHue = Math.random()

    const pattern = pickPattern(combo)
    spawnBurstPattern(pattern, origin, count, intensity, baseHue, spawnSpark)

    const ringColor = new THREE.Color().setHSL(baseHue, 1, 0.7)
    ringSpawnRef.current?.(origin, ringColor, 25 + combo * 5)

    shakeRef.current = Math.min(shakeRef.current + 1.0 + combo * 0.25, 8)
    flashRef.current = Math.min(0.5 + combo * 0.06, 1)

    if (flashEl.current) {
      const fo = flashRef.current
      flashEl.current.style.background = `radial-gradient(circle at ${(clientX / window.innerWidth * 100)}% ${(clientY / window.innerHeight * 100)}%, rgba(255,220,180,${fo}) 0%, rgba(255,120,160,${fo * 0.6}) 30%, transparent 65%)`
    }

    if (invertEl.current && combo >= 5) {
      invertEl.current.style.opacity = Math.min(0.15 + (combo - 5) * 0.05, 0.4).toString()
      setTimeout(() => { if (invertEl.current) invertEl.current.style.opacity = '0' }, 150)
    }

    if (colorShiftEl.current && combo >= 8) {
      colorShiftEl.current.style.opacity = Math.min(0.08 + (combo - 8) * 0.03, 0.25).toString()
      setTimeout(() => { if (colorShiftEl.current) colorShiftEl.current.style.opacity = '0' }, 250)
    }

    comboCallback.current?.(combo, clientX, clientY)
  }, [camera, raycaster, plane, spawnSpark, ringSpawnRef, comboCallback])

  const spawnTrailBurst = useCallback((worldPos: THREE.Vector3) => {
    const count = 3 + Math.floor(Math.random() * 4)
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2
      const speed = 0.2 + Math.random() * 0.4
      const vel = new THREE.Vector3(
        Math.cos(ang) * speed, Math.sin(ang) * speed,
        (Math.random() - 0.5) * 0.15,
      )
      const hue = (performance.now() * 0.0006 + Math.random() * 0.15) % 1
      const color = new THREE.Color().setHSL(hue, 0.9, 0.7)
      spawnSpark(worldPos, vel, 0.3 + Math.random() * 0.5, color, 0.8 + Math.random() * 1.5)
    }
  }, [spawnSpark])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const combo = comboCount.current

    raycaster.setFromCamera(mouse.current, camera)
    prevMouseWorld.current.copy(mouseWorld.current)
    raycaster.ray.intersectPlane(plane, mouseWorld.current)

    if (hasMoved.current) {
      const now = performance.now()
      const trailInterval = Math.max(8, 25 - combo)
      if (now - lastTrailSpawn.current > trailInterval && mouseWorld.current.distanceTo(prevMouseWorld.current) > 0.05) {
        spawnTrailBurst(mouseWorld.current)
        lastTrailSpawn.current = now
      }
    }

    const posArr = burstGeo.attributes.position.array as Float32Array
    const colArr = burstGeo.attributes.color.array as Float32Array
    const sizeArr = burstGeo.attributes.size.array as Float32Array

    for (let i = 0; i < POOL_SIZE; i++) {
      const p = pool.current[i]
      const ix = i * 3
      if (!p.active) {
        posArr[ix] = 9999
        posArr[ix + 1] = 9999
        posArr[ix + 2] = 9999
        colArr[ix] = 0
        colArr[ix + 1] = 0
        colArr[ix + 2] = 0
        sizeArr[i] = 0
        continue
      }
      p.life -= dt
      if (p.life <= 0) { p.active = false; continue }
      p.vel.y -= dt * (0.3 + combo * 0.03)
      p.vel.multiplyScalar(0.97)
      p.pos.addScaledVector(p.vel, dt * 60)
      const fade = Math.max(p.life / p.maxLife, 0)
      posArr[ix] = p.pos.x
      posArr[ix + 1] = p.pos.y
      posArr[ix + 2] = p.pos.z
      colArr[ix] = p.color.r * fade
      colArr[ix + 1] = p.color.g * fade
      colArr[ix + 2] = p.color.b * fade
      sizeArr[i] = p.size * (0.5 + fade * 0.5)
    }
    burstGeo.attributes.position.needsUpdate = true
    burstGeo.attributes.color.needsUpdate = true
    burstGeo.attributes.size.needsUpdate = true

    shakeRef.current *= 0.88
    const intensity = shakeRef.current
    const sx = (Math.random() - 0.5) * intensity
    const sy = (Math.random() - 0.5) * intensity
    const sz = Math.sin(timeRef.current * 10) * intensity * 0.1
    camera.position.set(sx, sy, BASE_CAM_Z + sz)

    if (flashEl.current) {
      flashRef.current *= 0.9
      const fo = flashRef.current
      flashEl.current.style.background = `radial-gradient(circle at var(--fx, 50%) var(--fy, 50%), rgba(255,220,180,${fo}) 0%, rgba(255,120,160,${fo * 0.6}) 30%, transparent 65%)`
    }
  })

  const timeRef = useRef(0)

  useEffect(() => {
    const el = gl.domElement
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
      hasMoved.current = true
    }
    const handleClick = (e: MouseEvent) => {
      if (e.button === 0) detonate(e.clientX, e.clientY)
    }
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('click', handleClick)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('click', handleClick)
    }
  }, [gl, mouse, detonate])

  return (
    <points geometry={burstGeo} material={burstMat} />
  )
}

function EchoPrismScene() {
  const mouse = useRef(new THREE.Vector2(0, 0))
  const mouseWorld = useRef(new THREE.Vector3(0, 0, 0))
  const detonateRef = useRef<((x: number, y: number) => void) | null>(null)
  const ringSpawnRef = useRef<((origin: THREE.Vector3, color: THREE.Color, maxScale: number) => void) | null>(null)
  const comboCallback = useRef<((combo: number, x: number, y: number) => void) | null>(null)
  const comboRef = useRef(0)

  return (
    <>
      <color attach="background" args={['#06040e']} />
      <AmbientParticles mouse={mouse} mouseWorld={mouseWorld} detonateRef={detonateRef} comboRef={comboRef} />
      <SparkSystem mouse={mouse} mouseWorld={mouseWorld} ringSpawnRef={ringSpawnRef} comboCallback={comboCallback} />
      <RingSystem spawnRef={ringSpawnRef} comboRef={comboRef} />
    </>
  )
}

function ComboPopup({ combo, x, y }: { combo: number; x: number; y: number }) {
  const hue = (combo * 37) % 360
  const labels = ['POP!', 'BOOM!', 'COMBO x2!', 'TRIPLE!', 'QUAD!', 'PENTA!', 'HEXA!', 'SEPTA!', 'OCTA!', 'NOVA!', 'SUPERNOVA!', 'VOID!', 'SINGULARITY!', 'BIG BANG!', 'OMEGA!', '???']
  const label = combo <= 1 ? (Math.random() > 0.5 ? 'POP!' : 'BOOM!') : (labels[Math.min(combo, labels.length - 1)] || `x${combo}`)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2, rotate: -12 }}
      animate={{
        opacity: [0, 1, 1, 0.8, 0],
        scale: [0.2, 1.3, 1.1, 1.2, 0.5],
        rotate: [-12, 6, 0, 0, 180],
        y: [0, -20, -40, -80, -120],
      }}
      transition={{ duration: 1.0, ease: 'easeOut' }}
      style={{
        left: x + (Math.random() - 0.5) * 40,
        top: y + (Math.random() - 0.5) * 40,
        color: `hsl(${hue}, 100%, 70%)`,
        fontSize: Math.min(16 + combo * 5, 80),
        textShadow: `
          0 0 20px hsl(${hue}, 100%, 70%),
          0 0 40px hsl(${(hue + 60) % 360}, 100%, 60%),
          0 0 80px hsl(${(hue + 120) % 360}, 100%, 50%)
        `,
      }}
      className="pointer-events-none fixed z-50 font-black -translate-x-1/2 -translate-y-1/2 whitespace-nowrap tracking-[-0.03em]"
    >
      {label}
    </motion.div>
  )
}

export function EchoPrism({ active, onClose }: { active: boolean; onClose: () => void }) {
  const [combos, setCombos] = useState<Array<{ id: number; combo: number; x: number; y: number }>>([])
  const comboId = useRef(0)
  const comboCallbackRef = useRef<((combo: number, x: number, y: number) => void) | null>(null)

  useEffect(() => {
    comboCallbackRef.current = (combo, x, y) => {
      const id = comboId.current++
      setCombos(prev => [...prev.slice(-30), { id, combo, x, y }])
      setTimeout(() => setCombos(prev => prev.filter(c => c.id !== id)), 1100)
    }
  }, [])

  useEffect(() => {
    if (!active) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active, onClose])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="echo-prism"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50"
        >
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, BASE_CAM_Z], fov: 60 }}
            style={{ background: '#06040e', width: '100vw', height: '100vh' }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          >
            <EchoPrismScene />
          </Canvas>

          {combos.map(c => (
            <ComboPopup key={c.id} combo={c.combo} x={c.x} y={c.y} />
          ))}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs font-mono text-white/15 tracking-[0.15em] z-[60]"
          >
            ESC to dismiss
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
