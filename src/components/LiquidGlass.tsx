import { type ReactNode } from 'react'
import { useLiquidGlass } from '../hooks/useLiquidGlass'

interface Props {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'article' | 'span'
  variant?: 'panel' | 'ghost' | 'hero' | 'button' | 'elevated'
  tilt?: number
  onClick?: (e: React.MouseEvent) => void
}

export function LiquidGlass({
  children,
  className = '',
  as: Tag = 'div',
  variant = 'panel',
  tilt = 8,
  onClick,
}: Props) {
  const { ref, triggerRipple } = useLiquidGlass({ maxTilt: tilt })

  const handleClick = (e: React.MouseEvent) => {
    triggerRipple(e)
    onClick?.(e)
  }

  const baseClasses = 'relative overflow-hidden rounded-[20px] transition-all duration-500 lg-panel'

  const variantClasses = {
    panel: 'bg-deep-elevated/70 backdrop-blur-xl border border-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.03)]',
    elevated: 'bg-deep-elevated/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]',
    ghost: 'bg-transparent border-0',
    hero: 'bg-deep-elevated/50 backdrop-blur-lg border border-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]',
    button: 'bg-deep-elevated/50 backdrop-blur-md border border-white/[0.04] !rounded-xl !px-5 !py-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]',
  }

  return (
    <Tag
      ref={ref}
      onClick={handleClick}
      className={[baseClasses, variantClasses[variant], className].join(' ')}
      style={{
        transform: 'perspective(1000px) rotateX(var(--lg-tilt-y, 0deg)) rotateY(var(--lg-tilt-x, 0deg)) translateZ(0)',
        willChange: 'transform',
      }}
    >
      {/* Ambient glow overlay — follows mouse */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(600px circle at var(--lg-glow-x, 50%) var(--lg-glow-y, 50%), rgba(196,164,85,0.04), transparent 60%)',
        }}
      />
      {/* Top-left shine */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[20px] -z-10"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%)',
        }}
      />
      {/* Ripple overlay for click feedback */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 lg-ripple-overlay"
        aria-hidden="true"
      />
      {/* Inner edge highlight — Apple-style */}
      <div
        className="pointer-events-none absolute inset-[0.5px] rounded-[19.5px] -z-10"
        aria-hidden="true"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}
      />
      {children}
    </Tag>
  )
}
