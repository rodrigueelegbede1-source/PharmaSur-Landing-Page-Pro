import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type FormEvent } from 'react'
import { cx } from '../lib/cx'
import { ArrowRight, Reveal, SectionHead } from './primitives'

const phoneRegex = /^(\+225)?[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}$/

const endpoint = import.meta.env.VITE_LEAD_ENDPOINT

type Profil = 'famille' | 'officine'

const messages = {
  manquant: 'Renseignez tous les champs avant de valider.',
  invalide: 'Entrez un numéro ivoirien valide, ex. +225 07 00 00 00 00.',
  ok: 'Merci ! Nous vous rappelons sous 48 h.',
  echec: 'Envoi impossible pour le moment. Réessayez dans un instant.',
}

const champ =
  'h-12 w-full rounded-xl border border-line bg-paper px-4 text-[0.95rem] font-semibold text-ink transition-colors placeholder:font-medium placeholder:text-body-soft focus:border-green-500 focus:outline-none'

const etiquette = 'mb-1.5 block text-[0.85rem] font-bold text-ink'

const vide = {
  nom: '',
  officine: '',
  commune: '',
  pharmacien: '',
  agrement: '',
  phone: '',
}

/** Champs exigés selon le profil : une famille n'a pas d'agrément à fournir. */
const requis: Record<Profil, (keyof typeof vide)[]> = {
  famille: ['nom', 'phone'],
  officine: ['officine', 'commune', 'pharmacien', 'agrement', 'phone'],
}

/*
 * Une seule section pour deux publics. Le profil se pré-sélectionne depuis
 * l'ancre d'arrivée — `#souscrire-officine` depuis l'offre Pharmacie Pro — pour
 * que le visiteur ne recommence pas un choix qu'il vient de faire en cliquant.
 */
export function Souscription() {
  const [profil, setProfil] = useState<Profil>('famille')
  const [valeurs, setValeurs] = useState(vide)
  const [leurre, setLeurre] = useState('')
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  useEffect(() => {
    const lire = () => {
      if (location.hash === '#souscrire-officine') setProfil('officine')
      else if (location.hash === '#souscrire') setProfil('famille')
    }
    lire()
    addEventListener('hashchange', lire)
    return () => removeEventListener('hashchange', lire)
  }, [])

  const maj = (cle: keyof typeof vide) => (e: { target: { value: string } }) =>
    setValeurs((v) => ({ ...v, [cle]: e.target.value }))

  const changerProfil = (p: Profil) => {
    setProfil(p)
    setStatus(null)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (pending) return

    const saisie = Object.fromEntries(
      requis[profil].map((cle) => [cle, valeurs[cle].trim()]),
    ) as Record<string, string>

    if (Object.values(saisie).some((v) => !v)) {
      setStatus({ ok: false, msg: messages.manquant })
      return
    }
    if (!phoneRegex.test(saisie.phone)) {
      setStatus({ ok: false, msg: messages.invalide })
      return
    }

    const corps = {
      ...saisie,
      offre: profil === 'famille' ? 'sante-famille' : 'pharmacie-pro',
      source: 'landing-souscription',
      _gotcha: leurre,
    }

    if (!endpoint) {
      setStatus({ ok: true, msg: messages.ok })
      setValeurs(vide)
      return
    }

    setPending(true)
    setStatus(null)

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(corps),
        signal: AbortSignal.timeout(10_000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus({ ok: true, msg: messages.ok })
      setValeurs(vide)
    } catch {
      setStatus({ ok: false, msg: messages.echec })
    } finally {
      setPending(false)
    }
  }

  const onglet = (p: Profil, libelle: string) => (
    <button
      type="button"
      onClick={() => changerProfil(p)}
      aria-pressed={profil === p}
      className={cx(
        'h-11 flex-1 rounded-xl text-[0.92rem] font-bold transition-all duration-300',
        profil === p
          ? 'bg-green-600 text-white shadow-glow'
          : 'text-body hover:text-green-700',
      )}
    >
      {libelle}
    </button>
  )

  return (
    <section id="souscrire" className="scroll-mt-24 border-t border-line-soft py-20 lg:py-28">
      {/* Seconde ancre, pour arriver directement sur le profil officine. */}
      <span id="souscrire-officine" className="sr-only" />

      <div className="rail">
        <SectionHead
          eyebrow="Souscription"
          title="Souscrire ou inscrire son officine"
          lede="Laissez-nous de quoi vous rappeler. Nous revenons vers vous sous 48 h pour finaliser."
        />

        <Reveal delay={0.1}>
          <form
            onSubmit={submit}
            noValidate
            aria-busy={pending}
            className="mx-auto mt-12 max-w-2xl rounded-3xl border border-line bg-paper p-6 shadow-sm sm:p-8 lg:mt-16"
          >
            <div className="mb-6 flex gap-1 rounded-2xl bg-green-50 p-1">
              {onglet('famille', 'Je suis un particulier')}
              {onglet('officine', 'Je suis une officine')}
            </div>

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

            <div className="grid gap-4 sm:grid-cols-2">
              {profil === 'famille' ? (
                <div className="sm:col-span-2">
                  <label htmlFor="sous-nom" className={etiquette}>
                    Nom complet
                  </label>
                  <input
                    id="sous-nom"
                    name="nom"
                    autoComplete="name"
                    value={valeurs.nom}
                    onChange={maj('nom')}
                    placeholder="Aya Kouassi"
                    className={champ}
                  />
                </div>
              ) : (
                <>
                  <div className="sm:col-span-2">
                    <label htmlFor="sous-officine" className={etiquette}>
                      Nom de l'officine
                    </label>
                    <input
                      id="sous-officine"
                      name="officine"
                      autoComplete="organization"
                      value={valeurs.officine}
                      onChange={maj('officine')}
                      placeholder="Pharmacie de la Riviera"
                      className={champ}
                    />
                  </div>

                  <div>
                    <label htmlFor="sous-commune" className={etiquette}>
                      Commune
                    </label>
                    <input
                      id="sous-commune"
                      name="commune"
                      autoComplete="address-level2"
                      value={valeurs.commune}
                      onChange={maj('commune')}
                      placeholder="Cocody"
                      className={champ}
                    />
                  </div>

                  <div>
                    <label htmlFor="sous-pharmacien" className={etiquette}>
                      Pharmacien
                    </label>
                    <input
                      id="sous-pharmacien"
                      name="pharmacien"
                      autoComplete="name"
                      value={valeurs.pharmacien}
                      onChange={maj('pharmacien')}
                      placeholder="Dr Kouassi Aya"
                      className={champ}
                    />
                  </div>

                  <div>
                    <label htmlFor="sous-agrement" className={etiquette}>
                      Numéro d'agrément
                    </label>
                    <input
                      id="sous-agrement"
                      name="agrement"
                      value={valeurs.agrement}
                      onChange={maj('agrement')}
                      placeholder="Tel qu'il figure sur votre autorisation"
                      className={champ}
                    />
                  </div>
                </>
              )}

              <div className={profil === 'famille' ? 'sm:col-span-2' : undefined}>
                <label htmlFor="sous-phone" className={etiquette}>
                  Téléphone
                </label>
                <input
                  id="sous-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={valeurs.phone}
                  onChange={maj('phone')}
                  placeholder="+225 07 00 00 00 00"
                  className={champ}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-[0.78rem] leading-snug text-body-soft">
                Ces informations servent uniquement à vous rappeler.{' '}
                <a
                  href="/confidentialite/"
                  className="font-semibold text-green-700 underline underline-offset-2"
                >
                  Politique de confidentialité
                </a>
              </p>
              <button
                type="submit"
                disabled={pending}
                className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-green-600 px-6 font-bold whitespace-nowrap text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 disabled:pointer-events-none disabled:opacity-60"
              >
                {pending ? 'Envoi…' : 'Être rappelé'}
                {!pending && <ArrowRight />}
              </button>
            </div>

            <div className="mt-3 min-h-6" aria-live="polite" role="status">
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
                      status.ok ? 'text-green-700' : 'text-alert',
                    )}
                  >
                    {status.msg}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
