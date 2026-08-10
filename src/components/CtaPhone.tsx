import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { cx } from '../lib/cx'
import { ArrowRight, Reveal } from './primitives'

const phoneRegex = /^(\+225)?[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}$/

export function CtaPhone() {
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!phoneRegex.test(phone.trim())) {
      setStatus({ ok: false, msg: 'Entrez un numéro ivoirien valide, ex. +225 07 00 00 00 00.' })
      return
    }
    setStatus({ ok: true, msg: 'Merci ! Le lien de téléchargement vous a été envoyé par SMS.' })
    setPhone('')
  }

  return (
    <section className="pb-20 lg:pb-28">
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
                  Téléchargez PharmaSur et vérifiez vos médicaments en toute confiance.
                </p>
              </div>

              <form onSubmit={submit} noValidate className="w-full">
                <label className="sr-only" htmlFor="phone">
                  Numéro de téléphone
                </label>
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
                    className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-green-400 px-6 font-bold whitespace-nowrap text-green-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                  >
                    Recevoir le lien
                    <ArrowRight />
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
