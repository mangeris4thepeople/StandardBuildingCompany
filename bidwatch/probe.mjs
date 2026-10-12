// One-off discovery: where does each government in the service area post bids?
import { writeFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const SITES = {
  'State of Colorado (VSS)': ['https://codpa-vss.hostams.com/PRDVSS1X1/Advantage4', 'https://www.colorado.gov/vss'],
  'CDOT': ['https://www.codot.gov/business/bidding'],
  'Larimer County': ['https://www.larimer.gov/purchasing'],
  'Weld County': ['https://www.weld.gov/Government/Departments/Purchasing'],
  'Boulder County': ['https://bouldercounty.gov/government/purchasing/'],
  'Eagle County': ['https://www.eaglecounty.us/Departments/Finance/Purchasing', 'https://www.eaglecounty.us'],
  'Pitkin County': ['https://pitkincounty.com/Bids.aspx', 'https://pitkincounty.com'],
  'Grand County': ['https://www.co.grand.co.us/Bids.aspx', 'https://www.co.grand.co.us'],
  'Summit County': ['https://www.summitcountyco.gov/Bids.aspx', 'https://www.summitcountyco.gov'],
  'Routt County': ['https://www.co.routt.co.us/Bids.aspx', 'https://www.co.routt.co.us'],
  'City of Loveland': ['https://www.lovelandgov.com/Bids.aspx', 'https://www.lovelandgov.com'],
  'City of Fort Collins': ['https://www.fcgov.com/purchasing/', 'https://www.fcgov.com'],
  'City of Greeley': ['https://greeleygov.com/government/finance/purchasing', 'https://greeleygov.com'],
  'City of Longmont': ['https://www.longmontcolorado.gov/departments/departments-n-z/purchasing', 'https://www.longmontcolorado.gov'],
  'Town of Windsor': ['https://www.windsorgov.com/Bids.aspx', 'https://www.windsorgov.com'],
  'Town of Berthoud': ['https://www.berthoud.org/Bids.aspx', 'https://www.berthoud.org'],
  'Town of Johnstown': ['https://www.johnstown.colorado.gov/bids', 'https://www.johnstownco.gov/Bids.aspx'],
  'Town of Timnath': ['https://timnath.org/Bids.aspx', 'https://timnath.org'],
  'Town of Wellington': ['https://www.wellingtoncolorado.gov/Bids.aspx', 'https://www.wellingtoncolorado.gov'],
  'Town of Estes Park': ['https://www.estespark.colorado.gov/bids', 'https://estespark.colorado.gov'],
  'Town of Milliken': ['https://www.millikenco.gov/Bids.aspx', 'https://www.millikenco.gov'],
  'City of Evans': ['https://www.evanscolorado.gov/bids', 'https://www.evanscolorado.gov'],
  'Town of Severance': ['https://www.townofseverance.org/Bids.aspx', 'https://www.townofseverance.org'],
  'Town of Mead': ['https://www.townofmead.org/Bids.aspx', 'https://www.townofmead.org'],
  'Town of Vail': ['https://www.vail.gov/government/departments/finance/bids', 'https://www.vail.gov'],
  'Town of Avon': ['https://www.avon.org/Bids.aspx', 'https://www.avon.org'],
  'City of Aspen': ['https://www.aspen.gov/Bids.aspx', 'https://www.aspen.gov'],
  'Town of Winter Park': ['https://www.wpgov.com/Bids.aspx', 'https://www.wpgov.com'],
  'City of Steamboat Springs': ['https://steamboatsprings.net/Bids.aspx', 'https://steamboatsprings.net'],
  'Town of Frisco (Copper Mtn area)': ['https://www.friscogov.com/Bids.aspx'],
  'Thompson School District': ['https://www.tsd.org/departments/purchasing'],
  'Weld RE-4 / Greeley-Evans D6': ['https://www.greeleyschools.org/Page/2131'],
};

const BIDWORDS = /\b(bid|bids|rfp|rfq|ifb|itb|rfi|solicitation|proposal|invitation to bid|request for)\b/i;
const GOV_PLATFORMS = /bidnetdirect|bonfirehub|publicpurchase|demandstar|questcdn|opengov|procurement\.opengov|bidexpress|negometrix|periscope|ionwave|planetbids|vendorregistry|civicplus|bids\.aspx/i;

const browser = await chromium.launch();
const page = await browser.newPage({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' });
const report = { bidnet: {}, sites: {} };

// BidNet: harvest agency links from the Colorado landing pages, and probe candidate slugs.
try {
  await page.goto('https://www.bidnetdirect.com/colorado/solicitations/open-bids', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('a[href*="/solicitations/open-bids/"]', { timeout: 90000 });
  report.bidnet = await page.evaluate(async () => {
    const links = new Set();
    for (const path of ['/colorado', '/colorado/agencies', '/colorado/buyers', '/colorado/solicitations/open-bids']) {
      try {
        const r = await fetch(path); const d = new DOMParser().parseFromString(await r.text(), 'text/html');
        for (const a of d.querySelectorAll('a[href]')) {
          const h = a.getAttribute('href') || '';
          const m = /^(?:https?:\/\/www\.bidnetdirect\.com)?\/colorado\/([a-z0-9-]+)\/?$/.exec(h);
          if (m) links.add(m[1] + ' :: ' + (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60));
        }
      } catch (e) {}
    }
    const cands = ['town-of-windsor','townofwindsor','town-of-estes-park','townofestespark','eagle-county','eaglecounty','town-of-vail','townofvail','town-of-avon','townofavon','pitkin-county','pitkincounty','city-of-aspen','cityofaspen','summit-county','summitcounty','summit-county-government','grand-county','grandcounty','town-of-winter-park','routt-county','routtcounty','city-of-steamboat-springs','steamboat-springs','town-of-berthoud','townofberthoud','town-of-johnstown','town-of-timnath','town-of-wellington','town-of-milliken','city-of-evans','town-of-severance','town-of-mead','thompson-school-district','thompson-r2-j-school-district','greeley-evans-school-district-6','weld-county-school-district-6','eagle-county-school-district','summit-school-district','roaring-fork-school-district','aspen-school-district','steamboat-springs-school-district','east-grand-school-district','state-of-colorado','colorado-department-of-transportation','cdot'];
    const probe = {};
    for (const s of cands) {
      try { const r = await fetch('/colorado/' + s); const t = await r.text(); const d = new DOMParser().parseFromString(t, 'text/html');
        probe[s] = { status: r.status, open: d.querySelectorAll('a[href*="/solicitations/open-bids/"]').length, title: (d.title || '').slice(0, 80) };
      } catch (e) { probe[s] = { error: String(e) }; }
    }
    return { agencyLinks: [...links].sort(), probe };
  });
} catch (e) { report.bidnet.error = String(e); }

for (const [name, urls] of Object.entries(SITES)) {
  report.sites[name] = [];
  for (const url of urls) {
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1500);
      const info = await page.evaluate(({ bw, gp }) => {
        const BW = new RegExp(bw, 'i'); const GP = new RegExp(gp, 'i');
        const links = [...document.querySelectorAll('a[href]')].map((a) => ({ t: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90), h: a.href }));
        return {
          finalUrl: location.href, title: document.title.slice(0, 80),
          bidLinks: links.filter((l) => BW.test(l.t) || /bids?\.aspx|\/bids?\b|purchas|procure|solicit/i.test(l.h)).slice(0, 25),
          platforms: [...new Set(links.map((l) => l.h).filter((h) => GP.test(h)).map((h) => new URL(h).hostname + new URL(h).pathname.slice(0, 60)))].slice(0, 10),
        };
      }, { bw: BIDWORDS.source, gp: GOV_PLATFORMS.source });
      report.sites[name].push({ url, status: resp ? resp.status() : 0, ...info });
    } catch (e) { report.sites[name].push({ url, error: String(e).slice(0, 160) }); }
  }
}
await browser.close();
await mkdir('out', { recursive: true });
await writeFile('out/probe.json', JSON.stringify(report, null, 1));
console.log('probe done');
