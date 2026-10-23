# Indexing submission checklist (account logins required)

Everything that could be done from the repo is done and ships with the next deploy: prerendered HTML for all 61 routes, sitemap.xml with lastmod, robots.txt, 301s from the old /residential/ URLs, IndexNow key file and post-deploy submission workflow, and verification meta tag slots. The steps below need you logged in. Do them in this order. Total time: about 45 minutes.

Canonical host: `https://www.standardbuildingcompany.net` (www). Use the www URL everywhere below.

## 1. Set the build environment variables on Vercel (5 min)

The site is hosted on Vercel (not Cloudflare Pages). In the Vercel dashboard: Project `standardbuildingcompany` (or whatever the SBC project is named), Settings, Environment Variables. Add for Production, Preview, and Development:

| Variable | Value | Where to get it |
|---|---|---|
| `GOOGLE_SITE_VERIFICATION` | the token from the Search Console HTML-tag method | Already verified; the current token is baked in as a default, so this is optional unless you re-verify with a new one |
| `BING_SITE_VERIFICATION` | the token from Bing Webmaster Tools, HTML meta tag method | Step 5 below |

After adding `BING_SITE_VERIFICATION`, redeploy (Deployments, three dots on the latest, Redeploy) so the tag appears in the HTML.

Optional GitHub secret (repo Settings, Secrets and variables, Actions): `BING_WEBMASTER_API_KEY` from Bing Webmaster Tools, Settings, API access. With it set, the IndexNow workflow also resubmits the sitemap to Bing after every deploy.

## 2. Google Search Console: verify the www property (5 min)

1. Go to https://search.google.com/search-console and sign in with the Google account that owns the SBC Google Business Profile.
2. If `www.standardbuildingcompany.net` is already listed as a URL-prefix property, skip to step 3.
3. Add property, choose URL prefix, enter `https://www.standardbuildingcompany.net/`, Continue.
4. Verification: the HTML tag method is already satisfied (the meta tag is on every page). Choose HTML tag, click Verify.
5. Also add a Domain property for `standardbuildingcompany.net` if you can add a DNS TXT record at the registrar; it covers www, apex, http, and https in one view. Optional.

## 3. Google Search Console: submit the sitemap (2 min)

1. Left menu, Sitemaps.
2. Enter `sitemap.xml` and click Submit.
3. It should show Success with 61 discovered URLs within a day. If it shows Couldn't fetch, wait an hour and resubmit.

## 4. Google Search Console: request indexing on the priority pages (15 min)

URL Inspection gives you roughly ten manual requests per day. Use them on these, in this order. Paste each URL into the search bar at the top of Search Console, wait for the result, click Request Indexing.

Day 1:
1. https://www.standardbuildingcompany.net/
2. https://www.standardbuildingcompany.net/services/
3. https://www.standardbuildingcompany.net/service-areas/
4. https://www.standardbuildingcompany.net/design-build/
5. https://www.standardbuildingcompany.net/services/kitchen-remodeling/
6. https://www.standardbuildingcompany.net/services/basement-finishing/
7. https://www.standardbuildingcompany.net/services/whole-home-remodels/
8. https://www.standardbuildingcompany.net/service-areas/loveland-co/
9. https://www.standardbuildingcompany.net/service-areas/fort-collins-co/
10. https://www.standardbuildingcompany.net/services/custom-homes/

Day 2:
1. https://www.standardbuildingcompany.net/services/garages-adus/
2. https://www.standardbuildingcompany.net/services/home-additions/
3. https://www.standardbuildingcompany.net/services/bathroom-remodeling/
4. https://www.standardbuildingcompany.net/service-areas/windsor-co/
5. https://www.standardbuildingcompany.net/service-areas/berthoud-co/
6. https://www.standardbuildingcompany.net/insights/kitchen-remodel-cost-northern-colorado/
7. https://www.standardbuildingcompany.net/insights/basement-finish-permits-loveland-fort-collins/
8. https://www.standardbuildingcompany.net/insights/adu-rules-larimer-county-cities/
9. https://www.standardbuildingcompany.net/about/
10. https://www.standardbuildingcompany.net/process/

The old `/residential/...` URLs now 301 to `/services/...`. Google will follow those on its own; do not request indexing on the old URLs.

## 5. Bing Webmaster Tools (10 min)

1. Go to https://www.bing.com/webmasters and sign in (Microsoft account; a Google login works too).
2. Easiest path: Import from Google Search Console. It copies the verified property and the sitemap. If you do that, skip to step 5.
3. Manual path: Add a site, enter `https://www.standardbuildingcompany.net/`. Choose the HTML Meta Tag verification option, copy the `content` value of the `msvalidate.01` tag, and paste it into Vercel as `BING_SITE_VERIFICATION` (Step 1). Redeploy, wait two minutes, click Verify.
4. Sitemaps, Submit sitemap: `https://www.standardbuildingcompany.net/sitemap.xml`.
5. IndexNow: Settings, IndexNow. Confirm the key file is detected at `https://www.standardbuildingcompany.net/7d9685547752fca16100f7713b89be87.txt`. The GitHub workflow submits every URL automatically after each deploy; you can also paste the home URL into URL Submission for an immediate crawl.
6. Settings, API access: generate an API key and add it as the `BING_WEBMASTER_API_KEY` secret in GitHub if you want automatic sitemap resubmission.

## 6. Trigger the first IndexNow run (2 min)

The workflow runs on every push to main. To run it right now: GitHub repo, Actions, "Submit sitemap to IndexNow after deploy", Run workflow. Check the log for `IndexNow: submitted 61 URLs, HTTP 200`.

## 7. Google Analytics key events (3 min)

In GA4 (property G-2J2566DNDM): Admin, Events. Mark `generate_lead` and `phone_call_click` as key events so Search Console and GA4 reports show which pages produce calls and form submissions. Both events are already firing from the site.

## 8. What to check next week

- Search Console, Pages: the 61 URLs should move from Discovered to Indexed over 7 to 21 days. The 11 old `/residential/` URLs will show as Page with redirect, which is correct.
- Search Console, Enhancements: Breadcrumbs and FAQ reports should populate with no errors. (Google no longer shows FAQ rich results for most business sites, but the markup still helps it understand the pages.)
- Bing Webmaster, Site Explorer: the same URLs should appear.
