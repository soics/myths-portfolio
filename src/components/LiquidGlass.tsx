import { type ReactNode } from 'react'
import { useLiquidGlass } from '../hooks/useLiquidGlass'

interface Props {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'article' | 'span'
  /** 'panel' = full glass bg+blur, 'ghost' = tilt+glow only, 'hero' = large text glass */
  variant?: 'panel' | 'ghost' | 'hero'
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

  const baseClasses = 'relative overflow-hidden rounded-2xl transition-shadow duration-500 lg-panel'

  const variantClasses = {
    panel: 'bg-deep/60 backdrop-blur-xl border border-white/[0.06]',
    ghost: 'bg-transparent border-0',
    hero: 'bg-deep/40 backdrop-blur-lg border border-white/[0.04]',
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
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(600px circle at var(--lg-glow-x, 50%) var(--lg-glow-y, 50%), rgba(212,212,220,0.06), transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl -z-10"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(135deg, rgba(212,212,220,0.04) 0%, transparent 40%, transparent 60%, rgba(136,136,160,0.03) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 lg-ripple-overlay"
        aria-hidden="true"
      />
      {children}
    </Tag>
  )
}
