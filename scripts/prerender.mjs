import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

/*
 * Injecte le HTML rendu au build dans dist/index.html.
 *
 * Sans cette étape, le navigateur reçoit un <div id="root"> vide et n'affiche
 * rien tant que le JavaScript n'est pas chargé puis exécuté — plusieurs secondes
 * sur une connexion mobile. Les animations d'entrée du héros étant en CSS, le
 * texte injecté ici s'anime sans attendre quoi que ce soit.
 */
const root = resolve(import.meta.dirname, '..')
const page = resolve(root, 'dist/index.html')

// pathToFileURL : sous Windows, import() refuse un chemin « C:\… » brut.
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href)
const html = render()

const cible = '<div id="root"></div>'
const source = readFileSync(page, 'utf8')

if (!source.includes(cible)) {
  console.error(`prerender: "${cible}" introuvable dans dist/index.html`)
  process.exit(1)
}

writeFileSync(page, source.replace(cible, `<div id="root">${html}</div>`))
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })

const ko = (n) => `${Math.round(n / 1024)} ko`
console.log(`prérendu : ${ko(html.length)} de HTML injecté dans dist/index.html`)
