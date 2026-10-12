// SBC BidWatch: collects open public construction bids from BidNet Direct and emails a weekly digest.
// Runs in GitHub Actions. See .github/workflows/bidwatch.yml for the schedule.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { AGENCIES, INCLUDE, EXCLUDE } from './agencies.mjs';

const DRY_RUN = process.env.DRY_RUN === '1';
const FORCE = process.env.FORCE === '1';
const MAIL_TO = process.env.MAIL_TO || 'info@standardbuildingcompany.net';
const STATE_DIR = process.env.STATE_DIR || 'state';
const START = 'https://www.bidnetdirect.com/colorado/solicitations/open-bids';

const denver = (opts) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', ...opts }).format(new Date());
const today = denver({ year: 'numeric', month: '2-digit', day: '2-digit' });
const todayLong = denver({ month: 'long', day: 'numeric', year: 'numeric' });

async function readState(name) {
  try { return (await readFile(`${STATE_DIR}/${name}`, 'utf8')).trim(); } catch { return ''; }
}

// The schedule fires at two UTC times so one of them is 5 PM in Denver in both summer and winter.
// Only the run that lands on Wednesday at or after 5 PM Denver time sends, and only once per day.
async function shouldRun() {
  if (DRY_RUN || FORCE) return true;
  const weekday = denver({ weekday: 'short' });
  const hour = Number(denver({ hour: 'numeric', hour12: false }));
  if (weekday !== 'Wed' || hour < 17) { console.log(`Not Wednesday 5 PM in Denver yet (${weekday} ${hour}:00). Skipping.`); return false; }
  if ((await readState('last_sent.txt')) === today) { console.log('Already sent today. Skipping.'); return false; }
  return true;
}

async function scrape() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    locale: 'en-US',
    viewport: { width: 1366, height: 900 },
  });
  try {
    await page.goto(START, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // BidNet serves a JavaScript bot check first. Wait for real listings to appear.
    await page.waitForSelector('a[href*="/solicitations/open-bids/"]', { timeout: 90000 });
  } catch (e) {
    const title = await page.title().catch(() => '');
    const snippet = (await page.evaluate(() => document.body.innerText.slice(0, 300)).catch(() => '')).replace(/\s+/g, ' ');
    await browser.close();
    throw new Error(`BidNet listings did not load (bot check not cleared or site down). Page title: "${title}". Page text: "${snippet}"`);
  }

  const result = await page.evaluate(async (agencies) => {
    const D = /(\d{1,2}\/\d{1,2}\/\d{2,4})/;
    const closing = (t) => {
      const c = /(clos(?:ing|es|ed|e)?|due|deadline)/i.exec(t || '');
      if (c) { const m = D.exec(t.slice(c.index + c[0].length)); if (m) return m[0]; }
      const m2 = D.exec(t || ''); return m2 ? m2[0] : '';
    };
    const rows = (doc, agency, region) => {
      const out = []; const seen = new Set();
      for (const a of doc.querySelectorAll('a[href*="/solicitations/open-bids/"]')) {
        const title = (a.textContent || '').replace(/\s+/g, ' ').trim();
        if (title.length < 12) continue;
        let n = a; let ctx = title;
        for (let i = 0; i < 4; i++) {
          n = n.parentElement; if (!n) break;
          if (n.querySelectorAll('a[href*="/solicitations/"]').length > 1) break;
          const t = (n.textContent || '').replace(/\s+/g, ' ').trim();
          if (t.length > 400) break; ctx = t;
        }
        const url = new URL(a.getAttribute('href'), location.origin).href.split('?')[0];
        if (seen.has(url)) continue; seen.add(url);
        out.push({ agency, region, title, closes: closing(ctx), url });
      }
      return out;
    };
    const parse = async (path) => {
      const r = await fetch(path);
      return { status: r.status, doc: new DOMParser().parseFromString(await r.text(), 'text/html') };
    };

    const local = []; const coverage = [];
    for (const [agency, slug, region] of agencies) {
      try {
        const { status, doc } = await parse('/colorado/' + slug);
        const got = rows(doc, agency, region);
        coverage.push({ agency, slug, region, status, count: got.length });
        local.push(...got);
      } catch (e) { coverage.push({ agency, slug, region, status: 0, count: 0, error: String(e) }); }
    }

    const statewide = []; const seen = new Set(); let pages = 0;
    for (let p = 1; p <= 30; p++) {
      let got = 0;
      try {
        const { doc } = await parse('/colorado/solicitations/open-bids?pageNumberSelect=' + p);
        for (const row of rows(doc, 'Statewide (agency shown on listing)', 'Statewide')) {
          if (seen.has(row.url)) continue; seen.add(row.url); got++; statewide.push(row);
        }
      } catch (e) { /* keep going */ }
      if (got === 0 && p > 2) break;
      pages = p;
    }
    return { local, statewide, coverage, pages };
  }, AGENCIES);

  await browser.close();
  return result;
}

const lower = (s) => s.toLowerCase();
const isConstruction = (title) => {
  const t = lower(title);
  return INCLUDE.some((k) => t.includes(k)) && !EXCLUDE.some((k) => t.includes(k));
};
const sortKey = (b) => {
  const m = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/.exec(b.closes || '');
  if (!m) return '9999';
  const y = m[3].length === 2 ? '20' + m[3] : m[3];
  return `${y}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
};
const byClosing = (a, b) => sortKey(a).localeCompare(sortKey(b));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function buildDigest({ local, statewide, coverage, pages }, sent) {
  const localUrls = new Set(local.map((b) => b.url));
  const localCon = local.filter((b) => isConstruction(b.title)).sort(byClosing);
  const stateCon = statewide.filter((b) => !localUrls.has(b.url) && isConstruction(b.title)).sort(byClosing);
  const isNew = (b) => !sent.has(b.url);
  const sections = [
    ['New this week: Northern Colorado', localCon.filter((b) => isNew(b) && b.region === 'Northern Colorado')],
    ['New this week: Mountain Towns', localCon.filter((b) => isNew(b) && b.region === 'Mountain Towns')],
    ['New this week: Rest of Colorado', stateCon.filter(isNew)],
    ['All open: Northern Colorado and Mountain Towns', localCon],
  ];
  const newCount = sections[0][1].length + sections[1][1].length + sections[2][1].length;
  const missing = coverage.filter((c) => c.count === 0);

  const item = (b) => `<tr><td style="padding:10px 0;border-bottom:1px solid #e6e2d6">
      <a href="${esc(b.url)}" style="color:#0F231C;font-weight:bold;text-decoration:none">${esc(b.title)}</a>
      <div style="color:#6b6b6b;font-size:12px;margin-top:3px">${esc(b.agency)}${b.closes ? ' &middot; closes ' + esc(b.closes) : ''}</div></td></tr>`;
  const section = ([name, list]) => `<h2 style="font-size:15px;letter-spacing:1px;text-transform:uppercase;color:#0F231C;border-bottom:2px solid #C8963E;padding-bottom:5px;margin:26px 0 4px">${esc(name)} (${list.length})</h2>
    ${list.length ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0">${list.map(item).join('')}</table>` : '<p style="color:#6b6b6b;font-size:13px;margin:8px 0">Nothing this week.</p>'}`;

  const html = `<div style="background:#f4f1ea;padding:24px 12px;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;padding:26px 28px;border-top:4px solid #C8963E">
    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6b6b6b">Standard Building Company</div>
    <h1 style="font-size:22px;margin:4px 0 2px;color:#0F231C">BidWatch: ${newCount} new construction bid${newCount === 1 ? '' : 's'}</h1>
    <div style="font-size:13px;color:#6b6b6b">Week of ${esc(todayLong)}</div>
    ${sections.map(section).join('\n')}
    <h2 style="font-size:15px;letter-spacing:1px;text-transform:uppercase;color:#0F231C;border-bottom:2px solid #C8963E;padding-bottom:5px;margin:26px 0 4px">Coverage</h2>
    <p style="font-size:13px;color:#444;margin:8px 0">Checked ${coverage.length} named agencies and ${pages} pages of the Colorado statewide feed (${statewide.length} open listings).</p>
    ${missing.length ? `<p style="font-size:13px;color:#444;margin:8px 0">No open listings found under these names, which can mean nothing is posted or that the agency posts elsewhere: ${esc(missing.map((c) => c.agency).join(', '))}.</p>` : ''}
    <p style="font-size:11px;color:#8a8a8a;margin-top:22px;border-top:1px solid #e6e2d6;padding-top:12px">Automated pull of public BidNet Direct (Rocky Mountain E-Purchasing System) pages. Titles are matched by keyword, so some listings will not be a fit and some may be missed. Confirm every opportunity on the issuing agency's official posting before acting. BidNet registration is required to submit.</p>
  </div></div>`;

  const text = [`Standard Building Company BidWatch, week of ${todayLong}`, `${newCount} new construction bids`, '',
    ...sections.flatMap(([name, list]) => [`${name.toUpperCase()} (${list.length})`, ...(list.length ? list.map((b) => `- ${b.title} | ${b.agency}${b.closes ? ' | closes ' + b.closes : ''}\n  ${b.url}`) : ['  Nothing this week.']), '']),
    `Coverage: ${coverage.length} named agencies, ${pages} statewide pages.`].join('\n');

  const subject = newCount ? `SBC BidWatch: ${newCount} new construction bid${newCount === 1 ? '' : 's'}, ${todayLong}` : `SBC BidWatch: no new bids, ${todayLong}`;
  const reportedUrls = [...localCon, ...stateCon].map((b) => b.url);
  return { subject, html, text, newCount, reportedUrls, localCon, stateCon };
}

async function sendEmail(subject, html, text) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return false;
  const nodemailer = (await import('nodemailer')).default;
  const port = Number(SMTP_PORT || 465);
  const transport = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  await transport.sendMail({ from: MAIL_FROM || `SBC BidWatch <${SMTP_USER}>`, to: MAIL_TO, subject, html, text });
  return true;
}

// Fallback when mail is not configured or fails: the digest is filed as a GitHub issue so it is not lost.
async function openIssue(title, body) {
  const { GITHUB_TOKEN, GITHUB_REPOSITORY } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_REPOSITORY) return false;
  const r = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/issues`, {
    method: 'POST',
    headers: { authorization: `Bearer ${GITHUB_TOKEN}`, accept: 'application/vnd.github+json', 'content-type': 'application/json' },
    body: JSON.stringify({ title, body: body.slice(0, 60000), labels: ['bidwatch'] }),
  });
  if (!r.ok) console.log('Issue creation failed:', r.status, await r.text());
  return r.ok;
}

async function deliver(subject, html, text) {
  if (DRY_RUN) { console.log(`[dry run] Would send "${subject}" to ${MAIL_TO}`); return 'dry-run'; }
  try {
    if (await sendEmail(subject, html, text)) { console.log(`Emailed "${subject}" to ${MAIL_TO}`); return 'email'; }
    console.log('SMTP secrets are not set. Filing the digest as a GitHub issue instead.');
  } catch (e) { console.log('Email failed:', e.message, 'Filing the digest as a GitHub issue instead.'); }
  return (await openIssue(subject, '```\n' + text + '\n```')) ? 'issue' : 'none';
}

if (await shouldRun()) {
  let data;
  try {
    data = await scrape();
    if (!data.local.length && !data.statewide.length) throw new Error('BidNet returned zero listings.');
  } catch (e) {
    console.error('RUN FAILED:', e.message);
    await deliver(`SBC BidWatch: run failed, ${todayLong}`, `<p>The weekly bid collection did not complete.</p><p>${esc(e.message)}</p>`, `The weekly bid collection did not complete.\n\n${e.message}`);
    process.exit(1);
  }
  const sent = new Set((await readState('sent.txt')).split('\n').filter(Boolean));
  const digest = buildDigest(data, sent);

  console.log(`Local rows: ${data.local.length}. Statewide rows: ${data.statewide.length} over ${data.pages} pages.`);
  console.log(`Construction matches: ${digest.localCon.length} local, ${digest.stateCon.length} statewide. New: ${digest.newCount}.`);
  console.log('Per-agency coverage:'); for (const c of data.coverage) console.log(`  ${String(c.count).padStart(3)}  http ${c.status}  ${c.agency} (${c.slug})`);

  await mkdir('out', { recursive: true });
  await writeFile('out/digest.html', digest.html);
  await writeFile('out/digest.txt', digest.text);

  const how = await deliver(digest.subject, digest.html, digest.text);
  if (how === 'email' || how === 'issue') {
    await mkdir(STATE_DIR, { recursive: true });
    const merged = [...new Set([...sent, ...digest.reportedUrls])].slice(-3000);
    await writeFile(`${STATE_DIR}/sent.txt`, merged.join('\n') + '\n');
    await writeFile(`${STATE_DIR}/last_sent.txt`, today + '\n');
  }
  if (how === 'none') process.exit(1);
}
