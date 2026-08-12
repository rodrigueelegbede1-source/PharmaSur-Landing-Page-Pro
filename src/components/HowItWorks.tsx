import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Reveal, SectionHead } from './primitives'

const steps = [
  {
    num: '01',
    title: 'Composez votre liste',
    body: "Ajoutez les produits de votre ordonnance un à un. PharmaSur interroge les stocks des pharmacies partenaires pour la liste entière, pas seulement pour un médicament.",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.4-3.4" />
      </>
    ),
  },
  {
    num: '02',
    title: 'Repérez la plus complète',
    body: 'Les officines sont classées par nombre de produits disponibles, et pas seulement par distance : celles qui couvrent toute votre liste apparaissent en premier, avec horaires, gardes de nuit et itinéraire GPS.',
    icon: (
      <>
        <path d="M12 21s-7-4.8-7-10a7 7 0 1 1 14 0c0 5.2-7 10-7 10Z" />
        <circle cx="12" cy="11" r="2.5" />
      </>
    ),
  },
  {
    num: '03',
    title: 'Scannez et authentifiez',
    body: 'Sur place, scannez le code de la boîte : PharmaSur confirme en une seconde si le médicament est authentique ou contrefait.',
    icon: (
      <>
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
        <path d="M7 12h10" />
      </>
    ),
  },
]

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'center 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 })
  const scaleX = useTransform(progress, [0, 1], [0, 1])

  return (
    <section id="how" className="py-20 lg:py-28">
      <div className="rail">
        <SectionHead
          eyebrow="Comment ça marche"
          title="Trois étapes, moins d'une minute"
          lede="De la recherche du médicament à la vérification de la boîte, PharmaSur vous accompagne à chaque étape."
        />

        <div ref={ref} className="relative mt-14 lg:mt-20">
          {/* Fil conducteur tracé au scroll, uniquement sur grand écran */}
          <div
            aria-hidden
            className="absolute top-11 right-[16%] left-[16%] hidden h-px bg-line lg:block"
          >
            <motion.div style={{ scaleX }} className="h-px w-full origin-left bg-green-400" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.1}>
                <article className="group relative h-full rounded-3xl border border-line bg-paper p-7 transition-all duration-500 ease-[var(--ease-cine)] hover:-translate-y-1.5 hover:border-green-200 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="grid size-14 place-items-center rounded-2xl bg-green-50 text-green-600 transition-colors duration-500 group-hover:bg-green-600 group-hover:text-white">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-6"
                        aria-hidden
                      >
                        {s.icon}
                      </svg>
                    </span>
                    <span className="text-[1.6rem] font-extrabold tracking-tight text-green-100 transition-colors duration-500 group-hover:text-green-200">
                      {s.num}
                    </span>
                  </div>

                  <h3 className="mt-7 text-[1.2rem]">{s.title}</h3>
                  <p className="mt-3 text-[0.98rem]">{s.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
