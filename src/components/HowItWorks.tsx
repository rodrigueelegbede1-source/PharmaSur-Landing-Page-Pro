import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { type ReactNode, useRef } from 'react'
import { ArrowRight, Button, Reveal, SectionHead } from './primitives'

/*
 * Il y avait ici une troisième étape, « Scannez et authentifiez ». Elle a été
 * retirée : authentifier une boîte suppose une base de codes authentiques que
 * le projet n'a pas. Tant qu'elle n'existe pas, l'annoncer sur la page revient
 * à promettre à un patient une vérification qu'il n'obtiendra pas — sur un
 * produit de santé, c'est la promesse la plus grave qu'on puisse tenir à faux.
 * Ne pas la remettre avant que la base existe et soit interrogeable.
 */
const steps: { num: string; id?: string; title: string; body: string; icon: ReactNode }[] = [
  {
    num: '01',
    title: 'Composez votre liste',
    body: "Ajoutez les produits de votre ordonnance un à un : le coût total se calcule au fur et à mesure. PharmaSur interroge ensuite les stocks pour la liste entière, pas seulement pour un médicament.",
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
    body: "Les officines sont classées par nombre de produits disponibles, et pas seulement par distance. En retenant la vôtre, vous voyez ses horaires, son itinéraire et les bons d'assurance qu'elle accepte en caisse — et, si un produit manque partout, son équivalent générique.",
    icon: (
      <>
        <path d="M12 21s-7-4.8-7-10a7 7 0 1 1 14 0c0 5.2-7 10-7 10Z" />
        <circle cx="12" cy="11" r="2.5" />
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
          title="Deux étapes, moins d'une minute"
          lede="De la liste de votre ordonnance à l'officine qui la sert le plus complètement, sans passer un appel."
        />

        <div ref={ref} className="relative mt-14 lg:mt-20">
          {/* Fil conducteur tracé au scroll, uniquement sur grand écran. Les
              bornes suivent le centre des colonnes : 16 % quand il y en avait
              trois, 25 % maintenant qu'il y en a deux. */}
          <div
            aria-hidden
            className="absolute top-11 right-[25%] left-[25%] hidden h-px bg-line lg:block"
          >
            <motion.div style={{ scaleX }} className="h-px w-full origin-left bg-green-400" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.1}>
                <article
                  id={s.id}
                  className="group relative h-full scroll-mt-28 rounded-3xl border border-line bg-paper p-7 transition-all duration-500 ease-[var(--ease-cine)] hover:-translate-y-1.5 hover:border-green-200 hover:shadow-md"
                >
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

        {/*
          La section expliquait les trois étapes puis s'arrêtait : le visiteur
          convaincu n'avait aucune suite sous la main et devait remonter au
          menu. C'est le seul endroit de la page où l'appel à l'action
          manquait vraiment.
        */}
        <Reveal delay={0.35}>
          <div className="mt-14 flex flex-col items-center gap-4 lg:mt-16">
            <Button href="#telecharger" size="lg">
              Télécharger l'application
              <ArrowRight />
            </Button>
            <p className="text-[0.88rem] text-body-soft">
              Gratuit pour les patients · Disponible en Côte d'Ivoire
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
