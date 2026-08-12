import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { cx } from '../lib/cx'
import { HeroBackdrop } from './HeroBackdrop'
import { PhoneMock } from './PhoneMock'
import { ArrowRight, Badge, Button, Counter } from './primitives'

const stats = [
  { to: 1400, suffix: '+', label: 'Pharmacies partenaires' },
  /* À ACTUALISER avant mise en ligne : chiffres encore provisoires, repris de la maquette. */
  { to: 98, suffix: '%', label: 'Scans authentifiés' },
  { to: 45, suffix: 's', label: 'Recherche moyenne' },
]

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0])

  return (
    <section
      id="hero"
      ref={ref}
      className="relative isolate overflow-hidden bg-white pt-28 pb-16 lg:pt-36 lg:pb-24"
    >
      <HeroBackdrop />

      <motion.div style={reduced ? undefined : { y, opacity: fade }} className="rail">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <div className="animate-[ps-fade_0.7s_var(--ease-cine)_both] motion-reduce:animate-none">
              <Badge>Disponible en Côte d'Ivoire</Badge>
            </div>

            <h1 className="mt-6 text-[2.35rem] sm:text-[3.2rem] lg:text-[3.6rem]">
              {['Trouvez vos médicaments.', 'Vérifiez leur authenticité', 'instantanément.'].map(
                (line, i) => (
                  <span key={line} className="block overflow-hidden pb-[0.08em]">
                    <span
                      className={cx(
                        'block animate-[ps-line_1.05s_var(--ease-cine)_both] motion-reduce:animate-none',
                        i > 0 && 'grad',
                      )}
                      style={{ animationDelay: `${0.08 + i * 0.1}s` }}
                    >
                      {line}
                    </span>
                  </span>
                ),
              )}
            </h1>

            <p
              className="mt-6 max-w-[34rem] animate-[ps-rise_0.9s_var(--ease-cine)_both] text-[1.05rem] motion-reduce:animate-none sm:text-[1.12rem]"
              style={{ animationDelay: '0.42s' }}
            >
              Ajoutez les produits de votre ordonnance : vous en connaissez le coût avant même de
              sortir de chez vous, et PharmaSur classe les pharmacies proches selon le nombre de
              médicaments réellement disponibles. Chaque boîte s'authentifie ensuite en un scan.
            </p>

            <div
              className="mt-8 flex flex-wrap gap-3 animate-[ps-rise_0.9s_var(--ease-cine)_both] motion-reduce:animate-none"
              style={{ animationDelay: '0.54s' }}
            >
              <Button href="#pricing" size="lg">
                Télécharger l'application
                <ArrowRight />
              </Button>
              <Button href="#how" variant="ghost" size="lg">
                Voir comment ça marche
              </Button>
            </div>

            <ul
              className="mt-11 flex flex-wrap gap-x-10 gap-y-6 animate-[ps-fade_0.9s_linear_both] motion-reduce:animate-none"
              style={{ animationDelay: '0.75s' }}
            >
              {stats.map((s) => (
                <li key={s.label} className="relative pl-4">
                  <span className="absolute top-1.5 left-0 h-[calc(100%-0.75rem)] w-0.5 rounded-full bg-green-200" />
                  <strong className="block text-[1.75rem] leading-none font-extrabold text-green-700">
                    <Counter to={s.to} suffix={s.suffix} />
                  </strong>
                  <span className="mt-1 block text-[0.85rem]">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="animate-[ps-rise_1.15s_var(--ease-cine)_both] [--rise:28px] motion-reduce:animate-none"
            style={{ animationDelay: '0.3s' }}
          >
            <PhoneMock />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
