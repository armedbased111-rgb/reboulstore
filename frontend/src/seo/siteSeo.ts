export const SITE_URL = 'https://www.reboulstore.com'
export const SITE_NAME = 'Reboul Store'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

export type HreflangEntry = {
  hrefLang: string
  href: string
}

export const getCanonicalUrl = (path: string): string => {
  if (!path) return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export const getDefaultHreflang = (path: string): HreflangEntry[] => {
  const canonical = getCanonicalUrl(path)
  return [
    { hrefLang: 'fr-FR', href: canonical },
    { hrefLang: 'en', href: canonical },
    { hrefLang: 'x-default', href: canonical },
  ]
}
