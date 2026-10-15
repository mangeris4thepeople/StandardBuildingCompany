#!/usr/bin/env python3
"""Publish due Standard Building Company posts to Instagram, Facebook, or LinkedIn.

  python social/tools/publish.py instagram|facebook|linkedin

Runs hourly from GitHub Actions (.github/workflows/social-publish.yml). Each run reads
social/<platform>/posts.json, takes the posts whose time has passed within the catch-up
window, skips any already live on the account (matched on the caption's first line), and
publishes the rest. Nothing is written back to the repo. Standard library only.

Secrets (GitHub repository secrets):
  Instagram  IG_USER_ID, META_PAGE_TOKEN
  Facebook   FB_PAGE_ID, META_PAGE_TOKEN
  LinkedIn   LINKEDIN_ORG_ID, LINKEDIN_TOKEN
Optional settings: GRAPH_VERSION (v25.0), LINKEDIN_VERSION (202606), CATCHUP_HOURS (20),
MEDIA_BASE_URL, DRY_RUN=1.
"""
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

SOCIAL = Path(__file__).resolve().parents[1]
REPO = os.environ.get("GITHUB_REPOSITORY", "mangeris4thepeople/StandardBuildingCompany")
BRANCH = os.environ.get("MEDIA_BRANCH") or "main"  # the workflow passes the exact commit
GRAPH_VERSION = os.environ.get("GRAPH_VERSION") or "v25.0"
GRAPH = f"https://graph.facebook.com/{GRAPH_VERSION}"
GRAPH_VIDEO = f"https://graph-video.facebook.com/{GRAPH_VERSION}"
RUPLOAD = f"https://rupload.facebook.com/ig-api-upload/{GRAPH_VERSION}"
LI_API = "https://api.linkedin.com/rest"
LI_VERSION = os.environ.get("LINKEDIN_VERSION") or "202606"
CATCHUP = timedelta(hours=float(os.environ.get("CATCHUP_HOURS") or 20))
DRY_RUN = os.environ.get("DRY_RUN", "") in ("1", "true", "yes")


class ApiError(RuntimeError):
    pass


# ---------------------------------------------------------------- HTTP helpers
def http(method, url, params=None, data=None, headers=None, timeout=180, raw=False):
    if params:
        url += ("&" if "?" in url else "?") + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read()
            if raw:
                return r, body
            return json.loads(body.decode() or "{}")
    except urllib.error.HTTPError as e:
        detail = e.read().decode(errors="replace")[:600]
        raise ApiError(f"{method} {url.split('?')[0]} -> {e.code}: {detail}") from None


def form(params):
    return urllib.parse.urlencode(params).encode(), {"Content-Type": "application/x-www-form-urlencoded"}


def multipart(fields, file_field, path):
    boundary = uuid.uuid4().hex
    parts = []
    for k, v in fields.items():
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
    parts.append((f'--{boundary}\r\nContent-Disposition: form-data; name="{file_field}"; '
                  f'filename="{path.name}"\r\nContent-Type: application/octet-stream\r\n\r\n').encode())
    parts.append(path.read_bytes())
    parts.append(f"\r\n--{boundary}--\r\n".encode())
    return b"".join(parts), {"Content-Type": f"multipart/form-data; boundary={boundary}"}


def first_line(text):
    text = (text or "").strip()
    return text.splitlines()[0].strip().lower() if text else ""


# ---------------------------------------------------------------- Instagram
class Instagram:
    secrets = ("IG_USER_ID", "META_PAGE_TOKEN")

    def __init__(self, media_dir, media_base):
        self.ig = os.environ["IG_USER_ID"]
        self.token = os.environ["META_PAGE_TOKEN"]
        self.media_dir, self.media_base = media_dir, media_base

    def get(self, path, **p):
        return http("GET", f"{GRAPH}/{path}", {**p, "access_token": self.token})

    def post(self, path, **p):
        data, h = form({**p, "access_token": self.token})
        return http("POST", f"{GRAPH}/{path}", data=data, headers=h)

    def wait(self, cid, minutes):
        end = time.time() + minutes * 60
        while time.time() < end:
            s = self.get(cid, fields="status_code").get("status_code")
            if s == "FINISHED":
                return
            if s in ("ERROR", "EXPIRED"):
                raise ApiError(f"container {cid} {s}: {self.get(cid, fields='status')}")
            time.sleep(15)
        raise ApiError(f"container {cid} still processing after {minutes} min")

    def existing(self):
        data = self.get(f"{self.ig}/media", fields="caption", limit=50)
        return {first_line(m.get("caption")) for m in data.get("data", [])}

    def extra(self, post):
        return {"location_id": str(post["location_id"])} if post.get("location_id") else {}

    def publish(self, post):
        kind, media = post["type"], post["media"]
        if kind == "REELS":
            path = self.media_dir / media[0]
            c = self.post(f"{self.ig}/media", media_type="REELS", upload_type="resumable",
                          share_to_feed="true", caption=post["caption"], **self.extra(post))
            data = path.read_bytes()
            http("POST", f"{RUPLOAD}/{c['id']}", data=data, timeout=600, headers={
                "Authorization": f"OAuth {self.token}", "offset": "0", "file_size": str(len(data))})
            self.wait(c["id"], 10)
            cid = c["id"]
        elif kind == "IMAGE":
            cid = self.post(f"{self.ig}/media", image_url=f"{self.media_base}/{media[0]}",
                            caption=post["caption"], **self.extra(post))["id"]
            self.wait(cid, 3)
        else:
            kids = [self.post(f"{self.ig}/media", image_url=f"{self.media_base}/{m}",
                              is_carousel_item="true")["id"] for m in media[:10]]
            for k in kids:
                self.wait(k, 3)
            cid = self.post(f"{self.ig}/media", media_type="CAROUSEL", children=",".join(kids),
                            caption=post["caption"], **self.extra(post))["id"]
            self.wait(cid, 3)
        return self.post(f"{self.ig}/media_publish", creation_id=cid)["id"]


# ---------------------------------------------------------------- Facebook Page
class Facebook:
    secrets = ("FB_PAGE_ID", "META_PAGE_TOKEN")

    def __init__(self, media_dir, media_base):
        self.page = os.environ["FB_PAGE_ID"]
        self.token = os.environ["META_PAGE_TOKEN"]
        self.media_dir, self.media_base = media_dir, media_base

    def get(self, path, **p):
        return http("GET", f"{GRAPH}/{path}", {**p, "access_token": self.token})

    def post(self, path, **p):
        data, h = form({**p, "access_token": self.token})
        return http("POST", f"{GRAPH}/{path}", data=data, headers=h)

    def existing(self):
        data = self.get(f"{self.page}/posts", fields="message", limit=50)
        return {first_line(m.get("message")) for m in data.get("data", [])}

    def publish(self, post):
        media, caption = post["media"], post["caption"]
        if not media:
            return self.post(f"{self.page}/feed", message=caption)["id"]
        if post["type"] == "REELS" or media[0].lower().endswith((".mp4", ".mov")):
            data, h = multipart({"description": caption, "access_token": self.token},
                                "source", self.media_dir / media[0])
            return http("POST", f"{GRAPH_VIDEO}/{self.page}/videos", data=data, headers=h, timeout=600)["id"]
        if len(media) == 1:
            return self.post(f"{self.page}/photos", url=f"{self.media_base}/{media[0]}", caption=caption)["id"]
        ids = [self.post(f"{self.page}/photos", url=f"{self.media_base}/{m}", published="false")["id"]
               for m in media[:10]]
        attached = {f"attached_media[{i}]": json.dumps({"media_fbid": x}) for i, x in enumerate(ids)}
        return self.post(f"{self.page}/feed", message=caption, **attached)["id"]


# ---------------------------------------------------------------- LinkedIn company page
class LinkedIn:
    secrets = ("LINKEDIN_ORG_ID", "LINKEDIN_TOKEN")

    def __init__(self, media_dir, media_base):
        self.org = f"urn:li:organization:{os.environ['LINKEDIN_ORG_ID']}"
        self.token = os.environ["LINKEDIN_TOKEN"]
        self.media_dir = media_dir

    def headers(self, extra=None):
        h = {"Authorization": f"Bearer {self.token}", "LinkedIn-Version": LI_VERSION,
             "X-Restli-Protocol-Version": "2.0.0"}
        h.update(extra or {})
        return h

    def existing(self):
        try:
            data = http("GET", f"{LI_API}/posts", {"q": "author", "author": self.org, "count": 50},
                        headers=self.headers())
            return {first_line(p.get("commentary")) for p in data.get("elements", [])}
        except ApiError as e:
            print("  could not read existing LinkedIn posts, using the 55-minute window:", e)
            return None

    def upload_image(self, path):
        init = http("POST", f"{LI_API}/images?action=initializeUpload",
                    data=json.dumps({"initializeUploadRequest": {"owner": self.org}}).encode(),
                    headers=self.headers({"Content-Type": "application/json"}))["value"]
        http("PUT", init["uploadUrl"], data=path.read_bytes(), raw=True,
             headers={"Authorization": f"Bearer {self.token}", "Content-Type": "application/octet-stream"})
        return init["image"]

    def publish(self, post):
        images = [m for m in post["media"] if m.lower().endswith((".jpg", ".jpeg", ".png"))]
        body = {"author": self.org, "commentary": post["caption"], "visibility": "PUBLIC",
                "distribution": {"feedDistribution": "MAIN_FEED", "targetEntities": [],
                                 "thirdPartyDistributionChannels": []},
                "lifecycleState": "PUBLISHED", "isReshareDisabledByAuthor": False}
        if len(images) == 1:
            body["content"] = {"media": {"id": self.upload_image(self.media_dir / images[0])}}
        elif len(images) > 1:
            body["content"] = {"multiImage": {"images": [
                {"id": self.upload_image(self.media_dir / m)} for m in images[:20]]}}
        resp, _ = http("POST", f"{LI_API}/posts", data=json.dumps(body).encode(), raw=True,
                       headers=self.headers({"Content-Type": "application/json"}))
        return resp.headers.get("x-restli-id", "created")


PLATFORMS = {"instagram": Instagram, "facebook": Facebook, "linkedin": LinkedIn}


# ---------------------------------------------------------------- checks + main
def check_manifest(platform, manifest, media_dir):
    out = []
    for p in manifest["posts"]:
        tag = f"{platform} post {p['n']} ({p['date']})"
        cap = p["caption"]
        if "—" in cap or "–" in cap:
            out.append(f"{tag}: contains an em or en dash")
        if platform == "instagram":
            if len(cap) > 2200:
                out.append(f"{tag}: caption over 2,200 characters")
            if cap.count("#") > 5:
                out.append(f"{tag}: more than 5 hashtags")
            if p["type"] not in ("IMAGE", "CAROUSEL", "REELS"):
                out.append(f"{tag}: unknown type {p['type']}")
        if platform == "linkedin" and len(cap) > 3000:
            out.append(f"{tag}: over LinkedIn's 3,000 character limit")
        for m in p["media"]:
            if not (media_dir / m).exists():
                out.append(f"{tag}: missing media file {m}")
    return out


def main(argv):
    if not argv or argv[0] not in PLATFORMS:
        print("usage: publish.py instagram|facebook|linkedin")
        return 2
    platform = argv[0]
    folder = SOCIAL / platform
    media_dir = folder / "media"
    media_base = (os.environ.get("MEDIA_BASE_URL") or
                  f"https://cdn.jsdelivr.net/gh/{REPO}@{BRANCH}/social/{platform}/media").rstrip("/")
    manifest = json.loads((folder / "posts.json").read_text())
    tz = ZoneInfo(manifest.get("timezone", "America/Denver"))
    now = datetime.now(tz)
    at = lambda p: datetime.fromisoformat(f"{p['date']}T{p['time']}").replace(tzinfo=tz)

    for line in check_manifest(platform, manifest, media_dir):
        print("WARN", line)
    needs_media = platform == "instagram"
    due = [p for p in manifest["posts"]
           if now - CATCHUP <= at(p) <= now and (p["media"] or not needs_media)]
    upcoming = [p for p in manifest["posts"] if at(p) > now]
    last = max((at(p) for p in manifest["posts"]), default=None)
    print(f"[{platform}] {now:%Y-%m-%d %H:%M %Z}: {len(due)} due, {len(upcoming)} upcoming"
          + (f", plan ends {last:%b %d, %Y}" if last else ", plan is empty"))
    if needs_media:
        missing = [p["n"] for p in upcoming if not p["media"]]
        if missing:
            print(f"  {len(missing)} upcoming posts still need photos, next: {missing[:7]}")
    if last and timedelta(0) < last - now < timedelta(days=14):
        print(f"  NOTE: this plan runs out {last:%b %d}. Time to load the next 90 days.")
    if not due:
        return 0

    cls = PLATFORMS[platform]
    if DRY_RUN or not all(os.environ.get(s) for s in cls.secrets):
        if not DRY_RUN:
            print(f"  secrets {', '.join(cls.secrets)} not set; listing only")
        for p in due:
            print(f"  would publish post {p['n']} {p['type']} {p['media']}")
        return 0

    client = cls(media_dir, media_base)
    seen = client.existing()
    if seen is None:
        # Without a way to see what is already live, only post what came due since the last hourly run.
        due = [p for p in due if now - at(p) <= timedelta(minutes=55)]
        seen = set()
    failed = 0
    for p in sorted(due, key=at):
        if first_line(p["caption"]) in seen:
            print(f"  post {p['n']}: already live, skipping")
            continue
        try:
            print(f"  post {p['n']}: published as {client.publish(p)}")
        except ApiError as e:
            failed += 1
            print(f"  post {p['n']}: FAILED {e}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
