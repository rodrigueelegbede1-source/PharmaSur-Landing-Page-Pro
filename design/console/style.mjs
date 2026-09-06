/*
 * Feuille de style de la console livrée.
 *
 * Une seule mise en page, deux formes. Sous 900 px — un téléphone derrière un
 * comptoir — la barre latérale devient une barre d'onglets en bas du pouce, et
 * les tableaux deviennent des cartes empilées : un tableau à quatre colonnes
 * sur 390 px se lit à la loupe ou pas du tout. Au-dessus, la barre latérale
 * revient et les tableaux redeviennent des tableaux.
 *
 * Les jetons sont ceux de src/index.css : la console, le site et l'application
 * doivent se ressembler, un pharmacien passe de l'un à l'autre.
 */
export const STYLE = `
:root {
  --vert-950:#062a1d; --vert-900:#0b3d2c; --vert-800:#0d5a40; --vert-700:#10714f;
  --vert-600:#12855d; --vert-500:#16a06f; --vert-400:#2fbc86; --vert-200:#b9e8d3;
  --vert-100:#d9f2e7; --vert-50:#f1fbf6;
  --encre:#0e1b16; --corps:#4a5b54; --doux:#7b8b84;
  --trait:#e2ece7; --trait-doux:#eef5f1; --papier:#ffffff; --fond:#f7faf9;
  --alerte:#c1121f; --ambre:#8a5a12; --ambre-fond:#fdf7ea; --ambre-trait:#f0dcb4;
  --barre: 64px;
}
* { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
html, body { margin:0; padding:0; }
body {
  font-family:'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  background:var(--fond); color:var(--corps);
  font-size:15px; line-height:1.5;
  -webkit-font-smoothing:antialiased;
}
button { font:inherit; color:inherit; border:0; background:none; cursor:pointer; }

/* — Avertissement de démonstration — */
.avis {
  display:flex; gap:10px; align-items:flex-start;
  background:var(--ambre-fond); border-bottom:1px solid var(--ambre-trait);
  color:var(--ambre); font-size:12.5px; font-weight:600; line-height:1.45;
  padding:10px 16px;
}
.avis svg { flex:none; margin-top:1px; }

/* — Ossature — */
.appli { display:flex; flex-direction:column; min-height:100vh; min-height:100dvh; }
.corps { display:flex; flex:1; min-height:0; }

.laterale { display:none; }

.principal { flex:1; min-width:0; display:flex; flex-direction:column; }

.entete {
  position:sticky; top:0; z-index:20;
  background:var(--papier); border-bottom:1px solid var(--trait);
  padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px;
}
.entete h1 { margin:0; font-size:19px; font-weight:800; letter-spacing:-0.02em; color:var(--encre); }
.entete p { margin:2px 0 0; font-size:12px; font-weight:500; color:var(--doux); }

.contenu { padding:16px; display:flex; flex-direction:column; gap:14px; padding-bottom:calc(var(--barre) + 28px); }

/* — Barre d'onglets, sous le pouce — */
.onglets {
  position:fixed; inset:auto 0 0 0; z-index:30;
  display:flex; background:var(--papier); border-top:1px solid var(--trait);
  padding-bottom:env(safe-area-inset-bottom);
}
.onglet {
  flex:1; display:flex; flex-direction:column; align-items:center; gap:3px;
  padding:9px 2px; min-height:var(--barre);
  font-size:10.5px; font-weight:600; color:var(--doux);
  position:relative;
}
.onglet[aria-current='page'] { color:var(--vert-600); font-weight:800; }
.onglet .pastille {
  position:absolute; top:5px; left:calc(50% + 8px);
  background:var(--vert-600); color:#fff; font-size:9.5px; font-weight:800;
  padding:1px 5px; border-radius:999px;
}

/* — Cartes — */
.carte { background:var(--papier); border:1px solid var(--trait); border-radius:16px; padding:16px; }
.carte + .carte { margin-top:0; }
.titre-bloc { font-size:11px; font-weight:800; letter-spacing:0.07em; text-transform:uppercase; color:var(--doux); }

.vignettes { display:grid; grid-template-columns:repeat(2, 1fr); gap:10px; }
.vignette { background:var(--papier); border:1px solid var(--trait); border-radius:16px; padding:14px; }
.vignette .lab { font-size:10.5px; font-weight:800; letter-spacing:0.06em; text-transform:uppercase; color:var(--doux); }
.vignette .val { margin-top:4px; font-size:26px; font-weight:800; letter-spacing:-0.03em; color:var(--encre); font-variant-numeric:tabular-nums; }
.vignette .note { margin-top:2px; font-size:11.5px; font-weight:600; color:var(--doux); }
.vignette .note.vert { color:var(--vert-600); }

/* — Étiquettes d'état — */
.etat { display:inline-flex; align-items:center; white-space:nowrap; font-size:11px; font-weight:800; padding:4px 9px; border-radius:8px; }
.etat.stock { background:var(--vert-100); color:var(--vert-800); }
.etat.incertain { background:#fdf3e3; color:var(--ambre); }
.etat.rupture { background:#fbe9ea; color:var(--alerte); }
.etat.neutre { background:var(--trait-doux); color:var(--corps); }

/* — Boutons — */
.btn {
  display:inline-flex; align-items:center; justify-content:center; gap:7px;
  min-height:42px; padding:0 16px; border-radius:999px;
  font-size:13.5px; font-weight:800; white-space:nowrap;
  transition:transform .12s ease;
}
.btn:active { transform:scale(.97); }
.btn.plein { background:var(--vert-600); color:#fff; }
.btn.clair { background:var(--vert-50); color:var(--vert-700); }
.btn.contour { border:1px solid var(--vert-200); color:var(--vert-700); }
.btn.danger { border:1px solid #f3d3d6; color:var(--alerte); }
.btn.bloc { width:100%; }

/* — Listes en cartes (téléphone) — */
.liste { display:flex; flex-direction:column; gap:10px; }
.ligne { background:var(--papier); border:1px solid var(--trait); border-radius:16px; padding:14px; }
.ligne.alerte { background:#fdf6f6; border-color:#f3d3d6; }
.ligne .haut { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; }
.ligne .nom { font-size:14.5px; font-weight:800; color:var(--encre); }
.ligne .det { margin-top:2px; font-size:12px; font-weight:500; color:var(--doux); }
.ligne .actions { margin-top:12px; display:flex; gap:8px; }
.ligne .actions .btn { flex:1; }

/* — Proposition d'un équivalent, repliée hors rupture — */
.equivalent, .equivalent-choisi { margin-top:12px; padding-top:12px; border-top:1px solid var(--trait-doux); }
.equivalent .intro { margin:0; font-size:12.5px; line-height:1.55; color:var(--corps); }
.equivalent .intro strong { color:var(--encre); }
.equivalent .vide { margin:0; font-size:12.5px; line-height:1.55; color:var(--doux); }
.equivalent .choix { margin-top:10px; display:flex; flex-wrap:wrap; gap:8px; }
.equivalent .choix .btn { min-height:44px; gap:10px; }
.equivalent .choix .prix { font-weight:700; color:var(--doux); }
.equivalent .rappel { margin:10px 0 0; font-size:11.5px; line-height:1.5; color:var(--doux); }

.equivalent-choisi {
  display:flex; align-items:center; gap:9px; flex-wrap:wrap;
  font-size:12.5px; color:var(--vert-800);
}
.equivalent-choisi strong { color:var(--encre); }
.equivalent-choisi svg { flex:none; color:var(--vert-600); }
.equivalent-choisi .btn { min-height:36px; padding:0 12px; font-size:12px; color:var(--alerte); margin-left:auto; }

/* Sur grand écran le panneau vit dans la première colonne du tableau : on le
   borne pour qu'il ne pousse pas les autres colonnes. */
@media (min-width: 900px) {
  .tableau .equivalent, .tableau .equivalent-choisi { max-width:460px; }
}

/* — Barres de recherche — */
.barre-mesure { height:7px; border-radius:999px; background:var(--trait-doux); overflow:hidden; }
.barre-mesure i { display:block; height:100%; border-radius:999px; background:var(--vert-400); }
.barre-mesure i.alerte { background:var(--alerte); }

/* — Inscription — */
.champ { display:flex; flex-direction:column; gap:6px; }
.champ label { font-size:12.5px; font-weight:700; color:#2a3d35; }
/* Ces champs étaient des <div> : ils avaient la bordure d'un formulaire sans
   en accepter la frappe. Ce sont des <input> et des <select>, habillés pareil. */
.champ .boite { position:relative; display:flex; align-items:center; }
.champ .saisie {
  min-height:46px; width:100%; box-sizing:border-box;
  border:1px solid var(--trait); border-radius:12px; padding:0 14px;
  font:inherit; font-size:14.5px; font-weight:600; color:var(--encre); background:var(--papier);
}
.champ .saisie:focus {
  outline:none; border-color:var(--vert-600); box-shadow:0 0 0 3px rgb(18 133 93 / .1);
}
.champ .boite .coche {
  position:absolute; right:13px; display:flex; color:var(--vert-600); pointer-events:none;
}
/* La coche ne se pose que sur du texte saisi : sur un menu déroulant elle
   viendrait chevaucher la flèche du système. */
.champ.valide input.saisie { border-color:var(--vert-600); padding-right:38px; }
.champ.invalide .saisie { border-color:var(--alerte); }
.champ .aide { font-size:11.5px; font-weight:500; color:var(--doux); }
.champ .msg { font-size:11.5px; font-weight:700; color:var(--alerte); }
.champ .msg:empty { display:none; }

.etapes { display:flex; align-items:center; gap:7px; flex-wrap:wrap; }
.etapes .e { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:var(--doux); }
.etapes .e.on { color:var(--encre); font-weight:700; }
.etapes .n { width:21px; height:21px; border-radius:999px; background:var(--trait-doux); color:var(--doux); display:grid; place-items:center; font-size:10.5px; font-weight:800; }
.etapes .e.on .n { background:var(--vert-600); color:#fff; }

/* — Horaires et garde —
   Le seul écran de la console qui commande directement ce que voit le patient :
   hors de ces heures, l'application cesse d'orienter vers l'officine. */
.horaires { margin-top:14px; display:flex; flex-wrap:wrap; gap:10px; }
/* Plafonné : sur un écran de comptoir, un champ d'heure étiré sur 460 px
   laissait « 08:00 » flotter au milieu du vide. */
.horaires .champ { flex:1 1 140px; max-width:190px; }
.horaires input[type=time] {
  min-height:46px; width:100%; box-sizing:border-box;
  border:1px solid var(--trait); border-radius:12px; padding:0 12px;
  font:inherit; font-size:15px; font-weight:700; color:var(--encre); background:var(--papier);
}
.horaires input[type=time]:disabled { color:var(--doux); background:var(--trait-doux); }

.bascule {
  margin-top:12px; display:flex; align-items:flex-start; gap:12px;
  border:1px solid var(--trait); border-radius:14px; padding:13px 15px; cursor:pointer;
}
.bascule + .bascule { margin-top:8px; }
.bascule input { flex:none; width:22px; height:22px; margin:1px 0 0; accent-color:var(--vert-600); }
.bascule .t { font-size:13.5px; font-weight:700; color:var(--encre); }
.bascule .d { margin-top:2px; font-size:11.5px; line-height:1.5; font-weight:500; color:var(--doux); }
.bascule:has(input:checked) { border-color:var(--vert-200); background:var(--vert-50); }

.apercu {
  margin-top:14px; padding-top:13px; border-top:1px solid var(--trait-doux);
  display:flex; align-items:center; gap:9px; flex-wrap:wrap;
}
.apercu .lab { font-size:11.5px; font-weight:600; color:var(--doux); }

/* — Organismes acceptés —
   Des cases à cocher, et non des lignes à supprimer : le pharmacien voit d'un
   coup ce qu'il accepte ET ce qu'il n'accepte pas, ce qu'une liste des seuls
   acceptés ne montre jamais. */
.aide-groupe { margin:6px 0 0; font-size:12px; line-height:1.5; color:var(--doux); }
.organismes { margin-top:12px; display:flex; flex-direction:column; gap:8px; }
.organisme {
  display:flex; align-items:flex-start; gap:12px;
  border:1px solid var(--trait); border-radius:12px; padding:11px 13px; cursor:pointer;
}
.organisme input { flex:none; width:20px; height:20px; margin:1px 0 0; accent-color:var(--vert-600); }
.organisme .t { display:block; font-size:13.5px; font-weight:700; color:var(--encre); }
.organisme .d { display:block; margin-top:2px; font-size:11.5px; line-height:1.45; color:var(--doux); }
.organisme:has(input:checked) { border-color:var(--vert-200); background:var(--vert-50); }

.ajout-bon { margin-top:12px; display:flex; gap:8px; flex-wrap:wrap; }
.ajout-bon .saisie { flex:1 1 190px; min-width:0; }
.ajout-bon .btn { flex:none; }

/* Les pastilles de l'aperçu patient. Vide, le bloc dit pourquoi il l'est :
   une officine sans bon déclaré n'est pas une officine sans information. */
.apercu-bons { margin-top:9px; display:flex; flex-wrap:wrap; gap:6px; }
.apercu-bons span {
  background:#fff; color:var(--vert-700); font-size:11px; font-weight:700;
  padding:4px 10px; border-radius:7px;
}
.apercu-bons .aucun { background:none; color:var(--doux); font-weight:500; padding:0; }

/* — Bandeaux — */
.bandeau { display:flex; gap:10px; align-items:flex-start; background:var(--vert-50); border:1px solid var(--vert-200); border-radius:16px; padding:13px 15px; }
.bandeau p { margin:0; font-size:12.5px; line-height:1.55; color:#2a3d35; }
.bandeau svg { flex:none; margin-top:2px; }

.sombre { background:var(--vert-950); border-radius:16px; padding:16px; color:var(--vert-200); }
.sombre h3 { margin:0 0 8px; font-size:14.5px; font-weight:800; color:#fff; }
.sombre p { margin:0; font-size:12.5px; line-height:1.55; }

.ecran { display:none; }
.ecran.actif { display:block; }

/* — Tableau : masqué sur téléphone, visible au-dessus de 900 px — */
.tableau { display:none; }

/* ————————————————————————————————————————————————
   Grand écran : la barre latérale revient, les listes
   redeviennent des tableaux.
   ———————————————————————————————————————————————— */
@media (min-width: 900px) {
  body { font-size:15px; }
  .appli { min-height:100vh; }
  .onglets { display:none; }
  .contenu { padding:22px 28px; padding-bottom:28px; gap:18px; max-width:1400px; }
  .entete { padding:18px 28px; }
  .entete h1 { font-size:22px; }

  .laterale {
    display:flex; flex-direction:column; width:246px; flex:none;
    background:var(--vert-950); padding:22px 14px; gap:22px;
    position:sticky; top:0; height:100vh;
  }
  .laterale .marque { display:flex; align-items:center; gap:10px; padding:0 8px; }
  .laterale .tuile { width:34px; height:34px; border-radius:10px; background:linear-gradient(140deg,var(--vert-500),var(--vert-700)); display:grid; place-items:center; flex:none; }
  .laterale .mot { font-size:15px; font-weight:800; letter-spacing:-0.02em; color:#fff; }
  .laterale .mot span { color:var(--vert-400); }
  .laterale .sous { font-size:10.5px; font-weight:600; color:var(--doux); }
  .laterale nav { display:flex; flex-direction:column; gap:2px; }
  .laterale .item {
    display:flex; align-items:center; gap:11px; width:100%;
    padding:11px 12px; border-radius:11px; text-align:left;
    font-size:13.5px; font-weight:600; color:var(--vert-200);
  }
  .laterale .item[aria-current='page'] { background:rgba(255,255,255,.09); color:#fff; font-weight:700; }
  .laterale .item .pastille { margin-left:auto; background:var(--vert-400); color:var(--vert-950); font-size:10.5px; font-weight:800; padding:2px 7px; border-radius:999px; }
  .laterale .officine { margin-top:auto; padding:13px 12px; border-radius:14px; background:rgba(255,255,255,.06); }
  .laterale .officine b { display:block; font-size:12.5px; font-weight:800; color:#fff; }
  .laterale .officine span { font-size:11px; font-weight:500; color:var(--vert-200); }

  .vignettes { grid-template-columns:repeat(4, 1fr); gap:14px; }
  .deux-colonnes { display:grid; grid-template-columns:1.35fr 1fr; gap:18px; align-items:start; }

  /* Le tableau remplace les cartes : plus dense, lisible à cette largeur. */
  .liste { display:none; }
  .tableau { display:block; background:var(--papier); border:1px solid var(--trait); border-radius:18px; overflow:hidden; }
  .tableau .tr { display:grid; align-items:center; gap:14px; padding:13px 20px; border-bottom:1px solid var(--trait-doux); }
  .tableau .tr:last-child { border-bottom:0; }
  .tableau .th { font-size:11px; font-weight:800; letter-spacing:0.06em; text-transform:uppercase; color:var(--doux); }
  .tableau .tr.alerte { background:#fdf6f6; }
  .tableau .nom { font-size:14px; font-weight:800; color:var(--encre); }
  .tableau .det { margin-top:2px; font-size:11.5px; font-weight:500; color:var(--doux); }
  .tableau .btn { min-height:36px; font-size:12.5px; }

  .grille-inscription { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
}

/* Très grand écran : on borne la largeur, un tableau de 1800 px ne se lit pas. */
@media (min-width: 1500px) {
  .contenu { margin:0 auto; width:100%; }
}
`
