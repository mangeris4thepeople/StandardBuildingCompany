// Route table. Every entry here is prerendered to its own HTML file at build time
// and listed in sitemap.xml. Add a service, city, or post in the content files and it appears here.
import { SITE, GROUPS } from './site.js';
import { RESIDENTIAL } from './residential.js';
import { DESIGN_BUILD } from './design-build-services.js';
import { CITIES } from './cities.js';
import { STATIC_PAGES } from './static-pages.js';
import { POSTS } from './posts.js';
import { LOCAL_SERVICES } from './local-services.js';

// Core design-build services lead the list; trade and small-job services follow.
const SERVICE_ORDER = [
  'whole-home-remodels',
  'kitchen-remodeling',
  'bathroom-remodeling',
  'basement-finishing',
  'home-additions',
  'custom-homes',
  'garages-adus',
  'decks-outdoor-living',
  'architectural-design-permitting',
  'exteriors',
  'flooring',
  'painting-drywall-trim',
  'concrete',
  'handyman-punch-list',
];

const rank = (slug) => { const i = SERVICE_ORDER.indexOf(slug); return i < 0 ? 99 : i; };

export const SERVICES = {
  residential: [...DESIGN_BUILD, ...RESIDENTIAL]
    .sort((a, b) => rank(a.slug) - rank(b.slug))
    .map((s) => ({ ...s, group: 'residential', path: `${GROUPS.residential.path}${s.slug}/` })),
};

// The ten services shown on the home page and in the nav. Everything else is reachable from the hub.
export const CORE_SERVICES = SERVICES.residential.filter((s) => rank(s.slug) < 10);

export const ALL_SERVICES = [...SERVICES.residential];

// Page titles are kept to 60 characters so search results show them in full.
const BRANDS = [' | Standard Building Co.', ' | Standard Building', ' | SBC'];
// Searchers in every town mostly type "general contractor <town>" or "building contractor <town>",
// so area titles lead with that phrase.
function areaTitle(name) {
  for (const b of BRANDS) { const t = `General Contractor in ${name}, CO${b}`; if (t.length <= 60) return t; }
  return `General Contractor in ${name}, CO`;
}

export const AREAS = CITIES.map((c) => ({
  region: 'northern',
  title: areaTitle(c.name),
  h1: `General Contractor and Home Remodeling in ${c.name}, CO`,
  ...c,
  path: `/service-areas/${c.slug}/`,
}));

// Service areas grouped for listings. Order here is the order the groups appear on the page.
export const AREA_REGIONS = [
  { key: 'northern', label: 'Northern Colorado' },
  { key: 'mountain', label: 'Mountain Towns' },
].map((r) => ({ ...r, areas: AREAS.filter((a) => a.region === r.key) }));

export function findService(group, slug) {
  return SERVICES[group].find((s) => s.slug === slug);
}

const home = {
  type: 'home',
  path: '/',
  title: 'General Contractor in Loveland, CO | Design-Build Remodeling',
  description:
    'Residential general contractor in Loveland, CO. Design-build kitchen and bath remodels, basements, additions, custom homes, and ADUs across Northern Colorado.',
  priority: '1.0',
};

const hubs = [
  {
    type: 'hub',
    group: 'residential',
    path: GROUPS.residential.path,
    title: 'Home Remodeling & Design-Build Services | Northern Colorado',
    description:
      'Design-build services in Loveland and Northern Colorado: whole-home, kitchen, and bath remodels, basement finishes, additions, custom homes, ADUs, decks, and design.',
    h1: 'Design-Build and Remodeling Services in Northern Colorado',
    lede: 'Whole-home remodels, kitchens, baths, basements, additions, custom homes, and ADUs, designed and built by one accountable contractor.',
    intro: [
      'Homeowners hire us for one reason: one firm that draws the plan, prices it as it is drawn, pulls the permit, schedules every trade, and answers for the result.',
      'We take on residential projects of every size across Larimer and Weld counties and in the mountain towns, from a bathroom to a custom home. Each service below has its own page with scope, process, timelines, what drives cost, and answers to the questions we hear most.',
    ],
    priority: '0.9',
  },
];

const pricing = {
  type: 'pricing',
  path: '/pricing/',
  title: 'Remodeling Costs & Estimates in Northern Colorado',
  description: 'Understand what affects kitchen, bathroom, and basement remodeling costs in Loveland and Northern Colorado. Request a written, project-specific estimate.',
  h1: 'Remodeling Pricing and Project Estimates',
  lede: 'Transparent scope, clear allowances, and a written estimate built around your property and selections.',
  priority: '0.7',
};

// Each location receives its own basement finishing landing page, with a local
// permit discussion and links to the city page and full service description.
const localBasements = AREAS.map((a) => ({
  type: 'local-basement',
  slug: a.slug,
  path: `/basement-finishing/${a.slug}/`,
  title: `Basement Finishing ${a.name}, CO | Standard Building`.slice(0, 60),
  description: `Basement finishing in ${a.name}, CO. Bedrooms, bathrooms, egress windows, permits, inspections, and written estimates from Standard Building Company.`,
  h1: `Basement Finishing in ${a.name}, CO`,
  lede: `Planning a finished basement in ${a.name}? We handle design, permits, subcontractors, inspections, and the final walkthrough.`,
  priority: '0.6',
}));

// Town-specific service pages: /<service>/<area>/. Content lives in local-services.js.
export const LOCAL_SERVICE_PAGES = LOCAL_SERVICES.map((l) => ({
  type: 'local-service',
  slug: `${l.service}/${l.area}`,
  service: l.service,
  area: l.area,
  path: `/${l.service}/${l.area}/`,
  title: l.title,
  description: l.description,
  h1: l.h1,
  lede: l.lede,
  priority: '0.7',
}));

const areasHub = {
  type: 'areas',
  path: '/service-areas/',
  title: 'Service Areas: Northern Colorado & Mountain Towns | SBC',
  description:
    'Design-build contractor serving Loveland, Fort Collins, Greeley, Longmont, Windsor, Estes Park, Vail, Avon, Aspen, Winter Park, Copper Mountain, and Steamboat.',
  h1: 'Northern Colorado and Mountain Town Service Areas',
  lede: 'Based in Loveland and working across the northern Front Range and into the mountain towns of Eagle, Pitkin, Grand, Summit, and Routt counties.',
  priority: '0.8',
};

const contact = {
  type: 'contact',
  path: '/contact/',
  title: 'Contact Standard Building Company | Loveland Contractor',
  description:
    'Call (970) 430-5884 or send a message to talk through your remodel, addition, or home project in Loveland, Northern Colorado, or the mountain towns.',
  h1: 'Contact Standard Building Company',
  lede: "Tell us about the project. Whether you're in early planning or ready to build, someone from our team will be in touch.",
  priority: '0.6',
};

const insightsHub = {
  type: 'insights',
  path: '/insights/',
  title: 'Remodeling Insights for Northern Colorado | SBC Loveland',
  description:
    'Cost guides, permit explainers, and planning advice for remodeling, additions, ADUs, and custom homes in Loveland, Fort Collins, and the Colorado mountain towns.',
  h1: 'Remodeling Insights for Northern Colorado Homeowners',
  lede: 'Cost ranges, permit rules, and planning advice written by the people who draw and build the projects.',
  priority: '0.7',
};

const postPages = POSTS.map((p) => ({
  type: 'post',
  slug: p.slug,
  path: `/insights/${p.slug}/`,
  title: p.title,
  description: p.description,
  priority: '0.6',
  lastmod: p.updated || p.published,
}));

const servicePages = ALL_SERVICES.map((s) => ({
  type: 'service',
  group: s.group,
  slug: s.slug,
  path: s.path,
  title: s.title,
  description: s.description,
  priority: rank(s.slug) < 10 ? '0.9' : '0.8',
}));

const areaPages = AREAS.map((c) => ({
  type: 'area',
  slug: c.slug,
  path: c.path,
  title: c.title,
  description: c.description,
  priority: c.region === 'mountain' ? '0.7' : '0.8',
}));

const staticPages = STATIC_PAGES.map((p) => ({ ...p }));

export const PAGES = [
  home,
  ...hubs,
  ...servicePages,
  ...staticPages,
  pricing,
  areasHub,
  ...areaPages,
  ...localBasements,
  ...LOCAL_SERVICE_PAGES,
  insightsHub,
  ...postPages,
  contact,
];

export const NOT_FOUND = {
  type: 'notfound',
  path: '/404/',
  title: 'Page Not Found | Standard Building Company',
  description: 'That page does not exist or has moved. Find our remodeling, design-build, and custom home services, service areas, and contact details from the links on this page.',
  noindex: true,
};

export function normalizePath(pathname) {
  let p = (pathname || '/').split('?')[0].split('#')[0];
  if (p.endsWith('/index.html')) p = p.slice(0, -'index.html'.length);
  if (!p.endsWith('/')) p += '/';
  return p;
}

export function findPage(pathname) {
  const p = normalizePath(pathname);
  return PAGES.find((page) => page.path === p) || NOT_FOUND;
}

export function absoluteUrl(path) {
  return SITE.url + path;
}
