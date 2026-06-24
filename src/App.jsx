import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

const SERVICES = [
  { title: 'General Contracting', description: 'Full-service project delivery from groundbreaking to closeout. We self-perform and subcontract with the same standard of accountability on every job.' },
  { title: 'Pre-Construction Planning', description: 'Budgeting, scheduling, site analysis, and constructability reviews before a single dollar hits the ground. Decisions made early cost less.' },
  { title: 'Construction Management', description: 'Owner-side representation and oversight throughout the construction process. We keep your project on schedule, on budget, and out of disputes.' },
  { title: 'Design-Build', description: 'Single-source responsibility from concept through completion. One contract, one point of contact, and a faster path from drawing to delivered.' },
  { title: 'Government & Public Works', description: 'Experienced in the compliance, documentation, and procurement requirements of municipal, county, and federal construction projects including prevailing wage and Davis-Bacon.' },
  { title: 'Industrial Build-Out', description: 'Warehouse, manufacturing, and heavy commercial build-outs built to operational specs — not just code minimums.' },
  { title: 'Tenant Finish & Tenant Improvement', description: 'Commercial office, retail, medical, and restaurant tenant finish and improvement projects throughout Northern Colorado.' },
  { title: 'Steel Erection', description: 'Structural steel erection, pre-engineered metal building installation, light gauge steel framing, and metal decking for commercial and industrial projects.' },
  { title: 'Concrete', description: 'Foundations, flatwork, tilt-up, cast-in-place, decorative concrete, and polished concrete for commercial and industrial applications.' },
  { title: 'Masonry', description: 'Brick, block, CMU, stone veneer, and masonry restoration for commercial projects across Northern Colorado.' },
  { title: 'Sitework & Earthwork', description: 'Excavation, grading, site preparation, erosion control, SWPPP, dewatering, and soil stabilization.' },
  { title: 'Underground Utilities', description: 'Water main, sewer, storm sewer, dry utilities, duct bank, and utility coordination for commercial and government projects.' },
  { title: 'Plumbing', description: 'Commercial plumbing rough-in, sanitary sewer, domestic water, medical gas, natural gas piping, and fixture installation.' },
  { title: 'Electrical', description: 'Commercial electrical rough-in, service entrance, switchgear, lighting, low voltage, panel installation, and electrical commissioning.' },
  { title: 'HVAC & Mechanical', description: 'Commercial heating, ventilation, and air conditioning including ductwork, rooftop units, boilers, chillers, and building automation systems.' },
  { title: 'Fire Suppression', description: 'Wet pipe, dry pipe, pre-action sprinkler systems, fire standpipe, kitchen hood suppression, and fire pump installation.' },
  { title: 'Roofing & Waterproofing', description: 'TPO, EPDM, metal roofing, flat roof systems, below grade waterproofing, air barrier, and building envelope solutions.' },
  { title: 'Doors, Windows & Glazing', description: 'Commercial storefront, curtain wall, hollow metal doors, aluminum storefronts, overhead doors, and automatic door systems.' },
  { title: 'Finishes', description: 'Drywall, acoustic ceilings, painting, commercial flooring, tile, carpet, resilient flooring, and fireproofing.' },
  { title: 'Landscaping & Exterior', description: 'Commercial landscaping, hardscape, concrete flatwork, asphalt, parking lots, curb and gutter, fencing, and irrigation.' },
  { title: 'Low Voltage & Communications', description: 'Structured cabling, fiber optic, data networks, audio visual, PA systems, and distributed antenna systems.' },
  { title: 'Electronic Safety & Security', description: 'Access control, security cameras, fire alarm, mass notification, intrusion detection, and video surveillance systems.' },
];

const WHY_REASONS = [
  {
    num: '01',
    title: 'Women & Minority Owned',
    body: 'Standard Building Company is a certified Women and Minority Owned Business (WMBE). For clients with diversity spend requirements on government, institutional, or corporate projects, SBC helps you meet those goals without sacrificing quality or capability. We bring the same credentials to the table that large firms charge a premium for.',
  },
  {
    num: '02',
    title: 'Local. Present. Accountable.',
    body: 'We are based in Loveland and we work in Northern Colorado. That means the person you call is the person on site. No regional offices, no account managers passing messages. When you need answers, you get them from someone who was at your project that morning.',
  },
  {
    num: '03',
    title: 'Hands-On at Every Phase',
    body: 'SBC leadership is not a management-only operation. We are in the field, reviewing submittals, walking the site, and solving problems in real time. The level of attention you get from us is not something you will find at a larger firm where your project is one of fifty.',
  },
  {
    num: '04',
    title: 'We Consult. We Contract. We Do Both.',
    body: 'Most contractors show up when there is a contract to sign. We show up earlier. SBC offers pre-construction consulting, owner representation, and feasibility analysis before the first dollar is committed. If you need a contractor in the field and an advisor at the table, that is exactly what we provide.',
  },
  {
    num: '05',
    title: 'Built for Commercial, Industrial & Government Work',
    body: 'We are not a residential remodeler who also does commercial work. SBC is purpose-built for commercial, industrial, institutional, and government construction. We understand prevailing wage, Davis-Bacon compliance, public procurement, and the documentation requirements that come with complex projects.',
  },
];

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return scrolled;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Nav() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Why SBC', to: '/why-sbc' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <Link to="/" className="nav__logo" onClick={() => setMenuOpen(false)}>
        <span className="nav__logo-main">STANDARD</span>
        <span className="nav__logo-rule" />
        <span className="nav__logo-sub">BUILDING COMPANY</span>
      </Link>
      <button className="nav__hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>
      <ul className={`nav__links${menuOpen ? ' nav__links--open' : ''}`}>
        {links.map(l => (
          <li key={l.to}>
            <Link
              to={l.to}
              className={location.pathname === l.to ? 'nav__link--active' : ''}
              onClick={() => setMenuOpen(false)}
            >{l.label}</Link>
          </li>
        ))}
        <li>
          <a href="tel:9704305884" className="nav__cta">(970) 430-5884</a>
        </li>
      </ul>
    </nav>
  );
}

function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="page-hero">
      <div className="page-hero__grid" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="page-hero__col" />)}
      </div>
      <div className="page-hero__content">
        {eyebrow && <p className="hero__eyebrow">{eyebrow}</p>}
        <h1 className="page-hero__title">{title}</h1>
        {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <section className="hero" id="top">
        <div className="hero__grid-overlay" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="hero__grid-col" />)}
        </div>
        <div className="hero__content">
          <p className="hero__eyebrow">Northern Colorado · Est. 2020</p>
          <h1 className="hero__headline">
            <span className="hero__headline-top">STANDARD</span>
            <span className="hero__headline-rule" />
            <span className="hero__headline-bottom">BUILDING</span>
          </h1>
          <p className="hero__tagline">Structure You Can Trust. Results You Can See.</p>
          <div className="hero__actions">
            <Link to="/contact" className="btn btn--primary">Start a Conversation</Link>
            <Link to="/services" className="btn btn--ghost">Our Services</Link>
          </div>
        </div>
        <div className="hero__ticker" aria-hidden="true">
          <span>Residential</span><span className="hero__ticker-dot" />
          <span>Commercial</span><span className="hero__ticker-dot" />
          <span>Industrial</span><span className="hero__ticker-dot" />
          <span>Government</span><span className="hero__ticker-dot" />
          <span>Institutional</span><span className="hero__ticker-dot" />
          <span>Northern Colorado</span><span className="hero__ticker-dot" />
          <span>Exceptional Outcomes</span>
        </div>
      </section>

      <section className="home-intro">
        <div className="container">
          <div className="home-intro__inner">
            <div className="home-intro__left">
              <span className="section-label">Who We Are</span>
              <h2 className="home-intro__headline">More than management.<br />We're in it with you.</h2>
            </div>
            <div className="home-intro__right">
              <p>Standard Building Company is a Women and Minority Owned general contractor based in Loveland, Colorado. We serve residential, commercial, industrial, institutional, and government clients across Northern Colorado — and we do more than manage. We consult, plan, and build.</p>
              <div className="home-intro__actions">
                <Link to="/about" className="btn btn--primary">About SBC</Link>
                <Link to="/why-sbc" className="btn btn--outline">Why Choose Us</Link>
              </div>
            </div>
          </div>
          <div className="home-stats">
            <div className="home-stat">
              <span className="home-stat__num">Est.</span>
              <span className="home-stat__label">2020</span>
            </div>
            <div className="home-stat__div" />
            <div className="home-stat">
              <span className="home-stat__num">W/MBE</span>
              <span className="home-stat__label">Certified</span>
            </div>
            <div className="home-stat__div" />
            <div className="home-stat">
              <span className="home-stat__num">32</span>
              <span className="home-stat__label">CSI Divisions</span>
            </div>
            <div className="home-stat__div" />
            <div className="home-stat">
              <span className="home-stat__num">N. CO</span>
              <span className="home-stat__label">Based & Serving</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-services">
        <div className="container">
          <div className="home-services__header">
            <span className="section-label section-label--light">What We Do</span>
            <h2 className="home-services__headline">Built for every phase.</h2>
          </div>
          <div className="home-services__grid">
            {SERVICES.slice(0, 6).map((s, i) => (
              <div className="service-card" key={s.title}>
                <span className="service-card__num">0{i + 1}</span>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="home-services__cta">
            <Link to="/services" className="btn btn--ghost">View All Services</Link>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="container">
          <div className="home-cta__inner">
            <h2 className="home-cta__headline">Ready to talk about your project?</h2>
            <Link to="/contact" className="btn btn--primary">Get In Touch</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function About() {
  return (
    <>
      <PageHero eyebrow="About Us" title="STANDARD BUILDING COMPANY" subtitle="Women and Minority Owned · Founded 2020 · Loveland, Colorado" />
      <section className="interior-section">
        <div className="container">
          <div className="about__inner">
            <div className="about__label-col">
              <span className="section-label">Our Story</span>
              <div className="about__accent-line" />
            </div>
            <div className="about__content">
              <h2 className="about__headline">More than management.<br />We're in it with you.</h2>
              <p className="about__body">Standard Building Company is a Women and Minority Owned general contractor founded in 2020 and based in Loveland, Colorado. We serve residential, commercial, industrial, institutional, and government clients across Northern Colorado including Fort Collins, Greeley, Longmont, Windsor, and the surrounding Front Range.</p>
              <p className="about__body">What sets us apart is the depth of what we offer. We don't just manage projects — we consult. From early-stage pre-construction planning, budgeting, and feasibility through full construction delivery across all CSI divisions, our team brings hands-on expertise to every phase. Whether you need an owner's representative at the table or a licensed general contractor in the field, SBC does both.</p>
              <p className="about__body">We built this company on the belief that great construction starts long before the first pour. Every decision made in pre-construction saves time and money in the field. That philosophy drives everything we do.</p>
              <div className="about__stats">
                <div className="about__stat">
                  <span className="about__stat-number">Est.</span>
                  <span className="about__stat-label">2020</span>
                </div>
                <div className="about__stat-divider" />
                <div className="about__stat">
                  <span className="about__stat-number">W/MBE</span>
                  <span className="about__stat-label">Certified</span>
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
    </>
  );
}

function Services() {
  return (
    <>
      <PageHero eyebrow="What We Do" title="OUR SERVICES" subtitle="Full-scope construction services across all 32 CSI divisions." />
      <section className="services interior-section" id="services">
        <div className="container">
          <div className="services__grid services__grid--full">
            {SERVICES.map((s, i) => (
              <div className="service-card" key={s.title}>
                <span className="service-card__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function WhySBC() {
  return (
    <>
      <PageHero eyebrow="The Difference" title="WHY SBC" subtitle="Five reasons clients choose Standard Building Company." />
      <section className="interior-section">
        <div className="container">
          <div className="why__list">
            {WHY_REASONS.map(r => (
              <div className="why__item" key={r.num}>
                <div className="why__num">{r.num}</div>
                <div className="why__content">
                  <h2 className="why__title">{r.title}</h2>
                  <p className="why__body">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="why__cta">
            <Link to="/contact" className="btn btn--primary">Start a Conversation</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('https://formspree.io/f/mnjkjabl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setSubmitted(true); } else { setError(true); }
    } catch { setError(true); }
  };

  return (
    <>
      <PageHero eyebrow="Get In Touch" title="CONTACT US" subtitle="Whether you're in early planning or ready to build, we want to hear about it." />
      <section className="interior-section">
        <div className="container">
          <div className="contact__inner">
            <div className="contact__info">
              <span className="section-label">Reach Out</span>
              <h2 className="contact__headline">Let's talk about your project.</h2>
              <p className="contact__body">Someone from our team will be in touch promptly. No runaround, no sales pitch — just a straight conversation about what you need.</p>
              <a href="tel:9704305884" className="contact__phone">(970) 430-5884</a>
              <p className="contact__location">Loveland, CO</p>
            </div>
            <div className="contact__form-wrap">
              {submitted ? (
                <div className="contact__success">
                  <span className="contact__success-icon">✓</span>
                  <p>Message received. We'll be in touch shortly.</p>
                </div>
              ) : error ? (
                <div className="contact__success">
                  <span className="contact__success-icon" style={{ color: '#E24B4A' }}>!</span>
                  <p>Something went wrong. Please call us at (970) 430-5884.</p>
                </div>
              ) : (
                <form className="contact__form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(970) 000-0000" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows="5" required value={form.message} onChange={handleChange} placeholder="Tell us about your project..." />
                  </div>
                  <button type="submit" className="btn btn--primary btn--full">Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SEOContent() {
  return (
    <section className="seo-content" aria-label="Service areas and specialties">
      <div className="container">
        <h2>Colorado General Contractor — Northern Colorado</h2>
        <p>Standard Building Company provides full-service general contracting, construction management, design-build, and pre-construction consulting to residential, commercial, industrial, institutional, and government clients across Northern Colorado. As a Women and Minority Owned (WMBE) contractor based in Loveland, CO, we self-perform and manage work spanning all 32 CSI construction divisions.</p>
        <h3>Service Areas</h3>
        <p>Loveland, Fort Collins, Greeley, Longmont, Windsor, Johnstown, Milliken, Timnath, Wellington, Berthoud, Estes Park, Evans, and surrounding Front Range communities.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__logo">
            <span className="footer__logo-main">STANDARD BUILDING</span>
            <span className="footer__logo-sub">COMPANY · LOVELAND, CO · EST. 2020</span>
          </div>
          <nav className="footer__nav">
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/why-sbc">Why SBC</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <p className="footer__copy">© {new Date().getFullYear()} Standard Building Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/why-sbc" element={<WhySBC />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <SEOContent />
      <Footer />
    </>
  );
}
