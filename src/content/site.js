// Single source of truth for company facts used across pages, head tags, and schema.
export const SITE = {
  name: 'Standard Building Company',
  legalName: 'Standard Building Company Inc.',
  url: 'https://www.standardbuildingcompany.net',
  phoneDisplay: '(970) 430-5884',
  phoneHref: 'tel:+19704305884',
  phoneE164: '+19704305884',
  email: 'info@standardbuildingcompany.net',
  founded: '2020',
  locality: 'Loveland',
  region: 'CO',
  postalCode: '80537',
  streetAddress: '1180 E. 3rd St.',
  geo: { latitude: 40.3978, longitude: -105.075 },
  formEndpoint: 'https://formspree.io/f/mnjkjabl',
  ogImage: '/og-image.png',
};

export const GROUPS = {
  commercial: {
    slug: 'commercial',
    path: '/commercial/',
    label: 'Commercial',
    name: 'Commercial Construction',
  },
  residential: {
    slug: 'residential',
    path: '/residential/',
    label: 'Residential',
    name: 'Residential Remodeling',
  },
};

// Towns we serve that do not have their own page yet.
export const OTHER_AREAS = ['Milliken', 'Evans', 'Severance', 'Laporte', 'Masonville', 'Mead'];

export const PROCESS = {
  commercial: [
    {
      title: 'Scope and budget',
      body: 'We walk the site or review the drawings with you, define the scope, and build a budget and schedule you can make decisions from.',
    },
    {
      title: 'Pre-construction',
      body: 'Constructability review, subcontractor pricing, long-lead procurement, and permit submittals happen before anyone mobilizes.',
    },
    {
      title: 'Construction',
      body: 'One superintendent runs the job. You get a schedule, regular updates, and a clear paper trail on every change.',
    },
    {
      title: 'Closeout',
      body: 'Punch list, final inspections, certificate of occupancy, and a complete turnover package with warranties and as-builts.',
    },
  ],
  residential: [
    {
      title: 'Walkthrough',
      body: 'We look at the space with you, talk through what you want, and flag anything that affects cost or schedule up front.',
    },
    {
      title: 'Written scope and price',
      body: 'You get a written scope of work and price before anything starts, so there is no guessing about what is included.',
    },
    {
      title: 'Build',
      body: 'We handle permits, schedule the trades, protect the rest of your home, and keep you posted as the work moves.',
    },
    {
      title: 'Final walkthrough',
      body: 'We walk the finished work with you, close out inspections, and take care of the punch list before we call it done.',
    },
  ],
};
