/** Builders for schema.org JSON-LD used with <Schema />. */

export interface SiteSettings {
  siteName: string;
  description: string;
  phone: string;
  email: string;
  region: string;
}

export function organizationSchema(settings: SiteSettings, siteUrl: URL, logoUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': new URL('/#organization', siteUrl).toString(),
    name: settings.siteName,
    url: siteUrl.toString(),
    logo: new URL(logoUrl, siteUrl).toString(),
    description: settings.description,
    telephone: settings.phone,
    email: settings.email,
    areaServed: { '@type': 'State', name: settings.region },
  };
}

export function websiteSchema(settings: SiteSettings, siteUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': new URL('/#website', siteUrl).toString(),
    name: settings.siteName,
    url: siteUrl.toString(),
    publisher: { '@id': new URL('/#organization', siteUrl).toString() },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[], siteUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.path, siteUrl).toString(),
    })),
  };
}
