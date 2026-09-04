import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import type { Etat } from './donnees'

export { Icone } from './icones'

/* Briques communes aux écrans. Mêmes jetons que le site : l'application et la
   landing page doivent se ressembler, un patient passe de l'une à l'autre. */

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-9.5 place-items-center rounded-xl bg-[linear-gradient(140deg,var(--color-green-500),var(--color-green-700))] text-white shadow-glow">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden
        >
          <path d="M12 21s-7-4.8-7-10a7 7 0 1 1 14 0c0 5.2-7 10-7 10Z" />
          <path d="M12 8v6M9 11h6" />
        </svg>
      </span>
      {!compact && (
        <span className="text-[1.18rem] font-extrabold tracking-[-0.02em] text-ink">
          Pharma<span className="text-green-600">Sur</span>
        </span>
      )}
    </span>
  )
}

export function EnTete({ titre, chapo, action }: { titre: string; chapo?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 px-5 pt-5">
      {action}
      <h1 className="text-[1.65rem] leading-[1.15] font-extrabold tracking-[-0.03em] text-ink">
        {titre}
      </h1>
      {chapo && <p className="text-[0.88rem] leading-relaxed text-body">{chapo}</p>}
    </div>
  )
}

export function Puce({
  ton = 'neutre',
  children,
}: {
  ton?: 'vert' | 'ambre' | 'rouge' | 'neutre'
  children: ReactNode
}) {
  const tons = {
    vert: 'bg-green-100 text-green-800',
    ambre: 'bg-[#fdf3e3] text-[#8a5a12]',
    rouge: 'bg-[#fbe9ea] text-alert',
    neutre: 'bg-line-soft text-body',
  }
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center rounded-lg px-2.5 py-1 text-[0.72rem] font-extrabold',
        tons[ton],
      )}
    >
      {children}
    </span>
  )
}

/*
 * L'étiquette d'état est le cœur de la doctrine du produit : « incertain »
 * n'est pas un demi-« disponible », c'est un avertissement. Ne jamais le
 * rendre vert, ne jamais le masquer pour faire plus propre.
 */
export function EtatPuce({ etat, heures }: { etat: Etat; heures?: number }) {
  if (etat === 'disponible') return <Puce ton="vert">En stock</Puce>
  if (etat === 'incertain')
    return <Puce ton="ambre">Incertain{heures ? ` · ${Math.round(heures / 24)} j` : ''}</Puce>
  return <Puce ton="rouge">Absent</Puce>
}

export function Bouton({
  children,
  onClick,
  variante = 'primaire',
  block = false,
  href,
}: {
  children: ReactNode
  onClick?: () => void
  variante?: 'primaire' | 'clair' | 'contour'
  block?: boolean
  href?: string
}) {
  const variantes = {
    primaire: 'bg-green-600 text-white shadow-glow active:bg-green-700',
    clair: 'bg-green-50 text-green-700 active:bg-green-100',
    contour: 'border border-line bg-paper text-green-700 active:bg-green-50',
  }
  const classe = cx(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[0.92rem] font-extrabold transition-transform duration-150 active:scale-[0.98]',
    variantes[variante],
    block && 'w-full',
  )
  if (href) {
    return (
      <a href={href} className={classe}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={classe}>
      {children}
    </button>
  )
}

export function Carte({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('rounded-2xl border border-line bg-paper p-4', className)}>{children}</div>
  )
}

/*
 * Bandeau de démonstration. Il est volontairement impossible à confondre avec
 * du contenu : quiconque installe cette application doit savoir en une seconde
 * que les officines, les stocks et les prix affichés sont fictifs.
 */
export function BandeauDemo() {
  return (
    <div className="flex items-start gap-2.5 border-b border-[#f0dcb4] bg-[#fdf7ea] px-5 py-2.5">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8a5a12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-px size-4 shrink-0"
        aria-hidden
      >
        <path d="M12 3 2 20h20L12 3Z" />
        <path d="M12 10v4M12 17h.01" />
      </svg>
      <p className="text-[0.72rem] leading-snug font-semibold text-[#8a5a12]">
        Démonstration : officines, stocks et prix sont fictifs. Ne vous en servez pas pour un vrai
        besoin de santé.
      </p>
    </div>
  )
}

export function Svg({
  children,
  className = 'size-5',
  trait = 2,
}: {
  children: ReactNode
  className?: string
  trait?: number
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={trait}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  )
}
