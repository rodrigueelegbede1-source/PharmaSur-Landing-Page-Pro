import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
              <Badge>Disponible en Côte d'Ivoire</Badge>
            </motion.div>

            <h1 className="mt-6 text-[2.35rem] sm:text-[3.2rem] lg:text-[3.6rem]">
              {['Trouvez vos médicaments.', 'Vérifiez leur authenticité', 'instantanément.'].map(
                (line, i) => (
                  <span key={line} className="block overflow-hidden pb-[0.08em]">
                    <motion.span
                      className={i === 0 ? 'block' : 'grad block'}
                      initial={reduced ? undefined : { y: '105%' }}
                      animate={reduced ? undefined : { y: '0%' }}
                      transition={{ duration: 1.05, delay: 0.08 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ),
              )}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-[34rem] text-[1.05rem] sm:text-[1.12rem]"
            >
              PharmaSur géolocalise en temps réel les pharmacies qui ont votre médicament en stock et
              authentifie chaque boîte en un scan pour vous protéger de la contrefaçon.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.54, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button href="#pricing" size="lg">
                Télécharger l'application
                <ArrowRight />
              </Button>
              <Button href="#how" variant="ghost" size="lg">
                Voir comment ça marche
              </Button>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.75 }}
              className="mt-11 flex flex-wrap gap-x-10 gap-y-6"
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
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <PhoneMock />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
