#!/usr/bin/env python3
"""Publish due Standard Building Company Instagram posts through the Instagram Graph API.

Runs from GitHub Actions on a schedule (see .github/workflows/instagram.yml). Each run:
  1. reads instagram/posts.json,
  2. picks posts whose scheduled time has passed within the catch-up window,
  3. skips any post already on the account (matched on the caption's first line),
  4. publishes the rest: carousels and single images by public URL, Reels by direct upload.

Nothing is stored between runs, so the job never has to commit back to the repo.
Standard library only.

Environment:
  IG_USER_ID        Instagram business account ID (GitHub secret)
  IG_ACCESS_TOKEN   Page access token with instagram_content_publish (GitHub secret)
  MEDIA_BASE_URL    Public base URL of instagram/media/ (defaults to jsDelivr for this repo)
  GRAPH_VERSION     Graph API version, default v25.0
  CATCHUP_HOURS     How far back a missed post is still published, default 20
  DRY_RUN           "1" prints what would be published and calls nothing that writes
"""
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "posts.json"
MEDIA_DIR = ROOT / "media"

GRAPH_VERSION = os.environ.get("GRAPH_VERSION", "v25.0")
GRAPH = f"https://graph.facebook.com/{GRAPH_VERSION}"
RUPLOAD = f"https://rupload.facebook.com/ig-api-upload/{GRAPH_VERSION}"
REPO = os.environ.get("GITHUB_REPOSITORY", "mangeris4thepeople/StandardBuildingCompany")
BRANCH = os.environ.get("MEDIA_BRANCH", "main")
MEDIA_BASE_URL = os.environ.get(
    "MEDIA_BASE_URL", f"https://cdn.jsdelivr.net/gh/{REPO}@{BRANCH}/instagram/media"
).rstrip("/")
CATCHUP = timedelta(hours=float(os.environ.get("CATCHUP_HOURS", "20")))
DRY_RUN = os.environ.get("DRY_RUN", "") in ("1", "true", "yes")


class GraphError(RuntimeError):
    pass


def _request(method, url, params=None, data=None, headers=None, timeout=120):
    if params:
        url = url + ("&" if "?" in url else "?") + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        raise GraphError(f"{method} {url.split('?')[0]} -> {e.code}: {body[:500]}") from None


def graph_get(path, token, **params):
    return _request("GET", f"{GRAPH}/{path}", {**params, "access_token": token})


def graph_post(path, token, **params):
    body = urllib.parse.urlencode({**params, "access_token": token}).encode()
    return _request("POST", f"{GRAPH}/{path}", data=body,
                    headers={"Content-Type": "application/x-www-form-urlencoded"})


def wait_finished(container_id, token, minutes=10):
    """Poll a media container until Instagram has processed it."""
    deadline = time.time() + minutes * 60
    while time.time() < deadline:
        status = graph_get(container_id, token, fields="status_code,status").get("status_code")
        if status == "FINISHED":
            return
        if status in ("ERROR", "EXPIRED"):
            info = graph_get(container_id, token, fields="status")
            raise GraphError(f"container {container_id} {status}: {info}")
        time.sleep(15)
    raise GraphError(f"container {container_id} still processing after {minutes} min")


def first_line(text):
    return (text or "").strip().splitlines()[0].strip().lower() if text and text.strip() else ""


def already_posted(ig_user, token):
    """First caption lines of the account's recent posts, used to avoid duplicates."""
    seen = set()
    data = graph_get(f"{ig_user}/media", token, fields="caption,timestamp", limit=50)
    for m in data.get("data", []):
        seen.add(first_line(m.get("caption")))
    return seen


def scheduled_at(post, tz):
    return datetime.fromisoformat(f"{post['date']}T{post['time']}").replace(tzinfo=tz)


def media_url(name):
    return f"{MEDIA_BASE_URL}/{urllib.parse.quote(name)}"


def base_params(post):
    p = {"caption": post["caption"]}
    if post.get("location_id"):
        p["location_id"] = str(post["location_id"])
    return p


def publish_image(ig_user, token, post):
    c = graph_post(f"{ig_user}/media", token, image_url=media_url(post["media"][0]), **base_params(post))
    wait_finished(c["id"], token, 3)
    return graph_post(f"{ig_user}/media_publish", token, creation_id=c["id"])["id"]


def publish_carousel(ig_user, token, post):
    children = []
    for name in post["media"][:10]:
        c = graph_post(f"{ig_user}/media", token, image_url=media_url(name), is_carousel_item="true")
        children.append(c["id"])
    for cid in children:
        wait_finished(cid, token, 3)
    parent = graph_post(f"{ig_user}/media", token, media_type="CAROUSEL",
                        children=",".join(children), **base_params(post))
    wait_finished(parent["id"], token, 3)
    return graph_post(f"{ig_user}/media_publish", token, creation_id=parent["id"])["id"]


def publish_reel(ig_user, token, post):
    """Reels go up as a direct (resumable) upload, so no public video URL is needed."""
    path = MEDIA_DIR / post["media"][0]
    c = graph_post(f"{ig_user}/media", token, media_type="REELS", upload_type="resumable",
                   share_to_feed="true", **base_params(post))
    data = path.read_bytes()
    res = _request("POST", f"{RUPLOAD}/{c['id']}", data=data, timeout=600, headers={
        "Authorization": f"OAuth {token}", "offset": "0", "file_size": str(len(data)),
    })
    if not res.get("success", True):
        raise GraphError(f"reel upload failed: {res}")
    wait_finished(c["id"], token, 10)
    return graph_post(f"{ig_user}/media_publish", token, creation_id=c["id"])["id"]


PUBLISHERS = {"IMAGE": publish_image, "CAROUSEL": publish_carousel, "REELS": publish_reel}


def check_manifest(manifest):
    """Fail early on anything that would break a publish later."""
    problems = []
    for p in manifest["posts"]:
        tag = f"post {p['n']} ({p['date']})"
        if p["type"] not in PUBLISHERS:
            problems.append(f"{tag}: unknown type {p['type']}")
        if len(p["caption"]) > 2200:
            problems.append(f"{tag}: caption over 2,200 characters")
        if p["caption"].count("#") > 5:
            problems.append(f"{tag}: more than 5 hashtags")
        if "—" in p["caption"] or "–" in p["caption"]:
            problems.append(f"{tag}: contains an em or en dash")
        for name in p["media"]:
            if not (MEDIA_DIR / name).exists():
                problems.append(f"{tag}: missing media file {name}")
            elif p["type"] != "REELS" and not name.lower().endswith((".jpg", ".jpeg")):
                problems.append(f"{tag}: Instagram only accepts JPEG images ({name})")
    return problems


def main():
    manifest = json.loads(MANIFEST.read_text())
    tz = ZoneInfo(manifest.get("timezone", "America/Denver"))
    now = datetime.now(tz)

    problems = check_manifest(manifest)
    for line in problems:
        print("WARN", line)

    due = [p for p in manifest["posts"]
           if p["media"] and now - CATCHUP <= scheduled_at(p, tz) <= now]
    upcoming = [p for p in manifest["posts"] if scheduled_at(p, tz) > now]
    no_media = [p["n"] for p in upcoming if not p["media"]]
    print(f"{now:%Y-%m-%d %H:%M %Z}: {len(due)} due, {len(upcoming)} upcoming, "
          f"{len(no_media)} upcoming without media")
    if no_media[:7]:
        print("  next posts still needing photos:", ", ".join(map(str, no_media[:7])))
    if not due:
        return 0

    if DRY_RUN:
        for p in due:
            print(f"DRY RUN would publish post {p['n']} {p['type']} {p['media']}")
        return 0

    ig_user = os.environ.get("IG_USER_ID")
    token = os.environ.get("IG_ACCESS_TOKEN")
    if not ig_user or not token:
        print("IG_USER_ID / IG_ACCESS_TOKEN are not set; nothing published.")
        return 1

    seen = already_posted(ig_user, token)
    failed = 0
    for p in sorted(due, key=lambda x: scheduled_at(x, tz)):
        if first_line(p["caption"]) in seen:
            print(f"post {p['n']}: already on Instagram, skipping")
            continue
        try:
            media_id = PUBLISHERS[p["type"]](ig_user, token, p)
            print(f"post {p['n']}: published {p['type']} as {media_id}")
        except GraphError as e:
            failed += 1
            print(f"post {p['n']}: FAILED {e}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
