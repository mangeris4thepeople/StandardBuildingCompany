# Baseline SEO audit: standardbuildingcompany.net

Captured 2026-10-22 from commit 697c06c (before the overhaul), built locally with the repo's own `npm run build`.

## Stack

- Framework: Vite 8 + React 18, plain anchors (no client router). `src/content/pages.js` is the route table.
- Rendering: already static prerendered. `npm run build` runs the client build, an SSR build of `src/entry-server.jsx`, then `scripts/prerender.mjs`, which writes one `index.html` per route into `dist/`, plus `404.html` and `sitemap.xml`. Every route ships full H1 and body text without JavaScript. This is NOT an empty-shell SPA.
- Hosting: Vercel (not Cloudflare Pages as the brief assumed). `vercel.json` sets `trailingSlash: true`, 301s apex to www, and 301s `/commercial/*` to standarddevelopmentcompany.com. There is also a GitHub Pages workflow that builds the same site under `/StandardBuildingCompany/`.
- Canonical host in production: `https://www.standardbuildingcompany.net` (www). Live sitemap confirms 48 URLs on www.
- Head handling: `src/content/head.js` injects title, description, robots, canonical, Open Graph, Twitter, and one JSON-LD graph per page at build time.
- `public/robots.txt`: allow all, points at the sitemap. Google Search Console verification meta tag and HTML file already present.
- No `_redirects`, `_headers`, or `wrangler.toml` (Cloudflare files are not applicable to this host). No cache headers configured in `vercel.json`.
- No IndexNow, no Bing verification, no sitemap-ping automation, no build-time SEO test.

## Routes before: 48 indexable + 404

| Group | Count | Notes |
|---|---|---|
| Home | 1 | H1 "Home Remodeling Contractor in Loveland and Northern Colorado" |
| Service hub `/residential/` | 1 | Services live under `/residential/<slug>/`, not `/services/` |
| Service pages | 11 | kitchen, bathroom, basement, additions, flooring, painting, decks, concrete, exteriors, garages-adus, handyman |
| Pricing | 1 | Publishes per-sq-ft ranges, cites a competitor's blog as a source for mountain-town pricing |
| Local basement pages | 16 | `/basement-finishing/<city>/` |
| Service-area hub | 1 | |
| City pages | 16 | 10 Front Range + 6 mountain towns, all with local copy, permits, FAQ |
| Contact | 1 | 106 words |

Crawl of every route is in `baseline-crawl.md`. Summary: 48 of 48 indexable routes have a unique title, meta description, canonical, exactly one H1, and JSON-LD (GeneralContractor+LocalBusiness, BreadcrumbList, Service, FAQPage where relevant).

## Problems found

1. Services are not at `/services/`, there is no design-build, custom homes, ADU-led, roofing coordination, or architectural design page. The site positions SBC as a remodeler only.
2. No `/about`, `/process`, `/design-build`, or blog/insights section.
3. City page H1s read "Home Remodeling Contractor in [City], Colorado" rather than "[Service] in [City], CO".
4. Four descriptions are over 165 chars (bathroom, garages-adus, service-areas hub, steamboat basement). 404 page description is 49 chars.
5. Thin pages: home (569 words), `/residential/` hub (507), `/service-areas/` (552), `/contact/` (106), three mountain basement pages at 586 to 595.
6. Pricing page and city pages contain en dashes in price ranges and a link to a competitor's blog (bulldogaspen.com) as a pricing source. Outbound link to a competitor from money pages, and the figures are not SBC's.
7. Schema: no `HomeAndConstructionBusiness` type, no `Organization`, no `openingHours`, no `logo`, no Instagram in `sameAs`, no `Article`/author schema (no posts exist).
8. NAP: footer shows phone and email but not the street address. Address appears only in schema and one Loveland FAQ.
9. Homepage CLS 0.262 on mobile: the Barlow Condensed 900 wordmark is not preloaded, so the hero reflows when the font swaps in. Only the 400 and 700 weights are preloaded.
10. Accessibility: `--gray-mid` (#888780) at 11 to 13px fails 4.5:1 contrast on labels, stat captions, and the contact location line. Footer email link is under the 24px target size.
11. No cache headers on hashed assets. Unknown routes: Vercel serves `404.html` with a real 404 status for static output, so soft 404s are not an issue.
12. Instagram URL is not in the repo even though the brand has an Instagram account.

## Lighthouse (mobile, local build, Chromium headless)

| Page | Perf | SEO | A11y | LCP | CLS | TBT |
|---|---|---|---|---|---|---|
| `/` | 86 | 100 | 93 | 1.8 s | 0.262 | 20 ms |
| `/residential/kitchen-remodeling/` | 95 | 100 | 93 | 2.3 s | 0.067 | 140 ms |
| `/service-areas/fort-collins-co/` | 94 | 100 | 92 | 2.3 s | 0.068 | 170 ms |

INP is not measurable in a lab run; TBT is the proxy. Failing audits on all three: `color-contrast`, `target-size`.

## Host and URL variants

- `http://` to `https://`: handled by Vercel automatically.
- apex to www: 301 in `vercel.json`.
- Trailing slash: `trailingSlash: true` 308s `/path` to `/path/`. Canonicals all end in `/`.
- Unknown routes: `404.html` served with 404 status.
- Decision: keep www as canonical (it is what is live and indexed). Do not flip.
