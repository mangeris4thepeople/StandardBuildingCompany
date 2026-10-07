import React, { useState, useEffect } from 'react';
import { SITE, GROUPS, PROCESS } from '../content/site.js';
import { SERVICES, AREAS } from '../content/pages.js';
import { track } from '../track.js';

const NAV_LINKS = [
  { label: 'Commercial', href: GROUPS.commercial.path },
  { label: 'Residential', href: GROUPS.residential.path },
  { label: 'Service Areas', href: '/service-areas/' },
  { label: 'Contact', href: '/contact/' },
];

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return scrolled;
}

export function Nav({ solid = false, current = '' }) {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={`nav${scrolled || solid ? ' nav--scrolled' : ''}`} aria-label="Main">
      <a href="/" className="nav__logo" aria-label="Standard Building Company home">
        <span className="nav__logo-main">STANDARD</span>
        <span className="nav__logo-rule" />
        <span className="nav__logo-sub">BUILDING COMPANY</span>
      </a>
      <button
        className="nav__hamburger"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span /><span /><span />
      </button>
      <ul className={`nav__links${menuOpen ? ' nav__links--open' : ''}`}>
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              aria-current={current.startsWith(l.href) ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <a href={SITE.phoneHref} className="nav__cta">
            {SITE.phoneDisplay}
          </a>
        </li>
      </ul>
    </nav>
  );
}

// Phone-width action bar. It appears once the visitor scrolls past the first screen, so the
// two things most people come to do are always one tap away.
export function MobileBar() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const handler = () => setShown(window.scrollY > 480);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <div className={`mobile-bar${shown ? ' mobile-bar--shown' : ''}`}>
      <a href={SITE.phoneHref} className="mobile-bar__call" tabIndex={shown ? 0 : -1}>Call {SITE.phoneDisplay}</a>
      <a href="#contact" className="mobile-bar__quote" tabIndex={shown ? 0 : -1}>Request a quote</a>
    </div>
  );
}

export function Breadcrumbs({ trail }) {
  if (!trail || trail.length < 2) return null;
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((t, i) => (
          <li key={t.path}>
            {i < trail.length - 1 ? <a href={t.path}>{t.name}</a> : <span aria-current="page">{t.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({ eyebrow, title, lede, trail, actions = true }) {
  return (
    <header className="page-hero">
      <div className="container">
        <Breadcrumbs trail={trail} />
        {eyebrow && <p className="page-hero__eyebrow">{eyebrow}</p>}
        <h1 className="page-hero__title">{title}</h1>
        {lede && <p className="page-hero__lede">{lede}</p>}
        {actions && (
          <div className="hero__actions">
            <a href="#contact" className="btn btn--primary">Request a Quote</a>
            <a href={SITE.phoneHref} className="btn btn--ghost">Call {SITE.phoneDisplay}</a>
          </div>
        )}
      </div>
    </header>
  );
}

export function ServiceCards({ services, variant = 'dark', headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <div className={`services__grid${variant === 'light' ? ' services__grid--light' : ''}`}>
      {services.map((s) => (
        <a className="service-card" key={s.path} href={s.path}>
          <H className="service-card__title">{s.short}</H>
          <p className="service-card__desc">{s.card}</p>
          <span className="service-card__more">Learn more</span>
        </a>
      ))}
    </div>
  );
}

export function ProcessSteps({ group }) {
  return (
    <ol className="steps">
      {PROCESS[group].map((step, i) => (
        <li className="steps__item" key={step.title}>
          <span className="steps__num">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <h3 className="steps__title">{step.title}</h3>
            <p>{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function SideCta() {
  return (
    <div className="side-card side-card--cta">
      <p className="side-card__label">Talk to a builder</p>
      <a href={SITE.phoneHref} className="side-card__phone">{SITE.phoneDisplay}</a>
      <p className="side-card__text">Call, or send the details and we will get back to you.</p>
      <a href="#contact" className="btn btn--primary btn--full">Request a Quote</a>
    </div>
  );
}

export function SideLinks({ title, links }) {
  return (
    <div className="side-card">
      <p className="side-card__label">{title}</p>
      <ul className="side-card__links">
        {links.map((l) => (
          <li key={l.href}><a href={l.href}>{l.label}</a></li>
        ))}
      </ul>
    </div>
  );
}

export function Contact({
  heading = "Let's talk about your project.",
  body = "Whether you're in early planning or ready to build, we want to hear about it. Reach out and someone from our team will be in touch.",
  projectType = '',
  headingLevel = 2,
}) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', projectType, message: '' });
  const [status, setStatus] = useState('idle');
  const H = `h${headingLevel}`;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target.elements._gotcha.value) return;
    setStatus('sending');
    try {
      const res = await fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, page: window.location.pathname }),
      });
      if (res.ok) {
        setStatus('sent');
        track('generate_lead', { form_id: 'contact', project_type: form.projectType || 'unspecified' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact__inner">
          <div className="contact__info">
            <span className="section-label">Contact</span>
            <H className="contact__headline">{heading}</H>
            <p className="contact__body">{body}</p>
            <a href={SITE.phoneHref} className="contact__phone">{SITE.phoneDisplay}</a>
            <a href={`mailto:${SITE.email}`} className="contact__email">{SITE.email}</a>
            <p className="contact__location">Loveland, CO · Serving Northern Colorado</p>
          </div>
          <div className="contact__form-wrap">
            {status === 'sent' ? (
              <div className="contact__success" role="status">
                <span className="contact__success-icon">✓</span>
                <p>Message received. We'll be in touch shortly.</p>
              </div>
            ) : status === 'error' ? (
              <div className="contact__success" role="alert">
                <span className="contact__success-icon contact__success-icon--error">!</span>
                <p>Something went wrong. Please call us at {SITE.phoneDisplay}.</p>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" autoComplete="name" required value={form.name} onChange={handleChange} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={handleChange} placeholder="(970) 000-0000" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label htmlFor="projectType">Project type</label>
                  <select id="projectType" name="projectType" value={form.projectType} onChange={handleChange}>
                    <option value="">Select one</option>
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                    <option value="other">Not sure yet</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="5" required value={form.message} onChange={handleChange} placeholder="Tell us about your project..." />
                </div>
                <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" className="form-honeypot" aria-hidden="true" />
                <button type="submit" className="btn btn--primary btn--full" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cols">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-main">STANDARD BUILDING</span>
              <span className="footer__logo-sub">COMPANY · LOVELAND, CO · EST. {SITE.founded}</span>
            </div>
            <a href={SITE.phoneHref} className="footer__phone">{SITE.phoneDisplay}</a>
            <a href={`mailto:${SITE.email}`} className="footer__email">{SITE.email}</a>
          </div>
          <div className="footer__col">
            <a href={GROUPS.commercial.path} className="footer__heading">Commercial</a>
            <ul>
              {SERVICES.commercial.map((s) => (
                <li key={s.path}><a href={s.path}>{s.short}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <a href={GROUPS.residential.path} className="footer__heading">Residential</a>
            <ul>
              {SERVICES.residential.map((s) => (
                <li key={s.path}><a href={s.path}>{s.short}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <a href="/service-areas/" className="footer__heading">Service Areas</a>
            <ul>
              {AREAS.map((a) => (
                <li key={a.path}><a href={a.path}>{a.name}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} Standard Building Company. All rights reserved.</p>
      </div>
    </footer>
  );
}
