import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cx } from '../lib/cx'

const QUERY = 'Paracétamol 500 mg'

const results = [
  { name: 'Pharmacie de la Riviera', meta: '1,2 km • Ouvert 24h/24', stock: 'En stock', best: true },
  { name: 'Pharmacie Saint-Jean', meta: '2,4 km • Ferme à 22h', stock: 'En stock' },
  { name: 'Pharmacie du Plateau', meta: '4,8 km • Ouvert', stock: 'Rupture' },
]

/** Frappe du nom du médicament, jouée une fois à l'entrée dans le viewport. */
function useTypewriter(active: boolean, text: string, speed = 55) {
  const [typed, setTyped] = useState('')
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!active) return
    if (reduced) {
      setTyped(text)
      return
    }
    let i = 0
    const id = setInterval(() => {
      i += 1
      setTyped(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [active, reduced, speed, text])

  return typed
}

export function PhoneMock() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const typed = useTypewriter(inView, QUERY)
  const done = typed.length === QUERY.length

  return (
    <div ref={ref} className="relative grid place-items-center">
      {/* Halos hérités de la maquette d'origine, atténués */}
      <div
        aria-hidden
        className="absolute top-[4%] right-[2%] size-64 rounded-full bg-green-400/45 blur-[70px]"
      />
      <div
        aria-hidden
        className="absolute bottom-[6%] left-0 size-56 rounded-full bg-green-200/70 blur-[70px]"
      />

      <div className="relative z-10 w-[min(320px,82vw)] rounded-[2.6rem] bg-ink p-3 shadow-lg motion-safe:animate-[float-soft_7s_ease-in-out_infinite]">
        <div className="absolute top-3 left-1/2 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-ink" />

        <div className="flex aspect-[320/640] flex-col gap-2.5 overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,var(--color-green-50),#fff_40%)] px-3.5 pt-9 pb-3.5">
          {/* Barre d'app */}
          <div className="flex items-baseline justify-between px-0.5">
            <span className="font-extrabold text-ink">Rechercher</span>
            <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold text-green-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-3" aria-hidden>
                <path d="M12 21s-7-4.8-7-10a7 7 0 1 1 14 0c0 5.2-7 10-7 10Z" />
              </svg>
              Abidjan, Cocody
            </span>
          </div>

          {/* Champ de recherche : frappe en direct */}
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-2.5 py-2 shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="size-4 shrink-0 text-green-600"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" />
            </svg>
            <span className="text-[0.8rem] font-medium text-ink">
              {typed || <span className="text-body-soft">Nom du médicament…</span>}
              {!done && <span className="ml-px inline-block h-3.5 w-px bg-green-600 align-middle" />}
            </span>
          </div>

          {/* Résultats */}
          <div className="flex flex-col gap-2">
            {results.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 10 }}
                animate={done ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={cx(
                  'flex items-center justify-between gap-2 rounded-xl border bg-white px-2.5 py-2',
                  r.best ? 'border-green-400 shadow-[0_8px_20px_rgb(18_133_93/0.14)]' : 'border-line',
                )}
              >
                <div>
                  <p className="text-[0.78rem] font-bold text-ink">{r.name}</p>
                  <p className="text-[0.68rem] text-body">{r.meta}</p>
                </div>
                <span
                  className={cx(
                    'rounded-full px-2 py-0.5 text-[0.62rem] font-bold whitespace-nowrap',
                    r.stock === 'En stock'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-[#eef1f0] text-body-soft',
                  )}
                >
                  {r.stock}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Carte de scan, ancrée en bas comme dans l'original */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={done ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-auto flex items-center gap-2.5 overflow-hidden rounded-2xl bg-green-900 px-3 py-2.5 text-white"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-green-400/80 motion-safe:animate-[scanline_3.2s_ease-in-out_infinite]"
            />
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/12 text-green-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4.5"
                aria-hidden
              >
                <path d="M12 3 4 6v6c0 4.4 3.4 8.2 8 9 4.6-.8 8-4.6 8-9V6l-8-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <div>
              <p className="text-[0.78rem] font-bold">Boîte authentifiée</p>
              <p className="text-[0.66rem] text-white/70">Lot #CI-4471 • Vérifié</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Vignette flottante : preuve de fraîcheur de la donnée */}
      <motion.div
        initial={{ opacity: 0, x: -12, scale: 0.95 }}
        animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-10 -left-2 z-20 hidden items-center gap-2.5 rounded-2xl border border-line bg-white/95 px-3.5 py-2.5 shadow-md backdrop-blur sm:flex lg:-left-8"
      >
        <span className="relative flex size-2.5 items-center justify-center">
          <span className="absolute size-2.5 rounded-full bg-green-500/50 animate-[pulse-ring_2.2s_ease-out_infinite] motion-reduce:animate-none" />
          <span className="size-2 rounded-full bg-green-500" />
        </span>
        <span className="text-[0.78rem] font-semibold text-ink">
          Stocks synchronisés <span className="font-medium text-body">il y a 30 s</span>
        </span>
      </motion.div>
    </div>
  )
}
