// Submits every URL in the production sitemap to IndexNow (Bing, Yandex, Naver, Seznam, and partners share
// the feed) after a deploy. Waits until the live sitemap carries the deployed commit so URLs are only
// submitted once they are actually serving. Optionally resubmits the sitemap to Bing Webmaster Tools
// when BING_WEBMASTER_API_KEY is set. Google has no ping endpoint anymore; it reads the sitemap from
// Search Console on its own schedule, so Search Console submission is a one-time manual step.
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://www.standardbuildingcompany.net';
const HOST = 'www.standardbuildingcompany.net';
const key = (await readFile(join(root, 'scripts', 'indexnow-key.txt'), 'utf8')).trim();
const sha = (process.env.GITHUB_SHA || '').slice(0, 12);
const waitMinutes = Number(process.env.WAIT_MINUTES || 20);

async function fetchSitemap() {
  const res = await fetch(`${SITE}/sitemap.xml?t=${Date.now()}`, { headers: { 'cache-control': 'no-cache' } });
  if (!res.ok) throw new Error(`sitemap fetch ${res.status}`);
  return res.text();
}

let xml = '';
const deadline = Date.now() + waitMinutes * 60_000;
while (true) {
  try {
    xml = await fetchSitemap();
    if (!sha || xml.includes(`build ${sha}`)) break;
    console.log(`Live sitemap is not yet from ${sha}; waiting...`);
  } catch (e) {
    console.log(`Sitemap not reachable yet: ${e.message}`);
  }
  if (Date.now() > deadline) {
    console.log(`Gave up waiting for commit ${sha} after ${waitMinutes} minutes. Submitting whatever is live.`);
    xml = xml || (await fetchSitemap());
    break;
  }
  await new Promise((r) => setTimeout(r, 30_000));
}

const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) throw new Error('No URLs found in sitemap');

const keyCheck = await fetch(`${SITE}/${key}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== key) throw new Error(`IndexNow key file is not live at ${SITE}/${key}.txt`);

const body = { host: HOST, key, keyLocation: `${SITE}/${key}.txt`, urlList: urls };
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});
console.log(`IndexNow: submitted ${urls.length} URLs, HTTP ${res.status} ${res.statusText}`);
if (![200, 202].includes(res.status)) {
  console.log(await res.text());
  process.exit(1);
}

if (process.env.BING_WEBMASTER_API_KEY) {
  const bing = await fetch(
    `https://ssl.bing.com/webmaster/api.svc/json/SubmitFeed?apikey=${process.env.BING_WEBMASTER_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ siteUrl: `${SITE}/`, feedUrl: `${SITE}/sitemap.xml` }) }
  );
  console.log(`Bing Webmaster sitemap resubmit: HTTP ${bing.status}`);
}
