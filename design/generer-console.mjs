/*
 * Assemble public/console-pharmasur.html : la console pharmacie en UN fichier,
 * que l'officine télécharge et ouvre dans son navigateur.
 *
 * Pourquoi un fichier plutôt qu'une adresse : une console en ligne suppose un
 * serveur, des comptes et une base de données, dont aucun n'existe. Un fichier
 * unique s'envoie par WhatsApp à un pharmacien, s'ouvre sans compte et
 * fonctionne sans réseau — c'est ce qu'on peut réellement livrer aujourd'hui.
 *
 * La console était auparavant un décalque des maquettes de bureau, figé à
 * 1440 px : sur le téléphone d'un pharmacien elle se lisait en la faisant
 * défiler latéralement, c'est-à-dire pas. Elle est désormais écrite pour les
 * deux formes — cartes empilées et barre d'onglets sous 900 px, barre latérale
 * et tableaux au-dessus — depuis une source unique (design/console/).
 *
 * Les maquettes de maquettes-console/ restent le document de design ; ce
 * fichier-ci est le produit livré. Modifier l'un sans l'autre les fait
 * diverger : le contenu de référence est design/console/donnees.mjs.
 *
 * Depuis design/ :  node generer-console.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { bons, demandes, inscription, laterale, onglets, stocks, tableau } from './console/ecrans.mjs'
import { STYLE } from './console/style.mjs'

const ICI = new URL('.', import.meta.url).pathname.slice(1)
const SORTIE = `${ICI}../public/console-pharmasur.html`
const POLICE = `${ICI}../public/fonts/plus-jakarta-sans.woff2`

const police = await readFile(POLICE)

const fichier = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#ffffff">
<title>PharmaSur — Console pharmacie (démonstration)</title>
<style>
@font-face {
  font-family:'Plus Jakarta Sans';
  src:url(data:font/woff2;base64,${police.toString('base64')}) format('woff2');
  font-weight:200 800;
  font-display:swap;
}
${STYLE}
</style>
</head>
<body>

<div class="appli">
  <p class="avis">
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/></svg>
    <span>Démonstration hors ligne. Officines, stocks, demandes et chiffres sont fictifs, rien n'est enregistré ni transmis. Ce fichier ne remplace pas un logiciel de gestion.</span>
  </p>

  <div class="corps">
    ${laterale()}
    <main class="principal">
      ${inscription()}
      ${tableau()}
      ${stocks()}
      ${bons()}
      ${demandes()}
    </main>
  </div>

  ${onglets()}
</div>

<script>
(function () {
  var ecrans = {};
  [].forEach.call(document.querySelectorAll('.ecran'), function (e) {
    ecrans[e.id.replace('ecran-', '')] = e;
  });

  function montrer(id) {
    if (!ecrans[id]) return;
    for (var cle in ecrans) ecrans[cle].classList.toggle('actif', cle === id);
    [].forEach.call(document.querySelectorAll('[data-va]'), function (b) {
      if (b.classList.contains('item') || b.classList.contains('onglet')) {
        if (b.getAttribute('data-va') === id) b.setAttribute('aria-current', 'page');
        else b.removeAttribute('aria-current');
      }
    });
    window.scrollTo(0, 0);
  }

  [].forEach.call(document.querySelectorAll('[data-va]'), function (b) {
    b.addEventListener('click', function () { montrer(b.getAttribute('data-va')); });
  });

  /* On ouvre sur l'inscription : le pharmacien voit d'abord comment entrer,
     puis ce qu'il trouve une fois entré. */
  montrer('inscription');
})();
</script>
</body>
</html>
`

await writeFile(SORTIE, fichier, 'utf8')
console.log(`console-pharmasur.html  5 écrans  ${Math.round(Buffer.byteLength(fichier) / 1024)} ko`)
