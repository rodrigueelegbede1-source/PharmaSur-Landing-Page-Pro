import { cx } from '../lib/cx'
import { ArrowRight, Button, Reveal, SectionHead } from './primitives'

const plans = [
  {
    name: 'Offre Citoyen',
    desc: "Pour tous les patients de Côte d'Ivoire.",
    price: 'Gratuit',
    unit: '',
    cta: 'Télécharger gratuitement',
    variant: 'ghost' as const,
    features: [
      'Géolocalisation des pharmacies ouvertes',
      "10 scans d'authentification / mois",
      'Carte interactive des pharmacies de garde',
      "Itinéraire GPS et horaires d'ouverture",
      'Recherche de médicaments illimitée',
      "Prix des médicaments et coût total de l'ordonnance",
      'Équivalent générique signalé en cas de rupture',
      'Alertes de retour en stock',
    ],
  },
  {
    name: 'Offre Santé Famille',
    desc: 'Pour protéger toute la famille au quotidien.',
    price: '2 500',
    unit: 'FCFA / mois',
    cta: 'Souscrire',
    variant: 'primary' as const,
    featured: true,
    tag: 'Le plus choisi',
    features: [
      'Recherche de médicaments illimitée',
      "Prix des médicaments et coût total de l'ordonnance",
      'Équivalent générique signalé en cas de rupture',
      'Géolocalisation des pharmacies de garde',
      "Scans d'authentification illimités",
      'Carnet de traitement numérique pour 5 membres',
      'Rappels intelligents de prise & notices vocales',
      'Support client prioritaire 24/7',
      'Alertes de retour en stock',
    ],
  },
  {
    name: 'Offre Pharmacie Pro',
    desc: 'Pour les officines qui veulent être visibles.',
    price: '15 000',
    unit: 'FCFA / mois',
    cta: 'Inscrire mon officine',
    variant: 'primary' as const,
    features: [
      "Géolocalisation de l'officine",
      'Badge « Officine Certifiée Anti-Contrefaçon »',
      'Mise en avant pendant les gardes',
      'Tableau de bord analytique de visibilité locale',
      'Canal direct de contact avec les patients',
      'Synchronisation des stocks en temps réel',
      "Scans d'authentification illimités",
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
          title="Une offre pour chacun"
          lede="Gratuit pour les citoyens, complet pour les familles, puissant pour les officines."
        />

        <div className="mt-14 grid items-start gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-7">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1} className="h-full">
              <article
                className={cx(
                  'relative flex h-full flex-col rounded-3xl p-7 transition-all duration-500 ease-[var(--ease-cine)] lg:p-8',
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
                      href="#contact"
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-400 px-6 py-3.5 font-bold text-green-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                    >
                      {p.cta}
                      <ArrowRight />
                    </a>
                  ) : (
                    <Button href="#contact" variant={p.variant} size="lg" block>
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
            Sans engagement · Paiement Mobile Money accepté · Résiliable à tout moment
          </p>
        </Reveal>
      </div>
    </section>
  )
}
