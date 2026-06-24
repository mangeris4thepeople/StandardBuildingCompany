import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

const SERVICES = [
  {
    title: 'General Contracting',
    description: 'Full-service project delivery from groundbreaking to closeout. We self-perform and subcontract with the same standard of accountability on every job.',
  },
  {
    title: 'Pre-Construction Planning',
    description: 'Budgeting, scheduling, site analysis, and constructability reviews before a single dollar hits the ground. Decisions made early cost less.',
  },
  {
    title: 'Construction Management',
    description: 'Owner-side representation and oversight throughout the construction process. We keep your project on schedule, on budget, and out of disputes.',
  },
  {
    title: 'Design-Build',
    description: 'Single-source responsibility from concept through completion. One contract, one point of contact, and a faster path from drawing to delivered.',
  },
  {
    title: 'Government & Public Works',
    description: 'Experienced in the compliance, documentation, and procurement requirements of municipal, county, and federal construction projects.',
  },
  {
    title: 'Industrial Build-Out',
    description: 'Warehouse, manufacturing, and heavy commercial build-outs built to operational specs — not just code minimums.',
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

function Nav() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <a href="#top" className="nav__logo">
        <span className="nav__logo-main">STANDARD</span>
        <span className="nav__logo-rule" />
        <span className="nav__logo-sub">BUILDING COMPANY</span>
      </a>
      <button className="nav__hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>
      <ul className={`nav__links${menuOpen ? ' nav__links--open' : ''}`}>
        {NAV_LINKS.map(l => (
          <li key={l.href}>
            <a href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          </li>
        ))}
        <li>
          <a href="tel:9704305884" className="nav__cta">
            (970) 430-5884
          </a>
        </li>
      </ul>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__grid-overlay" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="hero__grid-col" />
        ))}
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
          <a href="#contact" className="btn btn--primary">Start a Conversation</a>
          <a href="#services" className="btn btn--ghost">Our Services</a>
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
        <span>Northern Colorado</span>
        <span className="hero__ticker-dot" />
        <span>Exceptional Outcomes</span>
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
              Standard Building Company is a Women and Minority Owned business built on the belief that great construction starts long before the first pour. Founded in 2020 and based in Northern Colorado, we serve commercial, industrial, and government clients across the region.
            </p>
            <p className="about__body">
              What sets us apart is the depth of what we offer. We don't just manage projects — we consult. From early-stage feasibility and budget strategy through full construction delivery, our team brings hands-on expertise to every phase. Whether you need an owner's representative at the table or a contractor in the field, SBC does both.
            </p>
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
  );
}

function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="services__header">
          <span className="section-label section-label--light">Services</span>
          <h2 className="services__headline">What we deliver</h2>
        </div>
        <div className="services__grid">
          {SERVICES.map((s, i) => (
            <div className="service-card" key={s.title}>
              <span className="service-card__num">0{i + 1}</span>
              <h3 className="service-card__title">{s.title}</h3>
              <p className="service-card__desc">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact__inner">
          <div className="contact__info">
            <span className="section-label">Contact</span>
            <h2 className="contact__headline">Let's talk about your project.</h2>
            <p className="contact__body">
              Whether you're in early planning or ready to build, we want to hear about it. Reach out and someone from our team will be in touch.
            </p>
            <a href="tel:9704305884" className="contact__phone">(970) 430-5884</a>
            <p className="contact__location">Loveland, CO</p>
          </div>
          <div className="contact__form-wrap">
            {submitted ? (
              <div className="contact__success">
                <span className="contact__success-icon">✓</span>
                <p>Message received. We'll be in touch shortly.</p>
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
          <p className="footer__copy">© {new Date().getFullYear()} Standard Building Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Services />
      <Contact />
      <Footer />
    </>
  );
}
