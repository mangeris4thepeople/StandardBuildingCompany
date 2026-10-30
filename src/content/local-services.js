// Town-specific service pages. Each entry becomes /<service>/<area>/.
// These own the "<service> <town>" searches, so the general service pages target Northern Colorado.
// Local notes are limited to stable, verifiable facts: housing stock, utilities, and who issues permits.
// Nothing here claims a specific past project.
export const LOCAL_SERVICES = [
  {
    service: 'kitchen-remodeling',
    area: 'loveland-co',
    title: 'Kitchen Remodeling in Loveland, CO | Standard Building',
    description:
      'Kitchen remodeling in Loveland, CO: opened-up layouts, cabinets, countertops, islands, and lighting. Designed, permitted, and built by a Loveland contractor.',
    h1: 'Kitchen Remodeling in Loveland, CO',
    lede: 'From opening up a mid-century galley kitchen near Lake Loveland to upgrading a builder-grade kitchen on the east side, designed, permitted, and built by a contractor based on East 3rd Street.',
    sections: [
      {
        heading: 'Loveland kitchens, neighborhood by neighborhood',
        body: [
          'Many homes around Lake Loveland and in the older neighborhoods near downtown were built from the 1950s through the 1970s with closed-off galley or L-shaped kitchens. Most owners want the wall between the kitchen and the dining or living room gone. That means confirming whether the wall is load-bearing, sizing a beam if it is, and rerouting whatever plumbing, ductwork, or wiring runs through it before anything is cut.',
          'Homes in the newer subdivisions on the east side near I-25 usually have an open kitchen already. There the work tends to be cabinets, countertops, an island, lighting, and appliances, with fewer surprises behind the drywall and a shorter schedule.',
        ],
      },
      {
        heading: 'Utilities and permits in Loveland',
        body: [
          'Inside city limits, kitchen work that moves plumbing, relocates a gas line, adds circuits, or changes walls is permitted through the City of Loveland building department. Homes in unincorporated Larimer County around the city go through the county instead. We confirm which applies to your address and prepare the submittal.',
          'Loveland Water and Power is the city-owned electric utility. If an induction range, a second oven, or new circuits push the house past its existing electrical service, the service upgrade is coordinated with the city, and we build that lead time into the schedule rather than discovering it during rough-in.',
        ],
      },
      {
        heading: 'How a Loveland kitchen remodel runs',
        body: [
          'We start with a walkthrough at the house, measure, and flag anything that affects cost before design begins. Our design side draws the plan, we price it as it is drawn, and you get a written scope and price before demolition. During construction we seal off the work area, keep a path through the house, and help you set up a temporary kitchen.',
          'Countertops are templated after the cabinets are installed, so there is a short gap between cabinets and finished counters. We schedule around it so the rest of the work keeps moving.',
        ],
      },
    ],
    faqs: [
      { q: 'Can you remove the wall between my kitchen and living room?', a: 'Usually, yes. If the wall is load-bearing we have a beam sized and the opening engineered, and we reroute any plumbing, ductwork, or wiring inside the wall. We confirm all of that before pricing.' },
      { q: 'Do I need a permit to replace kitchen cabinets and countertops in Loveland?', a: 'A like-for-like cabinet and countertop replacement generally does not. Moving plumbing or gas, adding electrical circuits, or changing walls generally does. We check the scope against City of Loveland or Larimer County requirements before work starts.' },
      { q: 'How long does a kitchen remodel take?', a: 'A cabinet, countertop, and finish update usually takes several weeks of construction. A layout change with wall removal takes longer. Design, selections, and permitting come before that, and we give you a schedule with the written price.' },
    ],
  },
  {
    service: 'kitchen-remodeling',
    area: 'fort-collins-co',
    title: 'Kitchen Remodeling in Fort Collins, CO | Standard Building',
    description:
      'Kitchen remodeling in Fort Collins, CO for older Old Town homes, newer neighborhoods, and rentals. Layout changes, cabinets, counters, and permits handled.',
    h1: 'Kitchen Remodeling in Fort Collins, CO',
    lede: 'Kitchen remodels in Fort Collins, from small original kitchens near Old Town and campus to finish upgrades in the newer south-side neighborhoods, from a design-build contractor twenty minutes south in Loveland.',
    sections: [
      {
        heading: 'Older Fort Collins kitchens',
        body: [
          'Homes near Old Town and Colorado State University often have small original kitchens and the systems that came with them. Opening walls in these houses regularly turns up older wiring, galvanized supply lines, or undersized drains that should be replaced while the walls are open. We plan for that in the scope and carry a clear allowance for it, so it is a known line item rather than a mid-project surprise.',
          'Historic review in Fort Collins applies to designated landmarks and properties in historic districts, and it is mostly about exterior changes. An interior kitchen remodel usually goes through the normal building permit, but adding or enlarging a window or door changes the exterior, so we check the property before design work goes too far.',
        ],
      },
      {
        heading: 'Newer neighborhoods and rentals',
        body: [
          'In the south and southeast neighborhoods built over the last few decades, most kitchens already have a workable layout. The common projects are new cabinets and countertops, an island, better lighting, and upgraded appliances.',
          'For rental owners near campus, the goal is a kitchen that survives tenants and turns over fast. We plan durable cabinet and countertop choices and schedule the work around your lease dates so the unit is back on the market quickly.',
        ],
      },
      {
        heading: 'Permits and utilities in Fort Collins',
        body: [
          'Building permits are issued by the City of Fort Collins. Fort Collins Utilities provides electric service inside city limits, so if a remodel needs an electrical service upgrade, it is coordinated with the city utility. We handle the permit submittal and schedule inspections as the work reaches each stage.',
        ],
      },
    ],
    faqs: [
      { q: 'Do you work in Fort Collins regularly?', a: 'Yes. Our office is in Loveland, about twenty minutes south on US 287 or I-25, and Fort Collins is part of our regular working area.' },
      { q: 'Will my older Fort Collins home need historic review for a kitchen remodel?', a: 'Usually not. Historic review applies to designated landmarks and historic districts, and mainly to exterior changes. If the remodel adds or changes a window or door, we check before design is finalized.' },
      { q: 'Can you remodel a rental kitchen between tenants?', a: 'Yes. We plan the scope and order long-lead items ahead of time so the construction fits inside the gap between leases.' },
    ],
  },
  {
    service: 'bathroom-remodeling',
    area: 'loveland-co',
    title: 'Bathroom Remodeling in Loveland, CO | Standard Building',
    description:
      'Bathroom remodeling in Loveland, CO: walk-in and curbless showers, tub-to-shower conversions, basement bathrooms, and accessible upgrades.',
    h1: 'Bathroom Remodeling in Loveland, CO',
    lede: 'Walk-in and curbless showers, tub-to-shower conversions, basement bathrooms, and full primary bath remodels in Loveland, built waterproof behind the tile.',
    sections: [
      {
        heading: 'Showers first',
        body: [
          'Most Loveland bathroom calls start with the shower: a leaking or dated shower to replace, a tub to convert into a walk-in shower, or a curbless, zero-entry shower for easier access. Each one starts the same way. The old pan and walls come out down to the framing so we can see what water has done, and the new shower is built on a sloped pan with a continuous waterproofing membrane that we flood test before tile.',
          'A curbless shower takes more planning because the floor has to be recessed or the drain relocated so water stays where it belongs. We work that out during design, not on install day.',
        ],
      },
      {
        heading: 'Older homes and basement baths',
        body: [
          'In the mid-century homes around Lake Loveland and downtown, bathroom remodels often uncover cast iron drains and galvanized supply lines near the end of their life. Replacing them while the walls and floor are open costs far less than coming back later.',
          'In the newer east-side subdivisions, the common project is finishing the basement bathroom the builder roughed in. If there is no rough-in, we can cut the slab for new drains or use an ejector system where the sewer line sits above the basement floor.',
        ],
      },
      {
        heading: 'Permits in Loveland',
        body: [
          'Moving or adding plumbing, adding circuits, or changing walls is permitted through the City of Loveland building department inside city limits, or Larimer County outside them. Every bathroom gets an exhaust fan vented to the outside, which matters more than any finish for how the room holds up.',
        ],
      },
    ],
    faqs: [
      { q: 'Can you convert my bathtub into a walk-in shower?', a: 'Yes. It is one of the most common bathroom projects we do. The tub comes out, the drain is moved or resized if needed, and a new tiled shower is built on a waterproofed, sloped pan.' },
      { q: 'Can you build a curbless shower in an existing Loveland home?', a: 'Often, yes. It depends on the floor framing or slab and where the drain can go. We look at the structure first and tell you what it takes before pricing.' },
      { q: 'Do I need a permit to remodel a bathroom in Loveland?', a: 'Cosmetic updates generally do not. Moving or adding plumbing, adding circuits, or changing walls generally does. We handle the permits the job requires.' },
    ],
  },
  {
    service: 'bathroom-remodeling',
    area: 'fort-collins-co',
    title: 'Bathroom Remodeling in Fort Collins, CO | Standard Building',
    description:
      'Bathroom remodeling in Fort Collins, CO: walk-in showers, added bathrooms in older homes, basement baths, and rental bathroom updates.',
    h1: 'Bathroom Remodeling in Fort Collins, CO',
    lede: 'Walk-in showers, added bathrooms in older homes, basement baths, and rental updates across Fort Collins, from a design-build contractor based in Loveland.',
    sections: [
      {
        heading: 'Adding and updating baths in older Fort Collins homes',
        body: [
          'Many older homes near Old Town and campus were built with a single bathroom. Adding a second bath, whether by carving space from a bedroom, finishing part of a basement, or building a primary suite addition, is often the project that makes the house work for a family. We look at where drains and vents can run before choosing the location, because that decides cost more than anything else.',
          'Older houses also tend to have aging drain and supply piping. When a bathroom is opened up, replacing those lines is usually the right call, and we price it as a clear allowance from the start.',
        ],
      },
      {
        heading: 'Showers, basements, and rentals',
        body: [
          'Tub-to-shower conversions and walk-in tile showers are the most common requests. Every shower we build sits on a sloped pan with a continuous waterproofing membrane that is flood tested before tile goes on.',
          'Basement bathrooms in the newer south and southeast neighborhoods usually start from a builder rough-in. For rental owners, we choose durable fixtures and finishes and schedule the work between tenants.',
        ],
      },
      {
        heading: 'Permits in Fort Collins',
        body: [
          'Building permits are issued by the City of Fort Collins. Plumbing changes, new circuits, and wall changes are permitted and inspected, and we schedule each inspection as the work reaches that stage. Exterior changes on designated landmarks or in historic districts can need additional review, which matters if a new bathroom adds a window.',
        ],
      },
    ],
    faqs: [
      { q: 'Can you add a second bathroom to my older Fort Collins home?', a: 'Often, yes. It depends on where drains and vents can run and how much space is available. We evaluate the house and give you options before design is finalized.' },
      { q: 'Can you add a bathroom in my basement?', a: 'Yes. If there is a builder rough-in, the work is simpler. If not, we can cut the slab for new drains or install an ejector system where needed.' },
      { q: 'How far is Fort Collins from your office?', a: 'About twenty minutes. We are in Loveland, and Fort Collins is part of our regular working area.' },
    ],
  },
  {
    service: 'concrete',
    area: 'loveland-co',
    title: 'Concrete Contractor in Loveland, CO | Standard Building Co.',
    description:
      'Concrete contractor in Loveland, CO: driveways, patios, sidewalks, shop slabs, and replacement of heaved or cracked concrete, built for clay soil and freeze-thaw.',
    h1: 'Concrete Contractor in Loveland, CO',
    lede: 'Driveways, patios, sidewalks, garage and shop slabs, and replacement of heaved concrete in Loveland, placed on a prepared base and built for clay soil and freeze-thaw.',
    sections: [
      {
        heading: 'Why Loveland concrete cracks and heaves',
        body: [
          'Expansive clay is common around Loveland. It swells when it gets wet and shrinks when it dries, and a slab poured on it without a proper base and drainage moves with it. Add dozens of freeze-thaw cycles every winter and de-icing salt tracked in on tires, and a driveway or patio built thin or on poor base is cracked and uneven within a few years.',
          'We remove failed concrete, correct the grading so water runs away from the house and the slab, compact a proper base, use air-entrained concrete suited to freeze-thaw exposure, and cut control joints where the slab wants to crack.',
        ],
      },
      {
        heading: 'In town and on acreage',
        body: [
          'Inside the city, the common projects are driveway and sidewalk replacement, patios, and garage slabs. On acreage properties outside city limits, the work runs larger: long driveways, shop and barn slabs, and pads for detached garages, permitted through Larimer County where a permit is required.',
        ],
      },
      {
        heading: 'Permits for Loveland driveways and sidewalks',
        body: [
          'Work that touches the public sidewalk, curb, or driveway approach is in the city right-of-way and usually needs a separate permit from the City of Loveland. We pull it along with any building permit the project requires, so the curb cut and the approach are built to city standards.',
        ],
      },
    ],
    faqs: [
      { q: 'Do I need a permit to replace my driveway in Loveland?', a: 'If the work touches the public sidewalk, curb, or driveway approach, it usually needs a right-of-way permit from the City of Loveland. We confirm what applies and handle the permit.' },
      { q: 'Can you fix a driveway that has heaved?', a: 'A heaved or badly cracked slab is usually removed and replaced, with the grading and base corrected so the same problem does not come back.' },
      { q: 'When can I use a new driveway?', a: 'Stay off it with vehicles for about a week, and keep heavy trucks off for a month while the concrete gains strength. Avoid de-icing salt on new concrete through its first winter.' },
    ],
  },
  {
    service: 'concrete',
    area: 'fort-collins-co',
    title: 'Concrete Contractor in Fort Collins, CO | Standard Building',
    description:
      'Concrete contractor in Fort Collins, CO: driveways, sidewalks, patios, and slabs, with drainage, base preparation, and city right-of-way permits handled.',
    h1: 'Concrete Contractor in Fort Collins, CO',
    lede: 'Driveways, sidewalks, patios, and slabs in Fort Collins, with the drainage, base preparation, and right-of-way permits that decide whether concrete lasts.',
    sections: [
      {
        heading: 'Drainage comes first in Fort Collins',
        body: [
          'Much of Fort Collins sits on the Poudre River and Spring Creek drainages, and some neighborhoods are on expansive clay. That combination makes grading the most important part of any exterior concrete job. A patio or driveway that sends water back toward the foundation, or that sits in its own puddle, will fail early and can cause problems for the house.',
          'We set the grade so water moves away from the house and off the slab, compact a proper base, use air-entrained concrete for freeze-thaw exposure, and cut control joints to keep cracking where it belongs.',
        ],
      },
      {
        heading: 'Older neighborhoods and newer subdivisions',
        body: [
          'In the older neighborhoods near Old Town, the work is often replacing original driveways and walks, including sections lifted by the roots of mature trees. In the newer south and southeast neighborhoods, the common projects are patios, walkways, and slab extensions, and HOA approval for exterior changes is often part of the process. We help you put that request together.',
        ],
      },
      {
        heading: 'Right-of-way permits in Fort Collins',
        body: [
          'Work on the public sidewalk, curb and gutter, or the driveway approach is in the city right-of-way and requires a permit from the City of Fort Collins, separate from any building permit. We handle the permit and build the approach to city standards.',
        ],
      },
    ],
    faqs: [
      { q: 'Do I need a permit to replace a driveway in Fort Collins?', a: 'If the work touches the sidewalk, curb, or driveway approach, it requires a right-of-way permit from the City of Fort Collins. We confirm what applies and pull the permit.' },
      { q: 'Can you replace sidewalk lifted by tree roots?', a: 'Yes. We remove the lifted sections, address the roots where it is safe for the tree, correct the base, and pour new sections that match the grade.' },
      { q: 'Can you pour concrete in winter?', a: 'Yes, with precautions: heated materials, accelerators where appropriate, and insulated blankets to protect the slab while it cures.' },
    ],
  },
];
