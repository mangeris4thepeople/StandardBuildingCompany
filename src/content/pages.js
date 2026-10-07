// Route table. Every entry here is prerendered to its own HTML file at build time
// and listed in sitemap.xml. Add a service or city in the content files and it appears here.
import { SITE, GROUPS } from './site.js';
import { COMMERCIAL } from './commercial.js';
import { RESIDENTIAL } from './residential.js';
import { CITIES } from './cities.js';

export const SERVICES = {
  commercial: COMMERCIAL.map((s) => ({ ...s, group: 'commercial', path: `/commercial/${s.slug}/` })),
  residential: RESIDENTIAL.map((s) => ({ ...s, group: 'residential', path: `/residential/${s.slug}/` })),
};

export const ALL_SERVICES = [...SERVICES.commercial, ...SERVICES.residential];

export const AREAS = CITIES.map((c) => ({ ...c, path: `/service-areas/${c.slug}/` }));

export function findService(group, slug) {
  return SERVICES[group].find((s) => s.slug === slug);
}

const home = {
  type: 'home',
  path: '/',
  title: 'General Contractor in Loveland, CO | Standard Building Company',
  description:
    'General contractor in Loveland, Colorado. Commercial, industrial, and government construction plus residential remodeling across Northern Colorado.',
  priority: '1.0',
};

const hubs = [
  {
    type: 'hub',
    group: 'commercial',
    path: GROUPS.commercial.path,
    title: 'Commercial Construction in Northern Colorado | Standard Building Company',
    description:
      'Commercial, industrial, and government construction in Northern Colorado: general contracting, tenant finish, design-build, construction management, and steel erection.',
    h1: 'Commercial Construction in Northern Colorado',
    lede: 'General contracting, tenant finish, design-build, and construction management for commercial, industrial, and government clients.',
    intro: [
      'Standard Building Company provides full-service general contracting, construction management, design-build, and pre-construction consulting to commercial, industrial, and government clients across Northern Colorado. Based in Loveland, we self-perform and manage work spanning all 33 CSI construction divisions.',
      'That covers concrete foundations and flatwork, masonry, structural steel and miscellaneous metals, framing, roofing and waterproofing, doors and storefronts, interior finishes, fire suppression, plumbing, HVAC, electrical and low voltage, earthwork, exterior improvements, and underground utilities.',
    ],
    priority: '0.9',
  },
  {
    type: 'hub',
    group: 'residential',
    path: GROUPS.residential.path,
    title: 'Home Remodeling Contractor in Loveland, CO | Standard Building Company',
    description:
      'Residential remodeling in Loveland and Northern Colorado: kitchens, bathrooms, basements, additions, flooring, decks, concrete, roofing, siding, garages, and ADUs.',
    h1: 'Residential Remodeling in Loveland and Northern Colorado',
    lede: 'Kitchens, bathrooms, basements, additions, exteriors, and outdoor living, built by a general contractor who also builds commercial.',
    intro: [
      'Homeowners hire us for the same reason commercial owners do: one contractor who plans the work, pulls the permits, schedules every trade, and answers for the result.',
      'We take on residential projects of every size across Larimer and Weld counties, from a punch list of small repairs to a full addition.',
    ],
    priority: '0.9',
  },
];

const areasHub = {
  type: 'areas',
  path: '/service-areas/',
  title: 'Service Areas in Northern Colorado | Standard Building Company',
  description:
    'Standard Building Company serves Loveland, Fort Collins, Greeley, Longmont, Windsor, Berthoud, Johnstown, Timnath, Wellington, Estes Park, and the northern Front Range.',
  h1: 'Northern Colorado Service Areas',
  lede: 'Based in Loveland and working across Larimer County, Weld County, and the northern Front Range.',
  priority: '0.7',
};

const contact = {
  type: 'contact',
  path: '/contact/',
  title: 'Contact Standard Building Company | Loveland, CO General Contractor',
  description:
    'Call (970) 430-5884 or send a message to talk through your commercial or residential construction project in Loveland and Northern Colorado.',
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

export const PAGES = [home, ...hubs, ...servicePages, areasHub, ...areaPages, contact];

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
