import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { GUIDE_IPHONE } from '../lib/destinations'

/*
 * La feuille qui s'ouvre quand un visiteur d'iPhone touche « Installer ».
 *
 * Pourquoi une feuille, et pas une page. Le bouton menait à /iphone/ : le
 * visiteur quittait le site pour lire un mode d'emploi, puis devait revenir.
 * « Installer » doit agir là où on le touche.
 *
 * Pourquoi elle n'installe rien elle-même. Safari n'expose aucune API
 * d'installation — beforeinstallprompt n'existe pas sur iOS, et Apple ne
 * permet à aucun site de poser quoi que ce soit sur l'écran d'accueil. Les
 * trois gestes ci-dessous sont la seule voie qui existe. La feuille les met
 * donc sous les yeux, au moment exact où le visiteur veut installer, et
 * pointe vers le bouton Partager de Safari — qui est en bas de son écran,
 * juste sous cette feuille.
 *
 * Ne pas remplacer cela par une promesse d'installation automatique : il n'y
 * en a pas, et le bouton ne ferait rien.
 */

const Icone = ({ d, className }: { d: string; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d={d} />
  </svg>
)

const etapes = [
  {
    /* Le carré à flèche montante : l'icône Partager de Safari. */
    icone: 'M12 3v11M8.5 6.5 12 3l3.5 3.5M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13',
    titre: 'Touchez Partager',
    detail: 'Le carré avec une flèche, en bas de votre écran. Sur iPad, en haut à droite.',
  },
  {
    /* Le carré à signe plus : « Sur l'écran d'accueil ». */
    icone: 'M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM12 9v6M9 12h6',
    titre: 'Choisissez « Sur l’écran d’accueil »',
    detail: 'Faites défiler le menu : la ligne est plus bas, sous les applications de partage.',
  },
  {
    icone: 'm4 12.5 5 5L20 6.5',
    titre: 'Touchez Ajouter',
    detail: "L'icône se pose sur votre écran d'accueil. Elle s'ouvrira sans réseau.",
  },
]

export function InstallerIphone({ ouvert, onFermer }: { ouvert: boolean; onFermer: () => void }) {
  const fermeture = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!ouvert) return

    const auClavier = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFermer()
    }
    document.addEventListener('keydown', auClavier)

    /* La page ne défile plus derrière la feuille : sur iPhone, un défilement
       qui traverse une feuille modale donne l'impression qu'elle a lâché. */
    const defilement = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    fermeture.current?.focus()

    return () => {
      document.removeEventListener('keydown', auClavier)
      document.body.style.overflow = defilement
    }
  }, [ouvert, onFermer])

  return (
    <AnimatePresence>
      {ouvert && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
          <motion.button
            type="button"
            aria-label="Fermer"
            onClick={onFermer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-green-950/60 backdrop-blur-[2px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-installer-iphone"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[30rem] rounded-t-[1.75rem] bg-paper px-6 pt-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-lg sm:rounded-[1.75rem] sm:pb-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-green-600">iPhone et iPad</p>
                <h2 id="titre-installer-iphone" className="mt-2 text-[1.3rem] leading-tight">
                  Trois gestes, et c'est installé
                </h2>
              </div>
              <button
                ref={fermeture}
                type="button"
                onClick={onFermer}
                aria-label="Fermer"
                className="-mt-1 -mr-1 grid size-11 shrink-0 place-items-center rounded-full text-body-soft hover:bg-line-soft hover:text-ink"
              >
                <Icone d="M6 6l12 12M18 6 6 18" className="size-5" />
              </button>
            </div>

            <ol className="mt-6 flex list-none flex-col gap-4 p-0">
              {etapes.map((e, i) => (
                <li key={e.titre} className="flex gap-3.5">
                  <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-green-50 text-green-700">
                    <Icone d={e.icone} className="size-5" />
                    <span className="absolute -top-1.5 -left-1.5 grid size-5 place-items-center rounded-full bg-green-600 text-[0.68rem] font-extrabold text-white">
                      {i + 1}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.95rem] font-extrabold text-ink">{e.titre}</span>
                    <span className="mt-0.5 block text-[0.85rem] leading-relaxed text-body">
                      {e.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            {/*
              Le doigt tendu vers le bas de l'écran : c'est là qu'est le bouton
              Partager de Safari, à quelques centimètres sous cette feuille.
            */}
            <p className="mt-5 flex items-center gap-2.5 rounded-2xl bg-line-soft px-4 py-3 text-[0.83rem] leading-relaxed text-body">
              <Icone d="M12 4v14M6.5 12.5 12 18l5.5-5.5" className="size-5 shrink-0 text-green-700" />
              Le bouton Partager se trouve en bas de votre écran, sous cette fenêtre.
            </p>

            <p className="mt-4 text-[0.78rem] leading-relaxed text-body-soft">
              Apple ne permet à aucun site d'installer une application : ces trois gestes sont la
              seule voie sur iPhone. Ils donnent le même résultat — une icône, le plein écran, et
              l'application utilisable sans réseau.{' '}
              <a
                href={GUIDE_IPHONE}
                className="font-bold text-green-700 underline underline-offset-2"
              >
                Voir la page détaillée
              </a>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
