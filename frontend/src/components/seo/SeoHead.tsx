import { Helmet } from 'react-helmet-async'
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  getCanonicalUrl,
  getDefaultHreflang,
  type HreflangEntry,
} from '../../seo/siteSeo'

type SeoHeadProps = {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  hreflang?: HreflangEntry[]
}

export const SeoHead = ({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  hreflang,
}: SeoHeadProps) => {
  const canonical = getCanonicalUrl(path)
  const links = hreflang ?? getDefaultHreflang(path)

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonical} />

      {links.map((entry) => (
        <link key={`${entry.hrefLang}:${entry.href}`} rel="alternate" hrefLang={entry.hrefLang} href={entry.href} />
      ))}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
