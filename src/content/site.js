// Single source of truth for company facts used across pages, head tags, and schema.
export const SITE = {
  name: 'Standard Building Company',
  legalName: 'Standard Building Company Inc.',
  // Plain-language business description used in schema and shared with Google Business Profile.
  description:
    'Standard Building Company is a residential design-build general contractor founded in 2020 and based in Loveland, Colorado. We design and build for homeowners: whole-home and kitchen remodels, bathrooms, basement finishes, additions, custom homes, ADUs, decks, and architectural design and permitting. One accountable contractor from concept through completion, serving Northern Colorado and the mountain towns.',
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
  // The exact NAP string. Use it verbatim on every citation, the footer, the contact page, and schema.
  addressDisplay: '1180 E. 3rd St., Loveland, CO 80537',
  geo: { latitude: 40.3978, longitude: -105.075 },
  // Office hours for schema and Google Business Profile.
  hours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '17:00' },
  logo: '/og-image.png',
  formEndpoint: '/api/contact/',
  formFallback: 'https://formspree.io/f/mnjkjabl',
  ogImage: '/og-image.png',
};

// Company social profiles. Shown as icon links in the nav and footer on every page,
// and listed as sameAs in the business schema.
// Commercial work is handled by Standard Development Company, a separate firm.
export const COMMERCIAL_REFERRAL = { name: 'Standard Development Company', url: 'https://standarddevelopmentcompany.com/' };

export const SOCIAL = [
  { name: 'LinkedIn', key: 'linkedin', url: 'https://www.linkedin.com/company/standardbuildingcompany/' },
  { name: 'Facebook', key: 'facebook', url: 'https://www.facebook.com/profile.php?id=61595003715696' },
];

export const GROUPS = {
  residential: {
    slug: 'services',
    path: '/services/',
    label: 'Services',
    name: 'Design-Build and Remodeling',
  },
};

// Towns we serve that do not have their own page yet.
export const OTHER_AREAS = ['Milliken', 'Evans', 'Severance', 'Laporte', 'Masonville', 'Mead'];

export const PROCESS = {
  residential: [
    {
      title: 'Walkthrough and concept',
      body: 'We look at the space with you, talk through what you want, measure, and flag anything that affects cost or schedule before design starts.',
    },
    {
      title: 'Design and written price',
      body: 'Our design side draws the plan, we price it as it is drawn, and you get a written scope and price before anything is demolished.',
    },
    {
      title: 'Permits and build',
      body: 'We submit the permit set, schedule every trade, protect the rest of your home, and keep you posted as the work moves.',
    },
    {
      title: 'Final walkthrough',
      body: 'We walk the finished work with you, close out inspections, and take care of the punch list before we call it done.',
    },
  ],
};
