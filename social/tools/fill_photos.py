#!/usr/bin/env python3
"""Safety net: make sure the next posts on every platform have photos.

  python social/tools/fill_photos.py            (check the next 5 posts per platform)
  python social/tools/fill_photos.py --next 10

Runs before every publisher run. For each upcoming post with no media and no photos in
social/<platform>/photos/, it downloads free, commercially usable stock photos and saves them
as postNN_1.jpg, postNN_2.jpg, ... so build_media.py can turn them into finished media.

Where photos come from, in order:
  1. the post's own "photo_links" (Unsplash photo pages picked when the plan was written),
  2. Unsplash search, if the UNSPLASH_ACCESS_KEY secret is set (free developer key),
  3. Pexels search, if the PEXELS_API_KEY secret is set (free key),
  4. Openverse search for public-domain (CC0 / PDM) images, which needs no key.
Searches use each line of the post's "photo_brief", falling back to its topic.
Every download is logged to social/<platform>/photos/CREDITS.md.

Normally the plan already has hand-picked photos and this does nothing; it exists so the
feed never stalls if a cycle runs long or a post is added late.
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

SOCIAL = Path(__file__).resolve().parents[1]
UA = {"User-Agent": "sbc-social-autopilot/1.0 (+https://www.standardbuildingcompany.net)"}
COUNT = {"CAROUSEL": 3, "REELS": 3, "IMAGE": 1}


def fetch(url, headers=None, timeout=60):
    req = urllib.request.Request(url, headers={**UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(), r.headers.get("Content-Type", "")


def fetch_json(url, headers=None):
    return json.loads(fetch(url, headers)[0].decode())


def from_unsplash_page(link):
    """Resolve an Unsplash photo page to a 1600px JPEG via its og:image tag."""
    html = fetch(link)[0].decode(errors="replace")
    m = re.search(r'property="og:image" content="(https://images\.unsplash\.com/[^"?]+)', html)
    if not m:
        m = re.search(r'(https://images\.unsplash\.com/photo-[A-Za-z0-9_-]+)', html)
    if not m:
        return None, None
    return f"{m.group(1)}?w=1600&q=85&fm=jpg", link


def search_unsplash(q):
    key = os.environ.get("UNSPLASH_ACCESS_KEY")
    if not key:
        return []
    data = fetch_json("https://api.unsplash.com/search/photos?" + urllib.parse.urlencode(
        {"query": q, "per_page": 10, "orientation": "portrait", "content_filter": "high"}),
        {"Authorization": f"Client-ID {key}", "Accept-Version": "v1"})
    return [(r["urls"]["raw"] + "&w=1600&q=85&fm=jpg", r["links"]["html"])
            for r in data.get("results", []) if not r.get("premium") and not r.get("plus")]


def search_pexels(q):
    key = os.environ.get("PEXELS_API_KEY")
    if not key:
        return []
    data = fetch_json("https://api.pexels.com/v1/search?" + urllib.parse.urlencode(
        {"query": q, "per_page": 10, "orientation": "portrait"}), {"Authorization": key})
    return [(p["src"]["large2x"], p["url"]) for p in data.get("photos", [])]


def search_openverse(q):
    data = fetch_json("https://api.openverse.org/v1/images/?" + urllib.parse.urlencode(
        {"q": q, "license": "cc0,pdm", "page_size": 10, "mature": "false"}))
    return [(r["url"], r.get("foreign_landing_url") or r["url"]) for r in data.get("results", [])
            if (r.get("width") or 0) >= 1000]


def candidates(post):
    for link in post.get("photo_links", []):
        try:
            got = from_unsplash_page(link)
            if got[0]:
                yield got
        except Exception as e:
            print(f"    photo link failed {link}: {e}")
    queries = [q for q in post.get("photo_brief", []) if q] or [post.get("topic", "construction site")]
    for q in queries:
        q = re.sub(r"\(.*?\)|\"", "", q)[:80]
        for search in (search_unsplash, search_pexels, search_openverse):
            try:
                for hit in search(q)[:4]:
                    yield hit
            except Exception as e:
                print(f"    {search.__name__} failed for '{q}': {e}")


def main(argv):
    look = int(argv[argv.index("--next") + 1]) if "--next" in argv else 5
    tz = ZoneInfo("America/Denver")
    now = datetime.now(tz)
    added = 0
    for plat in ("instagram", "facebook", "linkedin"):
        path = SOCIAL / plat / "posts.json"
        if not path.exists():
            continue
        posts = json.loads(path.read_text()).get("posts", [])
        when = lambda p: datetime.fromisoformat(f"{p['date']}T{p['time']}").replace(tzinfo=tz)
        nxt = sorted([p for p in posts if when(p) > now], key=when)[:look]
        photos = SOCIAL / plat / "photos"
        photos.mkdir(parents=True, exist_ok=True)
        for p in nxt:
            have = list(photos.glob(f"post{p['n']:02d}_*"))
            if p.get("media") or have:
                continue
            need = COUNT.get(p.get("type"), 1)
            print(f"{plat} post {p['n']} ({p['date']}): no photos, fetching {need}")
            got, seen = 0, set()
            for url, credit in candidates(p):
                if got >= need or url in seen:
                    if got >= need:
                        break
                    continue
                seen.add(url)
                try:
                    data, ctype = fetch(url, timeout=90)
                except Exception as e:
                    print(f"    download failed: {e}")
                    continue
                if len(data) < 30_000 or "image" not in ctype:
                    continue
                got += 1
                out = photos / f"post{p['n']:02d}_{got}.jpg"
                out.write_bytes(data)
                with open(photos / "CREDITS.md", "a") as fh:
                    fh.write(f"- {out.name}: {credit}\n")
            added += got
            print(f"    saved {got} photo(s)" + ("" if got >= need else "  (still short, check manually)"))
    print(f"{added} photo(s) added")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
