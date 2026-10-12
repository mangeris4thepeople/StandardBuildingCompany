# SBC BidWatch

Every Wednesday at 5 PM (Denver time) this GitHub Actions job collects open construction bids
posted by state, county, city, and municipal governments in the Standard Building Company
service area and emails a digest to info@standardbuildingcompany.net. It runs on GitHub's free
Actions minutes.

Sources:
- BidNet Direct (Rocky Mountain E-Purchasing System) pages for each agency in `agencies.mjs`,
  plus any agency in BidNet's directory whose name places it in the service area
- Town and county bid pages (CivicPlus "Bids.aspx") and Summit County's bid pages
- State of Colorado Vendor Self Service (VSS) published solicitations

Each digest lists bids that are new since the last one, then everything still open, then a
coverage section naming any source that could not be read.

## Email setup

Add these repository secrets (Settings, Secrets and variables, Actions):

| Secret | Value |
| --- | --- |
| `SMTP_HOST` | Mail server, for Gmail `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | The account that sends the digest |
| `SMTP_PASS` | That account's app password (for Gmail: Google Account, Security, App passwords) |
| `MAIL_FROM` | Optional display sender, for example `SBC BidWatch <you@gmail.com>` |

Until the secrets exist, each digest is filed as a GitHub issue in this repository instead.

## Running it by hand

Actions tab, "SBC BidWatch", "Run workflow". Tick "dry run" to build the digest without sending it;
the digest is attached to the run as an artifact.

## Changing coverage

Edit `agencies.mjs`: BidNet agency slugs, town bid pages, keywords that decide what counts as
construction, and the list of sites that block automated access.
