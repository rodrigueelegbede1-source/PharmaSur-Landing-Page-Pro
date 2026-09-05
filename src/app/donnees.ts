/*
 * Données de démonstration de l'application patient.
 *
 * ELLES SONT FAUSSES. Aucune base de données n'existe : ni catalogue de
 * médicaments, ni référentiel d'officines, ni stock réel. Ces valeurs servent
 * à faire fonctionner l'application pour la montrer, pas à renseigner qui que
 * ce soit.
 *
 * Trois règles à ne pas contourner le jour où de vraies données arrivent :
 *   1. Une disponibilité non confirmée depuis 48 h est « incertaine », jamais
 *      « disponible ». Le champ `confirmeIlYaHeures` porte cette information
 *      et l'interface doit continuer de l'afficher.
 *   2. L'équivalent proposé porte sur le PRINCIPE ACTIF seul. Jamais sur une
 *      autre molécule, jamais sans la mention de validation par le pharmacien.
 *   3. Les prix sont indicatifs et déclarés par l'officine. L'application ne
 *      les garantit pas et doit le dire.
 */

export type Produit = {
  id: string
  nom: string
  dosage: string
  forme: string
  principeActif: string
  /** Prix indicatif en FCFA, déclaré par les officines. */
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
  horaires: string
  deGarde: boolean
  telephone: string
  bons: string[]
  /** Produits confirmés en stock, par identifiant de produit. */
  stock: Record<string, { confirmeIlYaHeures: number }>
}

export const OFFICINES: Officine[] = [
  {
    id: 'riviera',
    nom: 'Pharmacie de la Riviera',
    quartier: 'Cocody Riviera 2',
    distanceKm: 1.2,
    horaires: 'Ouvert 24 h/24',
    deGarde: true,
    telephone: '+225 07 00 00 00 01',
    bons: ['CMU', 'Mutuelles', 'Assurances privées'],
    stock: {
      para1000: { confirmeIlYaHeures: 3 },
      doli1000: { confirmeIlYaHeures: 3 },
      ibu400: { confirmeIlYaHeures: 6 },
      sero500: { confirmeIlYaHeures: 2 },
      metf850: { confirmeIlYaHeures: 30 },
      clamox500: { confirmeIlYaHeures: 5 },
    },
  },
  {
    id: 'saintjean',
    nom: 'Pharmacie Saint-Jean',
    quartier: 'Cocody Angré',
    distanceKm: 2.4,
    horaires: "Ferme à 22 h",
    deGarde: false,
    telephone: '+225 07 00 00 00 02',
    bons: ['CMU', 'Mutuelles'],
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
    horaires: 'Ouvert jusqu’à 20 h',
    deGarde: false,
    telephone: '+225 07 00 00 00 03',
    bons: ['CMU'],
    stock: {
      amox500: { confirmeIlYaHeures: 7 },
      para1000: { confirmeIlYaHeures: 20 },
      metf850: { confirmeIlYaHeures: 8 },
      lanto: { confirmeIlYaHeures: 14 },
    },
  },
  {
    id: 'palmeraie',
    nom: 'Pharmacie de la Palmeraie',
    quartier: 'Cocody Palmeraie',
    distanceKm: 4.6,
    horaires: 'Ouvert 24 h/24',
    deGarde: true,
    telephone: '+225 07 00 00 00 04',
    bons: ['CMU', 'Assurances privées'],
    stock: {
      amox500: { confirmeIlYaHeures: 60 },
      vent100: { confirmeIlYaHeures: 5 },
      salb100: { confirmeIlYaHeures: 5 },
      ibu400: { confirmeIlYaHeures: 26 },
      sero500: { confirmeIlYaHeures: 11 },
    },
  },
]

/** Au-delà de ce délai, une disponibilité n'est plus affirmée. */
export const SEUIL_INCERTAIN_H = 48

export type Etat = 'disponible' | 'incertain' | 'absent'

export function etatDuProduit(officine: Officine, produitId: string): Etat {
  const ligne = officine.stock[produitId]
  if (!ligne) return 'absent'
  return ligne.confirmeIlYaHeures <= SEUIL_INCERTAIN_H ? 'disponible' : 'incertain'
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
export function classer(officines: Officine[], produits: Produit[]) {
  return officines
    .map((o) => {
      const etats = produits.map((p) => ({ produit: p, etat: etatDuProduit(o, p.id) }))
      const disponibles = etats.filter((e) => e.etat === 'disponible').length
      const incertains = etats.filter((e) => e.etat === 'incertain').length
      const total = etats
        .filter((e) => e.etat !== 'absent')
        .reduce((s, e) => s + e.produit.prix, 0)
      return { officine: o, etats, disponibles, incertains, total }
    })
    .sort((a, b) => b.disponibles - a.disponibles || a.officine.distanceKm - b.officine.distanceKm)
}
