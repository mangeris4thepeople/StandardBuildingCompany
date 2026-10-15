# SBC social autopilot

Free, hands-off posting for Standard Building Company on **Instagram**, the **Facebook Page**,
and the **LinkedIn company page**. GitHub Actions publishes each post at its scheduled time
through each platform's official API. No paid scheduler, no browser automation, $0 to run.

## What's in here

| Path | What it is |
| --- | --- |
| `instagram/posts.json` | Instagram plan, Oct 23, 2026 to Jan 12, 2027 (82 posts) |
| `linkedin/posts.json` | LinkedIn plan, Oct 16, 2026 to Jan 12, 2027 (76 posts, 8:00 AM, no Sundays) |
| `facebook/posts.json` | Facebook plan (empty for now; Facebook still runs on the daily email drafts) |
| `<platform>/media/` | Finished images and Reel videos the publisher posts |
| `<platform>/photos/` | Drop raw photos here and the builder makes the branded media |
| `archive/` | Everything already posted, so new plans can't repeat it |
| `tools/publish.py` | Publishes due posts, skips anything already live |
| `tools/build_media.py` | Photos to branded carousels, single images, or Reels |
| `tools/check_plan.py` | Blocks repeats across all platforms and past cycles, dashes, hashtag limits |
| `tools/remind.py` | Reminder logic used by the daily reminder workflow |
| `tools/new_cycle.py` | Archives a finished cycle and clears its media |

Workflows in `.github/workflows/`:

- **Social publisher** (`social-publish.yml`): hourly, posts what's due on each platform.
- **Social media builder** (`social-media.yml`): runs when photos are pushed to any `photos/` folder.
- **Social reminders** (`social-reminder.yml`): every morning. Opens a GitHub issue that tags you
  (so GitHub emails you) when any platform's **last post is 2 days away**, when an Instagram
  post in the next week has no photos, or when the LinkedIn token is about to expire. The issue
  closes itself once everything is queued again.

Instagram posts through Oct 22 and the launch post are scheduled in Meta Business Suite; they
are recorded in `archive/2026-10-14/`, not in the plan, so nothing double-posts.

## One-time setup

### Instagram and Facebook (one Meta token covers both, about 10 minutes)

1. At developers.facebook.com create an app (type: Business). Add **Instagram** (API setup
   with Facebook login) and **Facebook Login for Business**.
2. In **Graph API Explorer**, pick the app and generate a User token with:
   `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`,
   `pages_manage_posts`, `business_management`. Approve the Standard Building Company Page and
   @standardbuildingcompany when asked.
3. Run `python social/tools/get_meta_token.py` (asks for app ID, app secret, and that token).
   It prints `FB_PAGE_ID`, `IG_USER_ID`, and `META_PAGE_TOKEN`. That Page token does not expire.
4. In GitHub: repo Settings, Secrets and variables, Actions, add those three as repository secrets.

### LinkedIn

1. At linkedin.com/developers create an app tied to the Standard Building Company page and
   request the **Community Management API** product (LinkedIn reviews this; it can take a few
   days). Company-page posting needs it.
2. Once approved, use the developer portal's OAuth token tool with scopes
   `w_organization_social`, `r_organization_social`, `rw_organization_admin`.
3. Run `python social/tools/get_linkedin_ids.py` to get `LINKEDIN_ORG_ID`.
4. Add secrets `LINKEDIN_ORG_ID` and `LINKEDIN_TOKEN`, and a repository **variable**
   `LINKEDIN_TOKEN_DATE` with today's date (YYYY-MM-DD). LinkedIn tokens last 60 days; the
   reminder workflow warns at day 55.

### Test

Actions tab, **Social publisher**, Run workflow with *dry run* checked. Each platform's log
lists what's due, what's missing, and when its plan ends. A platform without secrets only lists.

## Every 90 days: load the next round

The reminder issue tells you when. Then (or ask Claude to do it):

1. `python social/tools/new_cycle.py` archives everything already posted and deletes its media.
2. Add the new posts to each `social/<platform>/posts.json` (format below). Every platform gets
   its own topics; nothing is reused.
3. Add photos to `social/<platform>/photos/` as `postNN_1.jpg`, `postNN_2.jpg`, ... (NN = post
   number). The builder makes the branded versions on push.
4. `python social/tools/check_plan.py` must show 0 errors. Commit and push.

## Post format

```json
{
  "n": 91,
  "date": "2027-01-13",
  "time": "19:00",
  "type": "CAROUSEL",
  "topic": "One line that names the subject (used for repeat checks)",
  "hook": "Text printed on the first image; empty for a clean photo",
  "caption": "Full caption with hashtags",
  "media": [],
  "location": "Loveland, Colorado",
  "location_id": null,
  "photo_brief": ["What each photo should show"]
}
```

- `time` is 24-hour Denver time. `type` is `CAROUSEL`, `IMAGE`, or `REELS` (Instagram), and
  `IMAGE` for LinkedIn and Facebook (a post with no media goes out as text).
- `media` fills in automatically when photos are built; list files yourself only if you put
  finished files in `media/`.
- Rules the checker enforces: no em or en dashes, Instagram max 5 hashtags and 2,200 characters,
  LinkedIn 3,000 characters, no repeated topic or opening line anywhere, ever.

LinkedIn posts in this plan go out as text until photos are added for them; each one lists a
suggested free Unsplash photo under `photo_links`.
