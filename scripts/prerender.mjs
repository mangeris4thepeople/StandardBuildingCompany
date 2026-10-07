// Renders every route in src/content/pages.js to its own static HTML file, so search engines
// and AI crawlers get real content without running JavaScript. Also writes sitemap.xml and 404.html.
//
// Runs as the last step of `npm run build`, after the client and server bundles exist.
import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const dist = join(root, 'dist');
const ssrEntry = join(root, 'dist-ssr', 'entry-server.js');

const { render, PAGES, NOT_FOUND, SITE } = await import(pathToFileURL(ssrEntry).href);
const template = await readFile(join(dist, 'index.html'), 'utf8');

for (const marker of ['<!--app-head-->', '<!--app-html-->']) {
  if (!template.includes(marker)) throw new Error(`index.html is missing the ${marker} placeholder`);
}

// Preload the two fonts every page paints with first, so text does not wait on the stylesheet.
const assets = await readdir(join(dist, 'assets'));
const preloads = ['barlow-latin-400-normal', 'barlow-condensed-latin-700-normal']
  .map((name) => assets.find((f) => f.startsWith(name) && f.endsWith('.woff2')))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ');

function fill(path) {
  const rendered = render(path);
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

const today = new Date().toISOString().slice(0, 10);
const urls = PAGES.map(
  (p) => `  <url>
    <loc>${SITE.url}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.priority}</priority>
  </url>`
).join('\n');

await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
);

await rm(join(root, 'dist-ssr'), { recursive: true, force: true });

console.log(`Prerendered ${PAGES.length} pages, 404.html, and sitemap.xml`);
