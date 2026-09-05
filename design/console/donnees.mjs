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

export const STOCKS = [
  { nom: 'Amoxicilline 500 mg', forme: 'Boîte de 12 gélules', prix: '2 400 F', confirme: 'il y a 3 j', etat: 'incertain', note: '86 recherches cette semaine' },
  { nom: 'Paracétamol 1 g', forme: 'Boîte de 8 comprimés', prix: '900 F', confirme: 'il y a 3 h', etat: 'stock' },
  { nom: 'Ibuprofène 400 mg', forme: 'Boîte de 20 comprimés', prix: '1 300 F', confirme: 'il y a 6 h', etat: 'stock' },
  { nom: 'Ventoline 100 µg', forme: 'Flacon pressurisé', prix: '3 200 F', confirme: '—', etat: 'rupture' },
  { nom: 'Sérum physiologique', forme: 'Boîte de 20 dosettes', prix: '1 800 F', confirme: 'il y a 2 h', etat: 'stock' },
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
