import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { cx } from '../lib/cx'
import { APK_PATIENT, APP_FICHIER } from '../lib/destinations'
import { HeroBackdrop } from './HeroBackdrop'
import { PhoneMock } from './PhoneMock'
import { ArrowRight, Badge, Button, Counter } from './primitives'

/*
 * Aucun chiffre de traction ici tant que le service n'a pas d'utilisateurs.
 * Les trois valeurs ci-dessous sont vérifiables aujourd'hui : le nombre
 * d'officines du pays, la règle de fraîcheur que s'impose le service, et la
 * gratuité de l'offre Citoyen. Ne pas y remettre de « pharmacies partenaires »
 * avant d'avoir les chiffres réels.
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

            <div
              className="mt-8 flex flex-wrap gap-3 animate-[ps-rise_0.9s_var(--ease-cine)_both] motion-reduce:animate-none"
              style={{ animationDelay: '0.54s' }}
            >
              <Button href={APK_PATIENT} download="pharmasur-1.0.0.apk" size="lg">
                Télécharger l'application
                <ArrowRight />
              </Button>
              <Button href="#how" variant="ghost" size="lg">
                Voir comment ça marche
              </Button>
            </div>

            {/*
              Un APK ne sert à rien sur un iPhone ni sur un ordinateur. Plutôt
              que de détecter la plateforme — ce qui échoue toujours sur un
              appareil — chaque bouton dit pour qui il est et ce qu'il donne.
              Les deux ci-dessous téléchargent LE MÊME fichier : l'application
              s'adapte au téléphone comme à l'écran d'ordinateur, et livrer deux
              copies garantirait qu'elles divergent.
            */}
            <div
              className="mt-3 flex flex-wrap gap-2.5 animate-[ps-fade_0.9s_linear_both] motion-reduce:animate-none"
              style={{ animationDelay: '0.66s' }}
            >
              <a
                href={APP_FICHIER}
                download="pharmasur-application.html"
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-[0.84rem] font-bold text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-400"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 shrink-0" aria-hidden>
                  <path d="M16.3 12.6c0-2 1.6-2.9 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.2 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2 2.5 2 1 0 1.4-.6 2.6-.6s1.5.6 2.6.6c1.1 0 1.8-1 2.4-2 .8-1.1 1.1-2.2 1.1-2.3 0 0-2.2-.8-2.2-3.1ZM14.4 6.3c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.4 1.2-.5.6-.9 1.5-.8 2.4.9.1 1.8-.4 2.4-1.1Z" />
                </svg>
                iPhone — télécharger
                <ArrowRight />
              </a>

              <a
                href={APP_FICHIER}
                download="pharmasur-application.html"
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-[0.84rem] font-bold text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-400"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4 shrink-0"
                  aria-hidden
                >
                  <rect x="3" y="4" width="18" height="12" rx="2" />
                  <path d="M8 20h8M12 16v4" />
                </svg>
                Ordinateur — télécharger
                <ArrowRight />
              </a>
            </div>

            <p
              className="mt-2.5 animate-[ps-fade_0.9s_linear_both] text-[0.78rem] text-body-soft motion-reduce:animate-none"
              style={{ animationDelay: '0.72s' }}
            >
              Un fichier de moins de 500 ko, à ouvrir dans Safari, Chrome ou tout autre navigateur —
              sans installation et sans réseau.
            </p>

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
