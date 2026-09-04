import { Logo } from './Nav'

const columns = [
  {
    title: 'Produit',
    links: [
      { label: 'Comment ça marche', href: '#how' },
      { label: 'Tarifs', href: '#pricing' },
      { label: 'Témoignages', href: '#testimonials' },
      { label: 'Scanner anti-contrefaçon', href: '#how' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Espace pharmaciens', href: '#pricing' },
      // Aucun centre d'aide n'existe : le courriel est le seul recours réel.
      { label: "Centre d'aide", href: "mailto:contact@pharmasur.ci?subject=Besoin%20d'aide" },
      { label: 'Mentions légales', href: '/mentions-legales/' },
      { label: 'Confidentialité', href: '/confidentialite/' },
    ],
  },
]

const socials = [
  {
    label: 'Facebook',
    path: 'M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5H16.7V4.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V14h2.7v8h3.5Z',
  },
  {
    label: 'LinkedIn',
    path: 'M6.9 8.5H4V20h2.9V8.5ZM5.45 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.6c0-3.1-1.7-4.6-3.9-4.6-1.8 0-2.6 1-3 1.7V8.5H10.2c.04.9 0 11.5 0 11.5h2.9v-6.4c0-.3 0-.6.1-.8.3-.6.8-1.3 1.8-1.3 1.3 0 1.9.99 1.9 2.5V20H20v-6.4Z',
  },
  {
    label: 'X',
    path: 'M17.5 3h3l-6.6 7.6L21.8 21h-5.9l-4.3-5.6L6.5 21H3.4l7-8.1L2.6 3h6l3.9 5.2L17.5 3Zm-1 16.2h1.6L7.6 4.7H5.9l10.6 14.5Z',
  },
]

export function Footer() {
  return (
    <footer id="contact" className="bg-green-950 text-green-100/70">
      <div className="rail py-16">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.1fr]">
          <div>
            <Logo tone="dark" />
            <p className="mt-5 max-w-xs text-[0.92rem] leading-relaxed">
              L'application d'utilité publique qui rend le médicament disponible, traçable et sûr en
              Côte d'Ivoire.
            </p>
            <div className="mt-6 flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#hero"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full border border-white/12 text-green-100/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-400 hover:bg-green-400 hover:text-green-950"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4.5" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="text-[0.95rem] text-white">{c.title}</h4>
              <ul className="mt-5 flex flex-col gap-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[0.92rem] transition-colors hover:text-green-400"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-[0.95rem] text-white">Contact</h4>
            <ul className="mt-5 flex flex-col gap-3 text-[0.92rem]">
              <li>
                <a href="tel:+2252722000000" className="transition-colors hover:text-green-400">
                  +225 27 22 00 00 00
                </a>
              </li>
              <li>
                <a href="mailto:contact@pharmasur.ci" className="transition-colors hover:text-green-400">
                  contact@pharmasur.ci
                </a>
              </li>
              <li>Abidjan, Côte d'Ivoire</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-[0.85rem] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PharmaSur. Tous droits réservés.</p>
          <p>Application d'utilité publique · Côte d'Ivoire</p>
        </div>
      </div>
    </footer>
  )
}
