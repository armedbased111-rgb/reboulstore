import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')
const templatePath = path.join(distDir, 'index.html')

const ROUTES = [
  {
    route: '/catalog',
    title: 'Catalogue | Reboul Store',
    description: 'Parcourez le catalogue Reboul Store: vetements premium, marques iconiques et nouveautes selectionnees.',
  },
  {
    route: '/about',
    title: 'A propos | Reboul Store',
    description: "L'histoire, la vision et l'ADN premium streetwear de Reboul Store.",
  },
  {
    route: '/contact',
    title: 'Contact | Reboul Store',
    description: "Contactez l'equipe Reboul Store pour toute question commande, produit ou service.",
  },
  {
    route: '/stores',
    title: 'Boutiques | Reboul Store',
    description: 'Retrouvez Reboul Store a Marseille, Cassis et Sanary-sur-Mer.',
  },
  {
    route: '/shipping-returns',
    title: 'Livraison et retours | Reboul Store',
    description: 'Consultez les conditions de livraison, de retour et de remboursement Reboul Store.',
  },
  {
    route: '/terms',
    title: 'Conditions generales de vente | Reboul Store',
    description: 'Consultez les CGV de Reboul Store pour les achats en ligne.',
  },
  {
    route: '/privacy',
    title: 'Confidentialite et mentions legales | Reboul Store',
    description: 'Mentions legales, RGPD et politique de confidentialite Reboul Store.',
  },
]

const SITE_URL = 'https://www.reboulstore.com'

const upsertMeta = (html, key, value, isProperty = false) => {
  const attr = isProperty ? 'property' : 'name'
  const regex = new RegExp(`<meta\\s+${attr}=["']${key}["'][^>]*>`, 'i')
  const tag = `<meta ${attr}="${key}" content="${value}" />`
  return regex.test(html) ? html.replace(regex, tag) : html.replace('</head>', `  ${tag}\n</head>`)
}

const upsertCanonical = (html, href) => {
  const regex = /<link\s+rel=["']canonical["'][^>]*>/i
  const tag = `<link rel="canonical" href="${href}" />`
  return regex.test(html) ? html.replace(regex, tag) : html.replace('</head>', `  ${tag}\n</head>`)
}

const withSeo = (template, route, title, description) => {
  const canonical = `${SITE_URL}${route === '/' ? '' : route}`
  let html = template.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
  html = upsertMeta(html, 'description', description)
  html = upsertMeta(html, 'og:title', title, true)
  html = upsertMeta(html, 'og:description', description, true)
  html = upsertMeta(html, 'og:url', canonical, true)
  html = upsertMeta(html, 'og:image', `${SITE_URL}/og-image.png`, true)
  // Keep canonical out of SPA fallback (dist/index.html) to avoid conflicts
  // on runtime routes like /product/:id where canonical is set by React Helmet.
  html = upsertCanonical(html, canonical)
  return html
}

const run = async () => {
  const template = await readFile(templatePath, 'utf8')

  await Promise.all(
    ROUTES.map(async ({ route, title, description }) => {
      const html = withSeo(template, route, title, description)
      const routePath = route === '/' ? distDir : path.join(distDir, route.replace(/^\//, ''))
      await mkdir(routePath, { recursive: true })
      await writeFile(path.join(routePath, 'index.html'), html, 'utf8')
    }),
  )

  process.stdout.write(`Prerender complete: ${ROUTES.length} routes.\n`)
}

run().catch((error) => {
  process.stderr.write(`Prerender failed: ${String(error)}\n`)
  process.exit(1)
})
