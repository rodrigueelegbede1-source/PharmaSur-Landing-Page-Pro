import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { cx } from '../lib/cx'
import { ArrowRight, Reveal, SectionHead } from './primitives'

const phoneRegex = /^(\+225)?[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}$/

/** Même endpoint que le formulaire patient : `source` distingue les deux flux. */
const endpoint = import.meta.env.VITE_LEAD_ENDPOINT

const messages = {
  manquant: 'Renseignez le nom de votre officine, sa commune et un numéro de téléphone.',
  invalide: 'Entrez un numéro ivoirien valide, ex. +225 07 00 00 00 00.',
  ok: 'Merci ! Nous vous rappelons sous 48 h pour inscrire votre officine.',
  echec: 'Envoi impossible pour le moment. Réessayez dans un instant.',
}

const champ =
  'h-12 w-full rounded-xl border border-line bg-paper px-4 text-[0.95rem] font-semibold text-ink transition-colors placeholder:font-medium placeholder:text-body-soft focus:border-green-500 focus:outline-none'

export function OfficineSignup() {
  const [officine, setOfficine] = useState('')
  const [commune, setCommune] = useState('')
  const [phone, setPhone] = useState('')
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (pending) return

    const valeurs = {
      officine: officine.trim(),
      commune: commune.trim(),
      phone: phone.trim(),
    }

    if (!valeurs.officine || !valeurs.commune || !valeurs.phone) {
      setStatus({ ok: false, msg: messages.manquant })
      return
    }
    if (!phoneRegex.test(valeurs.phone)) {
      setStatus({ ok: false, msg: messages.invalide })
      return
    }

    if (!endpoint) {
      setStatus({ ok: true, msg: messages.ok })
      setOfficine('')
      setCommune('')
      setPhone('')
      return
    }

    setPending(true)
    setStatus(null)

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...valeurs, source: 'landing-officine' }),
        signal: AbortSignal.timeout(10_000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus({ ok: true, msg: messages.ok })
      setOfficine('')
      setCommune('')
      setPhone('')
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
          lede="Trois informations suffisent pour être rappelé. Aucun logiciel à installer, aucun matériel à acheter."
        />

        <Reveal delay={0.1}>
          <form
            onSubmit={submit}
            noValidate
            aria-busy={pending}
            className="mx-auto mt-12 max-w-2xl rounded-3xl border border-line bg-paper p-6 shadow-sm sm:p-8 lg:mt-16"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                {/* id distinct de celui de la section, sinon le label la désigne, elle. */}
                <label
                  htmlFor="officine-nom"
                  className="mb-1.5 block text-[0.85rem] font-bold text-ink"
                >
                  Nom de l'officine
                </label>
                <input
                  id="officine-nom"
                  name="officine"
                  value={officine}
                  onChange={(e) => setOfficine(e.target.value)}
                  placeholder="Pharmacie de la Riviera"
                  className={champ}
                />
              </div>

              <div>
                <label
                  htmlFor="officine-commune"
                  className="mb-1.5 block text-[0.85rem] font-bold text-ink"
                >
                  Commune ou quartier
                </label>
                <input
                  id="officine-commune"
                  name="commune"
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  placeholder="Cocody"
                  className={champ}
                />
              </div>

              <div>
                <label
                  htmlFor="officine-phone"
                  className="mb-1.5 block text-[0.85rem] font-bold text-ink"
                >
                  Téléphone
                </label>
                <input
                  id="officine-phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
