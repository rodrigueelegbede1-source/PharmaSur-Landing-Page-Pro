import { Reveal, SectionHead } from './primitives'

const quotes = [
  {
    text: "Mon fils avait besoin d'un antibiotique à 23h. En deux minutes j'ai trouvé une pharmacie de garde à Yopougon qui l'avait vraiment en stock.",
    initials: 'AK',
    name: 'Aminata Koné',
    role: 'Mère de famille, Abidjan',
  },
  {
    text: 'Depuis que notre officine est sur PharmaSur, nous recevons chaque jour de nouveaux patients qui savent déjà que le produit est disponible chez nous.',
    initials: 'DY',
    name: 'Dr Yao Kouassi',
    role: 'Pharmacien titulaire, Bouaké',
  },
  {
    text: "Le scanner a détecté un lot contrefait acheté hors circuit. C'est un outil de santé publique dont nous avions réellement besoin.",
    initials: 'FT',
    name: 'Fatou Traoré',
    role: 'Infirmière, Korhogo',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28">
      <div className="rail">
        <SectionHead
          eyebrow="Témoignages"
          title="Ils utilisent PharmaSur au quotidien"
          lede="Patients, pharmaciens et soignants témoignent de leur expérience."
        />

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.1} className="h-full">
              <figure className="group relative flex h-full flex-col rounded-3xl border border-line bg-paper p-7 transition-all duration-500 ease-[var(--ease-cine)] hover:-translate-y-1.5 hover:border-green-200 hover:shadow-md">
                <span
                  aria-hidden
                  className="absolute top-5 right-7 text-6xl leading-none font-extrabold text-green-50 transition-colors duration-500 group-hover:text-green-100"
                >
                  &rdquo;
                </span>

                <div className="relative flex gap-0.5 text-green-500" aria-label="5 sur 5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden>
                      <path d="M10 1.6l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8L10 1.6Z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="relative mt-5 flex-1 text-[1.02rem] leading-relaxed text-ink-soft">
                  «&nbsp;{q.text}&nbsp;»
                </blockquote>

                <figcaption className="mt-7 flex items-center gap-3 border-t border-line-soft pt-6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-green-100 text-[0.82rem] font-extrabold text-green-700">
                    {q.initials}
                  </span>
                  <span className="text-[0.88rem]">
                    <strong className="block font-extrabold text-ink">{q.name}</strong>
                    <span className="text-body-soft">{q.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
