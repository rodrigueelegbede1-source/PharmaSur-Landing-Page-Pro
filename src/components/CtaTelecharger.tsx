import { APK_PATIENT, APP_FICHIER, GUIDE_IPHONE } from '../lib/destinations'
import { ArrowRight, Reveal, SectionHead } from './primitives'

/*
 * L'ancre `#telecharger` de cette section est la destination de tous les
 * boutons « Télécharger » du site. `scroll-mt` compense l'en-tête fixe, sinon
 * le titre de la section se glisse dessous à l'arrivée.
 *
 * CE QUI A ÉTÉ RETIRÉ ICI, ET POURQUOI. Cette section portait un formulaire
 * « Être prévenu » : le visiteur laissait son numéro pour être averti de
 * l'ouverture du service. Retiré le 6 septembre 2026, pour deux raisons.
 *
 * 1. Il ne servait à rien. Les officines réelles arriveront dans
 *    l'application DÉJÀ INSTALLÉE sur l'appareil, sans que personne ait à
 *    prévenir qui que ce soit. Le numéro résolvait un problème que
 *    l'installation résout mieux.
 * 2. Il coûtait cher. C'était la seule donnée personnelle que PharmaSur
 *    recevait, le seul appel réseau sortant du produit, et le seul transfert
 *    hors de Côte d'Ivoire (Formspree, États-Unis). Il portait à lui seul la
 *    base légale du consentement, la durée de conservation, le délai de
 *    réponse aux demandes de suppression et l'essentiel de la politique de
 *    confidentialité.
 *
 * Ce que ce formulaire disait de vrai — l'application tourne aujourd'hui sur
 * des officines de démonstration — n'a pas disparu avec lui : ce serait
 * retirer l'information gênante en même temps que le champ de saisie. Elle
 * est reprise en bas de section, sans rien demander en échange.
 *
 * En le supprimant, le site cesse d'émettre le moindre octet vers un tiers.
 */
export function CtaTelecharger() {
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

            <div className="relative">
              <SectionHead
                eyebrow="Téléchargement"
                title="Prêt à ne plus courir de pharmacie en pharmacie ?"
                lede="Trois façons d'installer PharmaSur, parce qu'aucune ne convient à tout le monde."
                tone="dark"
              />

              {/*
                Trois routes, parce qu'aucune ne couvre tout le monde.
                L'APK ne s'installe que sur Android ; sur iPhone, rien ne
                s'installe depuis un site — Apple l'interdit, et le seul
                chemin est « Sur l'écran d'accueil » depuis Safari. Le
                fichier unique, lui, s'ouvre partout et sans réseau.
                Annoncer ce que chaque bouton donne évite de laisser
                quelqu'un télécharger l'inutile.

                Trois cartes de même hauteur : `mt-auto` pousse la ligne
                d'action en bas de chacune, pour que les trois flèches
                s'alignent quel que soit le nombre de lignes du descriptif.
              */}
              <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-4">
                <Reveal>
                  <a
                    href={APK_PATIENT}
                    download="pharmasur-1.0.0.apk"
                    className="group flex h-full flex-col rounded-2xl bg-green-400 p-5 text-green-950 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-7 shrink-0" aria-hidden>
                      <path d="M17.6 9.5 16 12.3M6.4 9.5 8 12.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M4 13.5h16a8 8 0 0 0-16 0Zm4.6-2.6a.55.55 0 1 0 0-1.1.55.55 0 0 0 0 1.1Zm6.8 0a.55.55 0 1 0 0-1.1.55.55 0 0 0 0 1.1Z" />
                      <rect x="4" y="14.6" width="16" height="6.4" rx="1.6" />
                    </svg>
                    <span className="mt-4 block text-[1.05rem] font-extrabold">Android</span>
                    <span className="mt-1.5 block text-[0.85rem] font-semibold text-green-950/70">
                      APK · 1,2 Mo · téléchargement direct
                    </span>
                    <span className="mt-auto flex items-center gap-2 pt-6 font-bold">
                      Installer l'application
                      <ArrowRight />
                    </span>
                  </a>
                </Reveal>

                <Reveal delay={0.08}>
                  <a
                    href={GUIDE_IPHONE}
                    className="group flex h-full flex-col rounded-2xl border border-white/20 bg-white/5 p-5 text-white transition-transform duration-300 hover:-translate-y-1 hover:border-white/35"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-7 shrink-0" aria-hidden>
                      <path d="M16.3 12.6c0-2 1.6-2.9 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.2 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2 2.5 2 1 0 1.4-.6 2.6-.6s1.5.6 2.6.6c1.1 0 1.8-1 2.4-2 .8-1.1 1.1-2.2 1.1-2.3 0 0-2.2-.8-2.2-3.1ZM14.4 6.3c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.4 1.2-.5.6-.9 1.5-.8 2.4.9.1 1.8-.4 2.4-1.1Z" />
                    </svg>
                    <span className="mt-4 block text-[1.05rem] font-extrabold">iPhone</span>
                    <span className="mt-1.5 block text-[0.85rem] font-medium text-green-100/70">
                      Trois gestes depuis Safari · sans App Store
                    </span>
                    <span className="mt-auto flex items-center gap-2 pt-6 font-bold">
                      Voir comment installer
                      <ArrowRight />
                    </span>
                  </a>
                </Reveal>

                <Reveal delay={0.16} className="sm:col-span-2 lg:col-span-1">
                  <a
                    href={APP_FICHIER}
                    download="pharmasur-application.html"
                    className="group flex h-full flex-col rounded-2xl border border-white/20 bg-white/5 p-5 text-white transition-transform duration-300 hover:-translate-y-1 hover:border-white/35"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-7 shrink-0"
                      aria-hidden
                    >
                      <path d="M12 4v11M8 11l4 4 4-4" />
                      <path d="M4 18v1.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V18" />
                    </svg>
                    <span className="mt-4 block text-[1.05rem] font-extrabold">Ordinateur</span>
                    {/* Une borne, pas un chiffre exact : le poids varie d'un
                        build à l'autre — la feuille de style pèse plus lourd
                        sur le serveur de build que sur une machine de
                        développement. scripts/generer-app-fichier.mjs fait
                        échouer le build si le fichier dépasse ces 500 ko,
                        pour que cette phrase ne puisse pas devenir fausse. */}
                    <span className="mt-1.5 block text-[0.85rem] font-medium text-green-100/70">
                      Moins de 500 ko · s'ouvre dans tout navigateur, sans réseau
                    </span>
                    <span className="mt-auto flex items-center gap-2 pt-6 font-bold">
                      Télécharger le fichier
                      <ArrowRight />
                    </span>
                  </a>
                </Reveal>
              </div>

              {/*
                L'état réel du service, dit au moment où quelqu'un s'apprête à
                installer — pas après. Il remplace le formulaire de rappel, et
                répond à la question que celui-ci posait : rien à laisser, rien
                à réinstaller, les officines réelles arrivent dans
                l'application déjà en place.
              */}
              <div className="mt-12 border-t border-white/12 pt-10">
                <p className="text-[1.05rem] font-extrabold text-white">
                  Les vraies pharmacies arrivent.
                </p>
                <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed">
                  L'application fonctionne aujourd'hui avec des officines de démonstration, le temps
                  que les premières pharmacies d'Abidjan y soient référencées. Elles apparaîtront
                  dans l'application que vous installez maintenant :{' '}
                  <strong className="font-semibold text-white">
                    rien à réinstaller, et aucun numéro à laisser
                  </strong>
                  .
                </p>
                {/* /80 et non /65 : à /65 le contraste tombait à 4,30 sur le
                    vert 900, sous le seuil de 4,5 qu'exige ce corps de
                    13,6 px. /80 mesure 6,53 — relevé sur le rendu, en peignant
                    la couleur dans un canvas, seul moyen fiable depuis que
                    Tailwind v4 émet des oklab() que getComputedStyle ne
                    résout pas. Volontairement sous les 7,37 du paragraphe
                    au-dessus : la hiérarchie entre les deux doit rester
                    visible. */}
                <p className="mt-3 max-w-2xl text-[0.85rem] leading-relaxed text-green-100/80">
                  {/* Formulation pesée : « n'envoie rien à personne » aurait été
                      faux — l'hébergeur voit forcément la requête qui charge la
                      page. Ce qui est exact, et vérifiable, c'est qu'aucune
                      donnée ne nous est demandée ni transmise. */}
                  PharmaSur ne vous demande aucune donnée personnelle et n'en transmet aucune.{' '}
                  <a
                    href="/confidentialite/"
                    className="font-semibold text-green-200 underline underline-offset-2 hover:text-white"
                  >
                    Politique de confidentialité
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
