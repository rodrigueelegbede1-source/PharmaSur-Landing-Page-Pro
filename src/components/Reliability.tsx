import { cx } from '../lib/cx'
import { Reveal, SectionHead } from './primitives'

/*
 * À CONSTRUIRE : cette section décrit le dispositif de fiabilité du stock, pas
 * un existant. Elle répond à l'objection centrale du visiteur — « comment
 * savez-vous que la pharmacie l'a vraiment ? » — et ne doit rester en ligne que
 * si les trois mécanismes sont effectivement mis en œuvre.
 */
const sources = [
  {
    title: 'Les officines équipées',
    body: "Les pharmacies dotées d'un logiciel de gestion transmettent leur stock en continu. Rien à saisir, rien à oublier.",
    icon: (
      <>
        <path d="M20 11a8 8 0 0 0-14.9-3.9M4 13a8 8 0 0 0 14.9 3.9" />
        <path d="M4 4v4h4M20 20v-4h-4" />
      </>
    ),
  },
  {
    title: 'Les autres, en un geste',
    body: "Celles qui n'en ont pas confirment depuis leur téléphone, sans installer de logiciel ni acheter de matériel.",
    icon: (
      <>
        <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
        <path d="m9.5 12 2 2 3.5-3.5" />
      </>
    ),
  },
  {
    title: 'Vous, en repartant',
    body: 'Sur place, vous indiquez en un geste si le produit était bien là. Chaque passage corrige la carte pour le suivant.',
    icon: (
      <>
        <path d="M12 21s-7-4.8-7-10a7 7 0 1 1 14 0c0 5.2-7 10-7 10Z" />
        <path d="m9.4 10.8 2 2 3.2-3.2" />
      </>
    ),
  },
]

export function Reliability() {
  return (
    <section id="fiabilite" className="border-t border-line-soft py-20 lg:py-28">
      <div className="rail">
        <SectionHead
          eyebrow="Fiabilité"
          title="Comment nous savons que le stock est juste"
          lede="Un stock faux fait faire trois kilomètres pour rien. La donnée est donc vérifiée par trois voies qui se corrigent entre elles."
        />

        <div className="mt-14 grid gap-y-10 sm:grid-cols-3 sm:gap-x-0 lg:mt-20">
          {sources.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="h-full">
              <div
                className={cx(
                  'flex h-full flex-col sm:px-7',
                  i > 0 && 'sm:border-l sm:border-line',
                )}
              >
                <span className="grid size-11 place-items-center rounded-xl bg-green-50 text-green-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                    aria-hidden
                  >
                    {s.icon}
                  </svg>
                </span>
                <h3 className="mt-5 text-[1.05rem]">{s.title}</h3>
                <p className="mt-2.5 text-[0.95rem]">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="mx-auto mt-14 max-w-2xl text-center text-[0.95rem] text-body-soft">
            Et quand la donnée vieillit, nous le disons :{' '}
            <span className="font-semibold text-ink">
              chaque officine affiche la date de sa dernière vérification
            </span>{' '}
            plutôt que de laisser croire à une certitude.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
