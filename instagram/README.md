# SBC Instagram autopilot

Free, hands-off posting for @standardbuildingcompany. GitHub Actions publishes each post at its
scheduled time through Instagram's official API. No paid scheduler, no browser automation.

## How it works

| Piece | What it does |
| --- | --- |
| `posts.json` | The plan: date, time (Denver), type, caption, media files for every post through Jan 12, 2027 |
| `media/` | Finished, branded images and Reel videos, ready to post |
| `photos/` | Drop raw job photos here to have media built for a post |
| `tools/publish.py` | Publishes whatever is due and not already on the account |
| `tools/build_media.py` | Turns raw photos into branded carousels, single images, or Reels |
| `.github/workflows/instagram.yml` | Runs the publisher every hour |
| `.github/workflows/instagram-media.yml` | Builds media whenever photos are pushed to `photos/` |

Posts through Oct 22 (and the launch post) were scheduled inside Meta Business Suite and are
not in `posts.json`, so nothing double-posts. The publisher also checks the account's recent
captions and skips anything already live.

Cost: $0. The repo is public, so Actions minutes are free. Images are served to Instagram from
jsDelivr's free CDN for this repo; Reels are uploaded straight from the runner.

## One-time setup (about 10 minutes)

1. **Meta app.** At developers.facebook.com, create an app (type: Business), then add the
   *Instagram* product using *API setup with Facebook login*.
2. **Token.** Open Graph API Explorer, pick the app, and generate a User token with:
   `instagram_basic`, `instagram_content_publish`, `pages_show_list`,
   `pages_read_engagement`, `business_management`. Approve the Standard Building Company Page
   and the @standardbuildingcompany account when asked.
3. **Get the two values.** Either run `python instagram/tools/get_token.py` (asks for app ID,
   app secret, and the Explorer token), or in Graph API Explorer:
   extend the token in the Access Token Debugger, then query
   `me/accounts?fields=name,access_token,instagram_business_account`.
   You need `instagram_business_account.id` and that Page's `access_token`
   (a Page token made from an extended user token does not expire).
4. **GitHub secrets.** Repo Settings, Secrets and variables, Actions, New repository secret:
   `IG_USER_ID` and `IG_ACCESS_TOKEN`.
5. **Test.** Actions tab, *Instagram publisher*, Run workflow with *dry run* checked. The log
   lists what is due and anything missing.

Until the secrets exist the hourly job only prints the queue, so it is safe to leave on.

## Adding photos for later posts

Posts 31 to 90 (Nov 13 to Jan 12) have captions but no photos yet. For each one, add 1 to 3
photos named by post number, in display order, to `instagram/photos/`:

```
instagram/photos/post31_1.jpg
instagram/photos/post31_2.jpg
instagram/photos/post31_3.jpg
```

Upload them on github.com (Add file, Upload files) or commit them. The media workflow builds the
branded versions and the publisher posts them on their date. `posts.json` lists each post's
shot list under `photo_brief`; your own job photos beat stock every time.

Rules the builder and publisher enforce: JPEG images only, at most 5 hashtags, no em or en dashes,
caption under 2,200 characters.

## Changing a post

Edit `posts.json` (caption, `date`, `time` in 24-hour Denver time, or `location_id` for a
location tag) and commit. To rebuild a post's media after swapping photos, run
`python instagram/tools/build_media.py --force 31` or re-run the media workflow.
