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
            <h2>Where we provide {lc(s.short)}</h2>
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
