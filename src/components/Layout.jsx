import React, { useState, useEffect, useRef } from 'react';
import { SITE, GROUPS, PROCESS, SOCIAL } from '../content/site.js';
import { SERVICES, AREAS } from '../content/pages.js';
import { track } from '../track.js';

const NAV_LINKS = [
  { label: 'Residential', href: GROUPS.residential.path },
  { label: 'Service Areas', href: '/service-areas/' },
  { label: 'Pricing', href: '/pricing/' },
  { label: 'Contact', href: '/contact/' },
];

const SOCIAL_ICONS = {
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11.25H3zM9.5 9.75h3.83v1.54h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13v5.64h-4v-5c0-1.19-.02-2.73-1.66-2.73-1.67 0-1.92 1.3-1.92 2.64V21H9.5z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.3" />
    </>
  ),
  facebook: (
    <path d="M13.5 21v-7.6h2.56l.38-2.97H13.5V8.53c0-.86.24-1.45 1.47-1.45h1.57V4.43c-.27-.04-1.2-.12-2.29-.12-2.27 0-3.82 1.38-3.82 3.93v2.19H7.87v2.97h2.56V21z" />
  ),
};

export function SocialLinks({ className = '' }) {
  return (
    <ul className={`social ${className}`.trim()} aria-label="Standard Building Company on social media">
      {SOCIAL.map((s) => (
        <li key={s.key}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Standard Building Company on ${s.name}`}
            title={s.name}
            onClick={() => track('social_click', { network: s.key, link_url: s.url })}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false">
              {SOCIAL_ICONS[s.key]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

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
        <li className="nav__social-item">
          <SocialLinks className="social--nav" />
        </li>
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

// Tabbed compartments. Every panel is in the prerendered HTML, so search engines and AI crawlers
// read all of it; visitors see one panel at a time instead of scrolling past everything.
// A tab can be linked directly: /#residential or /commercial/tenant-finish/#faq opens that tab.
export function Tabs({ id, label, tabs, tone = 'light' }) {
  const [active, setActive] = useState(tabs[0].key);
  const listRef = useRef(null);

  useEffect(() => {
    const fromHash = () => {
      const key = window.location.hash.slice(1);
      if (!tabs.some((t) => t.key === key)) return;
      setActive(key);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: 'start' });
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const select = (key) => {
    if (key === active) return;
    setActive(key);
    track('tab_select', { tab_group: id, tab_name: key });
    if (window.history && window.history.replaceState) window.history.replaceState(null, '', `#${key}`);
  };

  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.key === active);
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    select(tabs[next].key);
    const btn = listRef.current && listRef.current.children[next];
    if (btn) btn.focus();
  };

  return (
    <div className={`tabs tabs--${tone}`} id={id}>
      <div className="tabs__list" role="tablist" aria-label={label} ref={listRef} onKeyDown={onKeyDown}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`${id}-tab-${t.key}`}
            className="tabs__tab"
            aria-selected={active === t.key}
            aria-controls={`${id}-panel-${t.key}`}
            tabIndex={active === t.key ? 0 : -1}
            onClick={() => select(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.key}
          role="tabpanel"
          id={`${id}-panel-${t.key}`}
          className="tabs__panel"
          aria-labelledby={`${id}-tab-${t.key}`}
          hidden={active !== t.key}
          data-tabpanel
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}

// Questions collapse to one line each and open on tap. The answers stay in the HTML.
export function Faq({ items }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details
          className="faq__item"
          key={f.q}
          onToggle={(e) => { if (e.currentTarget.open) track('faq_open', { question: f.q }); }}
        >
          <summary><h3>{f.q}</h3></summary>
          <p>{f.a}</p>
        </details>
      ))}
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
            <p className="contact__location">Loveland, CO · Serving Northern Colorado and the mountain towns</p>
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
                <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" autoComplete="name" required value={form.name} onChange={handleChange} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={handleChange} placeholder="(970) 000-0000" />
                </div>
                </div>
                <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label htmlFor="projectType">Project type</label>
                  <select id="projectType" name="projectType" value={form.projectType} onChange={handleChange}>
                    <option value="">Select one</option>
                    <option value="residential">Residential construction</option>
                    <option value="other">Not sure yet</option>
                  </select>
                </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="4" required value={form.message} onChange={handleChange} placeholder="Tell us about your project..." />
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

// A footer column. On phones the list is collapsed behind its heading; on wider screens it is
// always open. The links are in the HTML either way.
function FooterCol({ title, href, links }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`footer__col${open ? ' footer__col--open' : ''}`}>
      <div className="footer__col-head">
        <a href={href} className="footer__heading">{title}</a>
        <button
          type="button"
          className="footer__toggle"
          aria-expanded={open}
          aria-label={`${open ? 'Hide' : 'Show'} ${title} links`}
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden="true" />
        </button>
      </div>
      <ul>
        {links.map((l) => (
          <li key={l.href}><a href={l.href}>{l.label}</a></li>
        ))}
      </ul>
    </div>
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
            <SocialLinks className="social--footer" />
          </div>
          <FooterCol
            title="Residential"
            href={GROUPS.residential.path}
            links={SERVICES.residential.map((s) => ({ href: s.path, label: s.short }))}
          />
          <FooterCol
            title="Service Areas"
            href="/service-areas/"
            links={AREAS.map((a) => ({ href: a.path, label: a.name }))}
          />
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} Standard Building Company. All rights reserved.</p>
      </div>
    </footer>
  );
}
