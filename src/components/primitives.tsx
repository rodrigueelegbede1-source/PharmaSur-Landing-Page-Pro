import { motion, useInView, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cx } from '../lib/cx'

/**
 * Révélation au scroll : translation courte, longue durée, easing décéléré.
 * Jouée une seule fois — rien ne rejoue quand on remonte la page.
 */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'span' | 'li' | 'p'
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as]

  return (
    <MotionTag
      className={className}
      initial={reduced ? undefined : { opacity: 0, y }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx('eyebrow inline-flex items-center gap-2 text-green-600', className)}>
      <span className="h-px w-6 bg-green-400" />
      {children}
    </span>
  )
}

/** Pastille « Disponible en Côte d'Ivoire » avec point pulsé. */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-paper px-3.5 py-1.5 text-[0.82rem] font-bold text-green-700 shadow-sm">
      <span className="relative flex size-2 items-center justify-center">
        <span className="absolute size-2 rounded-full bg-green-500/50 animate-[pulse-ring_2.2s_ease-out_infinite] motion-reduce:animate-none" />
        <span className="size-2 rounded-full bg-green-500" />
      </span>
      {children}
    </span>
  )
}

type ButtonProps = {
  children: ReactNode
  /*
   * Obligatoire, et sans valeur par défaut : le repli silencieux vers
   * « #pricing » transformait un bouton dont on avait oublié la destination
   * en bouton qui marche mais qui ment. Une destination manquante doit
   * casser la compilation, pas emmener le visiteur ailleurs.
   */
  href: string
  variant?: 'primary' | 'ghost' | 'dark'
  size?: 'md' | 'lg'
  block?: boolean
  className?: string
}

const sizes = { md: 'px-5 py-2.5 text-[0.9rem]', lg: 'px-7 py-3.5 text-base' }

export function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  block = false,
  className,
}: ButtonProps) {
  const variants = {
    primary:
      'bg-green-600 text-white shadow-glow hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg',
    ghost:
      'border border-line bg-paper text-green-700 hover:border-green-400 hover:-translate-y-0.5 hover:shadow-md',
    dark: 'bg-green-900 text-white hover:bg-green-950 hover:-translate-y-0.5',
  }

  return (
    <a
      href={href}
      className={cx(
        'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-bold transition-all duration-300 ease-[var(--ease-cine)]',
        sizes[size],
        variants[variant],
        block && 'w-full',
        className,
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant !== 'ghost' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -skew-x-12 bg-white/20 blur-md group-hover:animate-[sweep_0.9s_var(--ease-cine)]"
          style={{ transform: 'translateX(-120%)' }}
        />
      )}
    </a>
  )
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cx(
        'size-4 transition-transform duration-300 group-hover:translate-x-0.5',
        className,
      )}
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

/** Compteur qui s'incrémente une seule fois, à l'entrée dans le viewport. */
export function Counter({
  to,
  suffix = '',
  decimals = 0,
}: {
  to: number
  suffix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduced = useReducedMotion()
  const spring = useSpring(0, { stiffness: 55, damping: 20, mass: 1 })

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      spring.jump(to)
      return
    }
    spring.set(to)
  }, [inView, reduced, spring, to])

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const write = (v: number) => {
      node.textContent = `${v.toLocaleString('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`
    }
    write(spring.get())
    return spring.on('change', write)
  }, [decimals, spring, suffix])

  return <span ref={ref} className="tabular-nums" />
}

export function SectionHead({
  eyebrow,
  title,
  lede,
  align = 'center',
  tone = 'light',
}: {
  eyebrow: string
  title: ReactNode
  lede?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
}) {
  return (
    <div className={cx('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      <Reveal>
        <Eyebrow className={cx(align === 'center' && 'justify-center', tone === 'dark' && 'text-green-400')}>
          {eyebrow}
        </Eyebrow>
      </Reveal>
      <Reveal delay={0.06}>
        <h2
          className={cx(
            'mt-4 text-[2rem] sm:text-[2.6rem]',
            tone === 'dark' && 'text-white',
          )}
        >
          {title}
        </h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.12}>
          <p className={cx('mt-4 text-[1.05rem]', tone === 'dark' ? 'text-green-100/80' : 'text-body')}>
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  )
}
