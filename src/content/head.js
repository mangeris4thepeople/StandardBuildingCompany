// Builds the per-page <head> block: title, description, canonical, social tags, and JSON-LD.
import { SITE, GROUPS, OTHER_AREAS } from './site.js';
import { ALL_SERVICES, AREAS, findService, absoluteUrl } from './pages.js';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const BUSINESS_ID = `${SITE.url}/#business`;

function business() {
  return {
    '@type': ['GeneralContractor', 'LocalBusiness'],
    '@id': BUSINESS_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: `${SITE.url}/`,
    image: SITE.url + SITE.ogImage,
    telephone: SITE.phoneE164,
    email: SITE.email,
    foundingDate: SITE.founded,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.streetAddress,
      addressLocality: SITE.locality,
      addressRegion: SITE.region,
      postalCode: SITE.postalCode,
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', ...SITE.geo },
    areaServed: [
      ...AREAS.map((a) => ({ '@type': 'City', name: `${a.name}, CO` })),
      ...OTHER_AREAS.map((name) => ({ '@type': 'City', name: `${name}, CO` })),
      { '@type': 'AdministrativeArea', name: 'Larimer County, CO' },
      { '@type': 'AdministrativeArea', name: 'Weld County, CO' },
    ],
  };
}

function breadcrumbs(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: absoluteUrl(t.path),
    })),
  };
}

export function trailFor(page) {
  const homeCrumb = { name: 'Home', path: '/' };
  if (page.type === 'hub') return [homeCrumb, { name: GROUPS[page.group].label, path: page.path }];
  if (page.type === 'service') {
    const s = findService(page.group, page.slug);
    return [homeCrumb, { name: GROUPS[page.group].label, path: GROUPS[page.group].path }, { name: s.short, path: page.path }];
  }
  if (page.type === 'areas') return [homeCrumb, { name: 'Service Areas', path: page.path }];
  if (page.type === 'area') {
    const a = AREAS.find((c) => c.slug === page.slug);
    return [homeCrumb, { name: 'Service Areas', path: '/service-areas/' }, { name: a.name, path: page.path }];
  }
  if (page.type === 'contact') return [homeCrumb, { name: 'Contact', path: page.path }];
  return [];
}

function graphFor(page) {
  const graph = [business()];

  if (page.type === 'home') {
    graph.push({
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: SITE.name,
      publisher: { '@id': BUSINESS_ID },
    });
    graph[0].hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Construction Services',
      itemListElement: ALL_SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, url: absoluteUrl(s.path) },
      })),
    };
  }

  const trail = trailFor(page);
  if (trail.length) graph.push(breadcrumbs(trail));

  if (page.type === 'service') {
    const s = findService(page.group, page.slug);
    graph.push({
      '@type': 'Service',
      '@id': `${absoluteUrl(page.path)}#service`,
      name: s.name,
      serviceType: s.name,
      description: s.description,
      url: absoluteUrl(page.path),
      provider: { '@id': BUSINESS_ID },
      areaServed: AREAS.map((a) => ({ '@type': 'City', name: `${a.name}, CO` })),
    });
    graph.push({
      '@type': 'FAQPage',
      mainEntity: s.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  if (page.type === 'area') {
    const a = AREAS.find((c) => c.slug === page.slug);
    graph.push({
      '@type': 'Service',
      '@id': `${absoluteUrl(page.path)}#service`,
      name: `General contracting in ${a.name}, CO`,
      serviceType: 'General Contractor',
      url: absoluteUrl(page.path),
      provider: { '@id': BUSINESS_ID },
      areaServed: { '@type': 'City', name: `${a.name}, CO` },
    });
  }

  if (page.type === 'contact') {
    graph.push({ '@type': 'ContactPage', url: absoluteUrl(page.path), about: { '@id': BUSINESS_ID } });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

export function buildHead(page) {
  const url = absoluteUrl(page.path);
  const image = SITE.url + SITE.ogImage;
  const robots = page.noindex
    ? 'noindex, follow'
    : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

  const tags = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
  ];

  if (!page.noindex) {
    tags.push(
      `<link rel="canonical" href="${esc(url)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
      `<meta property="og:url" content="${esc(url)}" />`,
      `<meta property="og:title" content="${esc(page.title)}" />`,
      `<meta property="og:description" content="${esc(page.description)}" />`,
      `<meta property="og:image" content="${esc(image)}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${esc(page.title)}" />`,
      `<meta name="twitter:description" content="${esc(page.description)}" />`,
      `<meta name="twitter:image" content="${esc(image)}" />`,
      `<script type="application/ld+json">${JSON.stringify(graphFor(page)).replace(/</g, '\\u003c')}</script>`
    );
  }

  return tags.join('\n    ');
}
