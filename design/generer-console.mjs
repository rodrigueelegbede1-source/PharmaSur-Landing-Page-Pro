/*
 * Assemble public/console-pharmasur.html : la console pharmacie en UN fichier,
 * que l'officine télécharge et ouvre dans son navigateur.
 *
 * Pourquoi un fichier plutôt qu'une adresse : une console en ligne suppose un
 * serveur, des comptes et une base de données, dont aucun n'existe. Un fichier
 * unique s'envoie par WhatsApp à un pharmacien, s'ouvre sans compte et
 * fonctionne sans réseau — c'est ce qu'on peut réellement livrer aujourd'hui.
 *
 * Le contenu vient des maquettes de maquettes-console/ : une seule source,
 * pour que la console livrée et le canevas de design ne divergent jamais. La
 * police est intégrée en base64, sinon le fichier serait dépendant de Google
 * Fonts et s'afficherait dans une autre typographie hors ligne.
 *
 * Depuis design/ :  node generer-console.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'

const ICI = new URL('.', import.meta.url).pathname.slice(1)
const SORTIE = `${ICI}../public/console-pharmasur.html`
const POLICE = `${ICI}../public/fonts/plus-jakarta-sans.woff2`

/* Ordre d'apparition. Inscription ouvre le fichier : on montre d'abord
   comment une officine entre, puis ce qu'elle y trouve. */
const ECRANS = [
  { id: 'inscription', fichier: 'Inscription.dc.html', menu: null },
  { id: 'tableau', fichier: 'Main.dc.html', menu: 'Tableau de bord' },
  { id: 'stocks', fichier: 'Stocks.dc.html', menu: 'Stocks' },
  { id: 'bons', fichier: 'Bons.dc.html', menu: "Bons d'assurance" },
  { id: 'demandes', fichier: 'Demandes.dc.html', menu: 'Demandes locales' },
]

/** Ne garde que le contenu de l'artboard : ni en-tête, ni helmet. */
function extraire(source) {
  const corps = source.slice(source.indexOf('<x-dc>') + 6, source.lastIndexOf('</x-dc>'))
  return corps.replace(/<helmet>[\s\S]*?<\/helmet>/, '').trim()
}

const police = await readFile(POLICE)
const parties = []
for (const e of ECRANS) {
  const source = await readFile(`${ICI}maquettes-console/${e.fichier}`, 'utf8')
  parties.push(`<section class="ecran" id="ecran-${e.id}" data-menu="${e.menu ?? ''}">
${extraire(source)}
</section>`)
}

const fichier = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PharmaSur — Console pharmacie (démonstration)</title>
<style>
@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url(data:font/woff2;base64,${police.toString('base64')}) format('woff2');
  font-weight: 200 800;
  font-display: swap;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  background: #eef5f1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}
.avis {
  width: 100%;
  background: #fdf7ea;
  border-bottom: 1px solid #f0dcb4;
  color: #8a5a12;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
  padding: 10px 20px;
  text-align: center;
}
.cadre { padding: 20px; width: 100%; display: flex; justify-content: center; }
.ecran { display: none; box-shadow: 0 30px 70px rgb(11 61 44 / 0.16); border-radius: 16px; overflow: hidden; }
.ecran.actif { display: block; }
/* Les maquettes sont dessinées à 1440 px : on les réduit plutôt que de les
   casser, pour que le fichier reste lisible sur un portable d'officine. */
@media (max-width: 1500px) {
  .cadre { justify-content: flex-start; overflow-x: auto; }
}
[data-cliquable] { cursor: pointer; }
[data-cliquable]:hover { filter: brightness(1.08); }
.pied {
  width: 100%;
  padding: 14px 20px 26px;
  text-align: center;
  font-size: 12px;
  line-height: 1.6;
  color: #4a5b54;
}
.pied a { color: #12855d; font-weight: 700; }
</style>
</head>
<body>

<p class="avis">
  Démonstration hors ligne de la console PharmaSur. Officines, stocks, demandes et chiffres sont
  fictifs, rien n'est enregistré ni transmis. Ce fichier ne remplace pas un logiciel de gestion.
</p>

<div class="cadre">
${parties.join('\n')}
</div>

<p class="pied">
  Fichier unique, à ouvrir dans un navigateur. Aucun compte, aucune installation, aucun réseau.<br>
  Une question&nbsp;? <a href="mailto:contact@pharmasur.ci">contact@pharmasur.ci</a>
</p>

<script>
/*
 * Navigation : chaque écran porte sa propre barre latérale, avec le bon
 * élément déjà actif. Basculer d'écran entier suffit donc à obtenir une
 * navigation juste, sans recalculer d'état.
 */
(function () {
  var ecrans = [].slice.call(document.querySelectorAll('.ecran'));
  var parMenu = {};
  ecrans.forEach(function (e) {
    var m = e.getAttribute('data-menu');
    if (m) parMenu[m] = e;
  });

  function montrer(ecran) {
    ecrans.forEach(function (e) { e.classList.toggle('actif', e === ecran); });
    window.scrollTo(0, 0);
  }

  ecrans.forEach(function (ecran) {
    /*
     * Les libellés de menu sont cherchés DANS LA BARRE LATÉRALE seulement.
     * Cherchés dans tout l'écran, ils attrapaient aussi la vignette
     * « Bons d'assurance » du tableau de bord, qui devenait un faux élément
     * de menu. La barre est le premier enfant de la racine de la maquette.
     */
    var racine = ecran.firstElementChild;
    var barre = racine && racine.firstElementChild;
    if (barre) {
      [].slice.call(barre.querySelectorAll('span')).forEach(function (span) {
        var cible = parMenu[span.textContent.trim()];
        if (!cible) return;
        var ligne = span.closest('div');
        if (!ligne) return;
        ligne.setAttribute('data-cliquable', '');
        ligne.addEventListener('click', function () { montrer(cible); });
      });
    }

    // « Continuer » de l'inscription mène au tableau de bord.
    [].slice.call(ecran.querySelectorAll('span')).forEach(function (span) {
      if (span.textContent.trim() !== 'Continuer') return;
      var bouton = span.parentElement;
      bouton.setAttribute('data-cliquable', '');
      bouton.addEventListener('click', function () { montrer(parMenu['Tableau de bord']); });
    });
  });

  montrer(ecrans[0]);
})();
</script>
</body>
</html>
`

await writeFile(SORTIE, fichier, 'utf8')
console.log(
  `console-pharmasur.html  ${ECRANS.length} écrans  ${Math.round(Buffer.byteLength(fichier) / 1024)} ko`,
)
