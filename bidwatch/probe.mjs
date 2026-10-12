// Discovery pass 2: BidNet agency directory, statewide pagination, Colorado VSS, and non-CivicPlus bid pages.
import { writeFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' });
const page = await ctx.newPage();
const report = {};

try {
  await page.goto('https://www.bidnetdirect.com/colorado/solicitations/open-bids', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('a[href*="/solicitations/open-bids/"]', { timeout: 90000 });
  report.paging = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => ({ t: a.textContent.replace(/\s+/g, ' ').trim().slice(0, 30), h: a.getAttribute('href') })).filter((l) => /page|next|›|»/i.test(l.t + l.h)).slice(0, 40));
  report.totalText = await page.evaluate(() => (document.body.innerText.match(/[\d,]+\s+(results|solicitations|bids)[^\n]{0,60}/i) || [''])[0]);
  report.buyers = await page.evaluate(async () => {
    const out = [];
    for (const path of ['/colorado/participating-buyers', '/colorado/participating-buyers?page=2', '/colorado/participating-buyers?pageNumberSelect=2']) {
      try {
        const r = await fetch(path); const d = new DOMParser().parseFromString(await r.text(), 'text/html');
        const links = [...d.querySelectorAll('a[href]')].map((a) => (a.getAttribute('href') || '') + ' :: ' + a.textContent.replace(/\s+/g, ' ').trim().slice(0, 70));
        out.push({ path, status: r.status, n: links.length, links: links.filter((l) => /\/colorado\/[a-z0-9-]+/.test(l)).slice(0, 600), pager: links.filter((l) => /page/i.test(l)).slice(0, 20) });
      } catch (e) { out.push({ path, error: String(e) }); }
    }
    return out;
  });
} catch (e) { report.bidnetError = String(e); }

// Colorado VSS public solicitations
try {
  const vss = await ctx.newPage();
  await vss.goto('https://prd.co.cgiadvantage.com/PRDVSS1X1/Advantage4', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await vss.waitForTimeout(8000);
  report.vssHome = (await vss.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 1500);
  const btn = vss.getByText(/published solicitations/i).first();
  if (await btn.count()) {
    await btn.click(); await vss.waitForTimeout(10000);
    report.vssSolicitations = (await vss.evaluate(() => document.body.innerText)).replace(/[ \t]+/g, ' ').slice(0, 6000);
  } else report.vssSolicitations = 'no Published Solicitations control found';
} catch (e) { report.vssError = String(e).slice(0, 300); }

const PAGES = {
  'Summit County': 'https://www.summitcountyco.gov/how_do_i/apply_for/bid_postings.php',
  'Summit County Road & Bridge': 'https://www.summitcountyco.gov/services/public_works/road_bridge/r_b_bids.php',
  'Town of Estes Park': 'https://estespark.colorado.gov/rfp',
  'City of Evans': 'https://www.evanscolorado.gov/building-business-development/bids-and-rfps/',
  'City of Greeley': 'https://greeleyco.gov/finance/purchasing',
  'City of Longmont': 'https://longmontcolorado.gov/purchasing-and-contracts/',
  'Thompson School District': 'https://www.tsd.org/departments/business-services/materials-and-procurement',
  'CDOT future bids': 'https://www.codot.gov/business/bidding/future-bidding-opportunities',
  'Town of Johnstown': 'https://www.johnstownco.gov/Bids.aspx',
  'Town of Timnath': 'https://timnath.org/Bids.aspx',
  'Town of Wellington': 'https://www.wellingtoncolorado.gov/Bids.aspx',
  'City of Fort Collins': 'https://www.fcgov.com/purchasing/',
  'City of Loveland': 'https://www.lovelandgov.com/Bids.aspx',
  'City of Loveland alt': 'https://www.lovgov.org',
  'Town of Vail': 'https://www.vail.gov',
  'Eagle County': 'https://www.eaglecounty.us',
  'Aspen Bids.aspx': 'https://www.aspen.gov/Bids.aspx',
  'Avon bids': 'https://www.avon.org/bids',
};
report.pages = {};
for (const [name, url] of Object.entries(PAGES)) {
  const p = await ctx.newPage();
  try {
    const resp = await p.goto(url, { waitUntil: 'load', timeout: 45000 });
    await p.waitForTimeout(2500);
    report.pages[name] = await p.evaluate(() => {
      const main = document.querySelector('main, #main, #content, .content, #contentarea, article') || document.body;
      const links = [...main.querySelectorAll('a[href]')].map((a) => ({ t: a.textContent.replace(/\s+/g, ' ').trim().slice(0, 100), h: a.href })).filter((l) => l.t.length > 6);
      return { finalUrl: location.href, title: document.title.slice(0, 70), links: links.slice(0, 60), text: main.innerText.replace(/\s+/g, ' ').slice(0, 1200) };
    });
    report.pages[name].status = resp ? resp.status() : 0;
  } catch (e) { report.pages[name] = { error: String(e).slice(0, 200) }; }
  await p.close();
}
await browser.close();
await mkdir('out', { recursive: true });
await writeFile('out/probe.json', JSON.stringify(report, null, 1));
