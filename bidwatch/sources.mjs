// Collectors for each kind of bid source. Each returns rows: { source, agency, region, title, closes, url }
// plus a coverage entry per agency so gaps show up in the digest.
import { BIDNET, AREA_WORDS, CIVICPLUS, LINK_PAGES } from './agencies.mjs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
export const newContext = (browser) => browser.newContext({ userAgent: UA, locale: 'en-US', viewport: { width: 1366, height: 900 } });

// Shared in-page helper: pull listing links, a nearby closing date, and the URL from a document.
const ROW_HELPER = `
  window.__rows = (doc, sel, base) => {
    const D = /(\\d{1,2}\\/\\d{1,2}\\/\\d{2,4})/;
    const closing = (t) => { const c = /(clos(?:ing|es|ed|e)?|due|deadline)/i.exec(t || ''); if (c) { const m = D.exec(t.slice(c.index + c[0].length)); if (m) return m[0]; } const m2 = D.exec(t || ''); return m2 ? m2[0] : ''; };
    const out = []; const seen = new Set();
    for (const a of doc.querySelectorAll(sel)) {
      const title = (a.textContent || '').replace(/\\s+/g, ' ').trim();
      if (title.length < 8 || /^read on/i.test(title)) continue;
      let n = a; let ctx = title;
      for (let i = 0; i < 5; i++) { n = n.parentElement; if (!n) break; if (n.querySelectorAll(sel).length > 2) break; const t = (n.textContent || '').replace(/\\s+/g, ' ').trim(); if (t.length > 600) break; ctx = t; }
      const url = new URL(a.getAttribute('href'), base).href;
      if (seen.has(url)) continue; seen.add(url);
      out.push({ title, closes: closing(ctx), url });
    }
    return out;
  };`;

const areaFor = (name) => {
  const n = name.toLowerCase();
  for (const [region, words] of Object.entries(AREA_WORDS)) if (words.some((w) => n.includes(w))) return region;
  return null;
};

export async function collectBidNet(ctx) {
  const page = await ctx.newPage();
  await page.goto('https://www.bidnetdirect.com/colorado/solicitations/open-bids', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('a[href*="/solicitations/open-bids/"]', { timeout: 90000 });
  await page.addScriptTag({ content: ROW_HELPER });

  // Directory of participating agencies, used to pick up districts in the service area automatically.
  const directory = await page.evaluate(async () => {
    const found = {}; const queue = ['/colorado/participating-buyers']; const visited = new Set();
    while (queue.length && visited.size < 60) {
      const path = queue.shift(); if (visited.has(path)) continue; visited.add(path);
      try {
        const d = new DOMParser().parseFromString(await (await fetch(path)).text(), 'text/html');
        for (const a of d.querySelectorAll('a[href]')) {
          const h = a.getAttribute('href') || '';
          const m = /^(?:https?:\/\/www\.bidnetdirect\.com)?\/colorado\/([a-z0-9-]+)\/?$/.exec(h);
          const name = (a.textContent || '').replace(/Organization logo of/i, '').replace(/var g_.*/, '').replace(/\s+/g, ' ').trim();
          if (m && name && m[1] !== 'participating-buyers' && m[1] !== 'solicitations') found[m[1]] = name.slice(0, Math.ceil(name.length / 2)).trim() || name;
          if (/participating-buyers/.test(h) && !/changePage/.test(h)) queue.push(h.replace(/^https?:\/\/www\.bidnetdirect\.com/, ''));
        }
      } catch (e) { /* keep going */ }
    }
    return found;
  });

  const agencies = BIDNET.map(([name, slug, region]) => ({ name, slug, region }));
  const known = new Set(agencies.map((a) => a.slug));
  for (const [slug, name] of Object.entries(directory)) {
    const region = areaFor(name);
    if (region && !known.has(slug)) { agencies.push({ name, slug, region }); known.add(slug); }
  }

  const result = await page.evaluate(async (agencies) => {
    const rows = []; const coverage = [];
    for (const ag of agencies) {
      try {
        const r = await fetch('/colorado/' + ag.slug);
        const d = new DOMParser().parseFromString(await r.text(), 'text/html');
        const got = window.__rows(d, 'a[href*="/solicitations/open-bids/"]', location.origin);
        coverage.push({ agency: ag.name, region: ag.region, source: 'BidNet', ok: r.status === 200, count: got.length });
        for (const g of got) rows.push({ ...g, url: g.url.split('?')[0], agency: ag.name, region: ag.region, source: 'BidNet' });
      } catch (e) { coverage.push({ agency: ag.name, region: ag.region, source: 'BidNet', ok: false, count: 0 }); }
    }
    // Statewide feed, all Colorado agencies on BidNet. Rows carry no agency name.
    const statewide = []; const seen = new Set(); let pages = 0;
    for (let p = 1; p <= 40; p++) {
      const path = p === 1 ? '/colorado/solicitations/open-bids' : '/colorado/solicitations/open-bids/page' + p;
      let got = 0;
      try {
        const d = new DOMParser().parseFromString(await (await fetch(path)).text(), 'text/html');
        for (const g of window.__rows(d, 'a[href*="/solicitations/open-bids/"]', location.origin)) {
          const url = g.url.split('?')[0]; if (seen.has(url)) continue; seen.add(url); got++;
          statewide.push({ ...g, url, agency: 'Colorado agency on BidNet (see listing)', region: 'Other Colorado', source: 'BidNet statewide' });
        }
      } catch (e) { /* keep going */ }
      if (!got) break; pages = p;
    }
    return { rows, coverage, statewide, pages };
  }, agencies);
  await page.close();
  return { ...result, directoryCount: Object.keys(directory).length };
}

async function linksFrom(ctx, url, selector) {
  const page = await ctx.newPage();
  try {
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1500);
    if (!resp || resp.status() >= 400) return { ok: false, rows: [] };
    await page.addScriptTag({ content: ROW_HELPER });
    const rows = await page.evaluate((sel) => window.__rows(document, sel, location.href), selector);
    return { ok: true, rows };
  } catch (e) { return { ok: false, rows: [] }; } finally { await page.close(); }
}

export async function collectTownSites(ctx) {
  const rows = []; const coverage = [];
  for (const [agency, url, region] of CIVICPLUS) {
    const r = await linksFrom(ctx, url, 'a[href*="bidID="], a[href*="bidid="]');
    coverage.push({ agency, region, source: 'Town or county website', ok: r.ok, count: r.rows.length });
    for (const g of r.rows) rows.push({ ...g, agency, region, source: 'Town or county website' });
  }
  for (const [agency, url, region, pattern] of LINK_PAGES) {
    const r = await linksFrom(ctx, url, `a[href*="${pattern}"]`);
    coverage.push({ agency, region, source: 'County website', ok: r.ok, count: r.rows.length });
    for (const g of r.rows) rows.push({ ...g, agency: agency.replace(' Road & Bridge', ''), region, source: 'County website' });
  }
  return { rows, coverage };
}

// State of Colorado Vendor Self Service: published solicitations from every state agency.
export async function collectStateVSS(ctx) {
  const VSS = 'https://prd.co.cgiadvantage.com/PRDVSS1X1/Advantage4';
  const page = await ctx.newPage();
  const rows = [];
  try {
    await page.goto(VSS, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.getByText(/view published solicitations/i).first().click({ timeout: 45000 });
    await page.getByText(/published solicitations/i).nth(1).waitFor({ timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(8000);
    const per100 = page.getByText('100', { exact: true }).first();
    if (await per100.count()) { await per100.click().catch(() => {}); await page.waitForTimeout(6000); }
    const seen = new Set();
    for (let p = 0; p < 15; p++) {
      const text = await page.evaluate(() => document.body.innerText);
      let added = 0;
      for (const block of text.split(/\n\s*Respond\s*\n/)) {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        const numIdx = lines.findIndex((l) => /^[A-Z0-9]+-[A-Z0-9]{4}-\d{6,}/.test(l));
        if (numIdx < 2) continue;
        const number = lines[numIdx];
        if (seen.has(number)) continue; seen.add(number); added++;
        const closes = (lines.find((l) => /\d{1,2}\/\d{1,2}\/\d{4}/.test(l)) || '').replace(/\s+[AP]M.*$/, '');
        const title = lines[numIdx - 3] || lines[numIdx - 2];
        const dept = lines[numIdx - 2];
        const category = lines[numIdx + 2] && lines[numIdx + 2] !== '-' ? lines[numIdx + 2] : '';
        rows.push({ title: `${title}${category ? ' (' + category + ')' : ''}`, closes, url: `${VSS}#${number}`, agency: `State: ${dept}`, region: 'State of Colorado', source: 'Colorado VSS', number });
      }
      const next = page.locator('[aria-label*="Next" i], button:has-text("Next"), a:has-text("Next")').first();
      if (!added || !(await next.count()) || !(await next.isEnabled().catch(() => false))) break;
      await next.click().catch(() => {}); await page.waitForTimeout(5000);
    }
    return { rows, coverage: [{ agency: 'State agencies (Colorado VSS)', region: 'State of Colorado', source: 'Colorado VSS', ok: rows.length > 0, count: rows.length }] };
  } catch (e) {
    return { rows, coverage: [{ agency: 'State agencies (Colorado VSS)', region: 'State of Colorado', source: 'Colorado VSS', ok: false, count: rows.length, error: String(e).slice(0, 160) }] };
  } finally { await page.close(); }
}
