// SBC BidWatch: collects open public construction bids from BidNet Direct and emails a weekly digest.
// Runs in GitHub Actions. See .github/workflows/bidwatch.yml for the schedule.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { INCLUDE, EXCLUDE, NOT_COVERED } from './agencies.mjs';
import { newContext, collectBidNet, collectTownSites, collectStateVSS } from './sources.mjs';

const DRY_RUN = process.env.DRY_RUN === '1';
const FORCE = process.env.FORCE === '1';
const MAIL_TO = process.env.MAIL_TO || 'info@standardbuildingcompany.net';
const STATE_DIR = process.env.STATE_DIR || 'state';

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
  const ctx = await newContext(browser);
  const coverage = []; let rows = []; let statewide = []; let pages = 0; let directoryCount = 0;
  try {
    const bn = await collectBidNet(ctx);
    rows.push(...bn.rows); coverage.push(...bn.coverage); statewide = bn.statewide; pages = bn.pages; directoryCount = bn.directoryCount;
  } catch (e) {
    coverage.push({ agency: 'BidNet Direct (all BidNet agencies)', region: 'All', source: 'BidNet', ok: false, count: 0, error: String(e).slice(0, 200) });
  }
  const towns = await collectTownSites(ctx); rows.push(...towns.rows); coverage.push(...towns.coverage);
  const state = await collectStateVSS(ctx); rows.push(...state.rows); coverage.push(...state.coverage);
  await browser.close();
  return { rows, statewide, coverage, pages, directoryCount };
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

const REGIONS = ['Northern Colorado', 'Mountain Towns', 'State of Colorado'];

function buildDigest({ rows, statewide, coverage, pages, directoryCount }, sent) {
  // Same bid can appear on BidNet and on a town site. Keep one per title+agency.
  const seenKey = new Set(); const area = [];
  for (const b of rows) {
    const key = (b.agency.replace(/^State: /, '') + '|' + b.title).toLowerCase().replace(/[^a-z0-9|]/g, '');
    if (seenKey.has(key)) continue; seenKey.add(key); area.push(b);
  }
  const areaUrls = new Set(area.map((b) => b.url));
  const areaCon = area.filter((b) => isConstruction(b.title)).sort(byClosing);
  const otherCon = statewide.filter((b) => !areaUrls.has(b.url) && isConstruction(b.title)).sort(byClosing);
  const isNew = (b) => !sent.has(b.url);
  const sections = [
    ...REGIONS.map((r) => [`New this week: ${r}`, areaCon.filter((b) => b.region === r && isNew(b))]),
    ['Everything still open in the service area', areaCon],
  ];
  const newCount = sections.slice(0, 3).reduce((n, [, l]) => n + l.length, 0);
  const failed = coverage.filter((c) => !c.ok);

  const item = (b) => `<tr><td style="padding:10px 0;border-bottom:1px solid #e6e2d6">
      <a href="${esc(b.url)}" style="color:#0F231C;font-weight:bold;text-decoration:none">${esc(b.title)}</a>
      <div style="color:#6b6b6b;font-size:12px;margin-top:3px">${esc(b.agency)}${b.closes ? ' &middot; closes ' + esc(b.closes) : ''}${b.number ? ' &middot; ' + esc(b.number) : ''}</div></td></tr>`;
  const h2 = (t) => `<h2 style="font-size:15px;letter-spacing:1px;text-transform:uppercase;color:#0F231C;border-bottom:2px solid #C8963E;padding-bottom:5px;margin:26px 0 4px">${t}</h2>`;
  const section = ([name, list]) => `${h2(`${esc(name)} (${list.length})`)}
    ${list.length ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0">${list.map(item).join('')}</table>` : '<p style="color:#6b6b6b;font-size:13px;margin:8px 0">Nothing new.</p>'}`;
  const covLine = (c) => `${c.agency} (${c.source})`;

  const html = `<div style="background:#f4f1ea;padding:24px 12px;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;padding:26px 28px;border-top:4px solid #C8963E">
    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6b6b6b">Standard Building Company</div>
    <h1 style="font-size:22px;margin:4px 0 2px;color:#0F231C">BidWatch: ${newCount} new construction bid${newCount === 1 ? '' : 's'}</h1>
    <div style="font-size:13px;color:#6b6b6b">State, county, city, and municipal bids for the service area &middot; ${esc(todayLong)}</div>
    ${sections.map(section).join('\n')}
    <p style="font-size:13px;color:#444;margin:18px 0 0">BidNet also lists ${otherCon.length} construction bids from Colorado agencies outside the service area. <a href="https://www.bidnetdirect.com/colorado/solicitations/open-bids" style="color:#0F231C;font-weight:bold">Browse them on BidNet</a>.</p>
    ${h2('Coverage')}
    <p style="font-size:13px;color:#444;margin:8px 0">Checked ${coverage.length} agency sources (${coverage.filter((c) => c.ok).length} reachable), the State of Colorado VSS portal, and ${pages} pages of the BidNet Colorado feed.</p>
    ${failed.length ? `<p style="font-size:13px;color:#444;margin:8px 0"><b>Could not read this week:</b> ${esc(failed.map(covLine).join(', '))}.</p>` : ''}
    <p style="font-size:13px;color:#444;margin:8px 0"><b>Not covered (sites block automated access):</b> ${esc(NOT_COVERED.join('; '))}. Check these by hand.</p>
    <p style="font-size:11px;color:#8a8a8a;margin-top:22px;border-top:1px solid #e6e2d6;padding-top:12px">Automated weekly pull of public bid postings. Only titles that look like construction work are listed, so some listings will not be a fit and some may be missed. State solicitations link to the Colorado VSS portal; search the solicitation number shown. Confirm every opportunity on the issuing agency's official posting before acting.</p>
  </div></div>`;

  const text = [`Standard Building Company BidWatch, ${todayLong}`, `${newCount} new construction bids`, '',
    ...sections.flatMap(([name, list]) => [`${name.toUpperCase()} (${list.length})`, ...(list.length ? list.map((b) => `- ${b.title} | ${b.agency}${b.closes ? ' | closes ' + b.closes : ''}\n  ${b.url}`) : ['  Nothing new.']), '']),
    `Could not read: ${failed.map(covLine).join(', ') || 'none'}`, `Not covered: ${NOT_COVERED.join('; ')}`].join('\n');

  const subject = newCount ? `SBC BidWatch: ${newCount} new construction bid${newCount === 1 ? '' : 's'}, ${todayLong}` : `SBC BidWatch: no new bids, ${todayLong}`;
  const reportedUrls = areaCon.map((b) => b.url);
  return { subject, html, text, newCount, reportedUrls, areaCon, otherCon, directoryCount };
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
    if (!data.rows.length && !data.statewide.length) throw new Error('Every source returned zero listings.');
  } catch (e) {
    console.error('RUN FAILED:', e.message);
    await deliver(`SBC BidWatch: run failed, ${todayLong}`, `<p>The weekly bid collection did not complete.</p><p>${esc(e.message)}</p>`, `The weekly bid collection did not complete.\n\n${e.message}`);
    process.exit(1);
  }
  const sent = new Set((await readState('sent.txt')).split('\n').filter(Boolean));
  const digest = buildDigest(data, sent);

  const summary = { rows: data.rows.length, statewide: data.statewide.length, pages: data.pages, directory: data.directoryCount, areaConstruction: digest.areaCon.length, otherConstruction: digest.otherCon.length, newCount: digest.newCount, coverage: data.coverage };
  console.log(JSON.stringify(summary, null, 1));

  await mkdir('out', { recursive: true });
  await writeFile('out/digest.html', digest.html);
  await writeFile('out/digest.txt', digest.text);
  await writeFile('out/summary.json', JSON.stringify(summary, null, 1));

  const how = await deliver(digest.subject, digest.html, digest.text);
  if (how === 'email' || how === 'issue') {
    await mkdir(STATE_DIR, { recursive: true });
    const merged = [...new Set([...sent, ...digest.reportedUrls])].slice(-3000);
    await writeFile(`${STATE_DIR}/sent.txt`, merged.join('\n') + '\n');
    await writeFile(`${STATE_DIR}/last_sent.txt`, today + '\n');
  }
  if (how === 'none') process.exit(1);
}
