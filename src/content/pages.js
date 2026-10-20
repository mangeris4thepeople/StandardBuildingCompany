// Route table. Every entry here is prerendered to its own HTML file at build time
// and listed in sitemap.xml. Add a service or city in the content files and it appears here.
import { SITE, GROUPS } from './site.js';
import { RESIDENTIAL } from './residential.js';
import { CITIES } from './cities.js';

export const SERVICES = {
  residential: RESIDENTIAL.map((s) => ({ ...s, group: 'residential', path: `/residential/${s.slug}/` })),
};

export const ALL_SERVICES = [...SERVICES.residential];

// Page titles are kept to 60 characters so search results show them in full.
const BRANDS = [' | Standard Building Co.', ' | Standard Building'];
function areaTitle(name) {
  for (const b of BRANDS) { const t = `Home Remodeling in ${name}, CO${b}`; if (t.length <= 60) return t; }
  const t = `${name}, CO Home Remodeling | Standard Building`;
  return t.length <= 60 ? t : `Home Remodeling in ${name}, Colorado`;
}

export const AREAS = CITIES.map((c) => ({ region: 'northern', title: areaTitle(c.name), ...c, path: `/service-areas/${c.slug}/` }));

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
  title: 'Home Remodeling Contractor | Loveland, CO',
  description:
    'Home remodeling in Loveland and Northern Colorado: kitchens, bathrooms, basements, additions, decks, siding, garages, and ADUs. One accountable contractor.',
  priority: '1.0',
};

const hubs = [
  {
    type: 'hub',
    group: 'residential',
    path: GROUPS.residential.path,
    title: 'Home Remodeling Contractor in Loveland, CO | Standard Building Company',
    description:
      'Residential remodeling in Loveland and Northern Colorado: kitchens, bathrooms, basements, additions, flooring, decks, concrete, siding, windows, garages, and ADUs.',
    h1: 'Residential Remodeling in Loveland and Northern Colorado',
    lede: 'Kitchens, bathrooms, basements, additions, exteriors, and outdoor living, planned and built by one accountable contractor.',
    intro: [
      'Homeowners hire us for one reason: one contractor who plans the work, pulls the permits, schedules every trade, and answers for the result.',
      'We take on residential projects of every size across Larimer and Weld counties, from a punch list of small repairs to a full addition.',
    ],
    priority: '1.0',
  },
];

const pricing = {
  type: 'pricing',
  path: '/pricing/',
  title: 'Remodeling Costs & Estimates in Northern Colorado',
  description: 'Understand what affects kitchen, bathroom, and basement remodeling costs in Loveland and Northern Colorado. Request a written, project-specific estimate.',
  h1: 'Remodeling Pricing and Project Estimates',
  lede: 'Transparent scope, clear allowances, and a written estimate built around your property and selections.',
  priority: '0.8',
};

// Each location receives its own basement finishing landing page, with a local
// permit discussion and links to the city page and full service description.
const localBasements = AREAS.map((a) => ({
  type: 'local-basement',
  slug: a.slug,
  path: `/basement-finishing/${a.slug}/`,
  title: `Basement Finishing ${a.name}, CO | Standard Building`.slice(0, 60),
  description: `Basement finishing and remodeling in ${a.name}, Colorado. Bedrooms, bathrooms, egress, permits, and project-specific estimates from Standard Building Company.`,
  h1: `Basement Finishing in ${a.name}, Colorado`,
  lede: `Planning a finished basement in ${a.name}? We coordinate design, subcontractors, permits, inspections, and final walkthroughs.`,
  priority: '0.8',
}));

const areasHub = {
  type: 'areas',
  path: '/service-areas/',
  title: 'Remodeling Service Areas: Northern Colorado & Mountains',
  description:
    'Home remodeling contractor serving Loveland, Fort Collins, Greeley, Longmont, Windsor, Estes Park, Vail, Avon, Aspen, Winter Park, Copper Mountain, and Steamboat Springs.',
  h1: 'Northern Colorado and Mountain Town Service Areas',
  lede: 'Based in Loveland and working across the northern Front Range and into the mountain towns of Eagle, Pitkin, Grand, Summit, and Routt counties.',
  priority: '0.7',
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

const servicePages = ALL_SERVICES.map((s) => ({
  type: 'service',
  group: s.group,
  slug: s.slug,
  path: s.path,
  title: s.title,
  description: s.description,
  priority: '0.8',
}));

const areaPages = AREAS.map((c) => ({
  type: 'area',
  slug: c.slug,
  path: c.path,
  title: c.title,
  description: c.description,
  priority: '0.7',
}));

export const PAGES = [home, ...hubs, ...servicePages, pricing, ...localBasements, areasHub, ...areaPages, contact];

export const NOT_FOUND = {
  type: 'notfound',
  path: '/404/',
  title: 'Page Not Found | Standard Building Company',
  description: 'The page you were looking for could not be found.',
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
