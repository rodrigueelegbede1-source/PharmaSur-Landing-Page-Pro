import type { ReactNode } from 'react'
import { Reveal, SectionHead } from './primitives'

/*
 * Cette section contenait trois témoignages signés de noms, de professions et
 * de villes qui n'existaient pas, sous un titre affirmant qu'ils utilisaient
 * le service au quotidien. PharmaSur n'a pas encore d'utilisateurs : ces
 * citations étaient fausses, et l'une d'elles attribuait à un pharmacien
 * nommé une recommandation qu'il n'a jamais faite.
 *
 * Elles sont remplacées par les trois règles que le service s'impose. Elles
 * sont vraies aujourd'hui parce qu'elles décrivent sa conception, et elles
 * sont exactement ce que les maquettes de l'application et de la console
 * mettent en œuvre. Ne pas remettre de témoignages ici avant d'en avoir de
 * réels, recueillis et autorisés par écrit par les personnes citées.
 */
const engagements: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: (
      <>
        <path d="M12 3 4 6.2v5.6c0 4.6 3.4 8.6 8 9.2 4.6-.6 8-4.6 8-9.2V6.2L12 3Z" />
        <path d="m8.8 12.2 2.2 2.2 4.2-4.4" />
      </>
    ),
    title: 'Une disponibilité confirmée, jamais devinée',
    body: "La plupart des officines n'ont pas de logiciel de gestion connecté. PharmaSur ne prétend donc pas lire leur stock : c'est le pharmacien qui confirme. Un produit non confirmé depuis 48 heures vous est signalé comme incertain, jamais comme disponible.",
  },
  {
    icon: (
      <>
        <path d="M4 7h6a3 3 0 0 1 3 3v8" />
        <path d="M20 17h-6a3 3 0 0 1-3-3V6" />
        <path d="m17 4 3 3-3 3M7 20l-3-3 3-3" />
      </>
    ),
    title: 'Un équivalent proposé, jamais substitué',
    /* Cette phrase disait « en cas de rupture » seulement. L'application
       propose désormais aussi un équivalent moins cher quand le patient déclare
       lui-même un budget insuffisant — jamais de sa propre initiative. La
       promesse devait suivre, sous peine de devenir fausse. */
    body: "En cas de rupture, ou si vous nous dites que le total dépasse ce que vous avez, l'application peut signaler un médicament ayant le même principe actif. Elle ne le fait jamais d'elle-même pour vous pousser à changer, et ne décide de rien : seul le pharmacien peut valider cette équivalence pour votre situation. PharmaSur ne remplace ni une ordonnance ni un avis médical.",
  },
  {
    icon: (
      <>
        <rect x="4" y="10" width="16" height="10.5" rx="2.5" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <path d="M12 14.5v2" />
      </>
    ),
    title: 'Votre ordonnance ne quitte pas votre téléphone',
    body: "Aucune pharmacie ne reçoit votre ordonnance ni votre identité. Les officines voient seulement des comptages agrégés de ce que l'on cherche dans leur quartier, à partir de cinq recherches, sans qu'aucun patient puisse y être reconnu.",
  },
]

export function Engagements() {
  return (
    <section id="engagements" className="py-20 lg:py-28">
      <div className="rail">
        <SectionHead
          eyebrow="Nos engagements"
          title="Ce que PharmaSur s'interdit de faire"
          lede="Un service de santé se juge autant à ce qu'il refuse d'affirmer qu'à ce qu'il promet. Voici les trois règles qui tiennent le produit."
        />

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
          {engagements.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.1} className="h-full">
              <article className="group flex h-full flex-col rounded-3xl border border-line bg-paper p-7 transition-all duration-500 ease-[var(--ease-cine)] hover:-translate-y-1.5 hover:border-green-200 hover:shadow-md">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700 transition-colors duration-500 group-hover:bg-green-100">
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
                    {e.icon}
                  </svg>
                </span>

                <h3 className="mt-6 text-[1.12rem] leading-snug font-extrabold text-ink">
                  {e.title}
                </h3>

                <p className="mt-3 flex-1 text-[0.98rem] leading-relaxed text-body">{e.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
