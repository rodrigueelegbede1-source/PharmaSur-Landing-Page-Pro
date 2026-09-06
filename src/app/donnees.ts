/*
 * Données de démonstration de l'application patient.
 *
 * ELLES SONT FAUSSES. Aucune base de données n'existe : ni catalogue de
 * médicaments, ni référentiel d'officines, ni stock réel. Ces valeurs servent
 * à faire fonctionner l'application pour la montrer, pas à renseigner qui que
 * ce soit.
 *
 * Quatre règles à ne pas contourner le jour où de vraies données arrivent :
 *   1. Une disponibilité non confirmée depuis 48 h est « incertaine », jamais
 *      « disponible ». Le champ `confirmeIlYaHeures` porte cette information
 *      et l'interface doit continuer de l'afficher.
 *   2. L'équivalent proposé porte sur le PRINCIPE ACTIF seul. Jamais sur une
 *      autre molécule, jamais sans la mention de validation par le pharmacien.
 *   3. Les prix des médicaments sont homologués en Côte d'Ivoire : un produit
 *      a UN prix, le même partout. D'où un prix par produit et non par
 *      officine — et rien à comparer d'une officine à l'autre là-dessus.
 *   4. Une officine n'est proposée que si elle est ouverte à l'heure de la
 *      recherche. Ses horaires viennent d'elle, jamais d'une estimation.
 */

export type Produit = {
  id: string
  nom: string
  dosage: string
  forme: string
  principeActif: string
  /** Prix homologué en FCFA. Il ne varie pas d'une officine à l'autre. */
  prix: number
}

export const CATALOGUE: Produit[] = [
  { id: 'amox500', nom: 'Amoxicilline', dosage: '500 mg', forme: 'Boîte de 12 gélules', principeActif: 'amoxicilline', prix: 2400 },
  { id: 'clamox500', nom: 'Clamoxyl', dosage: '500 mg', forme: 'Boîte de 12 gélules', principeActif: 'amoxicilline', prix: 3900 },
  { id: 'para1000', nom: 'Paracétamol', dosage: '1 g', forme: 'Boîte de 8 comprimés', principeActif: 'paracétamol', prix: 900 },
  { id: 'doli1000', nom: 'Doliprane', dosage: '1 g', forme: 'Boîte de 8 comprimés', principeActif: 'paracétamol', prix: 1500 },
  { id: 'vent100', nom: 'Ventoline', dosage: '100 µg', forme: 'Flacon pressurisé', principeActif: 'salbutamol', prix: 3200 },
  { id: 'salb100', nom: 'Salbutamol', dosage: '100 µg', forme: 'Flacon pressurisé', principeActif: 'salbutamol', prix: 2100 },
  { id: 'ibu400', nom: 'Ibuprofène', dosage: '400 mg', forme: 'Boîte de 20 comprimés', principeActif: 'ibuprofène', prix: 1300 },
  { id: 'sero500', nom: 'Sérum physiologique', dosage: '5 ml', forme: 'Boîte de 20 dosettes', principeActif: 'chlorure de sodium', prix: 1800 },
  { id: 'lanto', nom: 'Insuline Lantus', dosage: '100 U/ml', forme: 'Stylo pré-rempli', principeActif: 'insuline glargine', prix: 12500 },
  { id: 'metf850', nom: 'Metformine', dosage: '850 mg', forme: 'Boîte de 30 comprimés', principeActif: 'metformine', prix: 2600 },
]

export type Officine = {
  id: string
  nom: string
  quartier: string
  distanceKm: number
  /*
   * Horaires en minutes depuis minuit, pas en phrase. « Ferme à 22 h » se lit
   * bien mais ne se calcule pas : impossible de savoir si l'officine est
   * ouverte MAINTENANT, et l'application envoyait donc des patients devant des
   * portes closes. Une officine ouverte 24 h/24 va de 0 à 1440.
   */
  ouvre: number
  ferme: number
  /*
   * De garde : l'officine assure la permanence de nuit, et reste donc
   * joignable en dehors de ses horaires. C'est une rotation, pas un état
   * permanent — l'officine la déclare depuis sa console.
   */
  deGarde: boolean
  telephone: string
  /*
   * Les organismes acceptés en tiers payant, NOMMÉS. Ce champ portait des
   * catégories — « CMU », « Mutuelles », « Assurances privées » — qui ne
   * répondaient à personne : un assuré chez NSIA ne cherche pas « assurances
   * privées », il cherche NSIA, et « Mutuelles » ne lui dit pas si la sienne
   * est acceptée.
   *
   * Le vocabulaire est celui que l'officine coche dans sa console
   * (design/console/donnees.mjs, ORGANISMES), plus ce qu'elle y ajoute
   * elle-même. Y écrire un nom absent de ce vocabulaire ferait apparaître un
   * organisme que personne ne pourra jamais déclarer.
   */
  bons: string[]
  /** Produits confirmés en stock, par identifiant de produit. */
  stock: Record<string, { confirmeIlYaHeures: number }>
}

/*
 * DEUX PRODUITS SONT VOLONTAIREMENT EN RUPTURE PARTOUT, et doivent le rester :
 *
 *   - Clamoxyl 500 mg, qui a un équivalent au même principe actif
 *     (Amoxicilline 500 mg, disponible aux Deux-Plateaux) ;
 *   - Insuline Lantus, qui n'en a aucun.
 *
 * Sans eux, aucun produit du catalogue ne serait jamais introuvable : la règle
 * « on ne propose un équivalent qu'en cas de rupture » ne se déclencherait
 * jamais, et personne ne pourrait vérifier qu'elle marche. Les deux cas
 * couvrent les deux branches — avec équivalent, et sans.
 *
 * Si vous ajoutez ces produits à un stock, ajoutez-en d'autres en rupture.
 */
export const OFFICINES: Officine[] = [
  {
    id: 'riviera',
    nom: 'Pharmacie de la Riviera',
    quartier: 'Cocody Riviera 2',
    distanceKm: 1.2,
    ouvre: 0,
    ferme: 1440,
    deGarde: true,
    telephone: '+225 07 00 00 00 01',
    bons: ['CMU', 'MUGEFCI', 'NSIA Assurances', 'ASCOMA'],
    stock: {
      para1000: { confirmeIlYaHeures: 3 },
      doli1000: { confirmeIlYaHeures: 3 },
      ibu400: { confirmeIlYaHeures: 6 },
      sero500: { confirmeIlYaHeures: 2 },
      metf850: { confirmeIlYaHeures: 30 },
    },
  },
  {
    id: 'saintjean',
    nom: 'Pharmacie Saint-Jean',
    quartier: 'Cocody Angré',
    distanceKm: 2.4,
    ouvre: 8 * 60,
    ferme: 22 * 60,
    deGarde: false,
    telephone: '+225 07 00 00 00 02',
    bons: ['CMU', 'MUGEFCI'],
    stock: {
      para1000: { confirmeIlYaHeures: 9 },
      ibu400: { confirmeIlYaHeures: 12 },
      vent100: { confirmeIlYaHeures: 4 },
      sero500: { confirmeIlYaHeures: 70 },
    },
  },
  {
    id: 'deuxplateaux',
    nom: 'Pharmacie des Deux-Plateaux',
    quartier: 'Deux-Plateaux Vallon',
    distanceKm: 3.1,
    ouvre: 9 * 60,
    ferme: 18 * 60,
    deGarde: false,
    telephone: '+225 07 00 00 00 03',
    bons: ['CMU'],
    stock: {
      amox500: { confirmeIlYaHeures: 7 },
      para1000: { confirmeIlYaHeures: 20 },
      metf850: { confirmeIlYaHeures: 8 },
    },
  },
  {
    id: 'palmeraie',
    nom: 'Pharmacie de la Palmeraie',
    quartier: 'Cocody Palmeraie',
    distanceKm: 4.6,
    ouvre: 7 * 60 + 30,
    ferme: 21 * 60,
    deGarde: true,
    telephone: '+225 07 00 00 00 04',
    bons: ['CMU', 'SUNU Assurances'],
    stock: {
      amox500: { confirmeIlYaHeures: 60 },
      vent100: { confirmeIlYaHeures: 5 },
      salb100: { confirmeIlYaHeures: 5 },
      ibu400: { confirmeIlYaHeures: 26 },
      sero500: { confirmeIlYaHeures: 11 },
    },
  },
]

/*
 * Ouverture : la seule chose qu'un patient doit savoir avant de se déplacer.
 *
 * L'application classait les officines par complétude puis par distance, sans
 * jamais regarder l'heure : à 23 h, elle pouvait recommander en tête une
 * pharmacie fermée depuis cinq heures. Avoir le médicament ne sert à rien si
 * la porte est close.
 *
 * Une officine DE GARDE assure la permanence de nuit : elle reste joignable en
 * dehors de ses horaires. C'est une rotation hebdomadaire, déclarée par
 * l'officine elle-même dans sa console — jamais devinée par l'application.
 */
export type Ouverture = {
  ouverte: boolean
  /** Ouverte uniquement parce qu'elle est de garde, hors de ses horaires. */
  parGarde: boolean
  /** Phrase à afficher : « Ouverte jusqu'à 22 h », « Fermée jusqu'à 8 h »… */
  libelle: string
}

const hhmm = (minutes: number) => {
  const h = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`
}

export function ouverture(officine: Officine, maintenant = new Date()): Ouverture {
  const m = maintenant.getHours() * 60 + maintenant.getMinutes()
  const continu = officine.ouvre === 0 && officine.ferme >= 1440
  /* Une officine qui ferme à 1 h du matin a une heure de fermeture INFÉRIEURE
     à son heure d'ouverture : la plage enjambe minuit et se teste alors par
     réunion, pas par intervalle. Sans ce cas, elle serait déclarée fermée
     toute la journée. */
  const dansLesHoraires =
    continu ||
    (officine.ouvre < officine.ferme
      ? m >= officine.ouvre && m < officine.ferme
      : m >= officine.ouvre || m < officine.ferme)

  if (continu) return { ouverte: true, parGarde: false, libelle: 'Ouverte 24 h/24' }
  if (dansLesHoraires) {
    return { ouverte: true, parGarde: false, libelle: `Ouverte jusqu'à ${hhmm(officine.ferme)}` }
  }
  if (officine.deGarde) {
    return { ouverte: true, parGarde: true, libelle: 'De garde cette nuit' }
  }
  return { ouverte: false, parGarde: false, libelle: `Fermée jusqu'à ${hhmm(officine.ouvre)}` }
}

/** Au-delà de ce délai, une disponibilité n'est plus affirmée. */
export const SEUIL_INCERTAIN_H = 48

export type Etat = 'disponible' | 'incertain' | 'absent'

export function etatDuProduit(officine: Officine, produitId: string): Etat {
  const ligne = officine.stock[produitId]
  if (!ligne) return 'absent'
  return ligne.confirmeIlYaHeures <= SEUIL_INCERTAIN_H ? 'disponible' : 'incertain'
}

/**
 * Un produit est en rupture quand AUCUNE officine des environs ne l'a confirmé
 * disponible. Un stock incertain ne suffit pas à le déclarer trouvable : c'est
 * la même règle que partout ailleurs.
 *
 * C'est la seule condition qui autorise à proposer un équivalent. Le proposer
 * sur un produit disponible reviendrait à pousser à la substitution pour une
 * raison de prix — exactement ce que la page d'accueil s'engage à ne pas faire :
 * « En cas de rupture, l'application PEUT signaler un médicament ayant le même
 * principe actif. »
 */
export function estEnRupture(produitId: string, officines: Officine[]): boolean {
  return !officines.some((o) => etatDuProduit(o, produitId) === 'disponible')
}

/**
 * Équivalents par principe actif, et uniquement par principe actif : deux
 * médicaments partageant la molécule et le dosage. Ce n'est pas une
 * substitution thérapeutique, et l'interface doit toujours renvoyer la
 * décision au pharmacien.
 */
export function equivalentsDe(produit: Produit): Produit[] {
  return CATALOGUE.filter(
    (p) => p.id !== produit.id && p.principeActif === produit.principeActif && p.dosage === produit.dosage,
  )
}

export function fcfa(n: number): string {
  return `${n.toLocaleString('fr-FR')} F`
}

export function chercher(requete: string): Produit[] {
  const q = requete.trim().toLowerCase()
  if (q.length < 2) return []
  return CATALOGUE.filter(
    (p) => p.nom.toLowerCase().includes(q) || p.principeActif.toLowerCase().includes(q),
  ).slice(0, 6)
}

/**
 * Verdict d'une officine sur une liste entière, pour la pastille de la carte.
 *
 * Le libellé disait « 1 en stock » : un décompte sans dénominateur, illisible,
 * et surtout absent quand l'officine n'avait rien — l'indisponibilité passait
 * alors sous silence, ce qui est le pire des cas pour un patient.
 *
 * Un produit INCERTAIN ne compte jamais comme disponible. C'est la même règle
 * que partout ailleurs dans le produit : une disponibilité non confirmée
 * depuis 48 h n'est pas une disponibilité. Elle ne peut donc pas faire monter
 * une officine à « Disponible ».
 */
export type Verdict = 'disponible' | 'partiel' | 'indisponible'

export function verdict(disponibles: number, nbProduits: number): Verdict {
  if (nbProduits === 0 || disponibles === 0) return 'indisponible'
  return disponibles === nbProduits ? 'disponible' : 'partiel'
}

/** Officines classées par complétude, puis par distance. */
export function classer(officines: Officine[], produits: Produit[], maintenant = new Date()) {
  return officines
    .map((o) => {
      const etats = produits.map((p) => ({ produit: p, etat: etatDuProduit(o, p.id) }))
      const disponibles = etats.filter((e) => e.etat === 'disponible').length
      const incertains = etats.filter((e) => e.etat === 'incertain').length
      const total = etats
        .filter((e) => e.etat !== 'absent')
        .reduce((s, e) => s + e.produit.prix, 0)
      return { officine: o, etats, disponibles, incertains, total, ouverture: ouverture(o, maintenant) }
    })
    /*
     * L'ouverture passe AVANT la complétude. Une officine fermée qui a tout
     * votre ordonnance ne vous sert à rien maintenant ; une officine ouverte
     * qui en a la moitié vous sert tout de suite. Les fermées ne disparaissent
     * pas pour autant — savoir qu'elle ouvre à 8 h vaut mieux que ne rien
     * savoir — mais elles ne sont jamais en tête.
     */
    .sort(
      (a, b) =>
        Number(b.ouverture.ouverte) - Number(a.ouverture.ouverte) ||
        b.disponibles - a.disponibles ||
        a.officine.distanceKm - b.officine.distanceKm,
    )
}
