/*
 * Contenu de la console pharmacie livrée.
 *
 * Il est séparé de la mise en page parce que la console existe en deux
 * formes — colonne sur téléphone, barre latérale sur grand écran — et qu'une
 * seule source de contenu évite qu'elles divergent.
 *
 * TOUT EST FICTIF : officine, stocks, demandes, chiffres. La console n'a ni
 * serveur ni base de données. Le bandeau qui l'annonce n'est pas décoratif.
 *
 * Deux règles à ne pas contourner le jour où de vraies données arrivent :
 *   1. Un produit non confirmé depuis plus de 48 h est « incertain », jamais
 *      « en stock ». C'est la contrepartie exacte de la promesse faite aux
 *      patients sur la landing page.
 *   2. Les demandes locales sont des comptages agrégés, seuil à cinq
 *      recherches. Aucun patient identifié, aucune ordonnance transmise.
 */

export const OFFICINE = {
  nom: 'Pharmacie de la Riviera',
  pharmacien: 'Dr Kouassi Aya',
  commune: 'Cocody',
  agrement: 'CI-PH-2019-0847',
  telephone: '07 00 00 00 00',
}

/*
 * Communes du district d'Abidjan, où commence le référencement. La commune est
 * une liste fermée et non un champ libre : « Cocody », « COCODY » et « cocody »
 * deviendraient trois zones différentes le jour où l'application cherchera les
 * officines proches.
 */
export const COMMUNES = [
  'Abobo', 'Adjamé', 'Attécoubé', 'Bingerville', 'Cocody', 'Koumassi',
  'Marcory', 'Plateau', 'Port-Bouët', 'Treichville', 'Yopougon',
]

/*
 * Horaires déclarés par l'officine. Ils ne sont pas décoratifs : l'application
 * patient ne classe en tête que les officines ouvertes, et affiche les autres
 * grisées avec leur heure d'ouverture. Une officine qui ne déclare rien serait
 * donc invisible aux heures où elle travaille.
 *
 * La garde est distincte des horaires parce qu'elle ne les prolonge pas : elle
 * rouvre l'officine en dehors, pour une nuit ou un dimanche.
 */
export const HORAIRES = {
  ouvre: '08:00',
  ferme: '22:00',
  continu: false,
  deGarde: false,
}

export const MENU = [
  { id: 'tableau', label: 'Tableau de bord', icone: 'grille' },
  { id: 'stocks', label: 'Stocks', icone: 'boite' },
  { id: 'bons', label: "Bons d'assurance", icone: 'bouclier' },
  { id: 'demandes', label: 'Demandes locales', icone: 'loupe', badge: '14' },
]

export const VIGNETTES = [
  { label: 'Vues de votre fiche', valeur: '1 284', note: '+12 % cette semaine', ton: 'vert' },
  { label: 'Produits confirmés', valeur: '312', note: 'sur 340 référencés' },
  { label: 'Demandes non couvertes', valeur: '47', note: 'stable' },
  { label: "Bons d'assurance", valeur: '3', note: 'vérifiés il y a 2 jours' },
]

export const RECHERCHES = [
  { nom: 'Amoxicilline 500 mg', nb: 86, part: 100, alerte: true },
  { nom: 'Paracétamol 1 g', nb: 61, part: 71 },
  { nom: 'Ventoline 100 µg', nb: 44, part: 51 },
  { nom: 'Ibuprofène 400 mg', nb: 29, part: 34 },
]

export const A_CONFIRMER = [
  { nom: 'Doliprane 1 g', detail: 'Confirmé il y a 3 jours' },
  { nom: 'Efferalgan 500 mg', detail: 'Confirmé il y a 4 jours' },
  { nom: 'Smecta', detail: 'Jamais confirmé' },
]

/*
 * Chaque produit porte son principe actif et les équivalents que l'officine
 * peut proposer à sa place — même molécule, même dosage, rien d'autre.
 *
 * Ces équivalents ne sont PAS proposés automatiquement au patient : c'est le
 * pharmacien qui en désigne un, produit par produit, quand il déclare une
 * rupture. C'est le sens de la fonctionnalité pour une officine sans logiciel
 * de gestion connecté — elle ne peut pas publier son stock, mais elle peut
 * dire « je n'ai pas celui-ci, j'ai celui-là ».
 *
 * La liste est volontairement courte : proposer un équivalent est un acte
 * professionnel, pas un moteur de suggestion. Un produit sans équivalent au
 * même principe actif n'en a aucun, et l'interface doit le dire.
 */
export const STOCKS = [
  {
    id: 'amox500',
    nom: 'Amoxicilline 500 mg',
    forme: 'Boîte de 12 gélules',
    prix: '2 400 F',
    confirme: 'il y a 3 j',
    etat: 'incertain',
    note: '86 recherches cette semaine',
    principeActif: 'amoxicilline',
    equivalents: [{ nom: 'Clamoxyl 500 mg', forme: 'Boîte de 12 gélules', prix: '3 900 F' }],
  },
  {
    id: 'para1000',
    nom: 'Paracétamol 1 g',
    forme: 'Boîte de 8 comprimés',
    prix: '900 F',
    confirme: 'il y a 3 h',
    etat: 'stock',
    principeActif: 'paracétamol',
    equivalents: [{ nom: 'Doliprane 1 g', forme: 'Boîte de 8 comprimés', prix: '1 500 F' }],
  },
  {
    id: 'ibu400',
    nom: 'Ibuprofène 400 mg',
    forme: 'Boîte de 20 comprimés',
    prix: '1 300 F',
    confirme: 'il y a 6 h',
    etat: 'stock',
    principeActif: 'ibuprofène',
    equivalents: [],
  },
  {
    id: 'vent100',
    nom: 'Ventoline 100 µg',
    forme: 'Flacon pressurisé',
    prix: '3 200 F',
    confirme: '—',
    etat: 'rupture',
    principeActif: 'salbutamol',
    equivalents: [{ nom: 'Salbutamol 100 µg', forme: 'Flacon pressurisé', prix: '2 100 F' }],
  },
  {
    id: 'sero500',
    nom: 'Sérum physiologique',
    forme: 'Boîte de 20 dosettes',
    prix: '1 800 F',
    confirme: 'il y a 2 h',
    etat: 'stock',
    principeActif: 'chlorure de sodium',
    equivalents: [],
  },
]

export const BONS = [
  { nom: 'CMU', detail: 'Couverture Maladie Universelle', ajout: 'ajoutée le 12 août' },
  { nom: 'Mutuelles', detail: "Mutuelles de fonctionnaires et d'entreprise", ajout: 'ajoutée le 12 août' },
  { nom: 'Assurances privées', detail: 'Contrats individuels et collectifs', ajout: 'ajoutée le 3 septembre' },
]

export const DEMANDES = [
  { nom: 'Amoxicilline 500 mg', detail: 'Antibiotique · boîte de 12 gélules', nb: 86, etat: 'rupture', action: "Signaler l'arrivée", alerte: true },
  { nom: 'Ventoline 100 µg', detail: 'Bronchodilatateur · flacon pressurisé', nb: 41, etat: 'rupture', action: "Signaler l'arrivée" },
  { nom: 'Insuline Lantus', detail: 'Chaîne du froid · stylo pré-rempli', nb: 33, etat: 'jamais', action: 'Ajouter au stock' },
  { nom: 'Paracétamol 1 g', detail: 'Antalgique · boîte de 8 comprimés', nb: 27, etat: 'non-confirme', action: 'Confirmer' },
  { nom: 'Bandes de contrôle glycémique', detail: 'Dispositif · boîte de 50', nb: 19, etat: 'jamais', action: 'Ajouter au stock' },
  { nom: 'Sérum physiologique', detail: 'Hygiène · dosettes 5 ml', nb: 12, etat: 'stock', action: null },
]

export const ZONES = [
  { nom: 'Cocody Riviera 2', nb: 94 },
  { nom: 'Cocody Angré', nb: 71 },
  { nom: 'Deux-Plateaux', nb: 53 },
]
