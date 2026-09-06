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

/*
 * Les organismes que l'officine peut déclarer accepter.
 *
 * PROVENANCE. Liste proposée le 6 septembre 2026, puis revue et validée le
 * même jour par Rodrigue Elegbede, qui connaît le terrain ivoirien. Deux
 * courtiers gestionnaires — ASCOMA et Gras Savoye — ont été retirés à cette
 * revue : c'est le nom de l'assureur, et non du gestionnaire, qui figure sur
 * la carte du patient. Les huit restants sont confirmés.
 *
 * Cette ligne n'est pas de la paperasse : le jour où quelqu'un se demandera
 * d'où sortent ces noms, la réponse doit être dans le fichier et non dans la
 * mémoire de quelqu'un. Toute modification ultérieure se refait valider de
 * la même façon.
 *
 * TROIS RÈGLES, dans l'ordre d'importance :
 *
 *   1. AUCUN NOM N'EST INVENTÉ. Un assureur qui n'existe pas, ou dont le nom
 *      est approximatif, envoie un patient au comptoir avec une carte qui sera
 *      refusée. Elle est volontairement COURTE : mieux vaut qu'un pharmacien
 *      ajoute le sien que de lui proposer un nom douteux.
 *
 *   2. ELLE RESTE OUVERTE. Le marché ivoirien compte davantage d'assureurs que
 *      ceux nommés ici, et les réseaux de tiers payant changent. D'où le champ
 *      libre : c'est le pharmacien qui sait ce qu'il accepte. Ses ajouts sont
 *      la vraie source pour compléter cette liste — y compris pour y ramener
 *      un gestionnaire si les cartes le portent réellement.
 *
 *   3. LES MUTUELLES D'ENTREPRISE NE S'ÉNUMÈRENT PAS. Chaque société a la
 *      sienne ; les lister toutes est impossible et en lister quelques-unes
 *      serait arbitraire. Elles passent donc par une entrée générique que le
 *      pharmacien nomme lui-même.
 *
 * Le nom retenu est celui que le PATIENT lit sur sa carte, pas la raison
 * sociale : c'est ce qu'il cherchera dans l'application. Si une carte porte
 * une autre graphie que celle écrite ici — « SUNU Santé » plutôt que « SUNU
 * Assurances », par exemple — c'est la carte qui a raison, et ce fichier qu'il
 * faut corriger.
 *
 * C'EST LA SEULE SOURCE. La console, la fiche de collecte, le vérificateur
 * d'import et l'application patient en dérivent : corriger ici suffit.
 */
export const ORGANISMES = [
  {
    categorie: 'Régime obligatoire',
    aide: "Le régime public. Toute officine conventionnée l'accepte.",
    entrees: [{ nom: 'CMU', detail: 'Couverture Maladie Universelle · CNAM', coche: true }],
  },
  {
    categorie: 'Mutuelles',
    aide: "Les mutuelles d'entreprise portent le nom de la société : ajoutez-les au champ libre.",
    entrees: [
      {
        nom: 'MUGEFCI',
        detail: "Mutuelle Générale des Fonctionnaires et Agents de l'État",
        coche: true,
      },
      { nom: "Mutuelle d'entreprise", detail: 'À nommer dans vos remarques', coche: false },
    ],
  },
  {
    /*
     * « Assurances », et non plus « Assurances et gestionnaires ». ASCOMA et
     * Gras Savoye en ont été retirés : ce sont des courtiers gestionnaires, et
     * c'est le nom de l'ASSUREUR qui figure sur la carte du patient. Les
     * proposer aurait fait cocher au pharmacien un intitulé que son client ne
     * lira jamais sur son carnet, et chercher en vain dans l'application.
     */
    categorie: 'Assurances',
    aide: 'Cochez ce que vous acceptez réellement en tiers payant, pas ce que vous pourriez accepter.',
    entrees: [
      { nom: 'NSIA Assurances', detail: 'Santé individuelle et collective', coche: true },
      { nom: 'SUNU Assurances', detail: 'Santé individuelle et collective', coche: false },
      { nom: 'Allianz Côte d’Ivoire', detail: 'Santé collective', coche: false },
      { nom: 'Sanlam', detail: 'Anciennement SAHAM · Colina', coche: false },
      { nom: 'Atlantique Assurances', detail: 'Santé collective', coche: false },
    ],
  },
]

/**
 * Seuil d'affichage des comptages, déjà appliqué aux produits et désormais au
 * croisement avec l'assurance. En dessous, on ne montre rien : « 2 recherches
 * d'insuline par des porteurs SUNU dans la Riviera » désigne une poignée de
 * personnes, et ce serait les identifier par la bande.
 */
export const SEUIL_AFFICHAGE = 5

/*
 * `parAssurance` est une ventilation du même comptage, pas un comptage
 * nouveau : la somme d'une ligne ne dépasse jamais `nb`. Elle est incomplète —
 * tous les patients n'ont pas d'assurance — et c'est voulu.
 *
 * Plusieurs cases sont volontairement SOUS le seuil : sans elles, personne ne
 * pourrait vérifier que le masquage fonctionne.
 */
export const DEMANDES = [
  { nom: 'Amoxicilline 500 mg', detail: 'Antibiotique · boîte de 12 gélules', nb: 86, etat: 'rupture', action: "Signaler l'arrivée", alerte: true,
    parAssurance: { CMU: 38, MUGEFCI: 21, 'NSIA Assurances': 11, 'SUNU Assurances': 8 } },
  { nom: 'Ventoline 100 µg', detail: 'Bronchodilatateur · flacon pressurisé', nb: 41, etat: 'rupture', action: "Signaler l'arrivée",
    parAssurance: { CMU: 19, MUGEFCI: 9, 'SUNU Assurances': 6, 'NSIA Assurances': 3 } },
  { nom: 'Insuline Lantus', detail: 'Chaîne du froid · stylo pré-rempli', nb: 33, etat: 'jamais', action: 'Ajouter au stock',
    parAssurance: { CMU: 14, MUGEFCI: 11, 'SUNU Assurances': 5, 'NSIA Assurances': 2 } },
  { nom: 'Paracétamol 1 g', detail: 'Antalgique · boîte de 8 comprimés', nb: 27, etat: 'non-confirme', action: 'Confirmer',
    parAssurance: { CMU: 12, MUGEFCI: 7, 'SUNU Assurances': 4 } },
  { nom: 'Bandes de contrôle glycémique', detail: 'Dispositif · boîte de 50', nb: 19, etat: 'jamais', action: 'Ajouter au stock',
    parAssurance: { CMU: 8, MUGEFCI: 6, 'SUNU Assurances': 3 } },
  { nom: 'Sérum physiologique', detail: 'Hygiène · dosettes 5 ml', nb: 12, etat: 'stock', action: null,
    parAssurance: { CMU: 7, MUGEFCI: 3 } },
]

/*
 * Les assurances portées par les patients qui cherchent près de l'officine,
 * TOUS PRODUITS CONFONDUS. C'est la seule ventilation dont les effectifs
 * restent assez grands pour être publiés sans réserve — le croisement avec un
 * produit précis, lui, passe par le seuil.
 *
 * Elle se déduit des demandes plutôt que d'être écrite à part : deux tableaux
 * de chiffres qui devraient concorder finissent toujours par diverger.
 */
export const ASSURANCES_ALENTOUR = Object.entries(
  DEMANDES.reduce((total, d) => {
    for (const [nom, nb] of Object.entries(d.parAssurance)) total[nom] = (total[nom] ?? 0) + nb
    return total
  }, {}),
)
  .map(([nom, nb]) => ({ nom, nb }))
  .sort((a, b) => b.nb - a.nb)

export const ZONES = [
  { nom: 'Cocody Riviera 2', nb: 94 },
  { nom: 'Cocody Angré', nb: 71 },
  { nom: 'Deux-Plateaux', nb: 53 },
]
