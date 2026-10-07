import React from 'react';
import { SITE, GROUPS, OTHER_AREAS } from '../content/site.js';
import { SERVICES, AREAS, findService } from '../content/pages.js';
import { trailFor } from '../content/head.js';
import { PageHero, ServiceCards, ProcessSteps, SideCta, SideLinks, Contact } from './Layout.jsx';
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
          Commercial, industrial, and government construction, plus residential remodeling. Structure you can trust. Results you can see.
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

function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about__inner">
          <div className="about__label-col">
            <span className="section-label">About</span>
            <div className="about__accent-line" />
          </div>
          <div className="about__content">
            <h2 className="about__headline">
              More than management.<br />We're in it with you.
            </h2>
            <p className="about__body">
              Standard Building Company is a general contractor founded in {SITE.founded} and based in Loveland, Colorado. We serve commercial, industrial, and government clients, and homeowners, across Northern Colorado including <a href="/service-areas/fort-collins-co/">Fort Collins</a>, <a href="/service-areas/greeley-co/">Greeley</a>, <a href="/service-areas/longmont-co/">Longmont</a>, and the surrounding Front Range.
            </p>
            <p className="about__body">
              What sets us apart is the depth of what we offer. We don't just manage projects. We consult. From early-stage <a href="/commercial/construction-management/">pre-construction planning</a>, budgeting, and feasibility through full construction delivery across all CSI divisions, our team brings hands-on expertise to every phase. Whether you need an owner's representative at the table or a licensed general contractor in the field, SBC does both.
            </p>
            <div className="about__stats">
              <div className="about__stat">
                <span className="about__stat-number">Est.</span>
                <span className="about__stat-label">{SITE.founded}</span>
              </div>
              <div className="about__stat-divider" />
              <div className="about__stat">
                <span className="about__stat-number">33</span>
                <span className="about__stat-label">CSI Divisions</span>
              </div>
              <div className="about__stat-divider" />
              <div className="about__stat">
                <span className="about__stat-number">N. CO</span>
                <span className="about__stat-label">Based</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AreaLinks({ heading = 'Where we work', headingLevel = 2 }) {
  const H = `h${headingLevel}`;
  return (
    <section className="areas">
      <div className="container areas__inner">
        <div className="areas__text">
          <span className="section-label">Service Areas</span>
          <H className="areas__headline">{heading}</H>
          <p className="areas__body">
            Based in Loveland, we work across Larimer County, Weld County, and the northern Front Range.
          </p>
          <ul className="areas__list">
            {AREAS.map((a) => (
              <li key={a.path}><a href={a.path}>{a.name}</a></li>
            ))}
          </ul>
          <p className="areas__also">Also serving {OTHER_AREAS.join(', ')}, and surrounding communities.</p>
        </div>
        <div className="areas__map">
          <AreaMap />
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <section className="services" id="services">
        <div className="container">
          <div className="services__header">
            <span className="section-label section-label--light">Commercial</span>
            <h2 className="services__headline">Commercial construction</h2>
            <p className="services__sub">
              General contracting, design-build, and construction management for commercial, industrial, and government clients.
            </p>
          </div>
          <ServiceCards services={SERVICES.commercial} />
          <a href={GROUPS.commercial.path} className="services__all services__all--light">All commercial services</a>
        </div>
      </section>
      <section className="services services--light" id="residential">
        <div className="container">
          <div className="services__header">
            <span className="section-label">Residential</span>
            <h2 className="services__headline">Residential remodeling</h2>
            <p className="services__sub">
              Kitchens, baths, basements, additions, exteriors, and outdoor living for Northern Colorado homeowners.
            </p>
          </div>
          <ServiceCards services={SERVICES.residential} variant="light" />
          <a href={GROUPS.residential.path} className="services__all">All residential services</a>
        </div>
      </section>
      <AreaLinks />
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
          <div className="prose prose--wide">
            {page.intro.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>
      </section>
      <section className="services services--light services--flush">
        <div className="container">
          <div className="services__header">
            <span className="section-label">{group.label}</span>
            <h2 className="services__headline">{group.name} services</h2>
          </div>
          <ServiceCards services={SERVICES[page.group]} variant="light" />
        </div>
      </section>
      <section className="page-body">
        <div className="container">
          <div className="prose prose--wide">
            <h2>How a project runs</h2>
            <ProcessSteps group={page.group} />
            <p className="prose__note">
              Looking for {other.name.toLowerCase()} instead? <a href={other.path}>See our {other.label.toLowerCase()} services</a>.
            </p>
          </div>
        </div>
      </section>
      <AreaLinks heading={`${group.label} work across Northern Colorado`} />
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
            {s.intro.map((p) => <p key={p}>{p}</p>)}

            <h2>{s.scopeTitle}</h2>
            <ul className="check-list">
              {s.scope.map((item) => <li key={item}>{item}</li>)}
            </ul>

            {s.sections.map((sec) => (
              <React.Fragment key={sec.heading}>
                <h2>{sec.heading}</h2>
                {sec.body.map((p) => <p key={p}>{p}</p>)}
              </React.Fragment>
            ))}

            <h2>How a project runs</h2>
            <ProcessSteps group={page.group} />

            <h2>Common questions</h2>
            <div className="faq">
              {s.faqs.map((f) => (
                <div className="faq__item" key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
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
        heading={`Talk to us about ${s.short.toLowerCase()}.`}
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
              Standard Building Company is based in Loveland and works throughout Northern Colorado. Building departments, soils, wind, and snow loads change from one town to the next, so each page below covers what is specific to building there.
            </p>
          </div>
          <div className="area-grid">
            {AREAS.map((a) => (
              <a className="area-card" href={a.path} key={a.path}>
                <span className="area-card__county">{a.county}</span>
                <h2 className="area-card__name">{a.name}, CO</h2>
                <p>{a.lede}</p>
              </a>
            ))}
          </div>
          <div className="prose prose--wide">
            <h2>Also serving</h2>
            <p>
              {OTHER_AREAS.join(', ')}, and the unincorporated areas of Larimer and Weld counties. If your project is on the northern Front Range, <a href="/contact/">get in touch</a> and we will tell you whether it is one we can take.
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
  const others = AREAS.filter((c) => c.slug !== a.slug).map((c) => ({ href: c.path, label: `${c.name}, CO` }));
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

            <h2>Permits and jurisdiction</h2>
            <p>{a.permits}</p>

            <h2>Commercial construction in {a.name}</h2>
            <ul className="link-list">
              {pick('commercial').map((s) => (
                <li key={s.path}>
                  <a href={s.path}>{s.short}</a>
                  <span>{s.card}</span>
                </li>
              ))}
            </ul>
            <p><a href={GROUPS.commercial.path}>All commercial services</a></p>

            <h2>Residential remodeling in {a.name}</h2>
            <ul className="link-list">
              {pick('residential').map((s) => (
                <li key={s.path}>
                  <a href={s.path}>{s.short}</a>
                  <span>{s.card}</span>
                </li>
              ))}
            </ul>
            <p><a href={GROUPS.residential.path}>All residential services</a></p>
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
