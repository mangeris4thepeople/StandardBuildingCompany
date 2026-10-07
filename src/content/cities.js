// Service-area pages. Each entry becomes /service-areas/<slug>/.
// Local notes are limited to facts that are stable and verifiable: county, geography, building stock.
export const CITIES = [
  {
    slug: 'loveland-co',
    name: 'Loveland',
    county: 'Larimer County',
    title: 'Loveland, CO Construction & Remodeling | Standard Building Company',
    description:
      'Loveland-based contractor for commercial construction, tenant finish, kitchen and bath remodeling, basement finishing, decks, and concrete in Loveland, Colorado.',
    lede: 'Loveland is home. Standard Building Company is based here, and it is where most of our commercial and residential work starts.',
    local: [
      'Loveland sits between Fort Collins and Longmont on US 287, with US 34 running east to I-25 and Greeley and west into the Big Thompson Canyon. The city mixes a historic downtown along 4th Street, established neighborhoods around Lake Loveland, and newer commercial and residential growth on the east side near I-25.',
      'That mix means the work varies: tenant improvements in downtown storefronts and east-side retail centers, updates to mid-century homes near the lake, and basement finishes and outdoor projects in newer subdivisions.',
    ],
    permits:
      'Projects inside city limits are permitted through the City of Loveland building department. Properties in unincorporated areas around the city go through Larimer County. We confirm which applies to your address and handle the submittal.',
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'design-build'],
      residential: ['kitchen-remodeling', 'basement-finishing', 'decks-outdoor-living', 'bathroom-remodeling'],
    },
  },
  {
    slug: 'fort-collins-co',
    name: 'Fort Collins',
    county: 'Larimer County',
    title: 'General Contractor in Fort Collins, CO | Standard Building Company',
    description:
      'General contractor serving Fort Collins, Colorado. Tenant finish, commercial construction, kitchen and bathroom remodeling, basement finishing, additions, and decks.',
    lede: 'Commercial construction and residential remodeling in Fort Collins, a short drive north of our Loveland base on US 287.',
    local: [
      'Fort Collins is the Larimer County seat and the largest city in Northern Colorado, anchored by Colorado State University and Old Town. Its building stock runs from late-1800s homes and storefronts near downtown to large newer neighborhoods on the south and east sides.',
      'Older homes near Old Town and campus often need structural, electrical, and plumbing updates along with any remodel, and some properties fall under historic preservation review. On the commercial side, steady turnover in retail, restaurant, and office space keeps tenant finish work in demand.',
    ],
    permits:
      'Building permits are issued by the City of Fort Collins. Designated landmarks and properties in historic districts can require an additional design review for exterior changes. We check for that before design work goes too far.',
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'construction-management'],
      residential: ['kitchen-remodeling', 'home-additions', 'bathroom-remodeling', 'basement-finishing'],
    },
  },
  {
    slug: 'greeley-co',
    name: 'Greeley',
    county: 'Weld County',
    title: 'General Contractor in Greeley, CO | Standard Building Company',
    description:
      'General contractor serving Greeley and Weld County, Colorado. Commercial and industrial construction, tenant finish, public works, remodeling, concrete, and garages.',
    lede: 'Commercial, industrial, and residential construction in Greeley and Weld County, east of Loveland on US 34.',
    local: [
      'Greeley is the Weld County seat and home to the University of Northern Colorado. The local economy leans on agriculture, food processing, energy, and the industrial and logistics businesses that support them, alongside a growing west side of newer homes and retail.',
      'For us that means industrial build-outs, shop and warehouse buildings, and tenant improvements on the commercial side, and remodels, concrete, and garages on the residential side.',
    ],
    permits:
      'Projects inside city limits are permitted through the City of Greeley. Evans, Garden City, and unincorporated Weld County each have their own requirements. Weld County covers a large rural area where agricultural and accessory building rules often apply.',
    focus: {
      commercial: ['industrial-construction', 'steel-erection', 'government-public-works'],
      residential: ['garages-adus', 'concrete', 'kitchen-remodeling', 'exteriors'],
    },
  },
  {
    slug: 'longmont-co',
    name: 'Longmont',
    county: 'Boulder County',
    title: 'General Contractor in Longmont, CO | Standard Building Company',
    description:
      'General contractor serving Longmont, Colorado. Tenant finish, commercial construction, kitchen and bath remodeling, basement finishing, additions, and exterior work.',
    lede: 'Commercial construction and residential remodeling in Longmont, south of Loveland on US 287.',
    local: [
      'Longmont lies mostly in Boulder County, with its eastern edge in Weld County. It has a walkable historic Main Street, older neighborhoods near downtown, and a sizable base of technology and light industrial employers.',
      'Remodels in the older neighborhoods often mean opening floor plans and updating systems, while newer homes on the edges of town are candidates for basement finishes and outdoor living projects.',
    ],
    permits:
      'Building permits are issued by the City of Longmont. Unincorporated properties nearby fall under Boulder County or Weld County depending on location, and the two counties have very different requirements. We confirm jurisdiction before pricing.',
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'industrial-construction'],
      residential: ['kitchen-remodeling', 'bathroom-remodeling', 'basement-finishing', 'decks-outdoor-living'],
    },
  },
  {
    slug: 'windsor-co',
    name: 'Windsor',
    county: 'Weld and Larimer counties',
    title: 'General Contractor in Windsor, CO | Standard Building Company',
    description:
      'General contractor serving Windsor, Colorado. Basement finishing, decks and patio covers, kitchen remodeling, new-home punch lists, and commercial construction.',
    lede: 'Basement finishes, outdoor living, remodeling, and commercial work in Windsor, northeast of Loveland.',
    local: [
      'Windsor straddles the Weld and Larimer county line between Loveland, Fort Collins, and Greeley. It has been one of the fastest-growing towns in the region, with large master-planned neighborhoods and a growing commercial base along the main corridors.',
      'A newer housing stock means many homes with unfinished basements, builder-grade finishes ready for an upgrade, and backyards waiting for a deck or patio cover.',
    ],
    permits:
      'The Town of Windsor issues building permits inside town limits. Many Windsor neighborhoods also have homeowner associations with design review for exterior projects, and we provide the drawings and material details they ask for.',
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'design-build'],
      residential: ['basement-finishing', 'decks-outdoor-living', 'handyman-punch-list', 'kitchen-remodeling'],
    },
  },
  {
    slug: 'berthoud-co',
    name: 'Berthoud',
    county: 'Larimer and Weld counties',
    title: 'General Contractor in Berthoud, CO | Standard Building Company',
    description:
      'General contractor serving Berthoud, Colorado. Home additions, remodeling, basement finishing, garages and shops, decks, concrete, and commercial construction.',
    lede: 'Remodeling, additions, shops, and commercial construction in Berthoud, just south of Loveland on US 287.',
    local: [
      'Berthoud is a small town between Loveland and Longmont with a historic core, new neighborhoods on its edges, and a lot of rural acreage in every direction.',
      'Work here ranges from remodels and additions on older in-town homes to detached shops, barns, and garages on larger lots outside town.',
    ],
    permits:
      'The Town of Berthoud issues permits inside town limits. Acreage properties outside town are usually in unincorporated Larimer or Weld County, where rules for shops, barns, and accessory buildings differ. We sort out which jurisdiction applies first.',
    focus: {
      commercial: ['general-contracting', 'steel-erection', 'tenant-finish'],
      residential: ['garages-adus', 'home-additions', 'basement-finishing', 'concrete'],
    },
  },
  {
    slug: 'johnstown-co',
    name: 'Johnstown',
    county: 'Weld and Larimer counties',
    title: 'General Contractor in Johnstown, CO | Standard Building Company',
    description:
      'General contractor serving Johnstown and Milliken, Colorado. Basement finishing, decks, new-home upgrades, tenant finish, and commercial and industrial construction.',
    lede: 'Residential upgrades and commercial construction in Johnstown and Milliken, southeast of Loveland along I-25 and US 34.',
    local: [
      'Johnstown spans Weld and Larimer counties and has grown quickly along the I-25 corridor, with major retail and commercial development near the US 34 interchange and new subdivisions spreading from the original downtown. Neighboring Milliken shares much of the same growth.',
      'New commercial space means tenant finish work. New homes mean basement finishes, decks, fences, and the punch list items builders leave behind.',
    ],
    permits:
      'The Town of Johnstown and the Town of Milliken each issue their own building permits. We handle the submittal and inspections for whichever jurisdiction your project is in.',
    focus: {
      commercial: ['tenant-finish', 'industrial-construction', 'general-contracting'],
      residential: ['basement-finishing', 'decks-outdoor-living', 'handyman-punch-list', 'flooring'],
    },
  },
  {
    slug: 'timnath-co',
    name: 'Timnath',
    county: 'Larimer County',
    title: 'General Contractor in Timnath, CO | Standard Building Company',
    description:
      'General contractor serving Timnath, Colorado. Basement finishing, decks and covered patios, custom built-ins, new-home upgrades, and commercial tenant finish.',
    lede: 'Basement finishes, outdoor living, and new-home upgrades in Timnath, east of Fort Collins across I-25.',
    local: [
      'Timnath has grown from a small farm town into one of the fastest-growing communities in Larimer County. Most of its homes have been built in recent years, in neighborhoods east of I-25 near Harmony Road.',
      'That makes it a town of unfinished basements and blank backyards. The most common projects are basement finishes, decks and covered patios, built-ins, and upgrades to builder-grade finishes.',
    ],
    permits:
      'Building permits are issued by the Town of Timnath. Nearly every neighborhood has a homeowner association with design review for exterior work, and we prepare what the review committee needs.',
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'design-build'],
      residential: ['basement-finishing', 'decks-outdoor-living', 'painting-drywall-trim', 'handyman-punch-list'],
    },
  },
  {
    slug: 'wellington-co',
    name: 'Wellington',
    county: 'Larimer County',
    title: 'General Contractor in Wellington, CO | Standard Building Company',
    description:
      'General contractor serving Wellington, Colorado. Basement finishing, decks, fences, garages and shops, concrete, remodeling, and commercial construction.',
    lede: 'Remodeling, basements, shops, and commercial work in Wellington, north of Fort Collins on I-25.',
    local: [
      'Wellington is the northernmost town in the Fort Collins area, with a small historic downtown, a large share of homes built since 2000, and open country beyond the town limits.',
      'It is also windy. Fences, decks, roofing, and siding all take more punishment here than they do farther south, and they need to be built with that in mind.',
    ],
    permits:
      'The Town of Wellington issues permits inside town limits, and surrounding rural properties are in unincorporated Larimer County. We confirm jurisdiction and handle the paperwork.',
    focus: {
      commercial: ['general-contracting', 'steel-erection', 'tenant-finish'],
      residential: ['basement-finishing', 'decks-outdoor-living', 'garages-adus', 'exteriors'],
    },
  },
  {
    slug: 'estes-park-co',
    name: 'Estes Park',
    county: 'Larimer County',
    title: 'General Contractor in Estes Park, CO | Standard Building Company',
    description:
      'General contractor serving Estes Park, Colorado. Remodeling, additions, decks, roofing and exteriors, and commercial construction built for mountain conditions.',
    lede: 'Remodeling, decks, exteriors, and commercial construction in Estes Park, west of Loveland up US 34.',
    local: [
      'Estes Park sits at about 7,500 feet at the eastern entrance to Rocky Mountain National Park, reached from Loveland through the Big Thompson Canyon. Its buildings include older cabins, vacation homes, lodging properties, and the shops and restaurants that serve visitors.',
      'Mountain construction is its own discipline. Snow and wind loads are higher than on the plains, the exterior building season is shorter, sites are often steep and rocky, and wildfire exposure shapes choices about roofing, siding, and decking.',
    ],
    permits:
      'Permits are issued by the Town of Estes Park inside town limits and by Larimer County in the surrounding valley. Structural design has to reflect local snow and wind loads, and we coordinate the engineering that goes with it.',
    focus: {
      commercial: ['general-contracting', 'tenant-finish', 'construction-management'],
      residential: ['decks-outdoor-living', 'exteriors', 'home-additions', 'kitchen-remodeling'],
    },
  },
];
