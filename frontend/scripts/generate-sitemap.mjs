import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const SITE_URL = 'https://www.reboulstore.com'
const NOW = new Date().toISOString()

const routes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/catalog', priority: '0.9', changefreq: 'daily' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/stores', priority: '0.6', changefreq: 'monthly' },
  { path: '/shipping-returns', priority: '0.5', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
]

const toUrl = (routePath) => `${SITE_URL}${routePath === '/' ? '' : routePath}`

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${toUrl(route.path)}</loc>
    <lastmod>${NOW}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const outputPath = path.resolve(process.cwd(), 'public', 'sitemap.xml')
await writeFile(outputPath, xml, 'utf8')
process.stdout.write(`Sitemap generated: ${outputPath}\n`)
