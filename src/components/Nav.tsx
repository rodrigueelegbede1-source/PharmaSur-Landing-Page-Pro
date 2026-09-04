import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { cx } from '../lib/cx'
import { ArrowRight } from './primitives'

const links = [
  { label: 'Comment ça marche', href: '#how' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'Témoignages', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export function Logo({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
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
      <span
        className={cx(
          'text-[1.15rem] font-extrabold tracking-[-0.02em]',
          tone === 'dark' ? 'text-white' : 'text-ink',
        )}
      >
        Pharma<span className={tone === 'dark' ? 'text-green-400' : 'text-green-600'}>Sur</span>
      </span>
    </span>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 8))

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/*
        Même bandeau vert foncé que la carte de partage : le site s'ouvre comme
        le lien s'annonce sur WhatsApp, sans rupture entre l'aperçu et la page.
      */}
      <div
        className={cx(
          'bg-green-950/90 backdrop-blur-xl transition-all duration-400 ease-[var(--ease-cine)]',
          scrolled ? 'border-b border-white/10 shadow-md' : 'border-b border-transparent',
        )}
      >
        <div className="rail flex h-18 items-center justify-between">
          <a href="#hero" aria-label="Accueil PharmaSur">
            <Logo tone="dark" />
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative py-1.5 text-[0.95rem] font-semibold text-green-100/85 transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-green-400 transition-transform duration-400 ease-[var(--ease-cine)] group-hover:scale-x-100" />
              </a>
            ))}
            <a
              href="#telecharger"
              className="group inline-flex items-center gap-2 rounded-full bg-green-400 px-5 py-2.5 text-[0.88rem] font-bold whitespace-nowrap text-green-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              Télécharger
              <ArrowRight />
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="nav-mobile"
            className="grid size-10 place-items-center rounded-full border border-white/20 lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={cx(
                  'absolute inset-x-0 h-0.5 rounded-full bg-white transition-all duration-300',
                  open ? 'top-1.5 rotate-45' : 'top-0',
                )}
              />
              <span
                className={cx(
                  'absolute inset-x-0 top-1.5 h-0.5 rounded-full bg-white transition-opacity duration-200',
                  open ? 'opacity-0' : 'opacity-100',
                )}
              />
              <span
                className={cx(
                  'absolute inset-x-0 h-0.5 rounded-full bg-white transition-all duration-300',
                  open ? 'top-1.5 -rotate-45' : 'top-3',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-white/10 bg-green-950 shadow-md lg:hidden"
          >
            <div className="rail flex flex-col py-3">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-white/10 py-3.5 font-semibold text-green-100/85 last:border-0"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#telecharger"
                onClick={() => setOpen(false)}
                className="mt-4 mb-2 inline-flex items-center justify-center gap-2 rounded-full bg-green-400 px-5 py-3 font-bold text-green-950"
              >
                Télécharger
                <ArrowRight />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
