import React from 'react';
import { SITE, GROUPS, OTHER_AREAS, COMMERCIAL_REFERRAL } from '../content/site.js';
import { SERVICES, CORE_SERVICES, AREAS, AREA_REGIONS, findService } from '../content/pages.js';
import { POSTS } from '../content/posts.js';
import { STATIC_PAGES } from '../content/static-pages.js';
import { trailFor } from '../content/head.js';
import { PageHero, ServiceCards, ProcessSteps, SideCta, SideLinks, Contact, Tabs, Faq } from './Layout.jsx';

// Lowercase a service name for use mid-sentence, keeping acronyms like ADUs.
const lc = (t) => t.split(' ').map((w) => (/[A-Z]{2,}/.test(w) ? w : w.toLowerCase())).join(' ');

// "A, B, and C" as links.
const linkList = (items) => items.map((c, i) => (
  <React.Fragment key={c.path}>
    {i > 0 && (i === items.length - 1 ? ', and ' : ', ')}
    <a href={c.path}>{c.name}</a>
  </React.Fragment>
));
import { HeroDrawing, AreaMap } from './Drawings.jsx';

const areaLinks = AREAS.map((a) => ({ href: a.path, label: `${a.name}, CO` }));

// Preselects the contact form's project type from the service page a visitor is on.
const FORM_TYPE = {
  'kitchen-remodeling': 'kitchen-bath',
  'bathroom-remodeling': 'kitchen-bath',
  'basement-finishing': 'basement',
  'home-additions': 'addition',
  'decks-outdoor-living': 'exterior',
  concrete: 'exterior',
  exteriors: 'exterior',
  'garages-adus': 'garage-adu',
  'whole-home-remodels': 'addition',
  'custom-homes': 'custom-home',
  'roofing-coordination': 'exterior',
  'architectural-design-permitting': 'design',
};

// One line pointing commercial inquiries to the separate firm that handles them.
function CommercialNote() {
  return (
    <p className="prose__note">
      Standard Building Company works on homes only. For commercial, industrial, or public projects, contact <a href={COMMERCIAL_REFERRAL.url}>{COMMERCIAL_REFERRAL.name}</a>.
    </p>
  );
}

/* ------------------------------------------------------------------ HOME */

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__grid-overlay" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="hero__grid-col" />
        ))}
      </div>
      <div className="hero__content">
        <div className="hero__copy">
        <p className="hero__eyebrow">Loveland, Colorado · Est. {SITE.founded}</p>
        <p className="hero__headline" aria-hidden="true">
          <span className="hero__headline-top">STANDARD</span>
          <span className="hero__headline-rule" />
          <span className="hero__headline-bottom">BUILDING</span>
        </p>
        <h1 className="hero__h1">Design-Build Remodeling and Custom Homes in Loveland and Northern Colorado</h1>
        <p className="hero__tagline">
          Standard Building Company designs, permits, and builds whole-home remodels, kitchens, bathrooms, basements, additions, ADUs, and custom homes for homeowners in Loveland, Fort Collins, and Northern Colorado. One contract, one accountable builder, from concept to completion.
        </p>
        <div className="hero__actions">
          <a href={SITE.phoneHref} className="btn btn--primary">Call {SITE.phoneDisplay}</a>
          <a href="#contact" className="btn btn--ghost">Request a Consultation</a>
        </div>
        </div>
        <div className="hero__drawing">
          <HeroDrawing />
        </div>
      </div>
      <div className="hero__ticker" aria-hidden="true">
        <span>Design-Build</span>
        <span className="hero__ticker-dot" />
        <span>Whole-Home Remodels</span>
        <span className="hero__ticker-dot" />
        <span>Kitchens and Baths</span>
        <span className="hero__ticker-dot" />
        <span>Additions and ADUs</span>
        <span className="hero__ticker-dot" />
        <span>Custom Homes</span>
        <span className="hero__ticker-dot" />
        <span>Northern Colorado</span>
      </div>
    </section>
  );
}

function AboutBody() {
  return (
    <div className="about__content">
      <h2 className="about__headline">
        Your home.<br />Built right.
      </h2>
      <p className="about__body">
        Standard Building Company is a residential <a href="/design-build/">design-build</a> general contractor founded in {SITE.founded} and based in Loveland, Colorado. We design and build for homeowners: <a href="/services/whole-home-remodels/">whole-home remodels</a>, <a href="/services/kitchen-remodeling/">kitchens</a>, <a href="/services/bathroom-remodeling/">bathrooms</a>, <a href="/services/basement-finishing/">basements</a>, <a href="/services/home-additions/">additions</a>, <a href="/services/custom-homes/">custom homes</a>, <a href="/services/garages-adus/">ADUs</a>, decks, and the <a href="/services/architectural-design-permitting/">architectural design and permitting</a> behind all of it. We work across Northern Colorado, including <a href="/service-areas/fort-collins-co/">Fort Collins</a>, <a href="/service-areas/greeley-co/">Greeley</a>, <a href="/service-areas/longmont-co/">Longmont</a>, and the surrounding Front Range, and in the mountain towns of <a href="/service-areas/vail-co/">Vail</a>, <a href="/service-areas/avon-co/">Avon</a>, <a href="/service-areas/aspen-co/">Aspen</a>, <a href="/service-areas/winter-park-co/">Winter Park</a>, <a href="/service-areas/copper-mountain-co/">Copper Mountain</a>, and <a href="/service-areas/steamboat-springs-co/">Steamboat Springs</a>.
      </p>
      <p className="about__body">
        Our leadership comes from the field. Behind SBC is a builder who has run projects from the first schedule through the subcontractors, safety, inspections, and turnover to the owner. That background is held to ICC National Standard General Building Contractor (A) certification and OSHA and MSHA 40-hour safety training, and every home we work on is run with the same discipline.
      </p>
      <p className="about__body">
        What sets us apart is how a job is run. You get a written scope and price before work starts, one point of contact the whole way through, permits and inspections handled for you, and a final walkthrough before we call it done. Small repair or custom home, the standard is the same. Read more <a href="/about/">about the company</a> and <a href="/process/">how a project runs</a>.
      </p>
      <div className="about__stats">
        <div className="about__stat">
          <span className="about__stat-number">Est.</span>
          <span className="about__stat-label">{SITE.founded}</span>
        </div>
        <div className="about__stat-divider" />
        <div className="about__stat">
          <span className="about__stat-number">ICC (A)</span>
          <span className="about__stat-label">Certified</span>
        </div>
        <div className="about__stat-divider" />
        <div className="about__stat">
          <span className="about__stat-number">N. CO</span>
          <span className="about__stat-label">Based</span>
        </div>
      </div>
    </div>
  );
}

function AreasBody({ heading = 'Where we work' }) {
  return (
    <div className="areas__inner">
      <div className="areas__text">
        <h2 className="areas__headline">{heading}</h2>
        <p className="areas__body">
          Based in Loveland, we work across Larimer County, Weld County, and the northern Front Range, and in the mountain towns of Eagle, Pitkin, Grand, Summit, and Routt counties.
        </p>
        {AREA_REGIONS.map((r) => (
          <React.Fragment key={r.key}>
            <h3 className="areas__region">{r.label}</h3>
            <ul className="areas__list">
              {r.areas.map((a) => (
                <li key={a.path}><a href={a.path}>{a.name}</a></li>
              ))}
            </ul>
          </React.Fragment>
        ))}
        <p className="areas__also">Also serving {OTHER_AREAS.join(', ')}, and surrounding communities.</p>
      </div>
      <div className="areas__map">
        <AreaMap />
      </div>
    </div>
  );
}

function ServicePanel({ group, sub, variant }) {
  return (
    <>
      <p className="services__sub">{sub}</p>
      <ServiceCards services={SERVICES[group]} variant={variant} />
      <p className="services__sub">
        Every project starts with a <a href="/design-build/">design-build plan</a>: one firm draws it, prices it, permits it, and builds it. See <a href="/process/">how a project runs</a> or <a href="/insights/">read our cost and permit guides</a>.
      </p>
      <a href={GROUPS[group].path} className={`services__all${variant === 'light' ? '' : ' services__all--light'}`}>
        All {GROUPS[group].label.toLowerCase()} services
      </a>
    </>
  );
}

export function HomePage() {
  return (
    <>
      <Hero />
      <section className="services">
        <div className="container">
          <div className="services__header">
            <span className="section-label section-label--light">Services</span>
            <h2 className="services__headline">What we build</h2>
          </div>
          <ServicePanel
            group="residential"
            sub="Whole-home remodels, kitchens, baths, basements, additions, custom homes, ADUs, decks, roofing coordination, and architectural design for Northern Colorado homeowners."
          />
        </div>
      </section>
      <section className="company">
        <div className="container">
          <Tabs
            id="company"
            label="About Standard Building Company"
            tabs={[
              { key: 'about', label: 'About us', content: <AboutBody /> },
              { key: 'areas', label: 'Where we work', content: <AreasBody /> },
            ]}
          />
        </div>
      </section>
      <Contact />
    </>
  );
}

/* ------------------------------------------------------------------- HUB */

export function HubPage({ page }) {
  const group = GROUPS[page.group];
  return (
    <>
      <PageHero eyebrow="Standard Building Company" title={page.h1} lede={page.lede} trail={trailFor(page)} />
      <section className="page-body">
        <div className="container">
          <div className="prose prose--wide page-intro">
            {page.intro.map((p) => <p key={p}>{p}</p>)}
          </div>
          <Tabs
            id="explore"
            label={`${group.name} sections`}
            tabs={[
              {
                key: 'services',
                label: 'Services',
                content: (
                  <>
                    <h2 className="panel-title">{group.name} services</h2>
                    <ServiceCards services={SERVICES[page.group]} variant="light" headingLevel={3} />
                  </>
                ),
              },
              {
                key: 'process',
                label: 'How it runs',
                content: (
                  <div className="prose prose--wide">
                    <h2>How a project runs</h2>
                    <ProcessSteps group={page.group} />
                    <CommercialNote />
                  </div>
                ),
              },
              {
                key: 'areas',
                label: 'Where we work',
                content: <AreasBody heading="Remodeling across Northern Colorado and the mountains" />,
              },
            ]}
          />
        </div>
      </section>
      <Contact />
    </>
  );
}

/* --------------------------------------------------------------- SERVICE */

export function ServicePage({ page }) {
  const s = findService(page.group, page.slug);
  const group = GROUPS[page.group];
  const related = s.related.map((slug) => findService(page.group, slug)).filter(Boolean);
  return (
    <>
      <PageHero eyebrow={group.name} title={s.h1} lede={s.lede} trail={trailFor(page)} />
      <section className="page-body">
        <div className="container page-body__inner">
          <article className="prose">
            <Tabs
              id="details"
              label={`${s.short} sections`}
              tabs={[
                {
                  key: 'overview',
                  label: 'Overview',
                  content: (
                    <>
                      {s.intro.map((p) => <p key={p}>{p}</p>)}
                      <h2>{s.scopeTitle}</h2>
                      <ul className="check-list">
                        {s.scope.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </>
                  ),
                },
                ...(s.sections.length
                  ? [{
                      key: 'know',
                      label: 'Details',
                      content: s.sections.map((sec) => (
                        <React.Fragment key={sec.heading}>
                          <h2>{sec.heading}</h2>
                          {sec.body.map((p) => <p key={p}>{p}</p>)}
                        </React.Fragment>
                      )),
                    }]
                  : []),
                {
                  key: 'process',
                  label: 'Process',
                  content: (
                    <>
                      <h2>How a project runs</h2>
                      <ProcessSteps group={page.group} />
                    </>
                  ),
                },
                {
                  key: 'faq',
                  label: 'FAQ',
                  content: (
                    <>
                      <h2>Common questions</h2>
                      <Faq items={s.faqs} />
                    </>
                  ),
                },
              ]}
            />
            {page.slug === 'basement-finishing' && <p><a href="/pricing/">How basement finishing estimates work</a>, or browse the local basement finishing pages below.</p>}
            <h2>Where we provide {lc(s.short)}</h2>
            {page.slug === 'basement-finishing' && <ul className="link-list">{AREAS.map(a => <li key={a.slug}><a href={`/basement-finishing/${a.slug}/`}>Basement Finishing in {a.name}, CO</a></li>)}</ul>}
            <p>
              Standard Building Company is based in Loveland and provides {lc(s.short)} across Northern Colorado, including {linkList(AREA_REGIONS[0].areas)}.
            </p>
            <p>
              We also take {lc(s.short)} projects in the mountain towns of {linkList(AREA_REGIONS[1].areas)}.
            </p>
          </article>
          <aside className="side">
            <SideCta />
            <SideLinks
              title={`Related ${group.label.toLowerCase()} services`}
              links={[
                ...related.map((r) => ({ href: r.path, label: r.short })),
                { href: group.path, label: `All ${group.label.toLowerCase()} services` },
              ]}
            />
            <SideLinks title="Areas we serve" links={areaLinks} />
          </aside>
        </div>
      </section>
      <Contact
        heading={`Talk to us about ${lc(s.short)}.`}
        body="Send the details or give us a call. We will ask a few questions, look at the site or the drawings, and tell you what it will take."
        projectType={FORM_TYPE[page.slug] || ''}
      />
    </>
  );
}

/* ----------------------------------------------------------------- AREAS */

export function AreasPage({ page }) {
  return (
    <>
      <PageHero eyebrow="Standard Building Company" title={page.h1} lede={page.lede} trail={trailFor(page)} />
      <section className="page-body">
        <div className="container">
          <div className="prose prose--wide">
            <p>
              Standard Building Company is based in Loveland and works throughout Northern Colorado and in the mountain towns along I-70, US 40, and the Roaring Fork Valley. Building departments, soils, wind, and snow loads change from one town to the next, so each page below covers what is specific to building there.
            </p>
          </div>
          {AREA_REGIONS.map((r) => (
            <React.Fragment key={r.key}>
              <h2 className="area-grid__heading">{r.label}</h2>
              <div className="area-grid">
                {r.areas.map((a) => (
                  <a className="area-card" href={a.path} key={a.path}>
                    <span className="area-card__county">{a.county}</span>
                    <h3 className="area-card__name">{a.name}, CO</h3>
                    <p>{a.lede}</p>
                  </a>
                ))}
              </div>
            </React.Fragment>
          ))}
          <div className="prose prose--wide">
            <h2>Also serving</h2>
            <p>
              {OTHER_AREAS.join(', ')}, and the unincorporated areas of Larimer and Weld counties. If your project is on the northern Front Range or in a mountain community near the ones above, <a href="/contact/">get in touch</a> and we will tell you whether it is one we can take.
            </p>
            <h2>How we work across the region</h2>
            <p>
              Every project, in every town, runs the same way: a walkthrough at the house, a cost range before design, a written scope and fixed price at the permit set, permits pulled under our name, one project lead through construction, and a final walkthrough before we call it done. What changes from town to town is the building department, the soils, the snow load, and the drive. Front Range projects get site visits on short notice from our Loveland office. Mountain projects are planned in blocks, with a project lead on site through demolition, rough-in, inspections, and finish, and with travel and logistics shown as their own lines in the estimate.
            </p>
            <p>
              The same <a href="/services/">design-build services</a> are offered everywhere we work: whole-home remodels, kitchens, baths, basement finishes, additions, custom homes, ADUs, decks, roofing coordination, and architectural design and permitting. Read <a href="/insights/remodeling-mountain-towns-colorado/">what is different about remodeling in the mountain towns</a> or <a href="/process/">how a project runs</a>.
            </p>
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
}

export function AreaPage({ page }) {
  const a = AREAS.find((c) => c.slug === page.slug);
  const services = a.focus.residential.map((slug) => findService('residential', slug)).filter(Boolean);
  const nearby = (a.nearby || []).map((slug) => AREAS.find((c) => c.slug === slug)).filter(Boolean);
  const others = AREA_REGIONS.flatMap((r) => r.areas).filter((c) => c.slug !== a.slug).map((c) => ({ href: c.path, label: `${c.name}, CO` }));
  return (
    <>
      <PageHero
        eyebrow={a.county}
        title={a.h1}
        lede={a.lede}
        trail={trailFor(page)}
      />
      <section className="page-body">
        <div className="container page-body__inner">
          <article className="prose">
            <h2>Building in {a.name}</h2>
            {a.local.map((p) => <p key={p}>{p}</p>)}

            {a.projects && (
              <>
                <h2>Projects we take on in {a.name}</h2>
                <ul className="link-list">
                  {a.projects.map((p) => (
                    <li key={p.title}><strong>{p.title}</strong><span>{p.body}</span></li>
                  ))}
                </ul>
              </>
            )}

            {a.conditions && (
              <>
                <h2>What building in {a.name} takes</h2>
                <ul className="check-list check-list--single">
                  {a.conditions.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </>
            )}

            <h2>Permits and jurisdiction in {a.name}</h2>
            <p>{a.permits}</p>

            <PriceSchedule location={a.name} slug={a.slug} />
            <h2>Basement finishing in {a.name}</h2>
            <p>Planning a bedroom, family room, home office, or bathroom downstairs? Read our <a href={`/basement-finishing/${a.slug}/`}>{a.name} basement finishing guide</a> for permitting considerations, planning steps, and pricing factors.</p>
            <h2>Services in {a.name}</h2>
            <p>These are the services homeowners in {a.name} ask for most. Every one of them is run design-build: one firm draws the plan, prices it, pulls the permit, and builds it.</p>
            <ul className="link-list">
              {services.map((s) => (
                <li key={s.path}>
                  <a href={s.path}>{s.short}</a>
                  <span>{s.card}</span>
                </li>
              ))}
            </ul>
            <h3>Every service we offer in {a.name}</h3>
            <p>{linkList(SERVICES.residential.map((s) => ({ path: s.path, name: s.short })))}. <a href={GROUPS.residential.path}>See all services</a> or <a href="/design-build/">how design-build works</a>.</p>
            <CommercialNote />

            {a.faqs && (
              <>
                <h2>{a.name} remodeling questions</h2>
                <Faq items={a.faqs} />
              </>
            )}

            {nearby.length > 0 && (
              <p className="prose__note">Also nearby: {linkList(nearby)}.</p>
            )}
          </article>
          <aside className="side">
            <SideCta />
            <SideLinks title="Other service areas" links={others} />
          </aside>
        </div>
      </section>
      <Contact heading={`Planning a project in ${a.name}?`} />
    </>
  );
}

const PRICING_RANGES = [
    { name: 'Basement finishing', low: 45, high: 110, note: 'Economy: resilient sheet flooring and standard trim. Luxury: premium Italian tile, upgraded millwork, and specialty spaces. Bathrooms and egress can increase cost.' },
    { name: 'Kitchen remodeling', low: 175, high: 450, note: 'Economy: Formica-style laminate countertops, linoleum or sheet-vinyl floors, and stock cabinets. Luxury: granite countertops, Italian tile, and custom cabinetry.' },
    { name: 'Bathroom remodeling', low: 250, high: 650, note: 'Economy: standard fixtures and resilient flooring. Luxury: Italian tile, stone countertops, custom shower, and premium fixtures.' },
];

const MOUNTAIN_SLUGS = new Set(['aspen-co', 'vail-co', 'avon-co', 'winter-park-co', 'copper-mountain-co', 'steamboat-springs-co', 'estes-park-co']);

function PriceSchedule({ location, slug }) {
  const isMountain = MOUNTAIN_SLUGS.has(slug);
  return (
    <>
      <h2>{location ? `Construction cost planning in ${location}` : 'Construction cost planning'}</h2>
      {isMountain ? (
        <>
          <p><strong>Mountain resort construction is a separate pricing market.</strong> Front Range remodeling figures do not apply in {location}. Trade availability, travel and lodging for crews, delivery logistics, design review, snow-load engineering, and the finish level expected in a resort town all push costs well above Northern Colorado ranges.</p>
          <p>We price every mountain project from a site visit, with travel and logistics shown as their own lines so you can see what is construction and what is distance. <a href="/contact/">Request a locally scoped estimate</a> or read <a href="/insights/remodeling-mountain-towns-colorado/">what is different about remodeling in the mountain towns</a>.</p>
        </>
      ) : (
        <>
          <p><strong>Preliminary Front Range planning ranges, not fixed bids.</strong> These figures are for early budgeting in {location || 'Northern Colorado'}. Your written estimate is built from your scope, your house, and your selections.</p>
          <ul className="link-list">
            {PRICING_RANGES.map((r) => (
              <li key={r.name}>
                <strong>{r.name}: ${r.low} to ${r.high} per sq. ft.</strong>
                <span>{r.note}</span>
              </li>
            ))}
          </ul>
          <p>Economy finishes include laminate countertops and sheet-vinyl flooring where suitable. Premium finishes can include large-format tile, stone countertops, and custom cabinetry. Structural work, electrical service upgrades, and mechanical systems affect cost separately.</p>
        </>
      )}
      <h3>Other home projects</h3>
      <p>Additions, custom homes, ADUs, garages, decks, siding, roofing, and concrete are priced from a real scope and site conditions. <a href="/pricing/">See how estimates are built</a> or <a href="/contact/">request an estimate</a>.</p>
    </>
  );
}

/* --------------------------------------------------------- PRICING / LOCAL BASEMENTS */

export function PricingPage({ page }) {
  const factors = [
    ['Basement finishing', 'Finished square footage, framing and insulation, bathroom plumbing, egress, HVAC, electrical, and finish selections.'],
    ['Kitchen remodeling', 'Cabinetry, counters, appliances, layout changes, structural work, plumbing, and electrical upgrades.'],
    ['Bathroom remodeling', 'Shower waterproofing, tile, plumbing moves, ventilation, fixtures, and accessibility details.'],
  ];
  return (
    <>
      <PageHero eyebrow="Project planning" title={page.h1} lede={page.lede} trail={trailFor(page)} />
      <section className="page-body">
        <div className="container page-body__inner">
          <article className="prose">
            <h2>What will my project cost?</h2>
            <p>We do not publish one-size-fits-all quotes because two projects with the same square footage can have very different structural, mechanical, and finish requirements. We review your project and provide a written scope and project-specific estimate. Any preliminary budget is an estimate, not a fixed-price offer.</p>
            <h2>Preliminary planning ranges per square foot</h2>
            <p><strong>Front Range only, not for mountain resort towns.</strong> Illustrative budgeting guidance, not an SBC quote or guaranteed minimum. These broad ranges are preliminary assumptions for Northern Colorado projects, not a price list validated against SBC's current subcontractor bids. Final pricing depends on site conditions, drawings, finish selections, and the written scope.</p>
            <ul className="link-list">
              {PRICING_RANGES.map((r) => (
                <li key={r.name}>
                  <strong>{r.name}: ${r.low} to ${r.high} per sq. ft.</strong>
                  <span>{r.note}</span>
                </li>
              ))}
            </ul>
            <p><strong>How to use the ranges:</strong> Multiply the floor area being remodeled by the low and high figures for an early planning allowance. This does not account for all minimum project costs, design and permit fees, major structural work, or unexpected existing conditions. We will confirm what is included in a written estimate.</p>
            <h2>What low-end and high-end mean</h2>
            <p><strong>Low-end</strong> means practical, durable finishes such as laminate (Formica-style) countertops, linoleum or sheet-vinyl flooring, stock cabinets, and standard fixtures. <strong>High-end</strong> means premium finishes such as Italian tile, granite countertops, custom cabinetry, and upgraded plumbing and lighting fixtures. The specific finish materials depend on the room and project scope.</p>
            <p>Finish quality is only one variable. Structural changes, moving plumbing, electrical upgrades, permits, site conditions, and labor can change the total even when economical materials are selected.</p>
            <h2>Mountain resort pricing is different</h2>
            <p>Aspen, Vail, Avon, Steamboat Springs, Winter Park, Copper Mountain, and Estes Park cannot be priced using this Front Range schedule. Mountain markets require separate labor, mobilization, delivery, access, weather, and permitting budgets. See each <a href="/service-areas/">service-area page</a> or read <a href="/insights/remodeling-mountain-towns-colorado/">what is different about mountain-town remodeling</a>.</p>
            <h2>Other home projects</h2>
            <p>Home additions, garages, ADUs and shops, decks, siding, concrete, and structural repairs are priced from the actual scope and site conditions. We will not publish unsupported square-foot estimates for those categories. <a href="/contact/">Request a project-specific budget</a>.</p>
            <h2>What affects the price</h2>
            <ul className="link-list">{factors.map(([name, detail]) => <li key={name}><strong>{name}</strong><span>{detail}</span></li>)}</ul>
            <h2>What you receive</h2>
            <ul className="check-list">
              <li>Scope of work and assumptions</li>
              <li>Material and finish allowances where selections are pending</li>
              <li>Known permit, engineering, and subcontractor requirements</li>
              <li>Schedule considerations and major cost risks</li>
              <li>A clear process for approving changes</li>
            </ul>
            <h2>Compare proposals fairly</h2>
            <p>Ask each contractor whether demolition, waste removal, permits, waterproofing, electrical, HVAC, inspections, and cleanup are included. An inexpensive quote that excludes essential work can cost more later.</p>
            <p>Explore <a href="/services/basement-finishing/">basement finishing</a>, <a href="/services/kitchen-remodeling/">kitchen remodeling</a>, and <a href="/services/bathroom-remodeling/">bathroom remodeling</a>, read our <a href="/insights/kitchen-remodel-cost-northern-colorado/">kitchen remodel cost guide</a>, or <a href="/contact/">request an estimate</a>.</p>
          </article>
          <aside className="side"><SideCta /><SideLinks title="Where we work" links={areaLinks} /></aside>
        </div>
      </section>
      <Contact heading="Request a project-specific estimate" />
    </>
  );
}

export function LocalBasementPage({ page }) {
  const area = AREAS.find((a) => a.slug === page.slug);
  if (!area) return <NotFoundPage />;
  return (
    <>
      <PageHero eyebrow={area.county} title={page.h1} lede={page.lede} trail={trailFor(page)} />
      <section className="page-body">
        <div className="container page-body__inner">
          <article className="prose">
            <h2>Plan a basement finish in {area.name}</h2>
            <p>Standard Building Company is based in Loveland and coordinates basement finishing work for homeowners in {area.name}. Whether you need a family room, bedroom, bathroom, office, or multi-use space, the first step is reviewing the existing structure and your goals.</p>
            <p>We evaluate ceiling heights, moisture conditions, insulation, electrical capacity, HVAC distribution, stairways, and emergency escape openings before finalizing the scope. Qualified subcontractors perform the field work under our project management.</p>
            <h2>Permits and local requirements</h2>
            <p>{area.permits}</p>
            <p>Bedroom egress, smoke and carbon-monoxide alarms, ventilation, electrical and plumbing work must be evaluated for the specific property and applicable codes. We confirm requirements with the authority having jurisdiction before construction.</p>
            <PriceSchedule location={area.name} slug={area.slug} />
            <h2>What affects basement finishing cost in {area.name}?</h2>
            <p>Size, bathroom rough-ins, egress modifications, moisture remediation, soundproofing, cabinetry, and finish selections all affect cost. See our <a href="/pricing/">pricing and estimating guide</a> for how we develop a written scope and estimate.</p>
            <h2>Related {area.name} resources</h2>
            <p>Read our <a href={area.path}>{area.name} remodeling and permitting guide</a>, our <a href="/services/basement-finishing/">full basement finishing service page</a>, and our <a href="/insights/basement-finish-permits-loveland-fort-collins/">guide to basement finish permits in Loveland and Fort Collins</a>.</p>
            <h2>Questions before starting</h2>
            <Faq items={[
              {q:`Do I need a permit to finish a basement in ${area.name}?`,a:'Finishing habitable space typically involves permits and inspections. The applicable jurisdiction depends on the property address and scope; we verify it before work begins.'},
              {q:'Can I add a bedroom or bathroom?',a:'Often, subject to egress, plumbing, ceiling height, ventilation, and applicable building code requirements. We evaluate the existing conditions before pricing.'},
              {q:'Can you give me a fixed price from square footage alone?',a:'Not reliably. We need the scope, site conditions, and material selections to prepare a meaningful estimate.'},
            ]} />
          </article>
          <aside className="side"><SideCta /><SideLinks title="Other service areas" links={areaLinks} /></aside>
        </div>
      </section>
      <Contact heading={`Discuss your ${area.name} basement project`} />
    </>
  );
}

/* ------------------------------------------------------ STATIC / INSIGHTS / POST */

// Renders a post body line: "## " is an H2, "- " a list item, **bold** inline. Everything else is a paragraph.
function inline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) =>
    part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <React.Fragment key={i}>{part}</React.Fragment>
  );
}

function RichBody({ body }) {
  const out = [];
  let list = [];
  const flush = () => {
    if (list.length) out.push(<ul className="check-list check-list--single" key={`l${out.length}`}>{list}</ul>);
    list = [];
  };
  body.forEach((line, i) => {
    if (line.startsWith('- ')) { list.push(<li key={i}>{inline(line.slice(2))}</li>); return; }
    flush();
    if (line.startsWith('## ')) out.push(<h2 key={i}>{line.slice(3)}</h2>);
    else out.push(<p key={i}>{inline(line)}</p>);
  });
  flush();
  return out;
}

const coreServiceLinks = CORE_SERVICES.map((s) => ({ href: s.path, label: s.short }));

export function StaticPage({ page }) {
  const sp = STATIC_PAGES.find((x) => x.slug === page.slug);
  return (
    <>
      <PageHero eyebrow={sp.eyebrow} title={sp.h1} lede={sp.lede} trail={trailFor(page)} />
      <section className="page-body">
        <div className="container page-body__inner">
          <article className="prose">
            {sp.sections.map((sec) => (
              <React.Fragment key={sec.heading}>
                <h2>{sec.heading}</h2>
                {sec.body.map((p) => <p key={p}>{p}</p>)}
              </React.Fragment>
            ))}
            {page.slug === 'design-build' && (
              <>
                <h2>Design-build services</h2>
                <ul className="link-list">
                  {CORE_SERVICES.map((s) => (
                    <li key={s.path}><a href={s.path}>{s.short}</a><span>{s.card}</span></li>
                  ))}
                </ul>
              </>
            )}
            {page.slug === 'process' && (
              <>
                <h2>The short version</h2>
                <ProcessSteps group="residential" />
              </>
            )}
            {page.slug === 'about' && (
              <>
                <h2>Where we work</h2>
                <p>
                  Northern Colorado: {linkList(AREA_REGIONS[0].areas)}. Mountain towns: {linkList(AREA_REGIONS[1].areas)}. See all <a href="/service-areas/">service areas</a>.
                </p>
              </>
            )}
            {sp.faqs && (
              <>
                <h2>Common questions</h2>
                <Faq items={sp.faqs} />
              </>
            )}
            <CommercialNote />
          </article>
          <aside className="side">
            <SideCta />
            <SideLinks title="Services" links={coreServiceLinks} />
            <SideLinks
              title="Learn more"
              links={[
                { href: '/design-build/', label: 'Design-build' },
                { href: '/process/', label: 'Our process' },
                { href: '/about/', label: 'About SBC' },
                { href: '/pricing/', label: 'Pricing and estimates' },
                { href: '/insights/', label: 'Insights' },
              ].filter((l) => l.href !== page.path)}
            />
          </aside>
        </div>
      </section>
      <Contact />
    </>
  );
}

const fmtDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export function InsightsPage({ page }) {
  return (
    <>
      <PageHero eyebrow="Insights" title={page.h1} lede={page.lede} trail={trailFor(page)} />
      <section className="page-body">
        <div className="container page-body__inner">
          <article className="prose">
            <p>
              These guides answer the questions we hear at the first walkthrough: what a project costs in Northern Colorado, what the permit will require, what the rules are for an ADU, what changes in the mountain towns, and how design-build compares to the traditional way of hiring. They are written by the people who draw and build the projects, and they are updated when codes and costs change.
            </p>
            <p>
              A note on the cost figures in these guides. They are planning ranges for the Front Range in 2026, drawn from the scopes we see on Loveland, Fort Collins, Windsor, and Berthoud homes. They are not quotes, and they do not apply to the mountain towns, where every project is priced from a site visit. The permit and code summaries describe the rules as adopted by each city or county at the time of writing; codes change, and we confirm the current requirements for your address before any design starts. If a guide and a building department disagree, the building department wins.
            </p>
            <h2>Guides</h2>
            <ul className="link-list">
              {POSTS.map((p) => (
                <li key={p.slug}>
                  <a href={`/insights/${p.slug}/`}>{p.title}</a>
                  <span>{p.description} <em>{p.category}, {fmtDate(p.updated || p.published)}.</em></span>
                </li>
              ))}
            </ul>
            <h2>Have a question these do not answer?</h2>
            <p>
              Call {SITE.phoneDisplay} or <a href="/contact/">send the details</a>. If it is a question other homeowners ask too, it becomes the next guide. For the services behind these guides, see <a href="/services/">all design-build and remodeling services</a>, <a href="/service-areas/">where we work</a>, and <a href="/pricing/">how we price</a>.
            </p>
          </article>
          <aside className="side">
            <SideCta />
            <SideLinks title="Services" links={coreServiceLinks} />
            <SideLinks title="Areas we serve" links={areaLinks} />
          </aside>
        </div>
      </section>
      <Contact />
    </>
  );
}

export function PostPage({ page }) {
  const post = POSTS.find((x) => x.slug === page.slug);
  const related = post.related.map((slug) => findService('residential', slug)).filter(Boolean);
  const others = POSTS.filter((p) => p.slug !== post.slug).map((p) => ({ href: `/insights/${p.slug}/`, label: p.title }));
  return (
    <>
      <PageHero eyebrow={post.category} title={post.h1} lede={post.lede} trail={trailFor(page)} />
      <section className="page-body">
        <div className="container page-body__inner">
          <article className="prose">
            <p className="prose__note">
              By {SITE.name}. Published {fmtDate(post.published)}{post.updated && post.updated !== post.published ? `, updated ${fmtDate(post.updated)}` : ''}.
            </p>
            <RichBody body={post.body} />
            <h2>Related services</h2>
            <ul className="link-list">
              {related.map((s) => (
                <li key={s.path}><a href={s.path}>{s.short}</a><span>{s.card}</span></li>
              ))}
            </ul>
            <CommercialNote />
          </article>
          <aside className="side">
            <SideCta />
            <SideLinks title="More insights" links={others} />
            <SideLinks title="Areas we serve" links={areaLinks} />
          </aside>
        </div>
      </section>
      <Contact heading="Planning a project? Start with a walkthrough." body="Tell us the house, the town, and what you want to do. We will tell you what it takes and what it will cost before anything is drawn." />
    </>
  );
}

/* --------------------------------------------------------- CONTACT / 404 */

export function ContactPage({ page }) {
  return (
    <>
      <PageHero eyebrow="Standard Building Company" title={page.h1} lede={page.lede} trail={trailFor(page)} actions={false} />
      <section className="page-body">
        <div className="container page-body__inner">
          <article className="prose">
            <h2>Call, email, or send the form</h2>
            <p>
              Standard Building Company is a residential design-build general contractor based in Loveland, Colorado. We design, permit, and build whole-home remodels, kitchens, bathrooms, basement finishes, additions, custom homes, ADUs, and decks for homeowners across Northern Colorado and in the mountain towns. The fastest way to reach us is the phone. The form works well too, especially if you want to attach what you have in mind.
            </p>
            <p>
              Phone: <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>. Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Office: {SITE.addressDisplay}. Calls are answered during business hours, Monday through Friday, and the form is read the same day it is sent. If we are on a job site when you call, leave a message with your name, the town, and the project and we will call back.
            </p>
            <h2>What to have ready</h2>
            <p>
              The address of the house, roughly what you want to do, and when you want it done. Photos help. A budget range helps more than anything, because design-build only works when the price travels with the design. If you have drawings, an inspection report, an HOA letter, or an insurance scope, mention it and we will ask for it.
            </p>
            <h2>Projects we are the right fit for</h2>
            <p>
              Anything on a home that involves more than one trade, a permit, or a drawing: a kitchen that moves the sink, a basement with a bathroom, an addition, a second story, an ADU, a custom home on your lot, or a whole house that needs everything at once. We also take decks, roofing coordinated with a larger project or a hail claim, siding and windows, and small-job lists for owners who want a general contractor rather than a rotating cast of trades. We do not take commercial, multifamily, or public work; that goes to a separate firm, named at the bottom of this page.
            </p>
            <h2>What happens next</h2>
            <p>
              We call or write back to ask a few questions. If the project is one we are the right fit for, we schedule a walkthrough at the house, which is free. From the walkthrough you get either a written scope and price, for kitchens, baths, and basements, or concept options with a cost range, for additions, ADUs, whole-home remodels, and custom homes. Our <a href="/process/">process page</a> walks through every stage after that.
            </p>
            <h2>Where we work</h2>
            <p>
              Northern Colorado: {linkList(AREA_REGIONS[0].areas)}. Mountain towns: {linkList(AREA_REGIONS[1].areas)}. Also {OTHER_AREAS.join(', ')}, and the unincorporated areas of Larimer and Weld counties.
            </p>
            <h2>Services</h2>
            <p>
              {linkList(SERVICES.residential.map((s) => ({ path: s.path, name: s.short })))}. Every project is run <a href="/design-build/">design-build</a>.
            </p>
            <CommercialNote />
          </article>
          <aside className="side">
            <SideCta />
            <SideLinks title="Learn more" links={[{ href: '/process/', label: 'How a project runs' }, { href: '/pricing/', label: 'Pricing and estimates' }, { href: '/about/', label: 'About SBC' }, { href: '/insights/', label: 'Insights' }]} />
          </aside>
        </div>
      </section>
      <Contact heading="Send us the details." />
    </>
  );
}

export function NotFoundPage() {
  return (
    <>
      <PageHero
        eyebrow="404"
        title="Page not found"
        lede="That page does not exist or has moved. Try one of the links below."
        actions={false}
      />
      <section className="page-body">
        <div className="container">
          <ul className="link-list">
            <li><a href="/">Home</a><span>Standard Building Company</span></li>
            <li><a href={GROUPS.residential.path}>Design-build and remodeling services</a><span>Whole-home, kitchens, baths, basements, additions, custom homes, ADUs</span></li>
            <li><a href="/service-areas/">Service areas</a><span>Northern Colorado and the mountain towns</span></li>
            <li><a href="/insights/">Insights</a><span>Cost guides and permit explainers</span></li>
            <li><a href="/contact/">Contact</a><span>{SITE.phoneDisplay}</span></li>
          </ul>
        </div>
      </section>
    </>
  );
}
