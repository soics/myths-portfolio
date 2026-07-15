import { useState, useEffect } from 'react'

const BUILD_STEPS = [
  { cmd: 'bun run build', msg: 'Compiling portfolio...', duration: 800 },
  { cmd: '', msg: '→ src/components/**/*.tsx ✓', duration: 600 },
  { cmd: '', msg: '→ src/styles/tokens.css ✓', duration: 400 },
  { cmd: '', msg: '→ src/hooks/**/*.ts ✓', duration: 500 },
  { cmd: '', msg: '→ src/lib/**/*.ts ✓', duration: 300 },
  { cmd: '', msg: '→ all assets optimized ✓', duration: 400 },
  { cmd: '', msg: 'Build complete. Ready for deploy.', duration: 200 },
]

export function Terminal() {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (visibleSteps >= BUILD_STEPS.length) return
    const t = setTimeout(() => setVisibleSteps((v) => v + 1), BUILD_STEPS[visibleSteps].duration)
    return () => clearTimeout(t)
  }, [visibleSteps])

  useEffect(() => {
    const i = setInterval(() => setShowCursor((c) => !c), 530)
    return () => clearInterval(i)
  }, [])

  const restart = () => {
    setVisibleSteps(0)
  }

  return (
    <div
      className="focus-ring w-full max-w-xl rounded-lg border border-blueprint/15 bg-deep/60 backdrop-blur-sm font-mono text-xs"
      onClick={restart}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') restart() }}
      aria-label="Build terminal — click to restart"
    >
      <div className="flex items-center gap-1.5 border-b border-blueprint/15 px-3 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
        <span className="ml-2 text-[9px] tracking-[0.1em] text-blueprint/30 uppercase">build.sh</span>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 text-blueprint/40">
          <span>$</span>
          <span>~/projects/myths-portfolio</span>
          <span className="text-blueprint/20">(main)</span>
        </div>
        {BUILD_STEPS.slice(0, visibleSteps).map((step, i) => (
          <div key={i} className="flex items-start gap-2 leading-5">
            {step.cmd ? (
              <>
                <span className="text-green-400/60 shrink-0">$</span>
                <span className="text-green-400/80">{step.cmd}</span>
              </>
            ) : (
              <>
                <span className="text-blueprint/20 shrink-0">{'>'}</span>
                <span className="text-concrete-light/50">{step.msg}</span>
              </>
            )}
          </div>
        ))}
        {visibleSteps < BUILD_STEPS.length && (
          <span className={`inline-block w-1.5 h-4 bg-gold/50 ml-0.5 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
        )}
        {visibleSteps >= BUILD_STEPS.length && (
          <div className="mt-2 text-[9px] text-blueprint/25 tracking-[0.1em]">
            [click anywhere to rebuild]
          </div>
        )}
      </div>
    </div>
  )
}
