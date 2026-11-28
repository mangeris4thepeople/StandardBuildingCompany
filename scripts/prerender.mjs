// Renders every route in src/content/pages.js to its own static HTML file, so search engines
// and AI crawlers get real content without running JavaScript. Also writes sitemap.xml, 404.html,
// and robots.txt, then runs the SEO gate (scripts/seo-check.mjs), which fails the build on problems.
//
// Runs as the last step of `npm run build`, after the client and server bundles exist.
import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const dist = join(root, 'dist');
const ssrEntry = join(root, 'dist-ssr', 'entry-server.js');

const { render, PAGES, NOT_FOUND, SITE } = await import(pathToFileURL(ssrEntry).href);
const template = await readFile(join(dist, 'index.html'), 'utf8');

for (const marker of ['<!--app-head-->', '<!--app-html-->']) {
  if (!template.includes(marker)) throw new Error(`index.html is missing the ${marker} placeholder`);
}

// Verification tokens come from the host's build environment (see seo-audit/report.md).
const env = {
  GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
  BING_SITE_VERIFICATION: process.env.BING_SITE_VERIFICATION,
};

// Preload the fonts every page paints with first, so text does not wait on the stylesheet and the
// wordmark does not reflow when the heavy condensed weight arrives.
const assets = await readdir(join(dist, 'assets'));
const assetBase = process.env.GITHUB_ACTIONS === 'true' ? '/StandardBuildingCompany/' : '/';
const preloads = ['barlow-latin-400-normal', 'barlow-latin-600-normal', 'barlow-condensed-latin-700-normal', 'barlow-condensed-latin-900-normal']
  .map((name) => assets.find((f) => f.startsWith(name) && f.endsWith('.woff2')))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="${assetBase}assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ');

function fill(path) {
  const rendered = render(path, env);
  const html = rendered.html;
  const head = `${rendered.head}\n    ${preloads}`;
  if (!html || html.length < 500) throw new Error(`Prerender produced almost no HTML for ${path}`);
  return template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
}

for (const page of PAGES) {
  const file = join(dist, page.path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, fill(page.path));
}

await writeFile(join(dist, '404.html'), fill(NOT_FOUND.path));

// lastmod: the date of the last commit that touched the content file behind each kind of page, so
// the sitemap only claims a change when one happened. Falls back to today outside a git checkout.
const today = new Date().toISOString().slice(0, 10);
function gitDate(...files) {
  try {
    const out = execSync(`git log -1 --format=%cs -- ${files.map((f) => JSON.stringify(f)).join(' ')}`, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : today;
  } catch {
    return today;
  }
}
const CONTENT = 'src/content';
const dates = {
  home: gitDate(`${CONTENT}/pages.js`, 'src/components/Pages.jsx', `${CONTENT}/site.js`),
  hub: gitDate(`${CONTENT}/pages.js`, `${CONTENT}/residential.js`, `${CONTENT}/design-build-services.js`),
  service: gitDate(`${CONTENT}/residential.js`, `${CONTENT}/design-build-services.js`),
  static: gitDate(`${CONTENT}/static-pages.js`),
  pricing: gitDate('src/components/Pages.jsx'),
  areas: gitDate(`${CONTENT}/cities.js`),
  area: gitDate(`${CONTENT}/cities.js`),
  'local-basement': gitDate(`${CONTENT}/cities.js`, 'src/components/Pages.jsx'),
  'local-service': gitDate(`${CONTENT}/local-services.js`, 'src/components/Pages.jsx'),
  insights: gitDate(`${CONTENT}/posts.js`),
  contact: gitDate(`${CONTENT}/site.js`, 'src/components/Pages.jsx'),
};
const lastmodFor = (p) => p.lastmod || dates[p.type] || today;

const sha = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || '').slice(0, 12);
const urls = PAGES.map(
  (p) => `  <url>
    <loc>${SITE.url}${p.path}</loc>
    <lastmod>${lastmodFor(p)}</lastmod>
    <priority>${p.priority}</priority>
  </url>`
).join('\n');

await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<!-- build ${sha || 'local'} ${new Date().toISOString()} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
);

// robots.txt is generated so the sitemap URL always matches SITE.url.
await writeFile(
  join(dist, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /404/

Sitemap: ${SITE.url}/sitemap.xml
`
);

// llms.txt: a plain index of every page for AI assistants, built from the same titles and
// descriptions the prerendered pages carry, grouped by page type.
{
  const GROUP = {
    home: 'Company', static: 'Company', contact: 'Company', pricing: 'Company',
    hub: 'Services', service: 'Services',
    areas: 'Service areas', area: 'Service areas', 'local-basement': 'Services in specific towns', 'local-service': 'Services in specific towns',
    insights: 'Guides', post: 'Guides',
  };
  const order = ['Company', 'Services', 'Services in specific towns', 'Service areas', 'Guides'];
  const clean = (t) => String(t || '').replace(/\s*\|\s*(Standard Building Co\.|Standard Building|SBC)\s*$/, '');
  const line = (p) => `- [${clean(p.title || p.h1)}](${SITE.url}${p.path})${p.description ? `: ${p.description}` : ''}`;
  const body = order
    .map((g) => [g, PAGES.filter((p) => (GROUP[p.type] || 'Company') === g)])
    .filter(([, list]) => list.length)
    .map(([g, list]) => `## ${g}\n\n${list.map(line).join('\n')}`)
    .join('\n\n');
  await writeFile(
    join(dist, 'llms.txt'),
    `# ${SITE.name}

> Residential design-build general contractor in Loveland, Colorado, founded in 2020. Designs, permits, and builds whole-home remodels, kitchens, bathrooms, basements, additions, custom homes, garages and ADUs, and decks across Northern Colorado and the mountain towns. Homes only; commercial work is handled by Standard Development Company. ${SITE.addressDisplay}. Phone ${SITE.phoneDisplay}. Email ${SITE.email}.

${body}
`
  );
}

await rm(join(root, 'dist-ssr'), { recursive: true, force: true });

console.log(`Prerendered ${PAGES.length} pages, 404.html, sitemap.xml, robots.txt, and llms.txt`);

// The SEO gate fails the build on missing or duplicate titles, descriptions, canonicals, H1s, JSON-LD,
// thin pages, or em dashes. SEO_SKIP_CHECK=1 bypasses it for local experiments only.
if (process.env.SEO_SKIP_CHECK !== '1') {
  const check = spawnSync(process.execPath, [join(root, 'scripts', 'seo-check.mjs')], { stdio: 'inherit', cwd: root });
  if (check.status !== 0) process.exit(check.status || 1);
}
