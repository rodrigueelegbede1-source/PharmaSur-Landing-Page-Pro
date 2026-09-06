/*
 * Vérifie une fiche de collecte remplie avant tout import.
 *
 *   node collecte/verifier.mjs collecte/officines.csv
 *
 * Pourquoi un script plutôt qu'une relecture : les erreurs qui coûtent le plus
 * cher sont invisibles à l'œil. Une latitude recopiée d'une officine sur la
 * suivante place deux pharmacies au même endroit ; un numéro d'agrément mal
 * formé bloque la vérification auprès de l'Ordre des mois plus tard ; une heure
 * de fermeture égale à l'heure d'ouverture rend l'officine invisible toute la
 * journée sans que personne comprenne pourquoi. Aucune de ces trois erreurs ne
 * se voit dans un tableur.
 *
 * Les colonnes ne sont pas choisies : elles correspondent une à une aux champs
 * du modèle (src/app/donnees.ts, type Officine) et de l'écran d'inscription de
 * la console (design/console/ecrans.mjs). C'est ce qui fait de la saisie un
 * import et non une ressaisie. Si le modèle change, ce fichier doit changer
 * avec lui.
 */
import { readFileSync } from 'node:fs'

const SEPARATEUR = ';'

/* Les trois seuls bons que la console propose aujourd'hui. Un intitulé libre
   rendrait le filtre patient inutilisable : « CMU », « C.M.U. » et « cmu »
   deviendraient trois bons différents. */
const BONS = ['CMU', 'Mutuelles', 'Assurances privées']

/* Bornes de la Côte d'Ivoire, arrondies vers l'extérieur. Elles n'attrapent pas
   une erreur de 200 m — elles attrapent la latitude et la longitude inversées,
   le point tombé au large du golfe de Guinée, et la virgule décimale oubliée. */
const BORNES = { lat: [4.2, 10.8], lon: [-8.7, -2.4] }

const COLONNES = [
  ['nom', { requis: true }],
  ['commune', { requis: true }],
  ['quartier', { requis: true }],
  ['adresse', { requis: true }],
  ['latitude', { requis: true, decimal: BORNES.lat }],
  ['longitude', { requis: true, decimal: BORNES.lon }],
  ['pharmacien', { requis: true }],
  [
    'agrement',
    {
      requis: true,
      motif: /^CI-PH-\d{4}-\d{4}$/,
      attendu: 'CI-PH-AAAA-0000, comme sur l\'écran d\'inscription de la console',
    },
  ],
  [
    'telephone',
    {
      requis: true,
      motif: /^\+225 \d{2} \d{2} \d{2} \d{2} \d{2}$/,
      attendu: '+225 07 00 00 00 00 — indicatif, puis cinq groupes de deux chiffres',
    },
  ],
  ['ouvre', { heure: true }],
  ['ferme', { heure: true }],
  ['ouvert_24h', { requis: true, parmi: ['oui', 'non'] }],
  ['horaires_remarques', {}],
  ['garde_participe', { requis: true, parmi: ['oui', 'non', 'inconnu'] }],
  ['garde_groupe', {}],
  ['bons', { liste: BONS }],
  ['logiciel_stock', { requis: true }],
  ['titulaire_informe', { requis: true, parmi: ['oui', 'non'] }],
  ['accord', { requis: true, parmi: ['oui', 'non', 'a revoir'] }],
  ['date_visite', { requis: true, motif: /^\d{4}-\d{2}-\d{2}$/, attendu: 'AAAA-MM-JJ' }],
  ['collecte_par', { requis: true }],
  ['remarques', {}],
]

/* Analyseur CSV minimal, mais qui gère les guillemets : une adresse contient
   presque toujours une virgule, et parfois un point-virgule. */
function lignes(texte) {
  const out = []
  let champ = ''
  let ligne = []
  let dansGuillemets = false

  for (let i = 0; i < texte.length; i++) {
    const c = texte[i]
    if (dansGuillemets) {
      if (c === '"') {
        if (texte[i + 1] === '"') {
          champ += '"'
          i++
        } else dansGuillemets = false
      } else champ += c
    } else if (c === '"') dansGuillemets = true
    else if (c === SEPARATEUR) {
      ligne.push(champ)
      champ = ''
    } else if (c === '\n') {
      ligne.push(champ.replace(/\r$/, ''))
      out.push(ligne)
      ligne = []
      champ = ''
    } else champ += c
  }
  if (champ !== '' || ligne.length) {
    ligne.push(champ)
    out.push(ligne)
  }
  return out.filter((l) => l.some((c) => c.trim() !== ''))
}

const minutes = (hhmm) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm)
  if (!m) return null
  const h = +m[1]
  const mn = +m[2]
  return h < 24 && mn < 60 ? h * 60 + mn : null
}

const chemin = process.argv[2] ?? 'collecte/officines.csv'
/* Excel écrit un UTF-8 avec marque d'ordre d'octets. Sans ce retrait, la
   première colonne s'appelle « ﻿nom » et l'en-tête est rejeté — pour une
   marque invisible que personne ne peut voir dans un tableur. */
const rangs = lignes(readFileSync(chemin, 'utf8').replace(/^﻿/, ''))

if (!rangs.length) {
  console.error(`${chemin} est vide.`)
  process.exit(1)
}

const entete = rangs[0].map((c) => c.trim())
const attendues = COLONNES.map(([nom]) => nom)
if (entete.join(SEPARATEUR) !== attendues.join(SEPARATEUR)) {
  console.error(
    "L'en-tête ne correspond pas au format attendu.\n" +
      `  attendu : ${attendues.join(SEPARATEUR)}\n` +
      `  trouvé  : ${entete.join(SEPARATEUR)}\n\n` +
      "N'ajoutez pas de colonne : elle ne serait pas importée. Une information " +
      'qui ne rentre dans aucune colonne va dans « remarques ».',
  )
  process.exit(1)
}

const erreurs = []
const vus = { agrement: new Map(), point: new Map(), telephone: new Map() }
let retenues = 0

rangs.slice(1).forEach((rang, i) => {
  const n = i + 2 // numéro de ligne dans le tableur, en-tête comprise
  const val = (nom) => (rang[attendues.indexOf(nom)] ?? '').trim()
  const dire = (msg) => erreurs.push(`ligne ${n} · ${msg}`)

  if (val('nom').toUpperCase().startsWith('EXEMPLE')) {
    dire("la ligne d'exemple est encore là. Supprimez-la avant l'import.")
    return
  }
  retenues++

  const vingtQuatre = val('ouvert_24h') === 'oui'

  for (const [nom, regle] of COLONNES) {
    const v = val(nom)

    if (!v) {
      /* Une officine ouverte en continu n'a pas d'heures à déclarer : les
         exiger obligerait à inventer « 00:00 » et « 24:00 ». */
      if (regle.heure && vingtQuatre) continue
      if (regle.heure || regle.requis) dire(`« ${nom} » est vide.`)
      continue
    }

    if (regle.parmi && !regle.parmi.includes(v)) {
      dire(`« ${nom} » vaut « ${v} » ; attendu : ${regle.parmi.join(', ')}.`)
    }
    if (regle.motif && !regle.motif.test(v)) {
      dire(`« ${nom} » vaut « ${v} » ; format attendu : ${regle.attendu}.`)
    }
    if (regle.heure && minutes(v) === null) {
      dire(`« ${nom} » vaut « ${v} » ; format attendu : HH:MM, en 24 h.`)
    }
    if (regle.decimal) {
      const x = Number(v.replace(',', '.'))
      if (!Number.isFinite(x)) dire(`« ${nom} » vaut « ${v} » ; ce n'est pas un nombre.`)
      else if (x < regle.decimal[0] || x > regle.decimal[1]) {
        dire(
          `« ${nom} » vaut ${x} : hors de la Côte d'Ivoire (${regle.decimal.join(' à ')}). ` +
            'Latitude et longitude sont-elles inversées ?',
        )
      } else if (!v.includes('.') && !v.includes(',')) {
        dire(`« ${nom} » vaut ${v} sans décimale : le point tombe à des kilomètres.`)
      }
    }
    if (regle.liste) {
      for (const item of v.split('|').map((s) => s.trim()).filter(Boolean)) {
        if (!regle.liste.includes(item)) {
          dire(`bon « ${item} » inconnu ; valeurs admises : ${regle.liste.join(', ')} (séparées par |).`)
        }
      }
    }
  }

  if (!vingtQuatre) {
    const o = minutes(val('ouvre'))
    const f = minutes(val('ferme'))
    if (o !== null && f !== null && o === f) {
      dire("« ouvre » et « ferme » sont identiques : l'officine n'apparaîtrait jamais.")
    }
  }

  /*
   * La seule règle de ce fichier qui ne porte pas sur un format.
   *
   * Le nom d'un pharmacien et son téléphone sont des données personnelles. Si
   * le titulaire n'a pas été informé de ce qu'on en fait, la ligne ne doit pas
   * entrer dans la base — quel que soit son accord commercial par ailleurs.
   * Retourner le lui dire coûte une visite ; l'importer sans le lui avoir dit
   * n'a pas de réparation.
   */
  if (val('titulaire_informe') === 'non') {
    dire(
      "le titulaire n'a pas été informé de l'usage de ses données : cette ligne " +
        "ne peut pas être importée. Retournez le lui dire, ou supprimez la ligne.",
    )
  }

  /* Doublons : deux fiches pour la même officine, ou un champ recopié d'une
     ligne sur la suivante — l'erreur de saisie la plus fréquente sur le
     terrain, et la plus silencieuse. */
  const point = `${val('latitude')},${val('longitude')}`
  for (const [cle, valeur] of [
    ['agrement', val('agrement')],
    ['point', point],
    ['telephone', val('telephone')],
  ]) {
    if (!valeur || valeur === ',') continue
    const deja = vus[cle].get(valeur)
    if (deja) dire(`« ${cle} » ${valeur} est déjà celui de la ligne ${deja}.`)
    else vus[cle].set(valeur, n)
  }
})

if (erreurs.length) {
  console.error(erreurs.join('\n'))
  console.error(`\n${erreurs.length} problème(s) sur ${chemin}. Rien ne doit être importé en l'état.`)
  process.exit(1)
}

console.log(`${chemin} : ${retenues} officine(s), aucun problème détecté.`)
