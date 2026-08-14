import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { cx } from '../lib/cx'
import { ArrowRight, Reveal, SectionHead } from './primitives'

const phoneRegex = /^(\+225)?[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}$/

/** Même endpoint que le formulaire patient : `source` distingue les deux flux. */
const endpoint = import.meta.env.VITE_LEAD_ENDPOINT

const messages = {
  manquant: "Renseignez tous les champs : ils nous permettent de vérifier votre officine avant de vous rappeler.",
  invalide: 'Entrez un numéro ivoirien valide, ex. +225 07 00 00 00 00.',
  ok: 'Merci ! Nous vous rappelons sous 48 h pour inscrire votre officine.',
  echec: 'Envoi impossible pour le moment. Réessayez dans un instant.',
}

const champ =
  'h-12 w-full rounded-xl border border-line bg-paper px-4 text-[0.95rem] font-semibold text-ink transition-colors placeholder:font-medium placeholder:text-body-soft focus:border-green-500 focus:outline-none'

const etiquette = 'mb-1.5 block text-[0.85rem] font-bold text-ink'

export function OfficineSignup() {
  const [valeurs, setValeurs] = useState({
    officine: '',
    commune: '',
    pharmacien: '',
    agrement: '',
    phone: '',
  })
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const maj = (cle: keyof typeof valeurs) => (e: { target: { value: string } }) =>
    setValeurs((v) => ({ ...v, [cle]: e.target.value }))

  const vider = () =>
    setValeurs({ officine: '', commune: '', pharmacien: '', agrement: '', phone: '' })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (pending) return

    const saisie = Object.fromEntries(
      Object.entries(valeurs).map(([k, v]) => [k, v.trim()]),
    ) as typeof valeurs

    if (Object.values(saisie).some((v) => !v)) {
      setStatus({ ok: false, msg: messages.manquant })
      return
    }
    /*
     * Seul le téléphone est validé sur sa forme. Le numéro d'agrément ne l'est
     * pas : j'ignore le format officiel ivoirien, et un motif inventé rejetterait
     * des numéros valides. Il sera vérifié à l'appel.
     */
    if (!phoneRegex.test(saisie.phone)) {
      setStatus({ ok: false, msg: messages.invalide })
      return
    }

    if (!endpoint) {
      setStatus({ ok: true, msg: messages.ok })
      vider()
      return
    }

    setPending(true)
    setStatus(null)

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...saisie, source: 'landing-officine' }),
        signal: AbortSignal.timeout(10_000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus({ ok: true, msg: messages.ok })
      vider()
    } catch {
      setStatus({ ok: false, msg: messages.echec })
    } finally {
      setPending(false)
    }
  }

  return (
    <section id="officine" className="border-t border-line-soft py-20 lg:py-28">
      <div className="rail">
        <SectionHead
          eyebrow="Officines"
          title="Inscrivez votre officine"
          lede="Quelques informations suffisent pour être rappelé. Aucun logiciel à installer, aucun matériel à acheter."
        />

        <Reveal delay={0.1}>
          <form
            onSubmit={submit}
            noValidate
            aria-busy={pending}
            className="mx-auto mt-12 max-w-2xl rounded-3xl border border-line bg-paper p-6 shadow-sm sm:p-8 lg:mt-16"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {/* ids préfixés : la section porte déjà l'id « officine ». */}
              <div className="sm:col-span-2">
                <label htmlFor="officine-nom" className={etiquette}>
                  Nom de l'officine
                </label>
                <input
                  id="officine-nom"
                  name="officine"
                  autoComplete="organization"
                  value={valeurs.officine}
                  onChange={maj('officine')}
                  placeholder="Pharmacie de la Riviera"
                  className={champ}
                />
              </div>

              <div>
                <label htmlFor="officine-commune" className={etiquette}>
                  Commune
                </label>
                <input
                  id="officine-commune"
                  name="commune"
                  autoComplete="address-level2"
                  value={valeurs.commune}
                  onChange={maj('commune')}
                  placeholder="Cocody"
                  className={champ}
                />
              </div>

              <div>
                <label htmlFor="officine-pharmacien" className={etiquette}>
                  Pharmacien
                </label>
                <input
                  id="officine-pharmacien"
                  name="pharmacien"
                  autoComplete="name"
                  value={valeurs.pharmacien}
                  onChange={maj('pharmacien')}
                  placeholder="Dr Kouassi Aya"
                  className={champ}
                />
              </div>

              <div>
                <label htmlFor="officine-agrement" className={etiquette}>
                  Numéro d'agrément
                </label>
                <input
                  id="officine-agrement"
                  name="agrement"
                  inputMode="numeric"
                  value={valeurs.agrement}
                  onChange={maj('agrement')}
                  placeholder="Tel qu'il figure sur votre autorisation"
                  className={champ}
                />
              </div>

              <div>
                <label htmlFor="officine-phone" className={etiquette}>
                  Téléphone
                </label>
                <input
                  id="officine-phone"
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
                Ces informations servent à vérifier votre officine et à vous rappeler.{' '}
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
