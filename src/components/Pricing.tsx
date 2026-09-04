import { cx } from '../lib/cx'
import { ArrowRight, Button, Reveal, SectionHead } from './primitives'

type Offre = {
  name: string
  desc: string
  price: string
  unit: string
  cta: string
  variant: 'primary' | 'ghost' | 'dark'
  /** Destination du bouton. Obligatoire : une offre sans suite n'est pas une offre. */
  href: string
  /** Ancre de la carte, quand un lien du site doit y mener directement. */
  id?: string
  featured?: boolean
  tag?: string
  features: string[]
}

/*
 * Un mailto sans corps ouvre une fenêtre vide : le pharmacien doit deviner ce
 * qu'on attend de lui, et le message arrive incomplet. Le corps reprend les
 * cinq informations de l'inscription — nom, commune, pharmacien, agrément,
 * téléphone — pour que le premier échange serve à quelque chose.
 */
const INSCRIPTION_OFFICINE = `mailto:contact@pharmasur.ci?subject=${encodeURIComponent(
  'Inscription de mon officine',
)}&body=${encodeURIComponent(
  [
    'Bonjour,',
    '',
    'Je souhaite inscrire mon officine sur PharmaSur.',
    '',
    "Nom de l'officine :",
    'Commune :',
    'Pharmacien titulaire :',
    "Numéro d'agrément :",
    'Téléphone :',
    '',
    'Merci de me préciser la suite de la démarche.',
  ].join('\n'),
)}`

/*
 * Deux offres, et non plus trois. L'offre Santé Famille à 2 500 FCFA / an a été
 * supprimée et ses fonctionnalités encore tenables — rappels de prise, alertes
 * de retour en stock — sont passées dans l'offre gratuite. Tout ce qui est
 * payant pour le patient a donc disparu : le service ne se finance plus que
 * par l'abonnement des officines.
 *
 * Le montant de cet abonnement n'est plus affiché. C'est un choix commercial,
 * pas un oubli : tant qu'aucun prix n'est écrit, aucun prix n'est promis.
 */
const plans: Offre[] = [
  {
    name: 'Offre Prompt rétablissement',
    desc: "Pour tous les patients de Côte d'Ivoire.",
    price: 'Gratuit',
    unit: '',
    cta: 'Télécharger gratuitement',
    href: '#telecharger',
    variant: 'ghost' as const,
    features: [
      'Recherche de médicaments illimitée',
      "Prix des médicaments et coût total de l'ordonnance",
      'Équivalent générique signalé en cas de rupture',
      "Bons d'assurance acceptés, affichés par officine",
      'Géolocalisation des pharmacies ouvertes',
      'Contacter la pharmacie',
      'Rappels intelligents de prise',
      'Alertes de retour en stock à la demande',
      'Carte interactive des pharmacies de garde',
      "Itinéraire GPS et horaires d'ouverture",
    ],
  },
  {
    name: 'Offre Pharmacie Pro',
    desc: 'Pour les officines qui veulent être visibles.',
    price: 'Abonnement',
    unit: '',
    cta: 'Inscrire mon officine',
    /* Une officine ne peut pas s'inscrire seule : le courriel pré-rempli ouvre
       un canal réel, là où une ancre ne ferait que défiler. */
    href: INSCRIPTION_OFFICINE,
    /* Cible du lien « Espace pharmaciens » du pied de page. */
    id: 'pharmacie-pro',
    variant: 'primary' as const,
    /* La carte sombre était sur Santé Famille. Elle passe à l'offre des
       officines, seule offre payante restante, sans reprendre l'étiquette
       « Le plus choisi » : aucune officine n'est encore inscrite. */
    featured: true,
    features: [
      "Géolocalisation de l'officine",
      "Bons d'assurance acceptés : ajout et retrait à tout moment",
      'Mise en avant pendant les gardes',
      'Tableau de bord analytique de visibilité locale',
      'Canal direct de contact avec les patients',
      'Synchronisation des stocks en temps réel, facultative',
      'Tableau de bord des demandes locales',
      'Support prioritaire 7j/7',
    ],
  },
]

function Check({ featured }: { featured?: boolean }) {
  return (
    <span
      className={cx(
        'mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full',
        featured ? 'bg-green-400/20 text-green-400' : 'bg-green-100 text-green-600',
      )}
    >
      <svg viewBox="0 0 12 12" fill="none" className="size-2.5" aria-hidden>
        <path d="m2 6.3 2.4 2.4L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function Pricing() {
  return (
    <section id="pricing" className="border-y border-line bg-green-50 py-20 lg:py-28">
      <div className="rail">
        <SectionHead
          eyebrow="Tarifs"
          title="Gratuit pour les patients"
          lede="Tout ce qu'un patient cherche est gratuit, sans limite et sans compte payant. Le service se finance par l'abonnement des officines qui veulent être trouvées."
        />

        <div className="mx-auto mt-14 grid items-start gap-6 lg:mt-20 lg:max-w-4xl lg:grid-cols-2 lg:gap-7">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1} className="h-full">
              <article
                id={p.id}
                className={cx(
                  'relative flex h-full scroll-mt-28 flex-col rounded-3xl p-7 transition-all duration-500 ease-[var(--ease-cine)] lg:p-8',
                  p.featured
                    ? 'bg-green-900 text-green-100/85 shadow-lg lg:-translate-y-4 lg:hover:-translate-y-5'
                    : 'border border-line bg-paper hover:-translate-y-1.5 hover:border-green-200 hover:shadow-md',
                )}
              >
                {p.tag && (
                  <span className="absolute -top-3 left-7 rounded-full bg-green-400 px-3 py-1 text-[0.7rem] font-extrabold tracking-wide text-green-950 uppercase">
                    {p.tag}
                  </span>
                )}

                <h3 className={cx('text-[1.2rem]', p.featured && 'text-white')}>{p.name}</h3>
                <p className="mt-1.5 text-[0.92rem]">{p.desc}</p>

                <p className="mt-6 flex items-baseline gap-2">
                  <span
                    className={cx(
                      'text-[2.6rem] leading-none font-extrabold tracking-[-0.03em]',
                      p.featured ? 'text-white' : 'text-ink',
                    )}
                  >
                    {p.price}
                  </span>
                  {p.unit && (
                    <span
                      className={cx(
                        'text-[0.85rem] font-semibold',
                        p.featured ? 'text-green-200' : 'text-body',
                      )}
                    >
                      {p.unit}
                    </span>
                  )}
                </p>

                <div
                  className={cx(
                    'mt-6 h-px w-full',
                    p.featured ? 'bg-white/12' : 'bg-line',
                  )}
                />

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3 text-[0.93rem] leading-snug">
                      <Check featured={p.featured} />
                      <span className={p.featured ? 'text-green-100/90' : undefined}>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {p.featured ? (
                    <a
                      href={p.href}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-400 px-6 py-3.5 font-bold text-green-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                    >
                      {p.cta}
                      <ArrowRight />
                    </a>
                  ) : (
                    <Button href={p.href} variant={p.variant} size="lg" block>
                      {p.cta}
                      <ArrowRight />
                    </Button>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25}>
          <p className="mt-10 text-center text-[0.88rem] text-body-soft">
            Abonnement officine sans engagement de durée · Paiement Mobile Money accepté ·
            Résiliable à tout moment
          </p>
        </Reveal>
      </div>
    </section>
  )
}
