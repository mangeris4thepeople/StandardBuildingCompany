import React from 'react';
import { SITE, GROUPS, OTHER_AREAS } from '../content/site.js';
import { SERVICES, AREAS, AREA_REGIONS, findService } from '../content/pages.js';
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
        <h1 className="hero__h1">General Contractor in Loveland and Northern Colorado</h1>
        <p className="hero__tagline">
          Kitchen and bathroom remodeling, basement finishing, home additions, and commercial construction across Northern Colorado. One accountable general contractor from planning through completion.
        </p>
        <div className="hero__actions">
          <a href="#contact" className="btn btn--primary">Start a Conversation</a>
          <a href={SITE.phoneHref} className="btn btn--ghost">Call {SITE.phoneDisplay}</a>
        </div>
        </div>
        <div className="hero__drawing">
          <HeroDrawing />
        </div>
      </div>
      <div className="hero__ticker" aria-hidden="true">
        <span>Commercial</span>
        <span className="hero__ticker-dot" />
        <span>Industrial</span>
        <span className="hero__ticker-dot" />
        <span>Government</span>
        <span className="hero__ticker-dot" />
        <span>Design-Build</span>
        <span className="hero__ticker-dot" />
        <span>Residential</span>
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
        More than management.<br />We're in it with you.
      </h2>
      <p className="about__body">
        Standard Building Company is a general contractor founded in {SITE.founded} and based in Loveland, Colorado. We build for commercial, industrial, and government clients, and for homeowners. Our work spans mid-rise, multifamily, retail, healthcare, senior living, industrial, municipal facilities, <a href="/commercial/tenant-finish/">tenant finish</a>, and <a href="/residential/">residential remodeling</a>. We work across Northern Colorado, including <a href="/service-areas/fort-collins-co/">Fort Collins</a>, <a href="/service-areas/greeley-co/">Greeley</a>, <a href="/service-areas/longmont-co/">Longmont</a>, and the surrounding Front Range, and in the mountain towns of <a href="/service-areas/vail-co/">Vail</a>, <a href="/service-areas/avon-co/">Avon</a>, <a href="/service-areas/aspen-co/">Aspen</a>, <a href="/service-areas/winter-park-co/">Winter Park</a>, <a href="/service-areas/copper-mountain-co/">Copper Mountain</a>, and <a href="/service-areas/steamboat-springs-co/">Steamboat Springs</a>.
      </p>
      <p className="about__body">
        Our leadership comes from the field. Behind SBC is a commercial construction executive who has led projects across those markets from the first schedule through the subcontractors, safety, inspections, and turnover to the owner. That background is held to ICC National Standard General Building Contractor (A) certification and OSHA and MSHA 40-hour safety training, and every SBC project is run with the same discipline, commercial or residential.
      </p>
      <p className="about__body">
        What sets us apart is the depth of what we offer. We don't just manage projects. We consult. From early-stage <a href="/commercial/construction-management/">pre-construction planning</a>, budgeting, and feasibility through full construction delivery, our team brings hands-on expertise to every phase. Whether you need an owner's representative at the table or a licensed general contractor in the field, SBC does both.
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
          <Tabs
            id="services"
            label="Services"
            tone="dark"
            tabs={[
              {
                key: 'commercial',
                label: 'Commercial',
                content: (
                  <ServicePanel
                    group="commercial"
                    sub="General contracting, design-build, and construction management for commercial, industrial, and government clients."
                  />
                ),
              },
              {
                key: 'residential',
                label: 'Residential',
                content: (
                  <ServicePanel
                    group="residential"
                    sub="Kitchens, baths, basements, additions, exteriors, and outdoor living for Northern Colorado homeowners."
                  />
                ),
              },
            ]}
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
  const other = page.group === 'commercial' ? GROUPS.residential : GROUPS.commercial;
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
                    <p className="prose__note">
                      Looking for {other.name.toLowerCase()} instead? <a href={other.path}>See our {other.label.toLowerCase()} services</a>.
                    </p>
                  </div>
                ),
              },
              {
                key: 'areas',
                label: 'Where we work',
                content: <AreasBody heading={`${group.label} work across Northern Colorado and the mountains`} />,
              },
            ]}
          />
        </div>
      </section>
      <Contact projectType={page.group} />
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
            {page.slug === 'basement-finishing' && <p><a href="/pricing/">How basement finishing estimates work</a> · Browse local basement finishing pages below.</p>}
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
        projectType={page.group}
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
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
}

export function AreaPage({ page }) {
  const a = AREAS.find((c) => c.slug === page.slug);
  const pick = (group) => a.focus[group].map((slug) => findService(group, slug)).filter(Boolean);
  const nearby = (a.nearby || []).map((slug) => AREAS.find((c) => c.slug === slug)).filter(Boolean);
  const others = AREA_REGIONS.flatMap((r) => r.areas).filter((c) => c.slug !== a.slug).map((c) => ({ href: c.path, label: `${c.name}, CO` }));
  return (
    <>
      <PageHero
        eyebrow={a.county}
        title={`General Contractor in ${a.name}, Colorado`}
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
            <Tabs
              id="services"
              label={`Services in ${a.name}`}
              tabs={['commercial', 'residential'].map((g) => ({
                key: g,
                label: GROUPS[g].label,
                content: (
                  <>
                    <h3>{GROUPS[g].name} in {a.name}</h3>
                    <ul className="link-list">
                      {pick(g).map((s) => (
                        <li key={s.path}>
                          <a href={s.path}>{s.short}</a>
                          <span>{s.card}</span>
                        </li>
                      ))}
                    </ul>
                    <p><a href={GROUPS[g].path}>All {GROUPS[g].label.toLowerCase()} services</a></p>
                  </>
                ),
              }))}
            />

            {a.faqs && (
              <>
                <h2>{a.name} construction questions</h2>
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
    { name: 'Commercial tenant improvements', low: 75, high: 250, note: 'Tenant-area pricing depends on occupancy, HVAC, fire protection, electrical upgrades, phasing, and finishes.' },
];

const MOUNTAIN_MARKETS = {
  'aspen-co': { label: 'Aspen', kitchen: '$200,000–$450,000+', bath: '$100,000–$275,000+', whole: '$350–$700+ per sq. ft.' },
  'vail-co': { label: 'Vail', kitchen: '$175,000–$400,000+', bath: '$85,000–$250,000+', whole: '$300–$600+ per sq. ft.' },
  'avon-co': { label: 'Avon', kitchen: '$140,000–$325,000', bath: '$70,000–$190,000', whole: '$240–$475 per sq. ft.' },
};
const MOUNTAIN_SLUGS = new Set(['aspen-co', 'vail-co', 'avon-co', 'winter-park-co', 'copper-mountain-co', 'steamboat-springs-co', 'estes-park-co']);

function PriceSchedule({ location, slug }) {
  const isMountain = MOUNTAIN_SLUGS.has(slug);
  const benchmark = MOUNTAIN_MARKETS[slug];
  return (
    <>
      <h2>{location ? `Construction cost planning in ${location}` : 'Construction cost planning'}</h2>
      {isMountain ? (
        <>
          <p><strong>Mountain resort construction is a separate pricing market.</strong> Front Range remodeling figures do not apply here. Mountain projects require independent estimates for local trade availability, travel, lodging, delivery, weather, snow-load requirements, permits, and property access.</p>
          {benchmark ? (
            <>
              <p><strong>Published 2026 local-market remodeling benchmarks (not SBC bids):</strong></p>
              <ul className="link-list">
                <li><strong>Kitchen remodel: {benchmark.kitchen} per project</strong></li>
                <li><strong>Bathroom remodel: {benchmark.bath} per project</strong></li>
                <li><strong>Whole-home remodel: {benchmark.whole}</strong></li>
              </ul>
              <p>Source: <a href="https://www.bulldogaspen.com/blog/best-remodeling-ideas-vail-aspen-2026">Bulldog Construction's 2026 mountain-market remodeling guide</a>. These are market examples for different scopes, not a guaranteed SBC price schedule or directly comparable square-foot kitchen/bath rates.</p>
            </>
          ) : (
            <p>We have not verified a defensible public per-square-foot remodeling schedule for {location}. Aspen/Vail pricing cannot simply be copied to this market. <a href="/contact/">Request a locally scoped estimate</a> covering labor, access, logistics, and finish allowances.</p>
          )}
          <p>Basement finishing, additions, commercial work, and ground-up construction in {location} require project-specific pricing. No Front Range price floor or ceiling is implied.</p>
        </>
      ) : (
        <>
          <p><strong>Preliminary Front Range planning ranges, not fixed bids.</strong> These figures apply to Loveland-area budgeting only until SBC verifies local subcontractor and material costs.</p>
          <ul className="link-list">
            {PRICING_RANGES.map((r) => (
              <li key={r.name}>
                <strong>{r.name}: ${r.low}–${r.high} per sq. ft.</strong>
                <span>{r.note}</span>
              </li>
            ))}
          </ul>
          <p>Economy finishes include laminate countertops and linoleum or sheet-vinyl flooring where suitable. Luxury finishes can include Italian tile and granite countertops. Structural work and mechanical systems affect costs separately.</p>
        </>
      )}
      <h3>Other residential and commercial work</h3>
      <p>Additions, garages, decks, siding, concrete, structural repairs, and ground-up commercial construction require a custom scope and estimate. <a href="/pricing/">See pricing assumptions</a> or <a href="/contact/">request an estimate</a>.</p>
    </>
  );
}

/* --------------------------------------------------------- PRICING / LOCAL BASEMENTS */

export function PricingPage({ page }) {
  const factors = [
    ['Basement finishing', 'Finished square footage, framing and insulation, bathroom plumbing, egress, HVAC, electrical, and finish selections.'],
    ['Kitchen remodeling', 'Cabinetry, counters, appliances, layout changes, structural work, plumbing, and electrical upgrades.'],
    ['Bathroom remodeling', 'Shower waterproofing, tile, plumbing moves, ventilation, fixtures, and accessibility details.'],
    ['Commercial tenant improvements', 'Occupancy and code requirements, drawings, building systems, phasing, inspections, and tenant schedule.'],
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
            <p><strong>Front Range only — not for mountain resort towns.</strong> Illustrative budgeting guidance — not an SBC quote or guaranteed minimum. These broad ranges are preliminary assumptions for Northern Colorado projects, not a price list validated against SBC's current subcontractor bids. Final pricing depends on site conditions, drawings, finish selections, and the written scope.</p>
            <ul className="link-list">
              {PRICING_RANGES.map((r) => (
                <li key={r.name}>
                  <strong>{r.name}: ${r.low}–${r.high} per sq. ft.</strong>
                  <span>{r.note}</span>
                </li>
              ))}
            </ul>
            <p><strong>How to use the ranges:</strong> Multiply the floor area being remodeled by the low and high figures for an early planning allowance. This does not account for all minimum project costs, design and permit fees, major structural work, or unexpected existing conditions. We will confirm what is included in a written estimate.</p>
            <h2>What low-end and high-end mean</h2>
            <p><strong>Low-end</strong> means practical, durable finishes such as laminate (Formica-style) countertops, linoleum or sheet-vinyl flooring, stock cabinets, and standard fixtures. <strong>High-end</strong> means premium finishes such as Italian tile, granite countertops, custom cabinetry, and upgraded plumbing and lighting fixtures. The specific finish materials depend on the room and project scope.</p>
            <p>Finish quality is only one variable. Structural changes, moving plumbing, electrical upgrades, permits, site conditions, and labor can change the total even when economical materials are selected.</p>
            <h2>Mountain resort pricing is different</h2>
            <p>Aspen, Vail, Avon, Steamboat Springs, Winter Park, Copper Mountain, and Estes Park cannot be priced using this Front Range schedule. Mountain markets require separate labor, mobilization, delivery, access, weather, and permitting budgets. See each <a href="/service-areas/">service-area page</a> for applicable market benchmarks or a custom-estimate explanation.</p>
            <h2>Other building and construction categories</h2>
            <p>Home additions, garages and shops, decks, siding, concrete, structural repairs, ground-up commercial construction, and design-build work are priced from the actual scope and site conditions. We will not publish unsupported square-foot estimates for those categories. <a href="/contact/">Request a project-specific budget</a>.</p>
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
            <p>Explore <a href="/residential/basement-finishing/">basement finishing</a>, <a href="/residential/kitchen-remodeling/">kitchen remodeling</a>, and <a href="/residential/bathroom-remodeling/">bathroom remodeling</a>, or <a href="/contact/">request an estimate</a>.</p>
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
            <p>Standard Building Company is based in Loveland and coordinates basement finishing work for property owners in {area.name}. Whether you need a family room, bedroom, bathroom, office, or multi-use space, the first step is reviewing the existing structure and your goals.</p>
            <p>We evaluate ceiling heights, moisture conditions, insulation, electrical capacity, HVAC distribution, stairways, and emergency escape openings before finalizing the scope. Qualified subcontractors perform the field work under our project management.</p>
            <h2>Permits and local requirements</h2>
            <p>{area.permits}</p>
            <p>Bedroom egress, smoke and carbon-monoxide alarms, ventilation, electrical and plumbing work must be evaluated for the specific property and applicable codes. We confirm requirements with the authority having jurisdiction before construction.</p>
            <PriceSchedule location={area.name} slug={area.slug} />
            <h2>What affects basement finishing cost in {area.name}?</h2>
            <p>Size, bathroom rough-ins, egress modifications, moisture remediation, soundproofing, cabinetry, and finish selections all affect cost. See our <a href="/pricing/">pricing and estimating guide</a> for how we develop a written scope and estimate.</p>
            <h2>Related {area.name} resources</h2>
            <p>Read our <a href={area.path}>{area.name} construction and permitting guide</a> and our <a href="/residential/basement-finishing/">full basement finishing service page</a>.</p>
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

/* --------------------------------------------------------- CONTACT / 404 */

export function ContactPage({ page }) {
  return (
    <>
      <PageHero eyebrow="Standard Building Company" title={page.h1} lede={page.lede} trail={trailFor(page)} actions={false} />
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
            <li><a href={GROUPS.commercial.path}>Commercial construction</a><span>General contracting, tenant finish, design-build</span></li>
            <li><a href={GROUPS.residential.path}>Residential remodeling</a><span>Kitchens, baths, basements, exteriors</span></li>
            <li><a href="/contact/">Contact</a><span>{SITE.phoneDisplay}</span></li>
          </ul>
        </div>
      </section>
    </>
  );
}
