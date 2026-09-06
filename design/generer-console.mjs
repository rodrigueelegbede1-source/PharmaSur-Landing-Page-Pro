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
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { bons, demandes, inscription, laterale, onglets, stocks, tableau } from './console/ecrans.mjs'
import { SEUIL_AFFICHAGE } from './console/donnees.mjs'
import { STYLE } from './console/style.mjs'

/* fileURLToPath et join, plutôt qu'un découpage de l'URL : sur Linux, retirer
   le premier caractère du chemin lui ôte sa barre oblique initiale et le rend
   relatif. Ce raccourci fonctionnait sur Windows et a fait échouer un
   déploiement Vercel. */
const RACINE = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const FICHIER = join(RACINE, 'public/console-pharmasur.html')
const INSTALLABLE = join(RACINE, 'public/console/index.html')
const POLICE = join(RACINE, 'public/fonts/plus-jakarta-sans.woff2')

const police = await readFile(POLICE)

/*
 * DEUX SORTIES, une seule source.
 *
 * /console/ est la console INSTALLABLE : servie en HTTPS, elle déclare un
 * manifeste et un service worker, et le pharmacien l'ajoute à son écran
 * d'accueil comme n'importe quelle application — c'est ce que « Installer la
 * console » doit donner. Auparavant le bouton ne proposait que le fichier, et
 * l'officine se retrouvait avec un « file:///C:/Users/… » dans sa barre
 * d'adresse : ni icône, ni raccourci, ni mise à jour.
 *
 * console-pharmasur.html reste le fichier UNIQUE, à télécharger et à envoyer
 * par WhatsApp. Il ne déclare NI manifeste NI service worker : depuis file://
 * l'un et l'autre sont refusés par le navigateur, et le fichier doit pouvoir
 * s'ouvrir sans réseau ni serveur. C'est la seule différence entre les deux.
 */
const page = (tete) => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>PharmaSur — Console pharmacie (démonstration)</title>
${tete}
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

  /*
   * Déclaration de disponibilité, et proposition d'un équivalent en rupture.
   *
   * Les deux vues du même produit — carte sur téléphone, ligne de tableau sur
   * grand écran — portent le même data-produit et sont mises à jour ensemble :
   * une officine qui bascule la Ventoline sur son portable puis rouvre le
   * fichier sur l'ordinateur du comptoir doit voir la même chose.
   *
   * Rien n'est enregistré : c'est une démonstration hors ligne, et le bandeau
   * du haut le dit.
   */
  var ETATS = {
    stock: ['stock', 'En stock'],
    incertain: ['incertain', 'Incertain'],
    rupture: ['rupture', 'Rupture'],
  };

  function vues(produit) {
    return [].slice.call(document.querySelectorAll('[data-produit="' + produit + '"]'));
  }

  function rendre(produit) {
    vues(produit).forEach(function (v) {
      var etat = v.getAttribute('data-etat');
      var choisi = v.getAttribute('data-equivalent-choisi');
      var puce = v.querySelector('[data-etat-puce]');
      if (puce) {
        var e = ETATS[etat] || ETATS.stock;
        puce.innerHTML = '<span class="etat ' + e[0] + '">' + e[1] + '</span>';
      }
      var panneau = v.querySelector('[data-panneau]');
      var resume = v.querySelector('[data-choisi]');
      if (panneau) panneau.hidden = !(etat === 'rupture' && !choisi);
      if (resume) {
        resume.hidden = !choisi;
        var nom = resume.querySelector('[data-nom-choisi]');
        if (nom && choisi) nom.textContent = choisi;
      }
    });
  }

  function poser(produit, attribut, valeur) {
    vues(produit).forEach(function (v) {
      if (valeur === null) v.removeAttribute(attribut);
      else v.setAttribute(attribut, valeur);
    });
    rendre(produit);
  }

  document.addEventListener('click', function (ev) {
    var cible = ev.target.closest ? ev.target.closest('[data-marquer],[data-equivalent],[data-annuler]') : null;
    if (!cible) return;
    var vue = cible.closest('[data-produit]');
    if (!vue) return;
    var produit = vue.getAttribute('data-produit');

    if (cible.hasAttribute('data-marquer')) {
      poser(produit, 'data-etat', cible.getAttribute('data-marquer'));
      /* Repasser en stock retire la proposition : elle n'avait de sens que
         pendant la rupture. */
      if (cible.getAttribute('data-marquer') !== 'rupture') {
        poser(produit, 'data-equivalent-choisi', null);
      }
    } else if (cible.hasAttribute('data-equivalent')) {
      var nom = cible.getAttribute('data-equivalent');
      poser(produit, 'data-equivalent-choisi', nom || null);
    } else if (cible.hasAttribute('data-annuler')) {
      poser(produit, 'data-equivalent-choisi', null);
    }
  });

  [].slice.call(document.querySelectorAll('[data-produit]')).forEach(function (v) {
    rendre(v.getAttribute('data-produit'));
  });

  /*
   * Inscription : cinq champs qu'on peut réellement remplir.
   *
   * Ils étaient figés. Le premier geste d'un pharmacien devant cette
   * démonstration est de taper le nom de son officine ; c'était aussi le
   * premier geste sans effet.
   *
   * Ce qui est saisi se répercute partout où la console nomme l'officine — la
   * barre latérale, l'en-tête du tableau de bord, l'aperçu de la fiche patient
   * sur l'écran des bons. Voir sa propre enseigne à ces trois endroits est ce
   * qui distingue une démonstration d'une capture d'écran. Rien n'est
   * enregistré pour autant : fermer l'onglet efface tout, et le bandeau du
   * haut le dit.
   */
  var champs = {};
  [].forEach.call(document.querySelectorAll('[data-saisie]'), function (e) {
    champs[e.getAttribute('data-saisie')] = e;
  });

  if (champs.agrement) {
    /* Le format d'agrément est celui que la fiche de collecte et le
       vérificateur emploient : CI-PH-AAAA-0000. Les trois doivent rester
       d'accord, sinon le terrain relève un numéro que la console refuse. */
    var MOTIFS = {
      agrement: /^CI-PH-\\d{4}-\\d{4}$/,
      telephone: /^\\+225( \\d{2}){5}$/
    };
    var MESSAGES = {
      nom: "Le nom de l'officine est obligatoire.",
      commune: 'Choisissez votre commune.',
      telephone: 'Format attendu : +225 07 00 00 00 00.',
      pharmacien: 'Le nom du pharmacien titulaire est obligatoire.',
      agrement: "Format attendu : CI-PH-AAAA-0000, tel qu'il figure sur votre autorisation."
    };

    function verifier(cle, montrerErreur) {
      var e = champs[cle];
      var bloc = e.parentNode.parentNode;
      var v = (e.value || '').trim();
      var ok = v !== '' && (!MOTIFS[cle] || MOTIFS[cle].test(v));

      bloc.className = 'champ' + (ok ? ' valide' : (montrerErreur ? ' invalide' : ''));
      var coche = bloc.querySelector('[data-coche]');
      if (coche) coche.hidden = !ok;
      var msg = bloc.querySelector('[data-msg]');
      if (msg) msg.textContent = (!ok && montrerErreur) ? MESSAGES[cle] : '';
      return ok;
    }

    function refleter() {
      [].forEach.call(document.querySelectorAll('[data-echo]'), function (n) {
        var e = champs[n.getAttribute('data-echo')];
        var v = e && (e.value || '').trim();
        if (v) n.textContent = v;
      });
    }

    Object.keys(champs).forEach(function (cle) {
      ['input', 'change'].forEach(function (ev) {
        champs[cle].addEventListener(ev, function () { verifier(cle, false); refleter(); });
      });
      /* L'erreur n'apparaît qu'en quittant le champ : la signaler à la
         troisième lettre du numéro d'agrément serait exact et insupportable. */
      champs[cle].addEventListener('blur', function () { verifier(cle, true); });
      verifier(cle, false);
    });

    var continuer = document.querySelector('[data-continuer]');
    if (continuer) {
      continuer.addEventListener('click', function () {
        var complet = Object.keys(champs).map(function (c) {
          return verifier(c, true);
        }).every(Boolean);

        if (!complet) {
          var premier = document.querySelector('.champ.invalide .saisie');
          if (premier) {
            premier.focus();
            if (premier.scrollIntoView) premier.scrollIntoView({ block: 'center' });
          }
          return;
        }
        refleter();
        montrer('tableau');
      });
    }
  }

  /*
   * Bons d'assurance : ce que l'officine accepte, et ce que le patient verra.
   *
   * L'aperçu se met à jour à chaque case cochée. C'est la même raison que pour
   * les horaires : un réglage dont on ne voit pas l'effet se règle de travers,
   * et ici l'effet est une pastille sur la fiche d'un patient qui décidera de
   * se déplacer ou non.
   *
   * Le champ libre existe parce que notre liste est courte à dessein — nous
   * n'y mettons que des organismes dont le nom est sûr. Ce qu'un pharmacien
   * ajoute vaut mieux qu'un nom que nous aurions deviné.
   */
  var apercuBons = document.querySelector('[data-apercu-bons]');
  if (apercuBons) {
    var champNouveau = document.querySelector('[data-nouveau-bon]');
    var boutonAjout = document.querySelector('[data-ajouter-bon]');
    var msgBon = document.querySelector('[data-msg-bon]');

    function rendreBons() {
      var choisis = [].slice
        .call(document.querySelectorAll('[data-bon]'))
        .filter(function (c) { return c.checked; })
        .map(function (c) { return c.getAttribute('data-bon'); });

      apercuBons.textContent = '';
      if (!choisis.length) {
        var vide = document.createElement('span');
        vide.className = 'aucun';
        vide.textContent = 'Aucun bon déclaré — les patients assurés vous chercheront ailleurs.';
        apercuBons.appendChild(vide);
        return;
      }
      choisis.forEach(function (nom) {
        var s = document.createElement('span');
        s.textContent = nom;
        apercuBons.appendChild(s);
      });
    }

    document.addEventListener('change', function (ev) {
      if (ev.target && ev.target.hasAttribute && ev.target.hasAttribute('data-bon')) rendreBons();
    });

    function ajouterBon() {
      var nom = (champNouveau.value || '').trim();
      if (!nom) {
        msgBon.textContent = "Écrivez le nom de l'organisme avant d'ajouter.";
        champNouveau.focus();
        return;
      }
      /* Comparaison insensible à la casse : « nsia » et « NSIA » sont le même
         organisme, et deux pastilles pour un seul assureur brouillent la
         fiche du patient. */
      var existe = [].slice.call(document.querySelectorAll('[data-bon]')).filter(function (c) {
        return c.getAttribute('data-bon').toLowerCase() === nom.toLowerCase();
      })[0];
      if (existe) {
        existe.checked = true;
        msgBon.textContent = nom + ' était déjà dans la liste : il est maintenant coché.';
        champNouveau.value = '';
        rendreBons();
        return;
      }

      var groupe = document.querySelectorAll('.organismes')[2] || document.querySelector('.organismes');
      var label = document.createElement('label');
      label.className = 'organisme';
      var boite = document.createElement('input');
      boite.type = 'checkbox';
      boite.checked = true;
      boite.setAttribute('data-bon', nom);
      var texte = document.createElement('span');
      var t = document.createElement('span');
      t.className = 't';
      t.textContent = nom;
      var d = document.createElement('span');
      d.className = 'd';
      d.textContent = 'Ajouté par votre officine';
      texte.appendChild(t);
      texte.appendChild(d);
      label.appendChild(boite);
      label.appendChild(texte);
      groupe.appendChild(label);

      champNouveau.value = '';
      msgBon.textContent = '';
      rendreBons();
    }

    boutonAjout.addEventListener('click', ajouterBon);
    champNouveau.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); ajouterBon(); }
    });
    rendreBons();
  }

  /*
   * Demandes locales, filtrées par assurance.
   *
   * Le pharmacien peut enfin poser la question qu'aucun autre écran ne permet :
   * « que cherchent, près de moi, les porteurs d'une convention que je n'ai pas
   * signée ». C'est une décision commerciale, pas une curiosité.
   *
   * DEUX RÈGLES QUI NE SE NÉGOCIENT PAS :
   *
   *   1. Le seuil. Croiser produit et assurance réduit les effectifs — deux
   *      recherches d'insuline par des porteurs SUNU dans un quartier
   *      désignent une poignée de personnes. Sous le seuil, la ligne
   *      disparaît. C'est la même règle que pour les produits, appliquée au
   *      croisement.
   *
   *   2. Dire ce qu'on masque. Retirer des lignes en silence ferait croire à
   *      l'officine que la demande n'existe pas, alors qu'elle existe et
   *      qu'on la protège. Le compte des lignes masquées est donc affiché.
   *
   * L'état « acceptez-vous cette convention » est lu sur les cases de l'écran
   * des bons, pas recopié : les deux écrans doivent dire la même chose.
   */
  var filtres = document.querySelector('[data-filtres]');
  if (filtres) {
    var SEUIL = ${SEUIL_AFFICHAGE};
    var convention = document.querySelector('[data-convention]');
    var masquees = document.querySelector('[data-masquees]');
    var demandes = [].slice.call(document.querySelectorAll('[data-demande]'));

    function ventilation(ligne) {
      try {
        return JSON.parse(decodeURIComponent(ligne.getAttribute('data-par-assurance')));
      } catch (e) {
        return {};
      }
    }

    function accepte(nom) {
      var c = document.querySelector('[data-bon="' + nom.replace(/"/g, '') + '"]');
      return !!(c && c.checked);
    }

    function filtrer(nom) {
      [].forEach.call(filtres.querySelectorAll('.filtre'), function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-assurance') === nom));
      });

      var cachees = 0;
      var total = 0;

      demandes.forEach(function (ligne) {
        var nb = ligne.querySelector('[data-nb]');
        var libelle = ligne.querySelector('[data-nb-libelle]');

        if (!nom) {
          ligne.hidden = false;
          nb.textContent = nb.getAttribute('data-total') || nb.textContent;
          libelle.textContent = 'recherches';
          return;
        }
        if (!nb.getAttribute('data-total')) nb.setAttribute('data-total', nb.textContent);

        var compte = ventilation(ligne)[nom] || 0;
        if (compte < SEUIL) {
          ligne.hidden = true;
          if (compte > 0) cachees++;
          return;
        }
        ligne.hidden = false;
        total += compte;
        nb.textContent = compte;
        libelle.textContent = 'recherches ' + nom;
      });

      if (!nom) {
        convention.hidden = true;
        masquees.hidden = true;
        return;
      }

      masquees.hidden = cachees === 0;
      if (cachees) {
        masquees.textContent =
          cachees + (cachees > 1 ? ' produits masqués : moins de ' : ' produit masqué : moins de ') +
          SEUIL + ' recherches. Le comptage existe, il désignerait trop peu de personnes pour être publié.';
      }

      convention.hidden = false;
      if (accepte(nom)) {
        convention.className = 'convention acceptee';
        convention.innerHTML =
          'Vous acceptez <strong>' + nom + '</strong>. Ces ' + total +
          ' recherches peuvent vous revenir.';
      } else {
        convention.className = 'convention';
        convention.innerHTML =
          "Vous n'acceptez pas <strong>" + nom + '</strong>. Ces ' + total +
          " recherches se font près de vous et vont ailleurs. Cochez-la sur l'écran des bons si vous signez la convention.";
      }
    }

    filtres.addEventListener('click', function (ev) {
      var b = ev.target.closest ? ev.target.closest('.filtre') : null;
      if (b) filtrer(b.getAttribute('data-assurance'));
    });

    /* Cocher un bon pendant qu'un filtre est actif doit changer le verdict. */
    document.addEventListener('change', function (ev) {
      if (!ev.target || !ev.target.hasAttribute || !ev.target.hasAttribute('data-bon')) return;
      var actif = filtres.querySelector('.filtre[aria-pressed="true"]');
      if (actif) filtrer(actif.getAttribute('data-assurance'));
    });

    filtrer('');
  }

  /*
   * Horaires et garde.
   *
   * La phrase de l'aperçu est calculée par la MÊME règle que l'application
   * patient (src/app/donnees.ts, fonction ouverture) : ouverte pendant les
   * heures, de garde en dehors si la garde est déclarée, fermée sinon. Si les
   * deux se mettent à diverger, le pharmacien règle une chose et le patient en
   * voit une autre — c'est le seul endroit du produit où cette duplication
   * existe, et elle est volontairement écrite juste à côté de son jumeau.
   */
  var bloc = document.querySelector('[data-horaires]');
  if (bloc) {
    var champOuvre = bloc.querySelector('[data-ouvre]');
    var champFerme = bloc.querySelector('[data-ferme]');
    var caseContinu = bloc.querySelector('[data-continu]');
    var caseGarde = bloc.querySelector('[data-garde]');
    var apercu = bloc.querySelector('[data-apercu]');

    /* Découpage plutôt qu'expression régulière : ce script vit dans un gabarit
       JavaScript, où « \\d » perd sa barre oblique à la génération. La première
       version l'avait perdue et lisait toute heure comme invalide — sans la
       moindre erreur en console. */
    function minutes(champ) {
      var parts = (champ.value || '').split(':');
      if (parts.length !== 2) return null;
      var h = parseInt(parts[0], 10), mn = parseInt(parts[1], 10);
      if (!(h >= 0 && h < 24 && mn >= 0 && mn < 60)) return null;
      return h * 60 + mn;
    }

    function hhmm(min) {
      var h = Math.floor(min / 60) % 24, m = min % 60;
      return m === 0 ? h + ' h' : h + ' h ' + (m < 10 ? '0' + m : m);
    }

    function rendreHoraires() {
      var continu = caseContinu.checked;
      champOuvre.disabled = continu;
      champFerme.disabled = continu;

      var ouvre = minutes(champOuvre), ferme = minutes(champFerme);
      var classe = 'stock', texte;

      if (continu) {
        texte = 'Ouverte 24 h/24';
      } else if (ouvre === null || ferme === null) {
        /* Une heure vide ne vaut pas « ouverte » : sans horaires déclarés,
           l'application ne peut rien promettre au patient. */
        classe = 'neutre';
        texte = 'Horaires incomplets — vous n\\'apparaissez pas';
      } else {
        var d = new Date();
        var m = d.getHours() * 60 + d.getMinutes();
        var dedans = ouvre < ferme ? (m >= ouvre && m < ferme) : (m >= ouvre || m < ferme);
        if (dedans) texte = 'Ouverte jusqu\\'à ' + hhmm(ferme);
        else if (caseGarde.checked) texte = 'De garde cette nuit';
        else { classe = 'rupture'; texte = 'Fermée jusqu\\'à ' + hhmm(ouvre); }
      }

      apercu.innerHTML = '<span class="etat ' + classe + '"></span>';
      apercu.firstChild.textContent = texte;
    }

    [champOuvre, champFerme, caseContinu, caseGarde].forEach(function (c) {
      c.addEventListener('change', rendreHoraires);
      c.addEventListener('input', rendreHoraires);
    });
    rendreHoraires();
  }
})();
</script>
</body>
</html>
`

const ko = (s) => `${Math.round(Buffer.byteLength(s) / 1024)} ko`

/* Le fichier unique : rien d'externe, rien à installer, il s'ouvre depuis le
   disque. Sa balise theme-color reste blanche — il n'a pas de barre système
   à teinter puisqu'il s'affiche dans un onglet ordinaire. */
const fichier = page('<meta name="theme-color" content="#ffffff">')
await writeFile(FICHIER, fichier, 'utf8')

/* La console installable : manifeste, couleur de barre système, et le service
   worker qui la rend consultable sans réseau.

   La garde est « isSecureContext », et non une comparaison de protocole : c'est
   le critère du navigateur lui-même. Un test sur « https: » écartait
   http://localhost, que le navigateur tient pourtant pour sûr — la console
   construite n'enregistrait donc aucun service worker en préversion locale, et
   il n'y avait aucun moyen de vérifier l'installation avant de déployer.
   Depuis file://, isSecureContext est faux : le fichier unique reste épargné. */
const installable = page(
  `<meta name="theme-color" content="#0b3d2c">
<link rel="manifest" href="/console/manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="/console/icone-192.png">
<link rel="apple-touch-icon" href="/console/icone-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="PharmaSur Pro">
<meta name="robots" content="noindex">
<script>
if ('serviceWorker' in navigator && isSecureContext) {
  addEventListener('load', function () {
    navigator.serviceWorker.register('/console/sw.js', { scope: '/console/' }).catch(function () {});
  });
}
</script>`,
)
await mkdir(join(RACINE, 'public/console'), { recursive: true })
await writeFile(INSTALLABLE, installable, 'utf8')

console.log(`console-pharmasur.html  5 écrans  ${ko(fichier)}  (fichier unique, hors ligne)`)
console.log(`console/index.html      5 écrans  ${ko(installable)}  (installable, manifeste + service worker)`)
