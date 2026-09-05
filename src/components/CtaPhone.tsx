import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { cx } from '../lib/cx'
import { APK_PATIENT, APP_FICHIER, APP_PATIENT } from '../lib/destinations'
import { ArrowRight, Reveal } from './primitives'

const phoneRegex = /^(\+225)?[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}$/

/**
 * Endpoint de collecte, défini dans `.env` (voir `.env.example`).
 * Absent — développement, préversion — le formulaire répond sans rien envoyer.
 */
const endpoint = import.meta.env.VITE_LEAD_ENDPOINT

const messages = {
  invalid: 'Entrez un numéro ivoirien valide, ex. +225 07 00 00 00 00.',
  ok: "Merci ! Nous vous préviendrons dès l'ouverture de PharmaSur.",
  failed: 'Envoi impossible pour le moment. Réessayez dans un instant.',
}

/*
 * L'ancre `#telecharger` de cette section est la destination de tous les boutons
 * « Télécharger » du site : tant que l'application n'est pas publiée, télécharger
 * consiste à laisser son numéro. `scroll-mt` compense l'en-tête fixe, sinon le
 * titre de la section se glisse dessous à l'arrivée.
 */
export function CtaPhone() {
  const [phone, setPhone] = useState('')
  /*
   * Champ leurre. Invisible et inatteignable au clavier, aucun humain ne le
   * remplit ; les robots qui moissonnent le formulaire, si. Formspree rejette
   * l'envoi dès que `_gotcha` est non vide. L'endpoint étant public dans le
   * bundle, c'est la seule barrière que nous puissions poser sans serveur.
   */
  const [leurre, setLeurre] = useState('')
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (pending) return

    const value = phone.trim()
    if (!phoneRegex.test(value)) {
      setStatus({ ok: false, msg: messages.invalid })
      return
    }

    if (!endpoint) {
      setStatus({ ok: true, msg: messages.ok })
      setPhone('')
      return
    }

    setPending(true)
    setStatus(null)

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ phone: value, source: 'landing-cta', _gotcha: leurre }),
        signal: AbortSignal.timeout(10_000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus({ ok: true, msg: messages.ok })
      setPhone('')
    } catch {
      setStatus({ ok: false, msg: messages.failed })
    } finally {
      setPending(false)
    }
  }

  return (
    <section id="telecharger" className="scroll-mt-24 pb-20 lg:pb-28">
      <div className="rail">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-green-900 px-6 py-14 text-green-100/85 sm:px-10 lg:px-14 lg:py-16">
            {/* Profondeur : halo vert et trame discrète */}
            <div
              aria-hidden
              className="absolute -top-24 -right-16 size-96 rounded-full bg-green-500/25 blur-[90px]"
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px]"
            />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-[1.9rem] text-white sm:text-[2.4rem]">
                  Prêt à ne plus courir de pharmacie en pharmacie ?
                </h2>
                <p className="mt-4 max-w-lg text-[1.02rem]">
                  Téléchargez PharmaSur et sachez où trouver votre ordonnance, à quel prix.
                </p>

                {/*
                  Trois routes, parce qu'aucune ne couvre tout le monde.
                  L'APK ne s'installe que sur Android ; sur iPhone, rien ne
                  s'installe depuis un site — Apple l'interdit, et le seul
                  chemin est « Sur l'écran d'accueil » depuis Safari. Le
                  fichier unique, lui, s'ouvre partout et sans réseau.
                  Annoncer ce que chaque bouton donne évite de laisser
                  quelqu'un télécharger l'inutile.
                */}
                <div className="mt-8 flex flex-col gap-2.5 sm:max-w-md">
                  <a
                    href={APK_PATIENT}
                    download="pharmasur-1.0.0.apk"
                    className="group flex items-center gap-3.5 rounded-2xl bg-green-400 px-5 py-4 text-green-950 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0" aria-hidden>
                      <path d="M17.6 9.5 16 12.3M6.4 9.5 8 12.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M4 13.5h16a8 8 0 0 0-16 0Zm4.6-2.6a.55.55 0 1 0 0-1.1.55.55 0 0 0 0 1.1Zm6.8 0a.55.55 0 1 0 0-1.1.55.55 0 0 0 0 1.1Z" />
                      <rect x="4" y="14.6" width="16" height="6.4" rx="1.6" />
                    </svg>
                    <span className="flex-1">
                      <span className="block font-extrabold">Android — installer l'application</span>
                      <span className="block text-[0.8rem] font-semibold text-green-950/70">
                        APK · 1,2 Mo · téléchargement direct
                      </span>
                    </span>
                    <ArrowRight />
                  </a>

                  <a
                    href={APP_PATIENT}
                    className="group flex items-center gap-3.5 rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-white transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0" aria-hidden>
                      <path d="M16.3 12.6c0-2 1.6-2.9 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.2 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2 2.5 2 1 0 1.4-.6 2.6-.6s1.5.6 2.6.6c1.1 0 1.8-1 2.4-2 .8-1.1 1.1-2.2 1.1-2.3 0 0-2.2-.8-2.2-3.1ZM14.4 6.3c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.4 1.2-.5.6-.9 1.5-.8 2.4.9.1 1.8-.4 2.4-1.1Z" />
                    </svg>
                    <span className="flex-1">
                      <span className="block font-extrabold">iPhone — ouvrir dans Safari</span>
                      <span className="block text-[0.8rem] font-medium text-green-100/70">
                        Puis Partager → « Sur l'écran d'accueil »
                      </span>
                    </span>
                    <ArrowRight />
                  </a>

                  <a
                    href={APP_FICHIER}
                    download="pharmasur-application.html"
                    className="group flex items-center gap-3.5 rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-white transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-6 shrink-0"
                      aria-hidden
                    >
                      <path d="M12 4v11M8 11l4 4 4-4" />
                      <path d="M4 18v1.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V18" />
                    </svg>
                    <span className="flex-1">
                      <span className="block font-extrabold">Version web — télécharger le fichier</span>
                      {/* Poids arrondi : il varie à chaque build, et annoncer
                          un chiffre au kilo-octet près le ferait mentir dès la
                          prochaine modification de l'application. */}
                      <span className="block text-[0.8rem] font-medium text-green-100/70">
                        Environ 340 ko · s'ouvre dans tout navigateur, sans réseau
                      </span>
                    </span>
                    <ArrowRight />
                  </a>
                </div>
              </div>

              <form onSubmit={submit} noValidate aria-busy={pending} className="w-full">
                <label className="sr-only" htmlFor="phone">
                  Numéro de téléphone
                </label>

                {/* Leurre : hors écran, hors tabulation, masqué aux lecteurs d'écran. */}
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={leurre}
                  onChange={(e) => setLeurre(e.target.value)}
                  className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
                />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 07 00 00 00 00"
                    className="h-13 flex-1 rounded-full border border-white/15 bg-white/8 px-5 font-semibold text-white transition-colors placeholder:font-medium placeholder:text-green-200/50 focus:border-green-400 focus:bg-white/12 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={pending}
                    className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-green-400 px-6 font-bold whitespace-nowrap text-green-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white disabled:pointer-events-none disabled:opacity-60"
                  >
                    {pending ? 'Envoi…' : 'Être prévenu'}
                    {!pending && <ArrowRight />}
                  </button>
                </div>

                {/*
                  Mention d'usage au point de collecte : le visiteur doit savoir
                  à quoi sert son numéro avant de le donner, pas après.
                */}
                <p className="mt-3 text-[0.78rem] leading-snug text-green-100/70">
                  Votre numéro sert uniquement à vous prévenir de l'ouverture du service. Il n'est
                  ni revendu, ni cédé.{' '}
                  <a
                    href="/confidentialite/"
                    className="font-semibold text-green-200 underline underline-offset-2 hover:text-white"
                  >
                    Politique de confidentialité
                  </a>
                </p>

                <div className="mt-2 min-h-6" aria-live="polite" role="status">
                  <AnimatePresence mode="wait">
                    {status && (
                      <motion.p
                        key={status.msg}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className={cx(
                          'text-[0.88rem] font-semibold',
                          status.ok ? 'text-green-400' : 'text-[#ffb4a2]',
                        )}
                      >
                        {status.msg}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
