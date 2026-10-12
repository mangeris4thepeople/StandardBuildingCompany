// Service-area pages. Each entry becomes /service-areas/<slug>/.
// Local notes are limited to facts that are stable and verifiable: county, geography, building stock,
// and who issues permits. Nothing here claims a specific past project.
// `region` groups the cities on the service-area listings. Entries without one are Northern Colorado.
// `nearby` lists other service-area slugs to cross-link from this page.
export const CITIES = [
  {
    slug: 'loveland-co',
    name: 'Loveland',
    county: 'Larimer County',
    title: 'Loveland Remodeling & Construction | Standard Building Co.',
    description:
      'Loveland-based general contractor: commercial construction, tenant finish, kitchen and bath remodels, basements, decks, and concrete across Loveland, CO.',
    lede: 'Loveland is home. Standard Building Company is based here, and it is where most of our commercial and residential work starts.',
    local: [
      'Loveland sits between Fort Collins and Longmont on US 287, with US 34 running east to I-25 and Greeley and west into the Big Thompson Canyon. The city mixes a historic downtown along 4th Street, established neighborhoods around Lake Loveland and Boyd Lake, and newer commercial and residential growth on the east side near I-25.',
      'That mix means the work varies: tenant improvements in downtown storefronts and east-side retail centers, updates to mid-century homes near the lake, and basement finishes and outdoor projects in newer subdivisions.',
      'Being based here matters for the small things as much as the big ones. Site visits, inspections, and punch list trips happen on short notice, and we already know the local building department, utilities, and inspectors.',
    ],
    projects: [
      { title: 'Downtown and east-side tenant finish', body: 'Retail, restaurant, office, and medical build-outs in downtown storefronts and the commercial centers near I-25 and US 34.' },
      { title: 'Updates to older homes', body: 'Kitchens, baths, and opened-up floor plans in mid-century and older homes around Lake Loveland and the downtown neighborhoods, usually with electrical and plumbing upgrades along the way.' },
      { title: 'Basements and outdoor living', body: 'Basement finishes, decks, covered patios, and fences in the newer subdivisions on the east and west edges of town.' },
      { title: 'Concrete and garages', body: 'Driveways, patios, shop slabs, and detached garages, including on acreage properties outside city limits.' },
    ],
    conditions: [
      'Expansive clay soils are common, so basement walls are framed to float and slabs need proper base, jointing, and drainage.',
      'Hail is a regular event on the Front Range, which makes impact-rated roofing and durable siding worth considering.',
      'Loveland Water and Power is the city-owned utility, so service upgrades and new meters are coordinated with the city.',
    ],
    permits:
      'Projects inside city limits are permitted through the City of Loveland building department. Properties in unincorporated areas around the city go through Larimer County. We confirm which applies to your address and handle the submittal.',
    faqs: [
      { q: 'Is Standard Building Company based in Loveland?', a: 'Yes. Our office is at 1180 E. 3rd St. in Loveland, and Loveland is where most of our work happens.' },
      { q: 'Do you work outside Loveland city limits?', a: 'Yes. We work in unincorporated Larimer County around Loveland, including acreage properties, as well as in Berthoud, Fort Collins, Windsor, Johnstown, and the rest of Northern Colorado.' },
      { q: 'Does a basement finish in Loveland need a permit?', a: 'Yes. Finishing a basement adds habitable space, wiring, and usually plumbing, so the City of Loveland or Larimer County requires a permit and inspections. We prepare the drawings and the submittal.' },
      { q: 'Do you take commercial tenant finish projects in Loveland?', a: 'Yes. Tenant finish for retail, restaurant, office, and medical space is a large part of our commercial work, and we plan every job around the date the tenant needs to open.' },
    ],
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'design-build'],
      residential: ['kitchen-remodeling', 'basement-finishing', 'decks-outdoor-living', 'bathroom-remodeling'],
    },
    nearby: ['fort-collins-co', 'berthoud-co', 'johnstown-co', 'windsor-co', 'estes-park-co'],
  },
  {
    slug: 'fort-collins-co',
    name: 'Fort Collins',
    county: 'Larimer County',
    description:
      'General contractor in Fort Collins, CO: tenant finish, commercial construction, kitchen and bath remodels, basements, additions, and decks. Based in Loveland.',
    lede: 'Commercial construction and residential remodeling in Fort Collins, a short drive north of our Loveland base on US 287.',
    local: [
      'Fort Collins is the Larimer County seat and the largest city in Northern Colorado, anchored by Colorado State University and Old Town. Its building stock runs from late-1800s homes and storefronts near downtown to large newer neighborhoods on the south and east sides.',
      'Older homes near Old Town and campus often need structural, electrical, and plumbing updates along with any remodel, and some properties fall under historic preservation review. On the commercial side, steady turnover in retail, restaurant, and office space keeps tenant finish work in demand.',
      'The city runs its own electric, water, and wastewater utilities through Fort Collins Utilities, which shapes how service upgrades, new meters, and some energy requirements are handled on a project.',
    ],
    projects: [
      { title: 'Retail, restaurant, and office build-outs', body: 'Tenant finish in Old Town, along College Avenue, and in the commercial centers on Harmony Road and the east side.' },
      { title: 'Older-home remodels near Old Town and campus', body: 'Kitchens, baths, and additions on older homes, with the structural and systems updates those houses usually need.' },
      { title: 'Basements and additions in newer neighborhoods', body: 'Basement finishes and room additions in the south and southeast neighborhoods built over the last few decades.' },
      { title: 'Rental and investment property updates', body: 'Kitchen, bath, flooring, and paint updates on rentals between tenants, scheduled to keep vacancy short.' },
    ],
    conditions: [
      'Some neighborhoods sit on expansive clay, and much of the city is on the Poudre River and Spring Creek drainages, so grading and drainage get attention on every exterior job.',
      'Designated landmarks and properties in historic districts can need design review before exterior changes.',
      'Fort Collins Utilities provides electric and water service inside city limits, so service changes go through the city.',
    ],
    permits:
      'Building permits are issued by the City of Fort Collins. Designated landmarks and properties in historic districts can require an additional design review for exterior changes. We check for that before design work goes too far.',
    faqs: [
      { q: 'How far is Fort Collins from your office?', a: 'Our office is in Loveland, about 20 minutes south of Fort Collins on US 287 or I-25, so Fort Collins is part of our regular working area.' },
      { q: 'Does my older Fort Collins home need historic review to remodel?', a: 'Only if it is a designated landmark or in a historic district, and usually only for exterior changes. Interior remodels generally go through normal building permits. We check the property before design work starts.' },
      { q: 'Do you build out commercial space in Fort Collins?', a: 'Yes. Tenant finish for retail, restaurant, and office space is a regular part of our work in Fort Collins, from permit drawings through certificate of occupancy.' },
      { q: 'Can you add on to a house in Fort Collins?', a: 'Yes. We handle room additions and primary suites, including the structural engineering, permits, and tie-in to the existing house.' },
    ],
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'construction-management'],
      residential: ['kitchen-remodeling', 'home-additions', 'bathroom-remodeling', 'basement-finishing'],
    },
    nearby: ['loveland-co', 'timnath-co', 'wellington-co', 'windsor-co'],
  },
  {
    slug: 'greeley-co',
    name: 'Greeley',
    county: 'Weld County',
    description:
      'General contractor in Greeley and Weld County, CO: commercial and industrial construction, tenant finish, public works, remodeling, concrete, and garages.',
    lede: 'Commercial, industrial, and residential construction in Greeley and Weld County, east of Loveland on US 34.',
    local: [
      'Greeley is the Weld County seat and home to the University of Northern Colorado. The local economy leans on agriculture, food processing, energy, and the industrial and logistics businesses that support them, alongside a growing west side of newer homes and retail.',
      'For us that means industrial build-outs, shop and warehouse buildings, and tenant improvements on the commercial side, and remodels, concrete, and garages on the residential side.',
      'Weld County is one of the largest and fastest-growing counties in the state, and much of it is rural, so projects range from in-town storefronts to buildings on agricultural land well outside city limits.',
    ],
    projects: [
      { title: 'Industrial and shop buildings', body: 'Warehouses, shops, and pre-engineered metal buildings for agricultural, energy, and logistics businesses.' },
      { title: 'Tenant improvements', body: 'Retail, office, and medical build-outs in downtown Greeley and the commercial corridors on the west side.' },
      { title: 'Public works', body: 'Municipal, county, and school projects with prevailing wage and public procurement requirements.' },
      { title: 'Residential remodels and garages', body: 'Kitchens, baths, concrete, and detached garages, in town and on acreage.' },
    ],
    conditions: [
      'Wide-open plains mean higher wind exposure, which affects roofing, siding, doors, and fences.',
      'Rural Weld County properties often have agricultural or accessory building rules that differ from in-town lots.',
      'Public projects in Greeley and Weld County are bid through public procurement with prevailing wage requirements on many jobs.',
    ],
    permits:
      'Projects inside city limits are permitted through the City of Greeley. Evans, Garden City, and unincorporated Weld County each have their own requirements. Weld County covers a large rural area where agricultural and accessory building rules often apply.',
    faqs: [
      { q: 'Do you build shops and metal buildings in Weld County?', a: 'Yes. Pre-engineered metal buildings, shops, and warehouses are part of our industrial work, including steel erection, slabs, and site work.' },
      { q: 'Do you bid public projects in Greeley?', a: 'Yes. We respond to invitations to bid and requests for proposals from public agencies, and we handle prevailing wage and Davis-Bacon reporting.' },
      { q: 'Do you work in Evans and Garden City too?', a: 'Yes. We work across the Greeley area, including Evans, Garden City, Milliken, and unincorporated Weld County.' },
      { q: 'Who issues permits for a property outside Greeley city limits?', a: 'Unincorporated properties are permitted through Weld County. We confirm the jurisdiction for your address before we price the work.' },
    ],
    focus: {
      commercial: ['industrial-construction', 'steel-erection', 'government-public-works'],
      residential: ['garages-adus', 'concrete', 'kitchen-remodeling', 'exteriors'],
    },
    nearby: ['windsor-co', 'johnstown-co', 'loveland-co', 'timnath-co'],
  },
  {
    slug: 'longmont-co',
    name: 'Longmont',
    county: 'Boulder County',
    description:
      'General contractor in Longmont, CO: tenant finish, commercial construction, kitchen and bath remodels, basements, additions, and exterior work.',
    lede: 'Commercial construction and residential remodeling in Longmont, south of Loveland on US 287.',
    local: [
      'Longmont lies mostly in Boulder County, with its eastern edge in Weld County. It has a walkable historic Main Street, older neighborhoods near downtown, and a sizable base of technology and light industrial employers.',
      'Remodels in the older neighborhoods often mean opening floor plans and updating systems, while newer homes on the edges of town are candidates for basement finishes and outdoor living projects.',
      'The city runs its own electric utility and fiber network, and the St. Vrain River runs through town, which matters for drainage and floodplain questions on some properties.',
    ],
    projects: [
      { title: 'Main Street and commercial tenant finish', body: 'Retail, restaurant, and office build-outs downtown and along the main commercial corridors.' },
      { title: 'Light industrial space', body: 'Build-outs and improvements in flex, light manufacturing, and technology space.' },
      { title: 'Older-home remodels', body: 'Kitchens, baths, and opened floor plans in the established neighborhoods near downtown.' },
      { title: 'Basements and outdoor living', body: 'Basement finishes, decks, and patios in newer subdivisions on the edges of town.' },
    ],
    conditions: [
      'Properties near the St. Vrain River and its tributaries can fall in a mapped floodplain, which affects what can be built and how.',
      'Boulder County and Weld County have very different rules for unincorporated properties near Longmont.',
      'The city-owned electric utility handles service upgrades inside city limits.',
    ],
    permits:
      'Building permits are issued by the City of Longmont. Unincorporated properties nearby fall under Boulder County or Weld County depending on location, and the two counties have very different requirements. We confirm jurisdiction before pricing.',
    faqs: [
      { q: 'Do you work in Longmont from Loveland?', a: 'Yes. Longmont is about 25 minutes south of our Loveland office on US 287, and it is part of our regular working area.' },
      { q: 'My Longmont property is near the river. Does that change anything?', a: 'It can. Properties in a mapped floodplain may need a floodplain permit and specific construction methods. We check the flood maps for your address before design starts.' },
      { q: 'Do you take commercial projects in Longmont?', a: 'Yes. We build out retail, office, and light industrial space, and we can manage the project from pre-construction through closeout.' },
      { q: 'Do you finish basements in Longmont?', a: 'Yes. Basement finishing, with bedrooms, bathrooms, egress windows, and permits, is one of our most common residential projects.' },
    ],
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'industrial-construction'],
      residential: ['kitchen-remodeling', 'bathroom-remodeling', 'basement-finishing', 'decks-outdoor-living'],
    },
    nearby: ['berthoud-co', 'loveland-co', 'johnstown-co'],
  },
  {
    slug: 'windsor-co',
    name: 'Windsor',
    county: 'Weld and Larimer counties',
    description:
      'General contractor in Windsor, CO: basement finishing, decks and patio covers, kitchen remodels, new-home punch lists, and commercial construction.',
    lede: 'Basement finishes, outdoor living, remodeling, and commercial work in Windsor, northeast of Loveland.',
    local: [
      'Windsor straddles the Weld and Larimer county line between Loveland, Fort Collins, and Greeley. It has been one of the fastest-growing towns in the region, with large master-planned neighborhoods and a growing commercial base along the main corridors.',
      'A newer housing stock means many homes with unfinished basements, builder-grade finishes ready for an upgrade, and backyards waiting for a deck or patio cover.',
      'The town also has an older core around Main Street and Windsor Lake, where homes and storefronts are older and remodels involve more updating behind the walls.',
    ],
    projects: [
      { title: 'Basement finishes', body: 'Bedrooms, bathrooms, family rooms, and bars in the unfinished basements common in Windsor\'s newer neighborhoods.' },
      { title: 'Decks and patio covers', body: 'Composite decks, covered patios, and pergolas, with the drawings HOA design review asks for.' },
      { title: 'New-home upgrades and punch lists', body: 'Builder punch list items, warranty repairs, and upgrades to builder-grade finishes.' },
      { title: 'Commercial build-outs', body: 'Tenant finish for retail, office, and service businesses along Windsor\'s commercial corridors.' },
    ],
    conditions: [
      'Most neighborhoods have HOA design review for exterior work like decks, fences, and patio covers.',
      'Wind and hail exposure on the open plains east of the foothills affect deck, fence, and roofing choices.',
      'The town spans two counties, but the Town of Windsor handles permits inside town limits either way.',
    ],
    permits:
      'The Town of Windsor issues building permits inside town limits. Many Windsor neighborhoods also have homeowner associations with design review for exterior projects, and we provide the drawings and material details they ask for.',
    faqs: [
      { q: 'Will my HOA need to approve a deck in Windsor?', a: 'Most Windsor neighborhoods require HOA approval for decks, patio covers, and fences. We provide the drawings and material details the review committee asks for.' },
      { q: 'How long does a basement finish take?', a: 'It depends on size and scope, especially whether it includes a bathroom or bar. We give you a schedule with the written scope and price, and permits and inspections are built into it.' },
      { q: 'Do you fix builder punch list items in new Windsor homes?', a: 'Yes. We work through punch lists and warranty items for homeowners, and we take warranty work for builders too.' },
      { q: 'Does it matter which county my Windsor home is in?', a: 'Not for permits inside town limits, which the Town of Windsor issues. It can matter for properties outside town, which go through Weld or Larimer County.' },
    ],
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'design-build'],
      residential: ['basement-finishing', 'decks-outdoor-living', 'handyman-punch-list', 'kitchen-remodeling'],
    },
    nearby: ['timnath-co', 'greeley-co', 'fort-collins-co', 'loveland-co', 'johnstown-co'],
  },
  {
    slug: 'berthoud-co',
    name: 'Berthoud',
    county: 'Larimer and Weld counties',
    description:
      'General contractor in Berthoud, CO: home additions, remodels, basement finishing, garages and shops, decks, concrete, and commercial construction.',
    lede: 'Remodeling, additions, shops, and commercial construction in Berthoud, just south of Loveland on US 287.',
    local: [
      'Berthoud is a small town between Loveland and Longmont with a historic core, new neighborhoods on its edges, and a lot of rural acreage in every direction.',
      'Work here ranges from remodels and additions on older in-town homes to detached shops, barns, and garages on larger lots outside town.',
      'Berthoud is a few minutes from our Loveland office, so it is one of the easiest places for us to work, from the first walkthrough to the last inspection.',
    ],
    projects: [
      { title: 'Shops, barns, and garages', body: 'Detached garages, workshops, and pole barns on acreage, including slabs, framing or steel, and electrical.' },
      { title: 'Additions to in-town homes', body: 'Room additions and primary suites on older homes in the historic core.' },
      { title: 'Basements in new neighborhoods', body: 'Basement finishes in the newer subdivisions around the edges of town.' },
      { title: 'Small commercial and municipal work', body: 'Tenant finish and building improvements for local businesses and public agencies.' },
    ],
    conditions: [
      'Acreage properties often need a site plan, setbacks, and accessory building approval before a shop or barn goes up.',
      'Water, septic, and access questions come up on rural lots and are worth answering before design.',
      'Expansive soils and freeze-thaw cycles make base preparation and drainage important on slabs and foundations.',
    ],
    permits:
      'The Town of Berthoud issues permits inside town limits. Acreage properties outside town are usually in unincorporated Larimer or Weld County, where rules for shops, barns, and accessory buildings differ. We sort out which jurisdiction applies first.',
    faqs: [
      { q: 'Can you build a shop or barn on my Berthoud acreage?', a: 'Yes. We build detached shops, garages, and pole barns, including the slab, structure, and electrical. We check county setbacks and accessory building rules for your parcel first.' },
      { q: 'Who issues permits for a property outside Berthoud town limits?', a: 'Usually Larimer County or Weld County, depending on which side of the county line the parcel sits. We confirm that before design.' },
      { q: 'Do you add on to older homes in Berthoud?', a: 'Yes. We handle room additions and primary suites, including structural engineering, permits, and matching the existing house.' },
      { q: 'How close are you to Berthoud?', a: 'Our office is in Loveland, a few minutes north on US 287.' },
    ],
    focus: {
      commercial: ['general-contracting', 'steel-erection', 'tenant-finish'],
      residential: ['garages-adus', 'home-additions', 'basement-finishing', 'concrete'],
    },
    nearby: ['loveland-co', 'longmont-co', 'johnstown-co'],
  },
  {
    slug: 'johnstown-co',
    name: 'Johnstown',
    county: 'Weld and Larimer counties',
    description:
      'General contractor in Johnstown and Milliken, CO: basement finishing, decks, new-home upgrades, tenant finish, and commercial and industrial construction.',
    lede: 'Residential upgrades and commercial construction in Johnstown and Milliken, southeast of Loveland along I-25 and US 34.',
    local: [
      'Johnstown spans Weld and Larimer counties and has grown quickly along the I-25 corridor, with major retail and commercial development near the US 34 interchange and new subdivisions spreading from the original downtown. Neighboring Milliken shares much of the same growth.',
      'New commercial space means tenant finish work. New homes mean basement finishes, decks, fences, and the punch list items builders leave behind.',
      'The interchange area has also drawn industrial and logistics development, which brings warehouse build-outs and site work along with it.',
    ],
    projects: [
      { title: 'Retail and restaurant tenant finish', body: 'Build-outs in the retail centers near the I-25 and US 34 interchange.' },
      { title: 'Industrial and warehouse space', body: 'Warehouse and light industrial build-outs along the I-25 corridor.' },
      { title: 'Basements, decks, and fences', body: 'Finishing basements and building outdoor space in new Johnstown and Milliken neighborhoods.' },
      { title: 'New-home punch lists', body: 'Builder punch list and warranty items for new homeowners.' },
    ],
    conditions: [
      'Johnstown and Milliken each issue their own permits, so the address decides which town reviews the work.',
      'Many newer neighborhoods have HOA design review for exterior projects.',
      'Open plains exposure means wind and hail are design factors for roofs, decks, and fences.',
    ],
    permits:
      'The Town of Johnstown and the Town of Milliken each issue their own building permits. We handle the submittal and inspections for whichever jurisdiction your project is in.',
    faqs: [
      { q: 'Do you work in Milliken as well as Johnstown?', a: 'Yes. We work in both towns and in the surrounding parts of Weld and Larimer counties.' },
      { q: 'Do you build out commercial space near the I-25 and US 34 interchange?', a: 'Yes. Retail, restaurant, office, and warehouse tenant finish are a regular part of our commercial work.' },
      { q: 'Can you finish the basement in my new Johnstown home?', a: 'Yes. We finish basements with bedrooms, bathrooms, and egress, and we pull the permit and schedule the inspections.' },
      { q: 'Do I need HOA approval for a fence or deck?', a: 'In most newer Johnstown and Milliken neighborhoods, yes. We supply the drawings and material details for the review.' },
    ],
    focus: {
      commercial: ['tenant-finish', 'industrial-construction', 'general-contracting'],
      residential: ['basement-finishing', 'decks-outdoor-living', 'handyman-punch-list', 'flooring'],
    },
    nearby: ['loveland-co', 'windsor-co', 'greeley-co', 'berthoud-co'],
  },
  {
    slug: 'timnath-co',
    name: 'Timnath',
    county: 'Larimer County',
    description:
      'General contractor in Timnath, CO: basement finishing, decks and covered patios, custom built-ins, new-home upgrades, and commercial tenant finish.',
    lede: 'Basement finishes, outdoor living, and new-home upgrades in Timnath, east of Fort Collins across I-25.',
    local: [
      'Timnath has grown from a small farm town into one of the fastest-growing communities in Larimer County. Most of its homes have been built in recent years, in neighborhoods east of I-25 near Harmony Road.',
      'That makes it a town of unfinished basements and blank backyards. The most common projects are basement finishes, decks and covered patios, built-ins, and upgrades to builder-grade finishes.',
      'Commercial development along Harmony Road near I-25 adds retail and service tenant finish to the mix.',
    ],
    projects: [
      { title: 'Basement finishes', body: 'Family rooms, bedrooms, bathrooms, and bars in new-construction basements.' },
      { title: 'Decks and covered patios', body: 'Composite decks, covered patios, and pergolas built to HOA standards.' },
      { title: 'Built-ins and trim upgrades', body: 'Custom built-ins, mudroom benches, and trim and paint upgrades to builder-grade finishes.' },
      { title: 'Commercial tenant finish', body: 'Build-outs for retail and service businesses near Harmony Road and I-25.' },
    ],
    conditions: [
      'Nearly every neighborhood has an HOA with design review for exterior projects.',
      'New homes often have builder warranty coverage, so we look at what is still covered before starting work on those items.',
      'Expansive soils mean basement walls are framed to float over the slab.',
    ],
    permits:
      'Building permits are issued by the Town of Timnath. Nearly every neighborhood has a homeowner association with design review for exterior work, and we prepare what the review committee needs.',
    faqs: [
      { q: 'Can you finish my new Timnath basement?', a: 'Yes. Basement finishing is the most common project we do in Timnath. We handle the design, permit, framing, systems, and finishes.' },
      { q: 'Will my HOA need to approve a covered patio?', a: 'Almost certainly. We prepare the drawings and material information the review committee asks for.' },
      { q: 'Should I wait until my builder warranty ends to remodel?', a: 'Not necessarily. Some work can affect warranty coverage, so we review what is still covered before we touch those parts of the house.' },
      { q: 'Do you do commercial work in Timnath?', a: 'Yes. We build out retail and service space and take on other commercial projects in and around Timnath.' },
    ],
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'design-build'],
      residential: ['basement-finishing', 'decks-outdoor-living', 'painting-drywall-trim', 'handyman-punch-list'],
    },
    nearby: ['fort-collins-co', 'windsor-co', 'wellington-co'],
  },
  {
    slug: 'wellington-co',
    name: 'Wellington',
    county: 'Larimer County',
    description:
      'General contractor in Wellington, CO: basement finishing, decks, fences, garages and shops, concrete, remodeling, and commercial construction.',
    lede: 'Remodeling, basements, shops, and commercial work in Wellington, north of Fort Collins on I-25.',
    local: [
      'Wellington is the northernmost town in the Fort Collins area, with a small historic downtown, a large share of homes built since 2000, and open country beyond the town limits.',
      'It is also windy. Fences, decks, roofing, and siding all take more punishment here than they do farther south, and they need to be built with that in mind.',
      'Rural properties around Wellington bring shop, barn, and garage projects, while in-town neighborhoods bring basement finishes and outdoor living work.',
    ],
    projects: [
      { title: 'Wind-ready fences and decks', body: 'Fence posts, footings, and deck framing sized and fastened for Wellington\'s wind.' },
      { title: 'Basement finishes', body: 'Finished basements in the town\'s newer neighborhoods.' },
      { title: 'Shops and garages on acreage', body: 'Detached garages, shops, and pole barns on rural parcels outside town.' },
      { title: 'Roofing and siding', body: 'Roof replacement and siding with wind and hail ratings suited to the area.' },
    ],
    conditions: [
      'Strong, frequent wind is a design factor for fences, decks, roofs, siding, and doors.',
      'Rural parcels outside town are in unincorporated Larimer County with their own setback and accessory building rules.',
      'Hail exposure makes impact-rated roofing worth considering.',
    ],
    permits:
      'The Town of Wellington issues permits inside town limits, and surrounding rural properties are in unincorporated Larimer County. We confirm jurisdiction and handle the paperwork.',
    faqs: [
      { q: 'How do you build fences that hold up to Wellington wind?', a: 'Deeper, properly spaced posts set in concrete, heavier rails, and fasteners and panel styles that let wind through. We size it to the exposure on your lot.' },
      { q: 'Do you build shops and garages near Wellington?', a: 'Yes, in town and on acreage. Rural parcels go through Larimer County, and we check setbacks and accessory building rules first.' },
      { q: 'Do you finish basements in Wellington?', a: 'Yes. We handle design, permits, framing, systems, and finishes.' },
      { q: 'Is Wellington inside your service area?', a: 'Yes. We work throughout northern Larimer County, including Wellington and the rural areas around it.' },
    ],
    focus: {
      commercial: ['general-contracting', 'steel-erection', 'tenant-finish'],
      residential: ['basement-finishing', 'decks-outdoor-living', 'garages-adus', 'exteriors'],
    },
    nearby: ['fort-collins-co', 'timnath-co', 'windsor-co'],
  },
  {
    slug: 'estes-park-co',
    name: 'Estes Park',
    county: 'Larimer County',
    description:
      'General contractor in Estes Park, CO: remodeling, additions, decks, roofing and exteriors, and commercial construction built for mountain conditions.',
    lede: 'Remodeling, decks, exteriors, and commercial construction in Estes Park, west of Loveland up US 34.',
    local: [
      'Estes Park sits at about 7,500 feet at the eastern entrance to Rocky Mountain National Park, reached from Loveland through the Big Thompson Canyon. Its buildings include older cabins, vacation homes, lodging properties, and the shops and restaurants that serve visitors.',
      'Mountain construction is its own discipline. Snow and wind loads are higher than on the plains, the exterior building season is shorter, sites are often steep and rocky, and wildfire exposure shapes choices about roofing, siding, and decking.',
      'Tourism drives the town\'s economy, so lodging and retail projects are often scheduled around the busy summer season.',
    ],
    projects: [
      { title: 'Cabin and vacation home remodels', body: 'Kitchens, baths, and updates to older cabins and second homes.' },
      { title: 'Decks and exteriors', body: 'Deck replacement, roofing, and siding with fire-resistant and snow-ready materials.' },
      { title: 'Lodging and retail improvements', body: 'Renovations to lodging, shops, and restaurants, scheduled around peak season.' },
      { title: 'Additions on sloped sites', body: 'Additions that work with steep, rocky lots and mountain structural loads.' },
    ],
    conditions: [
      'Snow and wind loads are higher than on the plains, so framing, roofs, and decks are engineered for local values.',
      'Much of the valley is in the wildland-urban interface, which shapes roofing, siding, vent, and decking choices.',
      'The exterior building season is shorter, so exterior work and foundations are scheduled for the warmer months.',
    ],
    permits:
      'Permits are issued by the Town of Estes Park inside town limits and by Larimer County in the surrounding valley. Structural design has to reflect local snow and wind loads, and we coordinate the engineering that goes with it.',
    faqs: [
      { q: 'Do you work in Estes Park from Loveland?', a: 'Yes. Estes Park is about 45 minutes up US 34 from our Loveland office, and we schedule mountain work to make the most of each trip.' },
      { q: 'When is the best time for exterior work in Estes Park?', a: 'Late spring through fall. Interior work can run year-round, but foundations, roofing, and decks are best scheduled for the snow-free months.' },
      { q: 'Do you use fire-resistant materials?', a: 'Where the site calls for it. Class A roofing, ignition-resistant siding, ember-resistant vents, and noncombustible decking near the house are common choices in the wildland-urban interface.' },
      { q: 'Can you work around my lodging business\'s busy season?', a: 'Yes. We plan commercial work in Estes Park around peak season and phase it so the property can stay open when possible.' },
    ],
    focus: {
      commercial: ['general-contracting', 'tenant-finish', 'construction-management'],
      residential: ['decks-outdoor-living', 'exteriors', 'home-additions', 'kitchen-remodeling'],
    },
    nearby: ['loveland-co', 'berthoud-co', 'winter-park-co'],
  },
  {
    slug: 'vail-co',
    name: 'Vail',
    region: 'mountain',
    county: 'Eagle County',
    description:
      'General contractor in Vail, CO: condo and home remodels, kitchens and baths, decks, exteriors, tenant finish, and commercial work built for mountain conditions.',
    lede: 'Remodeling, exteriors, tenant finish, and commercial construction in Vail, along I-70 in the Gore Creek valley.',
    local: [
      'Vail sits at about 8,150 feet in the Gore Creek valley of Eagle County, strung along I-70 below Vail Pass. The town grew up around the ski resort that opened in the 1960s, so much of its building stock is condominiums, lodges, and homes from the first few decades of the resort, along with the shops and restaurants of Vail Village and Lionshead.',
      'That makes renovation the core of the work here: updating older condos and homes, replacing worn exteriors, and building out commercial space. Snow loads are heavy, the exterior season is short, sites are tight, and staging and deliveries have to be planned around a busy resort.',
      'Many owners are not full-time residents, so clear scheduling, photo updates, and a single point of contact matter as much as the work itself.',
    ],
    projects: [
      { title: 'Condo remodels', body: 'Kitchens, baths, flooring, and full interior renovations in Vail Village, Lionshead, and the residential neighborhoods along the valley.' },
      { title: 'Exterior replacements', body: 'Siding, decks, windows, and roofing on homes and buildings from the resort\'s early decades.' },
      { title: 'Commercial tenant finish', body: 'Retail and restaurant build-outs in the villages, scheduled around the ski and summer seasons.' },
      { title: 'Second-home updates', body: 'Remodels managed for owners who are not on site, with regular progress updates.' },
    ],
    conditions: [
      'Heavy snow loads and snow shedding drive roof, deck, and entry design.',
      'Exterior changes typically go through the town\'s design review before a permit is issued.',
      'Staging, parking, and deliveries are tight in the villages and have to be planned around resort operations.',
    ],
    permits:
      'Building permits are issued by the Town of Vail, and exterior changes typically go through the town design review process before a permit is issued. Condominium projects usually need association approval as well. We line those up before the schedule is set.',
    faqs: [
      { q: 'Is Standard Building Company based in Vail?', a: 'No. We are based in Loveland and take projects in Vail and the rest of the I-70 mountain corridor, with one project lead responsible for each job.' },
      { q: 'Can you remodel my Vail condo while I am away?', a: 'Yes. We coordinate with your association and property manager, keep you updated with photos and schedule notes, and handle access and deliveries.' },
      { q: 'Do exterior changes in Vail need design review?', a: 'Typically, yes. Exterior changes usually go through the Town of Vail design review before a building permit is issued, so we build that time into the schedule.' },
      { q: 'When can construction happen in Vail?', a: 'Interior work can run most of the year, though some buildings and associations limit noisy work during peak seasons. Exterior work is scheduled for the snow-free months.' },
    ],
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'construction-management'],
      residential: ['kitchen-remodeling', 'bathroom-remodeling', 'exteriors', 'decks-outdoor-living'],
    },
    nearby: ['avon-co', 'copper-mountain-co', 'aspen-co'],
  },
  {
    slug: 'avon-co',
    name: 'Avon',
    region: 'mountain',
    county: 'Eagle County',
    description:
      'General contractor in Avon, CO: home and condo remodels, additions, decks, exteriors, tenant finish, and commercial construction in the Eagle River valley.',
    lede: 'Remodeling, additions, tenant finish, and commercial construction in Avon, on I-70 at the base of Beaver Creek.',
    local: [
      'Avon sits at about 7,400 feet on the Eagle River in Eagle County, a few miles west of Vail on I-70 and at the foot of Beaver Creek Resort. The valley floor holds the town core, with condominiums, lodging, retail, and offices, and neighborhoods climb the hillsides above it.',
      'Work here covers both sides of what we do: tenant finish and commercial construction in the town core, and remodels, additions, decks, and exterior replacements on homes and condos. Hillside lots bring steep access, engineered foundations, and wildfire exposure that shapes roofing, siding, and decking choices.',
      'Avon is also home to many of the people who work in the valley year-round, which means primary residences as well as second homes.',
    ],
    projects: [
      { title: 'Town core tenant finish', body: 'Retail, restaurant, and office build-outs in Avon\'s commercial center.' },
      { title: 'Hillside home remodels and additions', body: 'Remodels and additions on sloped lots, with the engineering steep sites require.' },
      { title: 'Condo renovations', body: 'Interior remodels in condominium buildings, coordinated with associations and property managers.' },
      { title: 'Decks and exteriors', body: 'Deck, siding, and roofing replacement with snow-ready and fire-resistant materials.' },
    ],
    conditions: [
      'Hillside lots mean steep access, engineered foundations, and careful staging.',
      'Wildfire exposure on the slopes above town shapes material choices for roofs, siding, and decks.',
      'Heavy snow and a short exterior season put exterior work in the summer and fall.',
    ],
    permits:
      'The Town of Avon issues building permits inside town limits and has its own design review for exterior work. Beaver Creek, Edwards, and the other unincorporated parts of the valley are permitted through Eagle County. We confirm which applies to your address before pricing.',
    faqs: [
      { q: 'Do you work in Beaver Creek and Edwards too?', a: 'Yes. Those areas are unincorporated Eagle County, and permits go through the county rather than the Town of Avon. We confirm jurisdiction before pricing.' },
      { q: 'Can you build an addition on a steep Avon lot?', a: 'Yes. Steep lots need engineered foundations and careful staging, and we coordinate the structural engineering and design review.' },
      { q: 'Do you handle condo association approvals?', a: 'Yes. We prepare the scope, schedule, and insurance documents associations usually ask for, and we work within building rules on hours and access.' },
      { q: 'Where are you based?', a: 'Our office is in Loveland. We take projects in Avon and across the Eagle River valley with one project lead responsible for each job.' },
    ],
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'design-build'],
      residential: ['kitchen-remodeling', 'home-additions', 'decks-outdoor-living', 'exteriors'],
    },
    nearby: ['vail-co', 'copper-mountain-co', 'aspen-co'],
  },
  {
    slug: 'aspen-co',
    name: 'Aspen',
    region: 'mountain',
    county: 'Pitkin County',
    description:
      'General contractor in Aspen, CO: design-build, home remodels and additions, kitchens and baths, exteriors, tenant finish, and commercial construction.',
    lede: 'Design-build, remodeling, additions, and commercial construction in Aspen, at the head of the Roaring Fork Valley.',
    local: [
      'Aspen is the Pitkin County seat, at about 7,900 feet at the upper end of the Roaring Fork Valley on Highway 82. It began as a silver mining town in the 1880s, and its core still holds Victorian-era homes and commercial buildings alongside lodges, condominiums, and newer homes.',
      'Projects here tend to be detailed and closely reviewed. Older buildings need structural and systems work behind the finishes, lots are tight, and the building season for exterior work is short. Planning, drawings, and procurement carry more weight than they do on the plains.',
      'High finish expectations and long lead times on materials make pre-construction planning, accurate budgets, and early ordering a large part of a successful Aspen project.',
    ],
    projects: [
      { title: 'Design-build residential projects', body: 'Remodels and additions delivered under one contract, from design through construction.' },
      { title: 'Historic building updates', body: 'Structural and systems updates behind the finishes of older buildings, with historic review where it applies.' },
      { title: 'Kitchens and baths', body: 'High-finish kitchen and bath remodels in homes and condominiums.' },
      { title: 'Commercial tenant finish', body: 'Retail and restaurant build-outs in the downtown core.' },
    ],
    conditions: [
      'Properties in historic districts or with landmark status get historic preservation review.',
      'The city and county have energy requirements that go beyond the base building code.',
      'Tight lots, limited staging, and a short exterior season make logistics and scheduling central to the job.',
    ],
    permits:
      'Permits inside city limits go through the City of Aspen, and properties in historic districts or with landmark status get historic preservation review. Surrounding properties fall under Pitkin County. Both have energy requirements that go beyond the base building code, so we account for them during design.',
    faqs: [
      { q: 'Do you offer design-build in Aspen?', a: 'Yes. We can carry a project from design through construction under one contract, working with architects and engineers suited to the project.' },
      { q: 'Does my Aspen property need historic review?', a: 'If it is a designated landmark or in a historic district, exterior changes and some interior work can require historic preservation review. We check that before design goes far.' },
      { q: 'Are Aspen\'s energy requirements different?', a: 'Yes. The City of Aspen and Pitkin County have energy requirements beyond the base code, which affect insulation, mechanical systems, and sometimes renewable energy. We account for them during design and pricing.' },
      { q: 'Is Standard Building Company local to Aspen?', a: 'No. We are based in Loveland and take projects in Aspen and the Roaring Fork Valley, with one project lead responsible for each job.' },
    ],
    focus: {
      commercial: ['design-build', 'tenant-finish', 'construction-management'],
      residential: ['home-additions', 'kitchen-remodeling', 'bathroom-remodeling', 'exteriors'],
    },
    nearby: ['avon-co', 'vail-co', 'steamboat-springs-co'],
  },
  {
    slug: 'winter-park-co',
    name: 'Winter Park',
    region: 'mountain',
    county: 'Grand County',
    description:
      'General contractor in Winter Park and the Fraser Valley, CO: cabin and condo remodels, additions, decks, garages, exteriors, and commercial construction.',
    lede: 'Remodeling, additions, decks, and commercial construction in Winter Park and the Fraser Valley, over Berthoud Pass on US 40.',
    local: [
      'Winter Park sits at about 9,000 feet in the Fraser Valley of Grand County, on US 40 on the west side of Berthoud Pass. Its buildings are a mix of cabins, vacation homes, condominiums, and lodging, with shops and restaurants along the highway through town.',
      'The valley is known for deep snow and long, cold winters. Roofs, decks, and entries have to be designed for heavy snow loads and for where that snow slides and piles up, and exterior work has to fit into a short summer season.',
      'Winter Park is the closest of the major ski towns to the Front Range, which makes it one of the more practical mountain locations for us to staff and supply.',
    ],
    projects: [
      { title: 'Cabin and condo remodels', body: 'Kitchens, baths, and interior updates in cabins, vacation homes, and condominiums.' },
      { title: 'Snow-ready decks and entries', body: 'Decks, covered entries, and roof details designed for heavy snow and snow shedding.' },
      { title: 'Additions and garages', body: 'Room additions and detached garages on valley and hillside lots.' },
      { title: 'Commercial improvements', body: 'Build-outs and renovations for shops, restaurants, and lodging along US 40.' },
    ],
    conditions: [
      'Deep snow and long winters drive structural design for roofs, decks, and entries.',
      'Cold temperatures make insulation, air sealing, and freeze protection for plumbing especially important.',
      'The short summer season means exterior work has to be planned and ordered early.',
    ],
    permits:
      'Projects inside town limits are permitted through the Town of Winter Park. Fraser and unincorporated Grand County have their own requirements. Structural design has to reflect local snow loads, and we coordinate the engineering that goes with it.',
    faqs: [
      { q: 'Do you work in Fraser and Granby too?', a: 'Yes. We take projects across the Fraser Valley and Grand County, and we confirm which jurisdiction issues permits for your address.' },
      { q: 'How do you design decks for Winter Park snow?', a: 'Framing, footings, and connections are engineered for local snow loads, and we plan where roof snow will shed so decks and entries are not buried or damaged.' },
      { q: 'When should I plan exterior work?', a: 'Plan in winter and spring so materials are ordered and permits are in hand for the summer building season.' },
      { q: 'Where is Standard Building Company based?', a: 'In Loveland. Winter Park is one of the closest ski towns to the Front Range, and we take projects there with one project lead responsible for each job.' },
    ],
    focus: {
      commercial: ['general-contracting', 'tenant-finish', 'design-build'],
      residential: ['decks-outdoor-living', 'home-additions', 'exteriors', 'garages-adus'],
    },
    nearby: ['estes-park-co', 'copper-mountain-co', 'steamboat-springs-co'],
  },
  {
    slug: 'copper-mountain-co',
    name: 'Copper Mountain',
    region: 'mountain',
    county: 'Summit County',
    description:
      'General contractor at Copper Mountain, CO: condo remodels, kitchens and baths, flooring, exteriors, tenant finish, and commercial construction in Summit County.',
    lede: 'Condo remodeling, tenant finish, and commercial construction at Copper Mountain, on I-70 in Summit County.',
    local: [
      'Copper Mountain is a resort community in Summit County, at about 9,700 feet where Highway 91 meets I-70 between Frisco and Vail Pass. Most of its buildings are condominiums, lodging, and the commercial space that serves the resort villages.',
      'Much of the work is interior: condo remodels, kitchens, bathrooms, flooring, and commercial tenant finish. Working inside occupied buildings means coordinating with property managers, protecting common areas, and scheduling noisy work and deliveries around guests.',
      'Many units are short-term rentals, so remodels are often scheduled into the gaps between peak seasons to keep units earning.',
    ],
    projects: [
      { title: 'Condo remodels', body: 'Kitchens, baths, flooring, and full interior updates in resort condominiums.' },
      { title: 'Rental unit refreshes', body: 'Fast, scheduled updates between seasons so units return to the rental pool on time.' },
      { title: 'Commercial tenant finish', body: 'Build-outs for retail, dining, and services in the resort villages.' },
      { title: 'Building exterior work', body: 'Siding, decks, and roofing repairs coordinated with associations.' },
    ],
    conditions: [
      'At about 9,700 feet, snow, cold, and a short summer season shape every exterior project.',
      'Work inside occupied buildings has to respect association rules on hours, noise, elevators, and common areas.',
      'Material deliveries and parking are limited in the resort villages and need to be planned.',
    ],
    permits:
      'Copper Mountain is unincorporated, so building permits go through Summit County. Most projects also need approval from the building owners association before work starts. We handle the submittals for both.',
    faqs: [
      { q: 'Who issues building permits at Copper Mountain?', a: 'Summit County, because Copper Mountain is unincorporated. Most condo projects also need association approval, and we handle both.' },
      { q: 'Can you remodel my rental condo between seasons?', a: 'Yes. We plan the scope, order materials early, and schedule the work into the off-season so the unit is back in the rental pool on time.' },
      { q: 'Do you work in Frisco and the rest of Summit County?', a: 'We take projects across Summit County. Tell us the address and we will confirm the jurisdiction and scope.' },
      { q: 'Where are you based?', a: 'In Loveland. We take projects at Copper Mountain and along the I-70 corridor with one project lead responsible for each job.' },
    ],
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'construction-management'],
      residential: ['kitchen-remodeling', 'bathroom-remodeling', 'flooring', 'exteriors'],
    },
    nearby: ['vail-co', 'avon-co', 'winter-park-co'],
  },
  {
    slug: 'steamboat-springs-co',
    name: 'Steamboat Springs',
    region: 'mountain',
    county: 'Routt County',
    description:
      'General contractor in Steamboat Springs, CO: home and condo remodels, additions, decks, garages and shops, exteriors, and commercial construction.',
    lede: 'Remodeling, additions, shops, and commercial construction in Steamboat Springs, in the Yampa Valley on US 40.',
    local: [
      'Steamboat Springs is the Routt County seat, at about 6,700 feet in the Yampa Valley on US 40, west of Rabbit Ears Pass. It is a working town as much as a resort: a historic downtown along Lincoln Avenue, condominiums and lodging at the base of the ski area, neighborhoods in between, and ranch land running out in every direction.',
      'That range shows up in the work. Downtown storefronts and offices need tenant finish, base-area condos need remodeling, in-town homes get additions and exterior replacements, and rural properties need shops, barns, and garages. Snowfall is heavy, so roofs, decks, and entries have to be designed for the load and for where the snow sheds.',
      'Because so many residents live here year-round, projects include primary homes and local businesses as well as second homes and rentals.',
    ],
    projects: [
      { title: 'Downtown tenant finish', body: 'Retail, restaurant, and office build-outs along Lincoln Avenue and in the downtown core.' },
      { title: 'Base-area condo remodels', body: 'Kitchens, baths, and interior renovations in condominiums near the ski area.' },
      { title: 'Ranch shops, barns, and garages', body: 'Detached shops, barns, and garages on rural Routt County properties.' },
      { title: 'Additions and exteriors', body: 'Room additions, decks, roofing, and siding on in-town homes.' },
    ],
    conditions: [
      'Heavy snowfall drives the design of roofs, decks, and entries, including where snow sheds.',
      'Rural parcels bring well, septic, and access questions worth settling before design.',
      'Exterior work and foundations are scheduled for the snow-free months.',
    ],
    permits:
      'Building permits for Steamboat Springs and the rest of Routt County are issued by the Routt County Regional Building Department, with planning review handled by the city inside city limits and by the county outside them. We confirm what your address needs and handle the submittal.',
    faqs: [
      { q: 'Who issues building permits in Steamboat Springs?', a: 'The Routt County Regional Building Department issues building permits for the city and the county, with planning review by the city inside city limits and by the county outside them.' },
      { q: 'Can you build a shop or barn on my Routt County ranch?', a: 'Yes. We build shops, barns, and garages on rural property, and we check county planning requirements, access, and utilities first.' },
      { q: 'Do you remodel condos near the ski area?', a: 'Yes. We coordinate with associations and property managers and schedule work around building rules and peak seasons.' },
      { q: 'Where is Standard Building Company based?', a: 'In Loveland. We take projects in Steamboat Springs and the Yampa Valley with one project lead responsible for each job.' },
    ],
    focus: {
      commercial: ['tenant-finish', 'general-contracting', 'design-build'],
      residential: ['home-additions', 'kitchen-remodeling', 'decks-outdoor-living', 'garages-adus'],
    },
    nearby: ['winter-park-co', 'aspen-co', 'vail-co'],
  },
];
