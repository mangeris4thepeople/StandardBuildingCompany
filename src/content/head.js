// Builds the per-page <head> block: title, description, canonical, social tags, and JSON-LD.
import { SITE, GROUPS, OTHER_AREAS, SOCIAL } from './site.js';
import { ALL_SERVICES, AREAS, findService, absoluteUrl } from './pages.js';
import { POSTS, AUTHOR } from './posts.js';
import { STATIC_PAGES } from './static-pages.js';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const BUSINESS_ID = `${SITE.url}/#business`;

function business() {
  return {
    '@type': ['HomeAndConstructionBusiness', 'GeneralContractor', 'LocalBusiness', 'Organization'],
    '@id': BUSINESS_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    alternateName: 'SBC',
    description: SITE.description,
    url: `${SITE.url}/`,
    logo: { '@type': 'ImageObject', url: SITE.url + SITE.logo, width: 1200, height: 630 },
    image: SITE.url + SITE.ogImage,
    telephone: SITE.phoneE164,
    email: SITE.email,
    foundingDate: SITE.founded,
    priceRange: '$$',
    knowsAbout: ['Design-build', 'Home remodeling', 'Kitchen remodeling', 'Bathroom remodeling', 'Basement finishing', 'Home additions', 'Custom homes', 'Accessory dwelling units', 'Residential architectural design'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: SITE.hours.days,
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ],
    sameAs: SOCIAL.map((s) => s.url),
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
      { '@type': 'AdministrativeArea', name: 'Eagle County, CO' },
      { '@type': 'AdministrativeArea', name: 'Pitkin County, CO' },
      { '@type': 'AdministrativeArea', name: 'Grand County, CO' },
      { '@type': 'AdministrativeArea', name: 'Summit County, CO' },
      { '@type': 'AdministrativeArea', name: 'Routt County, CO' },
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
  if (page.type === 'pricing') return [homeCrumb, { name: 'Pricing', path: page.path }];
  if (page.type === 'local-basement') {
    const a = AREAS.find((c) => c.slug === page.slug);
    return [homeCrumb, { name: 'Basement Finishing', path: '/services/basement-finishing/' }, { name: a.name, path: page.path }];
  }
  if (page.type === 'contact') return [homeCrumb, { name: 'Contact', path: page.path }];
  if (page.type === 'static') {
    const sp = STATIC_PAGES.find((x) => x.slug === page.slug);
    return [homeCrumb, { name: sp.eyebrow === 'How we work' ? 'Design-Build' : sp.eyebrow, path: page.path }];
  }
  if (page.type === 'insights') return [homeCrumb, { name: 'Insights', path: page.path }];
  if (page.type === 'post') {
    const post = POSTS.find((x) => x.slug === page.slug);
    return [homeCrumb, { name: 'Insights', path: '/insights/' }, { name: post.title, path: page.path }];
  }
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
      name: 'Home Remodeling Services',
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
      name: `Home remodeling in ${a.name}, CO`,
      serviceType: 'Home Remodeling',
      url: absoluteUrl(page.path),
      description: a.description,
      provider: { '@id': BUSINESS_ID },
      areaServed: {
        '@type': 'City',
        name: `${a.name}, CO`,
        containedInPlace: { '@type': 'AdministrativeArea', name: `${a.county}, CO` },
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `Home remodeling services in ${a.name}`,
        itemListElement: a.focus.residential.map((slug) => findService('residential', slug)).filter(Boolean)
          .map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: absoluteUrl(s.path) } })),
      },
    });
    if (a.faqs && a.faqs.length) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: a.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      });
    }
  }

  if (page.type === 'contact') {
    graph.push({ '@type': 'ContactPage', url: absoluteUrl(page.path), about: { '@id': BUSINESS_ID } });
  }

  if (page.type === 'static') {
    const sp = STATIC_PAGES.find((x) => x.slug === page.slug);
    graph.push({
      '@type': page.slug === 'about' ? 'AboutPage' : 'WebPage',
      '@id': `${absoluteUrl(page.path)}#webpage`,
      url: absoluteUrl(page.path),
      name: sp.h1,
      description: sp.description,
      about: { '@id': BUSINESS_ID },
    });
    if (page.slug === 'design-build') {
      graph.push({
        '@type': 'Service',
        '@id': `${absoluteUrl(page.path)}#service`,
        name: 'Residential design-build',
        serviceType: 'Design-build construction',
        description: sp.description,
        url: absoluteUrl(page.path),
        provider: { '@id': BUSINESS_ID },
        areaServed: AREAS.map((a) => ({ '@type': 'City', name: `${a.name}, CO` })),
      });
    }
    if (sp.faqs && sp.faqs.length) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: sp.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      });
    }
  }

  if (page.type === 'insights') {
    graph.push({
      '@type': 'CollectionPage',
      '@id': `${absoluteUrl(page.path)}#webpage`,
      url: absoluteUrl(page.path),
      name: page.h1,
      description: page.description,
      hasPart: POSTS.map((p) => ({ '@type': 'Article', headline: p.title, url: absoluteUrl(`/insights/${p.slug}/`), datePublished: p.published })),
    });
  }

  if (page.type === 'post') {
    const post = POSTS.find((x) => x.slug === page.slug);
    const text = post.body.filter((b) => !b.startsWith('## ')).join(' ');
    graph.push({
      '@type': 'Article',
      '@id': `${absoluteUrl(page.path)}#article`,
      headline: post.h1,
      description: post.description,
      url: absoluteUrl(page.path),
      mainEntityOfPage: absoluteUrl(page.path),
      datePublished: post.published,
      dateModified: post.updated || post.published,
      articleSection: post.category,
      wordCount: text.split(/\s+/).length,
      image: SITE.url + SITE.ogImage,
      author: { '@type': 'Organization', name: AUTHOR.name, url: AUTHOR.url, '@id': BUSINESS_ID },
      publisher: { '@id': BUSINESS_ID },
      inLanguage: 'en-US',
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

// Search results cut titles off around 60 characters. Shorten the brand suffix until the title fits.
function fitTitle(title) {
  if (title.length <= 60) return title;
  for (const [from, to] of [[' | Standard Building Company', ' | Standard Building Co.'], [' | Standard Building Company', ' | Standard Building']]) {
    const t = title.replace(from, to);
    if (t.length <= 60) return t;
  }
  return title.replace(/ \| Standard Building Company$/, '');
}

// Search engine verification tokens. Set GOOGLE_SITE_VERIFICATION and BING_SITE_VERIFICATION as build
// environment variables on the host. The Google default is the token already verified for this property.
export function verificationTags(env = {}) {
  const google = env.GOOGLE_SITE_VERIFICATION || 'nC4LZipWKEw515pkdTicr5fgcN_ZIy6erNHNBfWf4xc';
  const bing = env.BING_SITE_VERIFICATION || '';
  const tags = [`<meta name="google-site-verification" content="${esc(google)}" />`];
  if (bing) tags.push(`<meta name="msvalidate.01" content="${esc(bing)}" />`);
  return tags;
}

export function buildHead(page, env = {}) {
  page = { ...page, title: fitTitle(page.title) };
  const url = absoluteUrl(page.path);
  const image = SITE.url + SITE.ogImage;
  const robots = page.noindex
    ? 'noindex, follow'
    : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

  const tags = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    ...verificationTags(env),
  ];

  if (!page.noindex) {
    tags.push(
      `<link rel="canonical" href="${esc(url)}" />`,
      `<meta property="og:type" content="${page.type === 'post' ? 'article' : 'website'}" />`,
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
