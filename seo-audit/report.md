# SEO and indexing overhaul: final report

Standard Building Company, standardbuildingcompany.net. Completed 2026-10-23 on branch `main`. Three commits: Phase 0 baseline, Phases 1 and 2 (site), Phases 3 and 4 (indexing automation and playbooks).

## 1. Before and after

| Measure | Before (commit 697c06c) | After |
|---|---|---|
| Indexable routes | 48 | 61 |
| Routes with unique title, description, canonical, one H1, and JSON-LD | 48 of 48 | 61 of 61 (enforced by a build-time gate) |
| Routes under 600 words in `<main>` | 7 | 0 (gate enforces 600+ on every indexable route) |
| Titles over 60 chars or descriptions over 165 | 5 | 0 |
| Service URL structure | `/residential/<slug>/` | `/services/<slug>/` with 301s from every old URL |
| Core design-build services with their own page | 0 (whole-home, custom homes, roofing, design) | 4 new, 11 existing kept |
| `/design-build`, `/process`, `/about`, `/insights` | none | all four, plus 5 posts of 1,000+ words with Article schema |
| City page H1 | "Home Remodeling Contractor in [City], Colorado" | "Home Remodeling in [City], CO" |
| JSON-LD business types | GeneralContractor, LocalBusiness | HomeAndConstructionBusiness, GeneralContractor, LocalBusiness, Organization, with logo, openingHours, knowsAbout |
| JSON-LD validation | none | required-property validation on every page at build time |
| NAP in footer | phone and email only | name, street address, city, state, ZIP, phone, email |
| Sitemap lastmod | always "today" | date of the last commit that changed each page's content; build hash embedded |
| robots.txt | static file | generated at build from the canonical URL |
| Cache headers | none | immutable on hashed assets, 7 days on images and fonts, 1 hour on sitemap and robots |
| Security headers | none | nosniff, SAMEORIGIN, referrer policy, permissions policy |
| IndexNow | none | key file live, every URL submitted after each deploy by GitHub Action |
| Bing verification | none | `BING_SITE_VERIFICATION` env var slot |
| Competitor link on money pages | yes (bulldogaspen.com on pricing and 7 mountain pages) | removed |
| En dashes in copy | yes (price ranges) | none; gate fails the build on em dashes |

### Lighthouse (mobile, local build, same Chromium, same settings)

| Page | Before perf / SEO / a11y | Before LCP / CLS | After perf / SEO / a11y | After LCP / CLS |
|---|---|---|---|---|
| `/` | 86 / 100 / 93 | 1.8 s / 0.262 | 99 / 100 / 100 | 1.7 s / 0.038 |
| `/services/kitchen-remodeling/` (was `/residential/...`) | 95 / 100 / 93 | 2.3 s / 0.067 | 99 / 100 / 100 | 1.7 s / 0.038 |
| `/service-areas/fort-collins-co/` | 94 / 100 / 92 | 2.3 s / 0.068 | 99 / 100 / 100 | 1.7 s / 0.029 |
| `/insights/kitchen-remodel-cost-northern-colorado/` | did not exist | | 99 / 100 / 100 | 1.7 s / 0.032 |

The home page CLS fix: the condensed wordmark and the body font were swapping in after first paint and reflowing the hero. Metric-matched local fallbacks (`size-adjust`) for both Barlow and Barlow Condensed, a reserved height on the wordmark, and preloads for the four weights above the fold took CLS from 0.26 to 0.04. INP cannot be measured in a lab run; Total Blocking Time is 30 to 80 ms on every page, which predicts a good INP.

Full per-route crawl tables: `baseline-crawl.md` (before) and `after-crawl.md` (after).

## 2. New routes

| Route | Title | Target query |
|---|---|---|
| `/services/` | Home Remodeling & Design-Build Services | design-build contractor Northern Colorado |
| `/services/whole-home-remodels/` | Whole-Home Remodeling in Northern Colorado | whole home remodel Loveland, Fort Collins |
| `/services/custom-homes/` | Custom Home Builder in Northern Colorado | custom home builder Loveland, Northern Colorado |
| `/services/roofing-coordination/` | Roofing Coordination in Northern Colorado | roof replacement contractor Loveland, hail roof Northern Colorado |
| `/services/architectural-design-permitting/` | Architectural Design & Permitting in Northern Colorado | residential architectural design Fort Collins, permit drawings Loveland |
| `/services/garages-adus/` (retitled) | ADU Builder in Northern Colorado | ADU builder Loveland, Fort Collins |
| `/services/home-additions/` (refocused) | Home Additions in Northern Colorado | home additions Loveland, Fort Collins |
| `/design-build/` | Design-Build Contractor in Northern Colorado | design build Loveland, design-build remodeling Northern Colorado |
| `/process/` | Our Remodeling Process | remodeling process, what to expect from a remodel |
| `/about/` | About Standard Building Company | Standard Building Company Loveland |
| `/insights/` | Remodeling Insights for Northern Colorado | (hub) |
| `/insights/kitchen-remodel-cost-northern-colorado/` | Kitchen Remodel Cost in Northern Colorado: 2026 Ranges | kitchen remodel cost Northern Colorado, Fort Collins, Loveland |
| `/insights/basement-finish-permits-loveland-fort-collins/` | Basement Finish Permits in Loveland and Fort Collins | basement finish permit Loveland, Fort Collins |
| `/insights/adu-rules-larimer-county-cities/` | ADU Rules in Loveland, Fort Collins, and Larimer County | ADU rules Loveland, Fort Collins ADU, Larimer County ADU |
| `/insights/remodeling-mountain-towns-colorado/` | Remodeling in Colorado Mountain Towns: What Is Different | remodeling contractor Vail, Steamboat, Winter Park, Estes Park |
| `/insights/design-build-vs-architect-and-contractor/` | Design-Build vs. Hiring an Architect and a GC Separately | design build vs architect, design-build vs design-bid-build |

Existing routes kept and updated: home (new H1, tagline, CTAs, links to every core service and both hubs), 11 existing service pages (moved to `/services/`), `/service-areas/` and 16 city pages (new H1, every service linked from every city page, mountain pages already carried travel and logistics copy), 16 local basement pages, `/pricing/` (competitor link and en dashes removed), `/contact/` (address, what to have ready, service and area links).

Every page is reachable within two clicks of the home page: the nav links the four hubs plus design-build, pricing, about, and contact; the footer lists every service, every city, and the company pages.

## 3. Environment variables to set in Vercel (names only)

| Name | Purpose |
|---|---|
| `GOOGLE_SITE_VERIFICATION` | Optional. The already-verified token is the default in `src/content/head.js`; set this only if you re-verify with a new token. |
| `BING_SITE_VERIFICATION` | Bing Webmaster Tools HTML meta tag token. Set, then redeploy. |

GitHub repository secret (optional): `BING_WEBMASTER_API_KEY`, which lets the IndexNow workflow also resubmit the sitemap to Bing after each deploy.

The host is Vercel. The brief assumed Cloudflare Pages; the repo has `vercel.json`, the live site responds from Vercel, and the canonical host is www. Everything was built for Vercel: redirects and headers are in `vercel.json`, unknown routes return a real 404 because Vercel serves `404.html` with a 404 status for static output, and `VERCEL_GIT_COMMIT_SHA` is used as the sitemap build marker. No `_redirects` or `_headers` files were added because Vercel does not read them.

## 4. Account-login tasks remaining, in priority order

Click-by-click steps for each are in `submit-checklist.md` and `gbp-playbook.md`.

| # | Task | Time |
|---|---|---|
| 1 | Push is done; confirm the Vercel production deploy is green and `https://www.standardbuildingcompany.net/services/` loads | 2 min |
| 2 | Google Search Console: confirm the www property, submit `sitemap.xml` | 5 min |
| 3 | Search Console URL Inspection: request indexing on the day-1 list of 10 URLs | 15 min |
| 4 | Bing Webmaster Tools: import from Search Console or verify by meta tag, submit sitemap, confirm IndexNow key | 10 min |
| 5 | Vercel: add `BING_SITE_VERIFICATION`, redeploy | 5 min |
| 6 | GitHub Actions: run "Submit sitemap to IndexNow after deploy" once by hand and check for HTTP 200 | 2 min |
| 7 | Google Business Profile: categories, description, services, service area, attributes, UTM links (all paste-ready) | 40 min |
| 8 | GBP: schedule the first two posts and copy the review link into your phone | 10 min |
| 9 | Bing Places import from GBP, Apple Business Connect, Houzz, Yelp, Nextdoor claims | 15 min each |
| 10 | GA4: mark `generate_lead` and `phone_call_click` as key events | 3 min |
| 11 | Day 2: request indexing on the second list of 10 URLs | 15 min |
| 12 | Add the Instagram profile URL to `SOCIAL` in `src/content/site.js` and push | 2 min |

## 5. What could not be done, and why

1. **Lighthouse on the live site.** The workspace shell cannot reach the public internet, so Lighthouse ran against a local build of the same output. Live numbers will differ slightly by CDN latency; run PageSpeed Insights on the live URL after deploy for the field data.
2. **Verifying the deploy.** Pushing to `main` triggers Vercel. I cannot see the Vercel dashboard from the repo, so step 1 of the checklist is to confirm the deploy is green.
3. **Business hours.** No hours existed in the repo. The schema and the GBP playbook say Monday to Friday, 7:00 AM to 5:00 PM. Confirm or change them in `src/content/site.js` (`hours`).
4. **Insurance and license numbers.** The repo had no carrier, policy, or license numbers, so the about page says proof of insurance and license information are provided before any contract, and nothing else. Add the real numbers to `/about/` when you want them public.
5. **Instagram URL.** Not in the repo. Schema `sameAs` and the footer carry LinkedIn and Facebook only until the Instagram URL is added to `src/content/site.js`.
6. **Google Business Profile URL.** Not in the repo, so it is not in `sameAs`. Add it to `SOCIAL` once you copy it from the profile.
7. **Jobsite photos.** The site uses line drawings (the hero elevation and the area map) and no raster photos, so there are no placeholders to swap. Pages that would benefit most from real photos, in order: `/services/kitchen-remodeling/`, `/services/basement-finishing/`, `/services/whole-home-remodels/`, `/services/custom-homes/`, `/services/garages-adus/`, `/design-build/`, and the Loveland and Fort Collins city pages. When you have photos, add them with explicit width and height and descriptive alt text; the build gate fails any image without alt.
8. **Google sitemap ping.** Google retired its ping endpoint in 2023; there is nothing to automate. Submitting the sitemap in Search Console once is the mechanism, and Google re-reads it on its own.
9. **Google Search Console API submission.** Programmatic URL submission to Google requires an OAuth service account tied to the property; it was not set up because it needs the account login. The IndexNow workflow covers Bing and partners automatically; Google indexing requests are the manual URL Inspection steps.

## 6. Thirty-day plan

### Publish

- Week 1: nothing new on the site. Do the account tasks above. Post GBP posts 1 and 2.
- Week 2: one new insight: "Basement finishing cost in Northern Colorado: 2026 ranges" (the basement pages are the deepest existing content and the query has the most local volume). GBP posts 3 and 4.
- Week 3: one new insight: "How long does a kitchen remodel take in Loveland and Fort Collins." Add real jobsite photos to the kitchen and basement service pages. GBP posts 5 and 6.
- Week 4: one new insight: "Home addition cost in Northern Colorado: what moves the number." GBP posts 7 and 8. First review request round to any completed projects.

Each post goes in `src/content/posts.js` with the same shape as the existing five; the sitemap, Article schema, insights index, and IndexNow submission pick it up on push.

### Check in Search Console each week

- Week 1: Sitemaps shows 61 discovered. Pages report: watch the 61 new URLs move from "Discovered, currently not indexed" to "Indexed." The 11 old `/residential/` URLs should show "Page with redirect."
- Week 2: Pages report: anything stuck in "Crawled, currently not indexed" for 14 days gets a URL Inspection request. Enhancements: Breadcrumbs with zero errors.
- Week 3: Performance report, filter Query contains "loveland" or "fort collins": record impressions and average position for the top 20 queries as the baseline.
- Week 4: Performance report, compare week 4 to week 3: impressions, clicks, and the number of distinct queries. Pages: every one of the 61 should be indexed.

### The first three metrics that should move

1. **Indexed pages** (Search Console, Pages): from the current 48 to 61 within 21 days.
2. **Impressions on local queries** (Search Console, Performance, queries containing a city name): should rise within 14 to 30 days as the new service and insight pages are indexed; this moves before clicks do.
3. **Calls and form submissions from organic and GBP** (GA4 key events `phone_call_click` and `generate_lead`, segmented by `utm_campaign = gbp` and by organic source): the first leads attributable to the new pages typically show in weeks 3 to 6, with the Loveland and Fort Collins kitchen and basement pages leading.

## Files

- `seo-audit/baseline.md`, `baseline-crawl.md`: before.
- `seo-audit/after-crawl.md`: after, every route.
- `seo-audit/submit-checklist.md`: Search Console, Bing, IndexNow, GA4 steps.
- `seo-audit/gbp-playbook.md`: Google Business Profile, posts, reviews, citations.
- `scripts/seo-check.mjs`: the build gate. `node scripts/seo-check.mjs --report` prints the crawl table without failing.
- `scripts/indexnow-submit.mjs`, `.github/workflows/indexnow.yml`: post-deploy submission.
- `public/7d9685547752fca16100f7713b89be87.txt`: IndexNow key file (public by design).
