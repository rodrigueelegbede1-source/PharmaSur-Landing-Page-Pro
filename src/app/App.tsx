import { useEffect, useMemo, useState } from 'react'
import { cx } from '../lib/cx'
import {
  CATALOGUE,
  OFFICINES,
  chercher,
  classer,
  equivalentsDe,
  estEnRupture,
  etatDuProduit,
  fcfa,
  ouverture,
  verdict,
  type Officine,
  type Produit,
} from './donnees'
import { BandeauDemo, Bouton, Carte, EtatPuce, Icone, Logo, Puce, Svg } from './ui'

type Onglet = 'recherche' | 'liste' | 'carte' | 'profil'
type Vue =
  | { nom: 'onglets' }
  | { nom: 'resultats' }
  | { nom: 'officine'; id: string }
  | { nom: 'equivalent'; produitId: string }

const CLE_LISTE = 'pharmasur.liste'

/* La liste survit à la fermeture : une ordonnance se compose souvent en
   plusieurs fois, et la reperdre à chaque ouverture rendrait l'appli inutile. */
function useListe() {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const brut = localStorage.getItem(CLE_LISTE)
      return brut ? (JSON.parse(brut) as string[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(CLE_LISTE, JSON.stringify(ids))
    } catch {
      /* Navigation privée ou stockage refusé : l'appli marche, sans mémoire. */
    }
  }, [ids])

  return {
    ids,
    produits: ids.map((id) => CATALOGUE.find((p) => p.id === id)).filter(Boolean) as Produit[],
    ajouter: (id: string) => setIds((v) => (v.includes(id) ? v : [...v, id])),
    retirer: (id: string) => setIds((v) => v.filter((x) => x !== id)),
    remplacer: (ancien: string, nouveau: string) =>
      setIds((v) => v.map((x) => (x === ancien ? nouveau : x))),
    vider: () => setIds([]),
  }
}

export default function App() {
  const [onglet, setOnglet] = useState<Onglet>('recherche')
  const [vue, setVue] = useState<Vue>({ nom: 'onglets' })
  const liste = useListe()
  const classement = useMemo(() => classer(OFFICINES, liste.produits), [liste.produits])

  const allerA = (v: Vue) => {
    setVue(v)
    window.scrollTo(0, 0)
  }

  /*
   * Deux formes, une seule application. Sous 1024 px — un téléphone — colonne
   * unique et barre d'onglets sous le pouce. Au-dessus, l'application était une
   * colonne de 480 px perdue au milieu d'un écran de 27 pouces : elle s'y
   * présente maintenant dans un cadre, navigation en rail à gauche. Le contenu
   * ne change pas — c'est la même application, pas une seconde à maintenir.
   */
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-paper lg:my-10 lg:h-[min(880px,calc(100dvh-5rem))] lg:min-h-0 lg:max-w-[920px] lg:overflow-hidden lg:rounded-[2rem] lg:border lg:border-line lg:shadow-lg">
      <BandeauDemo />

      <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
        {vue.nom === 'onglets' && (
          <BarreOnglets actif={onglet} onChange={setOnglet} badge={liste.ids.length} />
        )}

        <main className="flex-1 pb-24 lg:min-h-0 lg:overflow-y-auto lg:pb-8">
        {vue.nom === 'onglets' && onglet === 'recherche' && (
          <EcranRecherche liste={liste} onVoirListe={() => setOnglet('liste')} />
        )}
        {vue.nom === 'onglets' && onglet === 'liste' && (
          <EcranListe
            liste={liste}
            onChercherOfficines={() => allerA({ nom: 'resultats' })}
            onEquivalent={(id) => allerA({ nom: 'equivalent', produitId: id })}
            onAjouter={() => setOnglet('recherche')}
          />
        )}
        {vue.nom === 'onglets' && onglet === 'carte' && (
          <EcranCarte
            classement={classement}
            nbProduits={liste.produits.length}
            onOfficine={(id) => allerA({ nom: 'officine', id })}
          />
        )}
        {vue.nom === 'onglets' && onglet === 'profil' && <EcranProfil nbProduits={liste.ids.length} />}

        {vue.nom === 'resultats' && (
          <EcranResultats
            classement={classement}
            nbProduits={liste.produits.length}
            onRetour={() => allerA({ nom: 'onglets' })}
            onOfficine={(id) => allerA({ nom: 'officine', id })}
          />
        )}
        {vue.nom === 'officine' && (
          <EcranOfficine
            officine={OFFICINES.find((o) => o.id === vue.id)!}
            produits={liste.produits}
            onRetour={() => allerA({ nom: 'resultats' })}
          />
        )}
        {vue.nom === 'equivalent' && (
          <EcranEquivalent
            produit={CATALOGUE.find((p) => p.id === vue.produitId)!}
            onRetour={() => allerA({ nom: 'onglets' })}
            onRemplacer={(nouveau) => {
              liste.remplacer(vue.produitId, nouveau)
              allerA({ nom: 'onglets' })
            }}
          />
        )}
        </main>
      </div>
    </div>
  )
}

function BarreOnglets({
  actif,
  onChange,
  badge,
}: {
  actif: Onglet
  onChange: (o: Onglet) => void
  badge: number
}) {
  const onglets: { id: Onglet; label: string; icone: React.ReactNode }[] = [
    { id: 'recherche', label: 'Recherche', icone: Icone.recherche },
    { id: 'liste', label: 'Ma liste', icone: Icone.liste },
    { id: 'carte', label: 'Carte', icone: Icone.carte },
    { id: 'profil', label: 'Profil', icone: Icone.profil },
  ]
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[480px] border-t border-line bg-paper pb-[max(env(safe-area-inset-bottom),0.5rem)] lg:static lg:w-[184px] lg:shrink-0 lg:flex-col lg:justify-start lg:gap-1 lg:border-t-0 lg:border-r lg:bg-line-soft lg:p-3 lg:pb-3">
      {onglets.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-current={actif === o.id ? 'page' : undefined}
          className={cx(
            'relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 pt-2',
            /* Sur grand écran, le rail passe en lignes : icône à gauche,
               libellé à droite, hauteur fixe — un bouton de navigation qui
               s'étire sur toute la hauteur disponible ne se vise pas. */
            'lg:min-h-11 lg:flex-none lg:flex-row lg:justify-start lg:gap-3 lg:rounded-xl lg:px-3 lg:pt-0',
            actif === o.id
              ? 'text-green-600 lg:bg-paper lg:shadow-sm'
              : 'text-body-soft lg:hover:bg-paper/60',
          )}
        >
          <Svg className="size-[1.35rem] lg:shrink-0" trait={actif === o.id ? 2.3 : 2}>
            {o.icone}
          </Svg>
          <span
            className={cx(
              'text-[0.68rem] lg:text-[0.86rem]',
              actif === o.id ? 'font-extrabold' : 'font-semibold',
            )}
          >
            {o.label}
          </span>
          {o.id === 'liste' && badge > 0 && (
            <span className="absolute top-1 right-[22%] grid size-4 place-items-center rounded-full bg-green-600 text-[0.6rem] font-extrabold text-white lg:static lg:ml-auto lg:size-5 lg:text-[0.68rem]">
              {badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}

function BoutonRetour({ onClick, libelle }: { onClick: () => void; libelle: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-ml-1 inline-flex min-h-11 items-center gap-1.5 text-[0.86rem] font-bold text-green-700"
    >
      <Svg className="size-5" trait={2.4}>
        {Icone.retour}
      </Svg>
      {libelle}
    </button>
  )
}

function EcranRecherche({
  liste,
  onVoirListe,
}: {
  liste: ReturnType<typeof useListe>
  onVoirListe: () => void
}) {
  const [requete, setRequete] = useState('')
  const resultats = chercher(requete)

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5">
        <Logo />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3.5 py-2 text-[0.75rem] font-bold text-green-700">
          <Svg className="size-3.5" trait={2.4}>
            <path d="M12 21s-7-4.8-7-10a7 7 0 1 1 14 0c0 5.2-7 10-7 10Z" />
          </Svg>
          Abidjan, Cocody
        </span>
      </div>

      <div className="px-5 pt-6">
        <h1 className="text-[1.75rem] leading-[1.15] font-extrabold tracking-[-0.03em] text-ink">
          Que cherchez-vous&nbsp;?
        </h1>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-body">
          Ajoutez les produits de votre ordonnance, un par un.
        </p>

        <label className="mt-5 flex items-center gap-2.5 rounded-2xl border border-line bg-line-soft px-4 focus-within:border-green-400 focus-within:bg-paper">
          <Svg className="size-5 text-body-soft" trait={2.2}>
            {Icone.recherche}
          </Svg>
          <input
            value={requete}
            onChange={(e) => setRequete(e.target.value)}
            placeholder="Ajouter un produit…"
            aria-label="Ajouter un produit à ma liste"
            className="min-h-13 flex-1 bg-transparent text-[0.98rem] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-body-soft"
          />
          {requete && (
            <button type="button" onClick={() => setRequete('')} aria-label="Effacer" className="p-1">
              <Svg className="size-4 text-body-soft" trait={2.4}>
                {Icone.croix}
              </Svg>
            </button>
          )}
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 px-5">
        {requete.trim().length >= 2 && resultats.length === 0 && (
          <p className="py-6 text-center text-[0.88rem] text-body-soft">
            Aucun produit ne correspond. Le catalogue de démonstration ne contient que dix
            médicaments.
          </p>
        )}

        {resultats.map((p) => {
          const dansLaListe = liste.ids.includes(p.id)
          return (
            <Carte key={p.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.95rem] font-extrabold text-ink">
                  {p.nom} {p.dosage}
                </p>
                <p className="mt-0.5 truncate text-[0.78rem] font-medium text-body-soft">
                  {p.forme} · {fcfa(p.prix)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => (dansLaListe ? liste.retirer(p.id) : liste.ajouter(p.id))}
                aria-label={dansLaListe ? `Retirer ${p.nom}` : `Ajouter ${p.nom}`}
                className={cx(
                  'grid size-11 shrink-0 place-items-center rounded-full transition-colors',
                  dansLaListe ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white',
                )}
              >
                <Svg className="size-5" trait={2.6}>
                  {dansLaListe ? Icone.croix : Icone.plus}
                </Svg>
              </button>
            </Carte>
          )
        })}

        {/*
          L'écran vide proposait quatre puces de recherche fréquente. Un
          premier utilisateur ne sait pas encore ce que fait l'application :
          lui suggérer « Paracétamol » ne le lui apprend pas. La promesse
          d'abord, les raccourcis ensuite.
        */}
        {requete.trim().length < 2 && (
          <div className="pt-1">
            {liste.ids.length === 0 && (
              <div className="rounded-2xl border border-line bg-line-soft px-5 py-6 text-center">
                <p className="text-[0.98rem] font-extrabold text-ink">Votre liste est vide</p>
                <p className="mt-2 text-[0.86rem] leading-relaxed text-body">
                  Ajoutez les produits de votre ordonnance. Nous chercherons ensuite les pharmacies
                  qui en ont le plus — pas seulement les plus proches.
                </p>
              </div>
            )}

            <p className="mt-6 text-[0.72rem] font-extrabold tracking-[0.09em] text-body-soft uppercase">
              Pour commencer
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Paracétamol', 'Amoxicilline', 'Ventoline', 'Ibuprofène'].map((mot) => (
                <button
                  key={mot}
                  type="button"
                  onClick={() => setRequete(mot)}
                  className="min-h-11 rounded-full border border-line px-4 text-[0.83rem] font-bold text-ink"
                >
                  {mot}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {liste.ids.length > 0 && (
        <div className="fixed inset-x-0 bottom-20 z-10 mx-auto max-w-[480px] px-5 lg:static lg:mt-6 lg:max-w-none lg:px-0">
          <Bouton block onClick={onVoirListe}>
            Voir ma liste ({liste.ids.length})
            <Svg className="size-4" trait={2.4}>
              {Icone.fleche}
            </Svg>
          </Bouton>
        </div>
      )}
    </>
  )
}

function EcranListe({
  liste,
  onChercherOfficines,
  onEquivalent,
  onAjouter,
}: {
  liste: ReturnType<typeof useListe>
  onChercherOfficines: () => void
  onEquivalent: (id: string) => void
  onAjouter: () => void
}) {
  const total = liste.produits.reduce((s, p) => s + p.prix, 0)

  if (liste.produits.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-8 pt-24 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-green-50 text-green-600">
          <Svg className="size-7">{Icone.liste}</Svg>
        </span>
        <h1 className="text-[1.3rem] font-extrabold text-ink">Votre liste est vide</h1>
        <p className="text-[0.88rem] leading-relaxed text-body">
          Ajoutez les produits de votre ordonnance : PharmaSur cherchera les officines qui les ont
          tous, et vous donnera le coût avant de sortir.
        </p>
        <Bouton onClick={onAjouter}>Chercher un médicament</Bouton>
      </div>
    )
  }

  return (
    <>
      <div className="px-5 pt-5">
        <h1 className="text-[1.65rem] font-extrabold tracking-[-0.03em] text-ink">Ma liste</h1>
        <p className="mt-1.5 text-[0.88rem] text-body">
          {liste.produits.length} produit{liste.produits.length > 1 ? 's' : ''} · prix homologués,
          identiques dans toutes les officines
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 px-5">
        {liste.produits.map((p) => {
          const equivalents = equivalentsDe(p)
          const enRupture = estEnRupture(p.id, OFFICINES)
          return (
            <Carte key={p.id}>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[0.95rem] font-extrabold text-ink">
                    {p.nom} {p.dosage}
                  </p>
                  <p className="mt-0.5 text-[0.78rem] font-medium text-body-soft">{p.forme}</p>
                </div>
                <span className="text-[0.95rem] font-extrabold text-ink">{fcfa(p.prix)}</span>
                <button
                  type="button"
                  onClick={() => liste.retirer(p.id)}
                  aria-label={`Retirer ${p.nom}`}
                  className="-mt-1.5 -mr-1.5 grid size-11 shrink-0 place-items-center rounded-full text-body-soft"
                >
                  <Svg className="size-4" trait={2.4}>
                    {Icone.croix}
                  </Svg>
                </button>
              </div>
              {/*
                L'équivalent n'est proposé QU'EN CAS DE RUPTURE — aucune
                officine des environs n'a confirmé le produit. Il s'affichait
                auparavant sur chaque ligne qui en avait un, y compris sur des
                médicaments disponibles à côté de chez soi : c'était pousser à
                la substitution pour une raison de prix, alors que la page
                d'accueil s'engage à ne le signaler qu'en cas de rupture.
                Le motif est donc affiché avec le lien : sans lui, le patient ne
                comprendrait pas pourquoi une ligne en propose un et pas l'autre.
              */}
              {enRupture && equivalents.length > 0 && (
                <div className="mt-3 border-t border-line-soft pt-3">
                  <p className="text-[0.78rem] font-bold text-alert">
                    Introuvable dans les officines proches
                  </p>
                  <button
                    type="button"
                    onClick={() => onEquivalent(p.id)}
                    className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-[0.8rem] font-bold text-green-700"
                  >
                    Voir un équivalent au même principe actif
                    <Svg className="size-3.5" trait={2.6}>
                      {Icone.fleche}
                    </Svg>
                  </button>
                </div>
              )}

              {enRupture && equivalents.length === 0 && (
                <p className="mt-3 border-t border-line-soft pt-3 text-[0.78rem] font-bold text-alert">
                  Introuvable dans les officines proches, et sans équivalent connu.
                </p>
              )}
            </Carte>
          )
        })}

        <Carte className="flex items-center justify-between bg-green-50">
          <span className="text-[0.88rem] font-bold text-ink">Coût total</span>
          <span className="text-[1.3rem] font-extrabold tracking-[-0.02em] text-ink">
            {fcfa(total)}
          </span>
        </Carte>

        <button
          type="button"
          onClick={liste.vider}
          className="mx-auto min-h-11 px-4 text-[0.82rem] font-bold text-body-soft"
        >
          Vider la liste
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-20 z-10 mx-auto max-w-[480px] px-5 lg:static lg:mt-6 lg:max-w-none lg:px-0">
        <Bouton block onClick={onChercherOfficines}>
          Trouver une officine
          <Svg className="size-4" trait={2.4}>
            {Icone.fleche}
          </Svg>
        </Bouton>
      </div>
    </>
  )
}

function EcranResultats({
  classement,
  nbProduits,
  onRetour,
  onOfficine,
}: {
  classement: ReturnType<typeof classer>
  nbProduits: number
  onRetour: () => void
  onOfficine: (id: string) => void
}) {
  return (
    <>
      <div className="px-5 pt-4">
        <BoutonRetour onClick={onRetour} libelle="Ma liste" />
        <h1 className="mt-2 text-[1.65rem] leading-tight font-extrabold tracking-[-0.03em] text-ink">
          Officines classées
        </h1>
        <p className="mt-1.5 text-[0.88rem] leading-relaxed text-body">
          Les officines ouvertes d'abord, puis par nombre de produits disponibles.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 px-5">
        {classement.map(({ officine, etats, disponibles, incertains, total, ouverture: ouv }) => {
          /*
            « 2/3 » obligeait à ouvrir la fiche pour savoir CE QUI manque.
            Le patient veut savoir ce qu'il devra chercher ailleurs : on le
            nomme quand il n'en manque qu'un, on le compte au-delà.
          */
          const manquants = etats.filter((e) => e.etat === 'absent').map((e) => e.produit)
          const resume =
            manquants.length === 0
              ? 'Liste complète'
              : manquants.length === 1
                ? /*
                     « Amoxicilline manquant » était faux, « manquante » l'eût
                     été sur Paracétamol : le genre varie d'un médicament à
                     l'autre et on ne peut pas le connaître pour des milliers.
                     Le deux-points supprime l'accord.
                   */
                  `Il manque : ${manquants[0].nom} ${manquants[0].dosage}`
                : `Il manque ${manquants.length} produits`

          return (
          <button
            key={officine.id}
            type="button"
            onClick={() => onOfficine(officine.id)}
            className={cx(
              'w-full rounded-2xl border border-line p-4 text-left active:bg-green-50',
              /* Une officine fermée reste consultable — on l'appelle demain —
                 mais elle ne se présente plus comme un trajet possible. */
              ouv.ouverte ? 'bg-paper' : 'bg-line-soft/60',
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cx(
                  'grid size-11 shrink-0 place-items-center rounded-xl text-[0.82rem] font-extrabold',
                  !ouv.ouverte
                    ? 'bg-paper text-body-soft'
                    : disponibles === nbProduits
                      ? 'bg-green-600 text-white'
                      : 'bg-green-50 text-green-700',
                )}
              >
                {disponibles}/{nbProduits}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.95rem] font-extrabold text-ink">{officine.nom}</p>
                <p className="mt-0.5 text-[0.78rem] font-medium text-body-soft">
                  {officine.distanceKm} km ·{' '}
                  <span className={cx('font-bold', ouv.ouverte ? 'text-green-700' : 'text-alert')}>
                    {ouv.libelle}
                  </span>
                </p>
                <p
                  className={cx(
                    'mt-0.5 text-[0.78rem] font-bold',
                    manquants.length === 0 ? 'text-green-700' : 'text-alert',
                  )}
                >
                  {resume}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ouv.parGarde && <Puce ton="vert">De garde</Puce>}
                  {incertains > 0 && <Puce ton="ambre">{incertains} à confirmer</Puce>}
                  {officine.bons.slice(0, 2).map((b) => (
                    <Puce key={b}>{b}</Puce>
                  ))}
                </div>
              </div>
              <span className="shrink-0 text-[0.88rem] font-extrabold text-ink">{fcfa(total)}</span>
            </div>
          </button>
          )
        })}

        <p className="px-1 pt-2 text-[0.75rem] leading-relaxed text-body-soft">
          Un produit non confirmé depuis plus de 48 h est signalé « incertain ». PharmaSur ne
          l'annonce jamais comme disponible.
        </p>
      </div>
    </>
  )
}

function EcranOfficine({
  officine,
  produits,
  onRetour,
}: {
  officine: Officine
  produits: Produit[]
  onRetour: () => void
}) {
  const manquants = produits.filter((p) => etatDuProduit(officine, p.id) === 'absent')
  const ouv = ouverture(officine)

  return (
    <>
      <div className="px-5 pt-4">
        <BoutonRetour onClick={onRetour} libelle="Officines" />
        <h1 className="mt-2 text-[1.5rem] leading-tight font-extrabold tracking-[-0.03em] text-ink">
          {officine.nom}
        </h1>
        <p className="mt-1.5 text-[0.88rem] text-body">
          {officine.quartier} · {officine.distanceKm} km
        </p>
        <p
          className={cx(
            'mt-1.5 text-[0.88rem] font-bold',
            ouv.ouverte ? 'text-green-700' : 'text-alert',
          )}
        >
          {ouv.libelle}
        </p>
      </div>

      {/* On barre la route avant le trajet, pas après : un déplacement pour
          rien coûte un taxi et parfois une nuit d'attente. */}
      {!ouv.ouverte && (
        <div className="mt-4 px-5">
          <p className="rounded-2xl border border-alert/30 bg-alert/8 px-4 py-3 text-[0.84rem] leading-relaxed font-semibold text-alert">
            Cette officine est fermée en ce moment. Appelez avant de vous déplacer, ou
            revenez à la liste : d'autres sont ouvertes.
          </p>
        </div>
      )}

      <div className="mt-4 flex gap-2.5 px-5">
        <Bouton block href={`tel:${officine.telephone.replace(/\s/g, '')}`} variante="contour">
          <Svg className="size-4" trait={2.2}>
            {Icone.telephone}
          </Svg>
          Appeler
        </Bouton>
        <Bouton
          block
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            `${officine.nom}, ${officine.quartier}, Abidjan`,
          )}`}
        >
          <Svg className="size-4" trait={2.2}>
            {Icone.itineraire}
          </Svg>
          Itinéraire
        </Bouton>
      </div>

      <div className="mt-6 px-5">
        <p className="text-[0.72rem] font-extrabold tracking-[0.09em] text-body-soft uppercase">
          Votre liste ici
        </p>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line">
          {produits.map((p, i) => {
            const etat = etatDuProduit(officine, p.id)
            const heures = officine.stock[p.id]?.confirmeIlYaHeures
            return (
              <div
                key={p.id}
                className={cx(
                  'flex items-center gap-3 px-4 py-3.5',
                  i > 0 && 'border-t border-line-soft',
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.9rem] font-bold text-ink">
                    {p.nom} {p.dosage}
                  </p>
                  <p className="mt-0.5 text-[0.75rem] font-medium text-body-soft">
                    {etat === 'absent' ? 'Non référencé ici' : `${fcfa(p.prix)} · confirmé il y a ${heures} h`}
                  </p>
                </div>
                <EtatPuce etat={etat} heures={heures} />
              </div>
            )
          })}

          {/*
            Le total manquait : c'est pourtant la question du patient devant
            une fiche — combien je paie si je vais LÀ. Il ne compte que ce que
            l'officine a ; les produits absents sont dits juste en dessous,
            pour qu'un total bas ne se lise pas comme une bonne affaire.
          */}
          {produits.length > 0 && (
            <div className="flex items-center justify-between gap-3 border-t border-line bg-green-50 px-4 py-3.5">
              <span className="text-[0.86rem] font-bold text-ink">Total sur place</span>
              <span className="text-[1.1rem] font-extrabold tracking-[-0.02em] text-ink">
                {fcfa(
                  produits
                    .filter((p) => etatDuProduit(officine, p.id) !== 'absent')
                    .reduce((s, p) => s + p.prix, 0),
                )}
              </span>
            </div>
          )}
        </div>

        {manquants.length > 0 && (
          <p className="mt-2.5 text-[0.78rem] leading-relaxed font-semibold text-alert">
            {/* « le chercher » / « la chercher » : encore un accord que le nom
                du médicament impose et qu'on ne peut pas deviner. */}
            {manquants.length === 1
              ? `À chercher ailleurs : ${manquants[0].nom} ${manquants[0].dosage}.`
              : `${manquants.length} produits sont à chercher ailleurs.`}
          </p>
        )}

        <p className="mt-2 text-[0.75rem] leading-relaxed text-body-soft">
          Les prix des médicaments sont homologués : ils sont les mêmes dans toutes les officines.
        </p>
      </div>

      <div className="mt-6 px-5">
        <p className="text-[0.72rem] font-extrabold tracking-[0.09em] text-body-soft uppercase">
          Bons d'assurance acceptés
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {officine.bons.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-[0.8rem] font-bold text-green-800"
            >
              <Svg className="size-3.5" trait={2.4}>
                {Icone.bouclier}
              </Svg>
              {b}
            </span>
          ))}
        </div>
        <p className="mt-2.5 text-[0.75rem] leading-relaxed text-body-soft">
          Déclarés par l'officine, vérifiés il y a 2 jours. Confirmez au comptoir avant de vous
          engager.
        </p>
      </div>
    </>
  )
}

function EcranEquivalent({
  produit,
  onRetour,
  onRemplacer,
}: {
  produit: Produit
  onRetour: () => void
  onRemplacer: (id: string) => void
}) {
  const equivalents = equivalentsDe(produit)

  return (
    <>
      <div className="px-5 pt-4">
        <BoutonRetour onClick={onRetour} libelle="Ma liste" />
        <h1 className="mt-2 text-[1.5rem] leading-tight font-extrabold tracking-[-0.03em] text-ink">
          Même principe actif
        </h1>
        {/*
          Pas d'article devant le principe actif : « de la paracétamol » était
          faux, et le genre varie d'une molécule à l'autre. Le deux-points
          évite d'avoir à le connaître pour chacune des milliers à venir.
        */}
        <p className="mt-1.5 text-[0.88rem] leading-relaxed text-body">
          {produit.nom} {produit.dosage} — principe actif : {produit.principeActif}. Ces produits
          contiennent la même molécule au même dosage.
        </p>

        {/*
          Le motif est rappelé ici : cet écran ne s'ouvre que sur un produit
          qu'aucune officine proche n'a confirmé. Sans cette phrase, il se
          lirait comme une suggestion d'économie, ce qu'il n'est pas.
        */}
        <p className="mt-2 text-[0.82rem] leading-relaxed font-semibold text-alert">
          Vous le voyez parce qu'aucune officine proche n'a confirmé{' '}
          {produit.nom} {produit.dosage}.
        </p>
      </div>

      {/*
        Cette mention est en rouge, seule couleur hors charte du projet, et elle
        n'est pas décorative : proposer un équivalent sans elle reviendrait à
        substituer à la place du pharmacien. Ne pas la retirer, ne pas
        l'atténuer, ne pas la replier derrière un « en savoir plus ».
      */}
      <div className="mx-5 mt-5 flex items-start gap-2.5 rounded-2xl border border-[#f3d3d6] bg-[#fdf6f6] p-4">
        <Svg className="mt-px size-4 shrink-0 text-alert" trait={2.2}>
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16h.01" />
          </>
        </Svg>
        <p className="text-[0.8rem] leading-relaxed font-semibold text-alert">
          Seul le pharmacien peut valider un équivalent pour votre situation. PharmaSur ne remplace
          ni votre ordonnance ni son avis.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 px-5">
        {equivalents.map((e) => (
          <Carte key={e.id}>
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[0.95rem] font-extrabold text-ink">
                  {e.nom} {e.dosage}
                </p>
                <p className="mt-0.5 text-[0.78rem] font-medium text-body-soft">{e.forme}</p>
              </div>
              <div className="text-right">
                <p className="text-[0.95rem] font-extrabold text-ink">{fcfa(e.prix)}</p>
                {e.prix < produit.prix && (
                  <p className="mt-0.5 text-[0.72rem] font-extrabold text-green-600">
                    −{fcfa(produit.prix - e.prix)}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-3">
              <Bouton block variante="clair" onClick={() => onRemplacer(e.id)}>
                Remplacer dans ma liste
              </Bouton>
            </div>
          </Carte>
        ))}
      </div>
    </>
  )
}

function EcranCarte({
  classement,
  nbProduits,
  onOfficine,
}: {
  classement: ReturnType<typeof classer>
  nbProduits: number
  onOfficine: (id: string) => void
}) {
  return (
    <>
      <div className="px-5 pt-5">
        <h1 className="text-[1.65rem] font-extrabold tracking-[-0.03em] text-ink">Autour de vous</h1>
        <p className="mt-1.5 text-[0.88rem] text-body">
Les officines fermées descendent en bas de la liste, grisées.
        </p>
      </div>

      {/*
        Pas de fond de carte : afficher une vraie carte suppose un fournisseur
        de tuiles et des coordonnées réelles, dont aucun n'existe. Un décor de
        carte laisserait croire à une géolocalisation qui n'a pas lieu.
      */}
      <div className="mx-5 mt-5 rounded-2xl border border-line bg-line-soft p-5 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-paper text-green-600">
          <Svg className="size-6">{Icone.carte}</Svg>
        </span>
        <p className="mt-3 text-[0.83rem] leading-relaxed font-semibold text-body">
          Le fond de carte arrivera avec les coordonnées réelles des officines. Pour l'instant, la
          liste ci-dessous suit le même classement.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 px-5">
        {classement.map(({ officine, disponibles, incertains, ouverture: ouv }) => {
          /*
            « 1 en stock » ne disait ni sur combien, ni ce qu'il fallait en
            conclure — et disparaissait quand l'officine n'avait rien, laissant
            l'indisponibilité muette. La pastille rend maintenant un verdict.
            Le décompte exact descend sous le nom, où il informe sans décider.
          */
          const v = verdict(disponibles, nbProduits)
          const puce = {
            disponible: { ton: 'vert' as const, texte: 'Disponible' },
            partiel: { ton: 'ambre' as const, texte: 'Partiel' },
            indisponible: { ton: 'rouge' as const, texte: 'Indisponible' },
          }[v]

          return (
            <button
              key={officine.id}
              type="button"
              onClick={() => onOfficine(officine.id)}
              className={cx(
                'flex w-full items-center gap-3 rounded-2xl border border-line p-4 text-left active:bg-green-50',
                /* Fermée : la carte s'efface au lieu de disparaître. Le patient
                   doit pouvoir la retrouver pour l'appeler demain matin. */
                ouv.ouverte ? 'bg-paper' : 'bg-line-soft/60',
              )}
            >
              <span
                className={cx(
                  'grid size-10 shrink-0 place-items-center rounded-full',
                  ouv.ouverte ? 'bg-green-50 text-green-700' : 'bg-paper text-body-soft',
                )}
              >
                <Svg className="size-5" trait={2.2}>
                  {Icone.repere}
                </Svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.92rem] font-extrabold text-ink">{officine.nom}</p>
                <p className="mt-0.5 text-[0.76rem] font-medium text-body-soft">
                  {officine.distanceKm} km ·{' '}
                  <span className={cx('font-bold', ouv.ouverte ? 'text-green-700' : 'text-alert')}>
                    {ouv.libelle}
                  </span>
                </p>
                {nbProduits > 0 && (
                  <p className="mt-0.5 text-[0.76rem] font-medium text-body-soft">
                    {disponibles} sur {nbProduits} confirmé{disponibles > 1 ? 's' : ''}
                    {incertains > 0 && ` · ${incertains} à confirmer`}
                  </p>
                )}
              </div>
              {/* Une pastille verte sur une officine fermée promettrait un
                  retrait impossible : le verdict de stock passe en gris. */}
              {nbProduits > 0 && (
                <Puce ton={ouv.ouverte ? puce.ton : 'neutre'}>{puce.texte}</Puce>
              )}
            </button>
          )
        })}
      </div>
    </>
  )
}

function EcranProfil({ nbProduits }: { nbProduits: number }) {
  return (
    <>
      <div className="px-5 pt-5">
        <h1 className="text-[1.65rem] font-extrabold tracking-[-0.03em] text-ink">Profil</h1>
      </div>

      <div className="mt-5 px-5">
        <div className="rounded-2xl bg-green-900 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.98rem] font-extrabold text-white">Offre Prompt rétablissement</p>
              <p className="mt-0.5 text-[0.8rem] font-semibold text-green-200">
                Gratuit, sans engagement
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-[0.7rem] font-extrabold text-green-100">
              Active
            </span>
          </div>
          <p className="mt-3 text-[0.8rem] leading-relaxed text-green-200">
            Recherche, prix, équivalent générique, rappels de prise et alertes de retour en stock :
            sans limite et sans compte payant. Il n'y a pas d'offre payante pour les patients.
          </p>
        </div>
      </div>

      <div className="mt-5 px-5">
        <p className="text-[0.72rem] font-extrabold tracking-[0.09em] text-body-soft uppercase">
          Mon dossier
        </p>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line">
          {[
            { label: 'Produits dans ma liste', valeur: String(nbProduits) },
            { label: 'Rappels de prise', valeur: 'Aucun' },
            { label: 'Alertes de retour en stock', valeur: 'Aucune' },
          ].map((l, i) => (
            <div
              key={l.label}
              className={cx(
                'flex items-center justify-between px-4 py-3.5',
                i > 0 && 'border-t border-line-soft',
              )}
            >
              <span className="text-[0.88rem] font-semibold text-ink">{l.label}</span>
              <span className="text-[0.88rem] font-extrabold text-body-soft">{l.valeur}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 px-5">
        <p className="text-[0.75rem] leading-relaxed text-body-soft">
          Cette application est une démonstration installable. Les officines, les stocks et les prix
          sont fictifs, et rien n'est envoyé à un serveur : votre liste reste sur cet appareil.
        </p>
      </div>

      <div className="mt-5 px-5">
        <Bouton block variante="contour" href="/">
          Retour au site PharmaSur
        </Bouton>
      </div>
    </>
  )
}
