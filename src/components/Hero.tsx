import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { cx } from '../lib/cx'
import { APK_PATIENT, APP_FICHIER, GUIDE_IPHONE } from '../lib/destinations'
import { HeroBackdrop } from './HeroBackdrop'
import { PhoneMock } from './PhoneMock'
import { ArrowRight, Badge, Counter } from './primitives'

/*
 * Les trois façons d'installer, dans l'ordre où elles se présentent à un
 * visiteur ivoirien : Android d'abord, largement majoritaire.
 *
 * Les deux dernières livrent le MÊME fichier. Ce n'est pas une redondance :
 * l'application s'adapte au téléphone comme à l'écran d'ordinateur, et livrer
 * deux copies garantirait qu'elles divergent au premier changement. Le
 * visiteur, lui, cherche son appareil dans la liste, pas un format de fichier.
 *
 * Sur iPhone, rien ne s'installe depuis un site — Apple l'interdit. Le bouton
 * mène donc au mode d'emploi : Safari sait poser l'application sur l'écran
 * d'accueil, en trois gestes que personne ne devine seul. La page y explique
 * aussi pourquoi il n'y a pas de .ipa, et propose le fichier en second choix.
 * Ne jamais appeler cela « application App Store » : ce n'en est pas une, et
 * aucune ne peut exister sans compte développeur ni macOS.
 */
const telechargements = [
  {
    plateforme: 'Android',
    detail: 'APK · 1,2 Mo',
    href: APK_PATIENT,
    fichier: 'pharmasur-1.0.0.apk',
    principal: true,
    svgProps: { fill: 'currentColor' },
    icone: (
      <>
        <path
          d="M17.6 9.5 16 12.3M6.4 9.5 8 12.3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M4 13.5h16a8 8 0 0 0-16 0Zm4.6-2.6a.55.55 0 1 0 0-1.1.55.55 0 0 0 0 1.1Zm6.8 0a.55.55 0 1 0 0-1.1.55.55 0 0 0 0 1.1Z" />
        <rect x="4" y="14.6" width="16" height="6.4" rx="1.6" />
      </>
    ),
  },
  {
    plateforme: 'iPhone',
    detail: 'Trois gestes, sans App Store',
    href: GUIDE_IPHONE,
    principal: false,
    svgProps: { fill: 'currentColor' },
    icone: (
      <path d="M16.3 12.6c0-2 1.6-2.9 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.2 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2 2.5 2 1 0 1.4-.6 2.6-.6s1.5.6 2.6.6c1.1 0 1.8-1 2.4-2 .8-1.1 1.1-2.2 1.1-2.3 0 0-2.2-.8-2.2-3.1ZM14.4 6.3c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.4 1.2-.5.6-.9 1.5-.8 2.4.9.1 1.8-.4 2.4-1.1Z" />
    ),
  },
  {
    plateforme: 'Ordinateur',
    detail: 'Fichier · 500 ko',
    href: APP_FICHIER,
    fichier: 'pharmasur-application.html',
    principal: false,
    svgProps: {
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.9,
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const,
    },
    icone: (
      <>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </>
    ),
  },
]

/*
 * Aucun chiffre de traction ici tant que le service n'a pas d'utilisateurs.
 * Les trois valeurs ci-dessous sont vérifiables aujourd'hui : le nombre
 * d'officines du pays, la règle de fraîcheur que s'impose le service, et la
 * gratuité de l'offre. Ne pas y remettre de « pharmacies partenaires » avant
 * d'avoir les chiffres réels.
 */
const stats: { to?: number; suffix?: string; text?: string; label: string }[] = [
  { to: 1400, label: "Pharmacies en Côte d'Ivoire" },
  { to: 48, suffix: ' h', label: 'Au-delà, un stock est dit incertain' },
  { text: 'Gratuit', label: 'Pour les patients, sans abonnement' },
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
              {/*
                Découpage choisi par mesure, pas à l'estime : la colonne du
                titre plafonne à 552 px et le texte à 57,6 px. « et les
                pharmacies proches » demandait 735 px et se cassait en
                laissant « proches » seul sur sa ligne. Découpé ainsi,
                chaque segment tient (491 px et 527 px) et aucun mot n'est
                orphelin. Remesurer avant de retoucher ce libellé.
              */}
              {['Trouvez vos médicaments', 'et les pharmacies', 'proches en un clic.'].map(
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
              médicaments réellement disponibles — pas seulement selon la distance.
            </p>

            {/*
              Les trois téléchargements sur UNE ligne, de même hauteur, avant
              tout le reste : ils étaient répartis en trois blocs empilés — un
              gros bouton, deux pastilles, une légende — et le visiteur devait
              lire trois fois pour comprendre qu'il n'y avait qu'un choix à
              faire, celui de son appareil.
              Aucune détection de plateforme : elle se trompe toujours sur un
              appareil, et un patient sait quel téléphone il tient.
            */}
            <div
              className="mt-8 grid gap-2.5 animate-[ps-rise_0.9s_var(--ease-cine)_both] motion-reduce:animate-none sm:grid-cols-3"
              style={{ animationDelay: '0.54s' }}
            >
              {telechargements.map((t) => (
                <a
                  key={t.plateforme}
                  href={t.href}
                  download={t.fichier}
                  className={cx(
                    'group flex min-h-[3.75rem] items-center gap-3 rounded-2xl px-4 transition-all duration-300 ease-[var(--ease-cine)] hover:-translate-y-0.5',
                    t.principal
                      ? 'bg-green-600 text-white shadow-glow hover:bg-green-700 hover:shadow-lg'
                      : 'border border-line bg-paper text-ink hover:border-green-400 hover:shadow-md',
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={cx('size-5 shrink-0', t.principal ? 'text-white' : 'text-green-600')}
                    aria-hidden
                    {...t.svgProps}
                  >
                    {t.icone}
                  </svg>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block text-[0.92rem] leading-tight font-extrabold">
                      {t.plateforme}
                    </span>
                    <span
                      className={cx(
                        'block text-[0.72rem] leading-tight font-semibold',
                        t.principal ? 'text-green-100/80' : 'text-body-soft',
                      )}
                    >
                      {t.detail}
                    </span>
                  </span>
                </a>
              ))}
            </div>

            <div
              className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 animate-[ps-fade_0.9s_linear_both] motion-reduce:animate-none"
              style={{ animationDelay: '0.66s' }}
            >
              <a
                href="#how"
                className="group inline-flex items-center gap-1.5 text-[0.9rem] font-bold text-green-700"
              >
                Voir comment ça marche
                <ArrowRight />
              </a>
              <span className="text-[0.8rem] text-body-soft">
                Gratuit, sans compte — et sans réseau une fois installé.
              </span>
            </div>

            <ul
              className="mt-11 flex flex-wrap gap-x-10 gap-y-6 animate-[ps-fade_0.9s_linear_both] motion-reduce:animate-none"
              style={{ animationDelay: '0.75s' }}
            >
              {stats.map((s) => (
                <li key={s.label} className="relative pl-4">
                  <span className="absolute top-1.5 left-0 h-[calc(100%-0.75rem)] w-0.5 rounded-full bg-green-200" />
                  <strong className="block text-[1.75rem] leading-none font-extrabold text-green-700">
                    {s.text ?? <Counter to={s.to ?? 0} suffix={s.suffix} />}
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
