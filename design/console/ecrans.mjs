/*
 * Les cinq écrans de la console, en HTML.
 *
 * Chaque écran est écrit UNE fois et rendu deux fois par la feuille de style :
 * en cartes empilées sous 900 px, en tableau au-dessus. Les deux formes
 * partagent le même contenu — c'est la raison d'être de ce fichier, et la
 * raison pour laquelle on n'écrit pas deux consoles.
 */
import {
  A_CONFIRMER, ASSURANCES_ALENTOUR, COMMUNES, DEMANDES, EQUIVALENTS_CHERCHES, HORAIRES,
  MENU, OFFICINE, ORGANISMES, RECHERCHES, SEUIL_AFFICHAGE, STOCKS, VIGNETTES, ZONES,
} from './donnees.mjs'

const ICONES = {
  grille: '<rect x="3" y="3" width="7" height="8" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="11" width="7" height="10" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/>',
  boite: '<path d="M3 8h18M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/>',
  bouclier: '<path d="M12 3 4 6v6c0 4.4 3.4 8.2 8 9 4.6-.8 8-4.6 8-9V6l-8-3Z"/>',
  loupe: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
  repere: '<path d="M12 21s-7-4.8-7-10a7 7 0 1 1 14 0c0 5.2-7 10-7 10Z"/><path d="M12 8v6M9 11h6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  coche: '<path d="m4 12.5 5 5L20 6.5"/>',
  fleche: '<path d="M5 12h13M13 6l6 6-6 6"/>',
}

export const svg = (nom, taille = 18, trait = 2) =>
  `<svg width="${taille}" height="${taille}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${trait}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nom]}</svg>`

const ETATS = {
  stock: ['stock', 'En stock'],
  incertain: ['incertain', 'Incertain'],
  rupture: ['rupture', 'Rupture'],
  jamais: ['neutre', 'Jamais référencé'],
  'non-confirme': ['neutre', 'Non confirmé'],
}
const etat = (cle) => {
  const [classe, texte] = ETATS[cle]
  return `<span class="etat ${classe}">${texte}</span>`
}

export const laterale = () => `
<aside class="laterale">
  <div>
    <div class="marque">
      <span class="tuile" style="color:#fff">${svg('repere', 18)}</span>
      <span>
        <span class="mot">Pharma<span>Sur</span></span><br>
        <span class="sous">Console officine</span>
      </span>
    </div>
  </div>
  <nav>
    ${MENU.map(
      (m) => `<button class="item" data-va="${m.id}" type="button">
      ${svg(m.icone, 18)}<span>${m.label}</span>${m.badge ? `<span class="pastille">${m.badge}</span>` : ''}
    </button>`,
    ).join('')}
  </nav>
  <div class="officine">
    <b data-echo="nom">${OFFICINE.nom}</b>
    <span><span data-echo="pharmacien">${OFFICINE.pharmacien}</span> · <span data-echo="commune">${OFFICINE.commune}</span></span>
  </div>
</aside>`

export const onglets = () => `
<nav class="onglets">
  ${MENU.map(
    (m) => `<button class="onglet" data-va="${m.id}" type="button">
    ${svg(m.icone, 21)}<span>${m.label.split(' ')[0]}</span>${m.badge ? `<span class="pastille">${m.badge}</span>` : ''}
  </button>`,
  ).join('')}
</nav>`

/* — 1. Inscription —
 *
 * Les cinq champs étaient des textes figés dans une bordure : ils avaient
 * l'apparence d'un formulaire sans en être un. Un pharmacien qui ouvrait la
 * démonstration essayait d'y taper le nom de son officine, et rien ne se
 * passait — la première chose qu'il fait, et la première qui ne marchait pas.
 *
 * Ils sont maintenant saisissables, et ce qui est saisi se répercute là où la
 * console nomme l'officine (voir data-echo). Rien n'est enregistré pour autant :
 * le bandeau du haut le dit, et fermer l'onglet efface tout.
 */
const champ = (label, valeur, { cle, aide, options, motif, exemple } = {}) => `
<div class="champ" data-champ="${cle}">
  <label for="i-${cle}">${label}</label>
  <div class="boite">
    ${
      options
        ? `<select class="saisie" id="i-${cle}" data-saisie="${cle}">
      ${options.map((o) => `<option${o === valeur ? ' selected' : ''}>${o}</option>`).join('')}
    </select>`
        : `<input class="saisie" id="i-${cle}" data-saisie="${cle}" value="${valeur}" autocomplete="off"${
            motif ? ` data-motif="${motif}"` : ''
          }${exemple ? ` placeholder="${exemple}"` : ''}>`
    }
    <span class="coche" data-coche hidden>${svg('coche', 16, 2.6)}</span>
  </div>
  ${aide ? `<span class="aide">${aide}</span>` : ''}
  <span class="msg" data-msg></span>
</div>`

export const inscription = () => `
<section class="ecran" id="ecran-inscription">
  <header class="entete">
    <div><h1>Inscrire mon officine</h1><p>Cinq informations suffisent</p></div>
  </header>
  <div class="contenu">
    <div class="etapes">
      <span class="e on"><span class="n">1</span>Votre officine</span>
      <span class="e"><span class="n">2</span>Bons d'assurance</span>
      <span class="e"><span class="n">3</span>Vérification</span>
    </div>

    <p style="margin:0;font-size:13.5px;line-height:1.6;color:var(--corps)">
      Nous vérifions votre numéro d'agrément auprès de l'Ordre avant la mise en ligne de votre fiche.
    </p>

    <div class="carte" style="display:flex;flex-direction:column;gap:14px">
      ${champ("Nom de l'officine", OFFICINE.nom, {
        cle: 'nom',
        exemple: 'Pharmacie de la Riviera',
      })}
      <div class="grille-inscription" style="display:flex;flex-direction:column;gap:14px">
        ${champ('Commune', OFFICINE.commune, { cle: 'commune', options: COMMUNES })}
        ${champ('Téléphone', `+225 ${OFFICINE.telephone}`, {
          cle: 'telephone',
          motif: 'telephone',
          exemple: '+225 07 00 00 00 00',
        })}
      </div>
      ${champ('Pharmacien titulaire', OFFICINE.pharmacien, {
        cle: 'pharmacien',
        exemple: 'Dr Kouassi Aya',
      })}
      ${champ("Numéro d'agrément", OFFICINE.agrement, {
        cle: 'agrement',
        motif: 'agrement',
        exemple: 'CI-PH-2019-0847',
        aide: "Format attendu : CI-PH-AAAA-0000. Votre fiche reste hors ligne tant que ce numéro n'est pas vérifié.",
      })}
    </div>

    <div class="sombre">
      <h3>Abonnement · Offre Pharmacie Pro</h3>
      <p>Sans engagement de durée. Le montant vous est communiqué à la validation de votre agrément, et rien n'est facturé avant.</p>
    </div>

    <button class="btn plein bloc" type="button" data-continuer>Continuer ${svg('fleche', 16, 2.4)}</button>
    <p style="margin:0;text-align:center;font-size:12px;color:var(--doux)">Aucun paiement à cette étape.</p>
  </div>
</section>`

/*
 * Horaires et garde.
 *
 * C'est le seul réglage de la console dont l'application patient dépend
 * directement : hors des heures déclarées, PharmaSur cesse d'orienter vers
 * l'officine et l'affiche fermée, avec son heure d'ouverture. Envoyer quelqu'un
 * devant un rideau baissé, la nuit, en taxi, coûte plus qu'une recherche ratée.
 *
 * La garde n'allonge pas les horaires, elle les court-circuite : une officine
 * de garde redevient visible en dehors de ses heures, et seulement là — le
 * jour, la mention n'apprendrait rien.
 *
 * L'aperçu montre la phrase exacte que verra le patient. Un réglage dont on ne
 * voit pas l'effet se règle de travers.
 */
const horaires = () => `
<div class="carte" data-horaires>
  <div class="titre-bloc">Horaires et garde</div>
  <p style="margin:8px 0 0;font-size:12.5px;line-height:1.55;color:var(--corps)">
    PharmaSur n'oriente les patients vers vous que pendant ces heures.
  </p>

  <div class="horaires">
    <div class="champ">
      <label for="h-ouvre">Ouverture</label>
      <input type="time" id="h-ouvre" data-ouvre value="${HORAIRES.ouvre}">
    </div>
    <div class="champ">
      <label for="h-ferme">Fermeture</label>
      <input type="time" id="h-ferme" data-ferme value="${HORAIRES.ferme}">
    </div>
  </div>

  <label class="bascule">
    <input type="checkbox" data-continu${HORAIRES.continu ? ' checked' : ''}>
    <span>
      <span class="t">Ouverte 24 h/24</span>
      <span class="d">Les horaires ci-dessus ne s'appliquent plus.</span>
    </span>
  </label>

  <label class="bascule">
    <input type="checkbox" data-garde${HORAIRES.deGarde ? ' checked' : ''}>
    <span>
      <span class="t">De garde cette nuit</span>
      <span class="d">Vous restez visible en dehors de vos heures, tant que la garde dure. À retirer le lendemain matin&nbsp;: une garde oubliée envoie des patients devant une porte fermée.</span>
    </span>
  </label>

  <div class="apercu">
    <span class="lab">Ce que voit le patient&nbsp;:</span>
    <span data-apercu></span>
  </div>
</div>`

/* — 2. Tableau de bord — */
export const tableau = () => `
<section class="ecran" id="ecran-tableau">
  <header class="entete">
    <div><h1>Tableau de bord</h1><p><span data-echo="nom">${OFFICINE.nom}</span> · <span data-echo="commune">${OFFICINE.commune}</span></p></div>
  </header>
  <div class="contenu">
    ${horaires()}

    <div class="vignettes">
      ${VIGNETTES.map(
        (v) => `<div class="vignette">
        <div class="lab">${v.label}</div>
        <div class="val">${v.valeur}</div>
        <div class="note${v.ton ? ` ${v.ton}` : ''}"${v.label === "Bons d'assurance" ? ' data-vignette-bons' : ''}>${v.note}</div>
      </div>`,
      ).join('')}
    </div>

    <div class="deux-colonnes">
      <div class="carte">
        <div class="titre-bloc">Ce qu'on cherche près de vous</div>
        <div style="margin-top:14px;display:flex;flex-direction:column;gap:13px">
          ${RECHERCHES.map(
            (r) => `<div>
            <div style="display:flex;justify-content:space-between;gap:10px;margin-bottom:6px">
              <span style="font-size:13.5px;font-weight:700;color:var(--encre)">${r.nom}</span>
              <span style="font-size:13.5px;font-weight:800;color:${r.alerte ? 'var(--alerte)' : 'var(--encre)'};font-variant-numeric:tabular-nums">${r.nb}</span>
            </div>
            <div class="barre-mesure"><i class="${r.alerte ? 'alerte' : ''}" style="width:${r.part}%"></i></div>
          </div>`,
          ).join('')}
        </div>
      </div>

      <div class="carte">
        <div class="titre-bloc">À confirmer aujourd'hui</div>
        <div style="margin-top:14px;display:flex;flex-direction:column;gap:10px">
          ${A_CONFIRMER.map(
            (a) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
            <div style="min-width:0">
              <div style="font-size:13.5px;font-weight:700;color:var(--encre)">${a.nom}</div>
              <div style="font-size:11.5px;font-weight:500;color:var(--doux)">${a.detail}</div>
            </div>
            <div style="display:flex;gap:7px">
              <span class="btn clair" style="min-height:34px;font-size:12px;padding:0 12px">En stock</span>
              <span class="btn danger" style="min-height:34px;font-size:12px;padding:0 12px">Rupture</span>
            </div>
          </div>`,
          ).join('')}
        </div>
      </div>
    </div>
  </div>
</section>`

/*
 * Panneau de proposition d'un générique, replié tant que le produit n'est pas
 * en rupture.
 *
 * Il existe pour les officines qui ne connectent pas leur logiciel de gestion :
 * elles ne peuvent pas publier leur stock, mais elles peuvent dire « je n'ai
 * pas celui-ci, j'ai celui-là ». L'équivalent vient alors du pharmacien, pas
 * d'un algorithme — ce qui règle au passage la règle que le produit s'impose
 * depuis le début : seul un pharmacien peut valider une équivalence.
 *
 * Il n'apparaît que sur une rupture. Le proposer sur un produit en stock
 * reviendrait à pousser à la substitution sans raison.
 */
const panneauEquivalent = (s) => `
<div class="equivalent" data-panneau hidden>
  ${
    s.equivalents.length === 0
      ? `<p class="vide">Aucun équivalent au même principe actif (${s.principeActif}) dans votre catalogue. Les patients verront ce produit comme introuvable chez vous.</p>`
      : `<p class="intro">Vous avez déclaré une rupture. Proposez-vous un équivalent au même principe actif&nbsp;? <strong>${s.principeActif}</strong></p>
    <div class="choix">
      ${s.equivalents
        .map(
          (e) => `<button class="btn contour" type="button" data-equivalent="${e.nom}">
        <span>${e.nom}</span><span class="prix">${e.prix}</span>
      </button>`,
        )
        .join('')}
      <button class="btn" type="button" data-equivalent="" style="color:var(--doux)">Aucun</button>
    </div>
    <p class="rappel">Le patient verra «&nbsp;proposé par l'officine, à valider au comptoir&nbsp;». Votre nom engage la proposition : c'est un acte professionnel, pas une suggestion automatique.</p>`
  }
</div>
<div class="equivalent-choisi" data-choisi hidden>
  ${svg('coche', 15, 2.6)}
  <span>Vous proposez <strong data-nom-choisi></strong> à la place</span>
  <button class="btn" type="button" data-annuler>Retirer</button>
</div>`

/* — 3. Stocks — */
export const stocks = () => `
<section class="ecran" id="ecran-stocks">
  <header class="entete">
    <div><h1>Stocks</h1><p>340 produits référencés</p></div>
  </header>
  <div class="contenu">
    <div class="bandeau">
      <span style="color:var(--vert-800)">${svg('info', 18)}</span>
      <p><strong>Vous n'avez pas de logiciel de gestion connecté.</strong> Confirmez la disponibilité en un clic. Les produits non confirmés depuis 48 h sont signalés aux patients comme incertains, jamais comme disponibles. <strong>Quand vous déclarez une rupture, vous pouvez proposer vous-même un équivalent au même principe actif</strong> — le patient le verra comme venant de votre officine.</p>
    </div>

    <div class="liste">
      ${STOCKS.map(
        (s) => `<div class="ligne${s.note ? ' alerte' : ''}" data-produit="${s.id}" data-etat="${s.etat}">
        <div class="haut">
          <div style="min-width:0">
            <div class="nom">${s.nom}</div>
            <div class="det">${s.forme} · ${s.prix}</div>
            <div class="det">Confirmé ${s.confirme}${s.note ? ` · <strong style="color:var(--alerte)">${s.note}</strong>` : ''}</div>
          </div>
          <span data-etat-puce>${etat(s.etat)}</span>
        </div>
        <div class="actions">
          <button class="btn clair" type="button" data-marquer="stock">En stock</button>
          <button class="btn danger" type="button" data-marquer="rupture">Rupture</button>
        </div>
        ${panneauEquivalent(s)}
      </div>`,
      ).join('')}
    </div>

    <div class="tableau">
      <div class="tr th" style="grid-template-columns:2.4fr 1fr 1.1fr 1.5fr">
        <span>Produit</span><span>Prix</span><span>Confirmé</span><span>Disponibilité</span>
      </div>
      ${STOCKS.map(
        (s) => `<div class="tr${s.note ? ' alerte' : ''}" data-produit="${s.id}" data-etat="${s.etat}" style="grid-template-columns:2.4fr 1fr 1.1fr 1.5fr">
        <div>
          <div class="nom">${s.nom}</div>
          <div class="det">${s.forme}${s.note ? ` · <strong style="color:var(--alerte)">${s.note}</strong>` : ''}</div>
          ${panneauEquivalent(s)}
        </div>
        <span style="font-size:13.5px;font-weight:700;color:var(--encre)">${s.prix}</span>
        <span style="font-size:12.5px;color:var(--doux)">${s.confirme}</span>
        <div style="display:flex;gap:7px;align-items:center;flex-wrap:wrap">
          <span data-etat-puce>${etat(s.etat)}</span>
          <button class="btn clair" type="button" data-marquer="stock">En stock</button>
          <button class="btn danger" type="button" data-marquer="rupture">Rupture</button>
        </div>
      </div>`,
      ).join('')}
    </div>
  </div>
</section>`

/* — 4. Bons d'assurance —
 *
 * L'écran listait trois catégories figées — CMU, Mutuelles, Assurances privées
 * — sous un bouton « Ajouter » qui ne faisait rien. Or un patient assuré chez
 * NSIA ne cherche pas « assurances privées » : il cherche NSIA. Et le
 * pharmacien n'avait aucun moyen de déclarer ce qu'il accepte vraiment.
 *
 * Il coche donc maintenant les organismes, et nomme lui-même ceux que la liste
 * ignore. Ce champ libre n'est pas un pis-aller : la liste amorcée dans
 * donnees.mjs est courte à dessein — on n'y met que des noms sûrs — et ce que
 * les officines y ajouteront est la seule source fiable pour la compléter.
 */
export const bons = () => `
<section class="ecran" id="ecran-bons">
  <header class="entete">
    <div><h1>Bons d'assurance</h1><p>Ce que vous acceptez en caisse</p></div>
  </header>
  <div class="contenu">
    <!--
      RAPPEL HEBDOMADAIRE OBLIGATOIRE.

      Il remplace une « confirmation trimestrielle » qui était trop lente pour
      ce que la donnée subit : une convention peut être suspendue du jour au
      lendemain, et un patient qui se présente avec une carte refusée l'apprend
      au comptoir, après le trajet.

      « Obligatoire » a un sens précis ici, et un seul : passé le délai, la
      fiche cesse d'AFFIRMER aux patients que ces organismes sont acceptés.
      Elle ne disparaît pas — supprimer une officine des résultats parce que
      son pharmacien n'a pas cliqué punirait le patient pour une négligence qui
      n'est pas la sienne. Elle passe en « à reconfirmer », comme un stock
      dépasse 48 heures.
    -->
    <div class="rappel-bons" data-rappel-bons>
      <div class="rappel-tete">
        <span class="rappel-pastille">À confirmer</span>
        <span class="rappel-delai" data-rappel-delai>Dernière confirmation il y a 9 jours</span>
      </div>
      <p class="rappel-texte">
        Confirmez chaque semaine que cette liste est toujours exacte. Sans confirmation, votre fiche cesse d'affirmer aux patients que ces organismes sont acceptés&nbsp;: elle affiche «&nbsp;à reconfirmer&nbsp;», et votre officine reste visible.
      </p>
      <div class="rappel-actions">
        <button class="btn plein" type="button" data-confirmer-bons>La liste est exacte</button>
        <span class="rappel-msg" data-rappel-msg></span>
      </div>
    </div>

    <p style="margin:0;font-size:13px;line-height:1.55;color:var(--corps)">
      Ce que vous cochez ici s'affiche aux patients sur votre fiche. Décochez dès que vous cessez d'accepter un organisme&nbsp;: une liste périmée renvoie le patient au problème que le service résout.
    </p>

    ${ORGANISMES.map(
      (g) => `<div class="carte">
      <div class="titre-bloc">${g.categorie}</div>
      <p class="aide-groupe">${g.aide}</p>
      <div class="organismes">
        ${g.entrees
          .map(
            (e) => `<label class="organisme">
          <input type="checkbox" data-bon="${e.nom}"${e.coche ? ' checked' : ''}>
          <span>
            <span class="t">${e.nom}</span>
            <span class="d">${e.detail}</span>
          </span>
        </label>`,
          )
          .join('')}
      </div>
    </div>`,
    ).join('')}

    <div class="carte">
      <div class="titre-bloc">Un organisme absent de la liste</div>
      <p class="aide-groupe">Elle est volontairement courte&nbsp;: nous n'y mettons que des noms dont nous sommes sûrs. Ajoutez le vôtre tel qu'il figure sur la carte du patient.</p>
      <div class="ajout-bon">
        <input class="saisie" type="text" data-nouveau-bon placeholder="Nom de l'organisme" autocomplete="off">
        <button class="btn plein" type="button" data-ajouter-bon>Ajouter</button>
      </div>
      <p class="msg" data-msg-bon></p>
    </div>

    <div class="carte">
      <div class="titre-bloc">Ce que voit le patient</div>
      <div style="margin-top:12px;border:1px solid var(--vert-200);background:var(--vert-50);border-radius:14px;padding:14px">
        <div style="font-size:13.5px;font-weight:800;color:var(--encre)" data-echo="nom">${OFFICINE.nom}</div>
        <div class="apercu-bons" data-apercu-bons></div>
        <!--
          Ce pied d'aperçu affirmait « vérifié il y a 2 jours », en dur. Aucune
          vérification n'existait, et ce délai rassurait le patient sur la foi
          de rien. Il reflète maintenant l'état réel de la confirmation
          hebdomadaire, et bascule avec elle.
        -->
        <div style="margin-top:9px;font-size:11px;font-weight:500;color:var(--doux)" data-apercu-fraicheur>Déclarés par l'officine · à reconfirmer</div>
      </div>
    </div>

    <div class="carte">
      <div class="titre-bloc">Pourquoi chaque semaine</div>
      <p style="margin:10px 0 0;font-size:12.5px;line-height:1.55;color:var(--corps)">
        Une convention avec un organisme peut être suspendue du jour au lendemain. Le patient, lui, ne l'apprend qu'au comptoir — après le trajet, et souvent après avoir choisi votre officine pour cette raison précise.
      </p>
      <p style="margin:10px 0 0;font-size:12.5px;line-height:1.55;color:var(--corps)">
        Un rappel trimestriel laissait passer trois mois d'erreur possible. Une semaine est le rythme auquel cette information se dégrade réellement.
      </p>
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--trait-doux);display:flex;justify-content:space-between">
        <span style="font-size:12.5px;font-weight:600;color:var(--doux)">Prochain rappel</span>
        <span style="font-size:12.5px;font-weight:800;color:var(--encre)" data-prochain-rappel>chaque lundi</span>
      </div>
    </div>
  </div>
</section>`

/* — 5. Demandes locales — */
export const demandes = () => `
<section class="ecran" id="ecran-demandes">
  <header class="entete">
    <div><h1>Demandes locales</h1><p>Rayon de 3 km · 7 derniers jours</p></div>
  </header>
  <div class="contenu">
    <div class="bandeau">
      <span style="color:var(--vert-800)">${svg('info', 18)}</span>
      <p>Ces chiffres sont des <strong>comptages agrégés</strong> de recherches faites près de vous. Aucun patient n'est identifié, aucune ordonnance ne vous est transmise. Un produit n'apparaît qu'à partir de ${SEUIL_AFFICHAGE} recherches — filtre par assurance compris.</p>
    </div>

    <!--
      Le filtre par assurance. Il répond à une question que le pharmacien ne
      peut poser nulle part ailleurs : « ce que cherchent, près de moi, les
      porteurs d'une convention que je n'ai pas signée ».

      Le croisement produit × assurance réduit les effectifs, et un comptage de
      deux personnes dans un quartier n'est plus un agrégat. Les lignes qui
      passent sous le seuil sont donc masquées, et leur nombre annoncé : les
      cacher en silence laisserait croire que la demande n'existe pas.
    -->
    <!--
      RECHERCHES D'ÉQUIVALENTS MOINS CHERS.

      Ce que déclenche, côté patient, l'option « chercher moins cher au même
      principe actif » : elle s'ouvre quand le coût d'une ordonnance dépasse ce
      que la personne a en poche.

      Présenté comme un signal de STOCK et non comme un signal social. Le
      pharmacien apprend qu'il y a une demande de générique dans son quartier,
      pas que Untel est en difficulté — voir le commentaire de donnees.mjs.
    -->
    <div class="carte">
      <div class="titre-bloc">Équivalents moins chers recherchés</div>
      <p class="aide-groupe">Des patients autour de vous ont cherché un générique au même principe actif, faute de pouvoir régler l'ordonnance entière. Tenir ces références en rayon évite qu'ils repartent sans traitement.</p>
      <div class="liste-equivalents">
        ${EQUIVALENTS_CHERCHES.filter((e) => e.nb >= SEUIL_AFFICHAGE && e.generique)
          .map(
            (e) => `<div class="equivalent">
          <div class="eq-noms">
            <span class="eq-princeps">${e.princeps}</span>
            <span class="eq-fleche">${svg('fleche', 13)}</span>
            <span class="eq-generique">${e.generique}</span>
          </div>
          <div class="eq-chiffres">
            <span class="eq-nb">${e.nb}</span>
            <span class="eq-ecart">−${e.ecart.toLocaleString('fr-FR')} F</span>
          </div>
        </div>`,
          )
          .join('')}
      </div>
      ${(() => {
        const sous = EQUIVALENTS_CHERCHES.filter((e) => e.nb < SEUIL_AFFICHAGE || !e.generique).length
        return sous > 0
          ? `<p class="masquees" style="margin-top:10px">${
              sous > 1
                ? `${sous} autres références sont sous le seuil de ${SEUIL_AFFICHAGE} recherches, ou sans équivalent connu : elles ne sont pas affichées.`
                : `1 autre référence est sous le seuil de ${SEUIL_AFFICHAGE} recherches, ou sans équivalent connu : elle n'est pas affichée.`
            }</p>`
          : ''
      })()}
    </div>

    <div class="carte">
      <div class="titre-bloc">Assurance des patients</div>
      <p class="aide-groupe">Ce que cherchent les porteurs d'un organisme donné. Les conventions que vous n'acceptez pas sont signalées.</p>
      <div class="filtres-assurance" data-filtres>
        <button class="filtre" type="button" data-assurance="" aria-pressed="true">Toutes</button>
        ${ASSURANCES_ALENTOUR.map(
          (a) => `<button class="filtre" type="button" data-assurance="${a.nom}" aria-pressed="false">
          ${a.nom}<span class="nb">${a.nb}</span>
        </button>`,
        ).join('')}
      </div>
      <p class="convention" data-convention hidden></p>
    </div>

    <div class="liste" data-liste-demandes>
      ${DEMANDES.map(
        (d) => `<div class="ligne${d.alerte ? ' alerte' : ''}" data-demande data-par-assurance="${encodeURIComponent(JSON.stringify(d.parAssurance))}">
        <div class="haut">
          <div style="min-width:0">
            <div class="nom">${d.nom}</div>
            <div class="det">${d.detail}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:19px;font-weight:800;color:${d.alerte ? 'var(--alerte)' : 'var(--encre)'};font-variant-numeric:tabular-nums" data-nb>${d.nb}</div>
            <div style="font-size:10.5px;font-weight:600;color:var(--doux)" data-nb-libelle>recherches</div>
          </div>
        </div>
        <div style="margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          ${etat(d.etat)}
          ${d.action ? `<button class="btn ${d.alerte ? 'plein' : 'contour'}" type="button" style="min-height:36px;font-size:12.5px">${d.action}</button>` : '<span style="font-size:12.5px;color:var(--doux)">Rien à faire</span>'}
        </div>
      </div>`,
      ).join('')}
      <p class="masquees" data-masquees hidden></p>
    </div>

    <div class="tableau">
      <div class="tr th" style="grid-template-columns:2.3fr .9fr 1fr 1.3fr">
        <span>Produit recherché</span><span>Recherches</span><span>Chez vous</span><span>Action</span>
      </div>
      ${DEMANDES.map(
        (d) => `<div class="tr${d.alerte ? ' alerte' : ''}" style="grid-template-columns:2.3fr .9fr 1fr 1.3fr">
        <div><div class="nom">${d.nom}</div><div class="det">${d.detail}</div></div>
        <span style="font-size:17px;font-weight:800;color:${d.alerte ? 'var(--alerte)' : 'var(--encre)'};font-variant-numeric:tabular-nums">${d.nb}</span>
        <span>${etat(d.etat)}</span>
        ${d.action ? `<button class="btn ${d.alerte ? 'plein' : 'contour'}" type="button">${d.action}</button>` : '<span style="font-size:12.5px;color:var(--doux)">Rien à faire</span>'}
      </div>`,
      ).join('')}
    </div>

    <div class="carte">
      <div class="titre-bloc">Ce que vous avez manqué</div>
      <div style="margin-top:12px;display:flex;align-items:baseline;gap:8px">
        <span style="font-size:32px;font-weight:800;letter-spacing:-0.03em;color:var(--encre);font-variant-numeric:tabular-nums">218</span>
        <span style="font-size:12.5px;font-weight:600;color:var(--doux)">recherches sans réponse</span>
      </div>
      <p style="margin:10px 0 0;font-size:12.5px;line-height:1.55;color:var(--corps)">
        Des patients à moins de 3 km ont cherché un produit que votre officine n'a pas confirmé. Ils ont été orientés ailleurs.
      </p>
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--trait-doux);display:flex;flex-direction:column;gap:8px">
        ${ZONES.map(
          (z) => `<div style="display:flex;justify-content:space-between">
          <span style="font-size:12.5px;font-weight:600;color:var(--corps)">${z.nom}</span>
          <span style="font-size:12.5px;font-weight:800;color:var(--encre)">${z.nb}</span>
        </div>`,
        ).join('')}
      </div>
    </div>
  </div>
</section>`
