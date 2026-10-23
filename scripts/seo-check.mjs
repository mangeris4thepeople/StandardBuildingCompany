// Build-time SEO gate. Reads every prerendered HTML file in dist/ and fails the build when a
// route is missing a title, description, canonical, single H1, or JSON-LD, when JSON-LD does
// not parse, when titles or descriptions repeat across routes, when a page is thin, or when an
// em dash slips into the output. Run with --report to print the audit table without failing.
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, dirname, relative } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const dist = join(root, 'dist');
const reportOnly = process.argv.includes('--report');
const MIN_WORDS = Number(process.env.SEO_MIN_WORDS || 600);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry);
    const s = await stat(full);
    if (s.isDirectory()) out.push(...(await walk(full)));
    else if (entry === 'index.html' || entry === '404.html') out.push(full);
  }
  return out;
}

const pick = (html, re) => { const m = html.match(re); return m ? m[1].trim() : ''; };
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

function words(html) {
  const main = pick(html, /<main[^>]*>([\s\S]*?)<\/main>/i) || html;
  const text = main
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ');
  return text.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length;
}

const files = await walk(dist);
const rows = [];
const problems = [];
const seenTitle = new Map();
const seenDesc = new Map();

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const route = '/' + relative(dist, dirname(file)).replace(/\\/g, '/').replace(/^\.$/, '');
  const is404 = file.endsWith('404.html');
  const title = decode(pick(html, /<title>([^<]*)<\/title>/i));
  const desc = decode(pick(html, /<meta name="description" content="([^"]*)"/i));
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/i);
  const robots = pick(html, /<meta name="robots" content="([^"]*)"/i);
  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  const h1 = decode(pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, ''));
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const wc = words(html);
  const lang = /<html[^>]*\blang="en"/i.test(html);
  const noindex = /noindex/i.test(robots);
  const types = [];
  let ldOk = ld.length > 0;
  const ldErrors = [];
  // Required properties per schema type, so a regression in head.js fails the build instead of
  // silently losing rich results.
  const REQUIRED = {
    LocalBusiness: ['name', 'address', 'telephone', 'url', 'image'],
    PostalAddress: ['streetAddress', 'addressLocality', 'addressRegion', 'postalCode', 'addressCountry'],
    Service: ['name', 'provider', 'areaServed', 'serviceType'],
    BreadcrumbList: ['itemListElement'],
    FAQPage: ['mainEntity'],
    Question: ['name', 'acceptedAnswer'],
    Answer: ['text'],
    Article: ['headline', 'datePublished', 'dateModified', 'author', 'publisher', 'mainEntityOfPage'],
    ListItem: ['position', 'name', 'item'],
  };
  const visit = (node, where) => {
    if (Array.isArray(node)) return node.forEach((n, i) => visit(n, `${where}[${i}]`));
    if (!node || typeof node !== 'object') return;
    const ts = [].concat(node['@type'] || []);
    const topLevel = /^graph\[\d+\]$/.test(where);
    for (const t of ts) {
      if ((t === 'Service' || t === 'Article') && !topLevel) continue; // items listed inside an OfferCatalog or CollectionPage only need name and url
      for (const req of REQUIRED[t] || []) if (!(req in node)) ldErrors.push(`${t} at ${where} missing ${req}`);
    }
    for (const [k, v] of Object.entries(node)) if (k !== '@type' && k !== '@context') visit(v, `${where}.${k}`);
  };
  for (const block of ld) {
    try {
      const data = JSON.parse(block);
      const nodes = data['@graph'] || [data];
      for (const n of nodes) types.push([].concat(n['@type']).join('+'));
      if (!data['@context']) ldOk = false;
      visit(nodes, 'graph');
    } catch { ldOk = false; }
  }
  const imgsNoAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/gi) || []).length;
  const emDash = html.includes(String.fromCharCode(0x2014));

  const page = { route: is404 ? '/404.html' : route, title, desc, canonical, h1, h1s, ld: types.length, types, wc, noindex, lang, imgsNoAlt };
  rows.push(page);

  const where = page.route;
  const fail = (msg) => problems.push(`${where}: ${msg}`);
  if (!title) fail('missing <title>');
  if (title.length > 60) fail(`title is ${title.length} chars (max 60): ${title}`);
  if (!desc) fail('missing meta description');
  if (desc && (desc.length < 110 || desc.length > 165)) fail(`description is ${desc.length} chars (want 110 to 165)`);
  if (h1s !== 1) fail(`${h1s} H1 tags (want exactly 1)`);
  if (!lang) fail('missing lang="en" on <html>');
  if (emDash) fail('contains an em dash');
  if (imgsNoAlt) fail(`${imgsNoAlt} <img> without alt`);
  if (!noindex) {
    if (!canonical) fail('missing canonical');
    if (canonical && !canonical.startsWith('https://')) fail('canonical is not https');
    if (canonical && !canonical.endsWith(route === '/' ? '/' : `${route}/`)) fail(`canonical ${canonical} does not match route`);
    if (!ldOk) fail('missing or invalid JSON-LD');
    for (const e of ldErrors) fail(`JSON-LD: ${e}`);
    if (wc < MIN_WORDS) fail(`only ${wc} words in <main> (want ${MIN_WORDS}+)`);
    if (seenTitle.has(title)) fail(`duplicate title (also on ${seenTitle.get(title)})`);
    if (seenDesc.has(desc)) fail(`duplicate description (also on ${seenDesc.get(desc)})`);
    seenTitle.set(title, where);
    seenDesc.set(desc, where);
  }
}

rows.sort((a, b) => a.route.localeCompare(b.route));
const full = rows.filter((r) => r.title && r.desc && r.h1s === 1 && r.ld > 0 && (r.noindex || r.canonical)).length;

if (reportOnly) {
  console.log('| Route | Title (chars) | Desc (chars) | Canonical | H1 | JSON-LD types | Words |');
  console.log('|---|---|---|---|---|---|---|');
  for (const r of rows) {
    console.log(`| ${r.route} | ${r.title.replace(/\|/g, '\\|')} (${r.title.length}) | ${r.desc.length} | ${r.canonical ? 'yes' : r.noindex ? 'noindex' : 'MISSING'} | ${r.h1s === 1 ? 'yes' : r.h1s} | ${r.types.join(', ') || 'none'} | ${r.wc} |`);
  }
  console.log(`\nRoutes: ${rows.length}. Routes with title, description, canonical (or noindex), one H1, and JSON-LD: ${full}.`);
  if (problems.length) console.log(`\nProblems (${problems.length}):\n- ` + problems.join('\n- '));
  process.exit(0);
}

if (problems.length) {
  console.error(`SEO check failed with ${problems.length} problem(s):\n- ` + problems.join('\n- '));
  process.exit(1);
}
console.log(`SEO check passed: ${rows.length} routes, ${full} fully tagged, no duplicate titles or descriptions.`);
