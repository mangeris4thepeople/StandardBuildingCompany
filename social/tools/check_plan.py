#!/usr/bin/env python3
"""Check the content plans before they go live.

  python social/tools/check_plan.py

Fails (exit 1) when:
  - the same topic or opening line appears twice anywhere, across Instagram, Facebook,
    LinkedIn, and every archived cycle (SBC rule: new content on every platform, no reuse),
  - a caption has an em or en dash,
  - Instagram has more than 5 hashtags or a caption over 2,200 characters,
  - two posts on one platform share a date and time.
Warns about upcoming posts that still need photos and plans that end within two weeks.
"""
import difflib
import json
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

SOCIAL = Path(__file__).resolve().parents[1]
PLATFORMS = ("instagram", "facebook", "linkedin")
SIMILAR = 0.86


def norm(text):
    return re.sub(r"[^a-z0-9 ]", "", (text or "").lower()).strip()


def opening(caption):
    """First line of a caption, minus a short series label like 'Question of the week:'."""
    lines = (caption or "").strip().splitlines()
    if not lines:
        return ""
    head, sep, tail = lines[0].partition(":")
    line = tail if sep and len(head) <= 30 and len(tail.strip()) >= 25 else lines[0]
    return norm(line)


def load(path):
    try:
        return json.loads(path.read_text())
    except FileNotFoundError:
        return {"posts": []}


def main():
    errors, warnings = [], []
    entries = []
    for plat in PLATFORMS:
        for p in load(SOCIAL / plat / "posts.json")["posts"]:
            entries.append((f"{plat} #{p['n']} {p['date']}", plat, p, False))
    for f in sorted((SOCIAL / "archive").rglob("*.json")):
        for p in load(f).get("posts", []):
            entries.append((f"archive {f.parent.name}/{f.stem} #{p.get('n')}", f.stem, p, True))

    keys = []
    for label, plat, p, archived in entries:
        for kind, val in (("topic", norm(p.get("topic", ""))), ("opening line", opening(p.get("caption")))):
            if len(val) >= 25:
                keys.append((kind, val, label, archived))
    for i in range(len(keys)):
        for j in range(i + 1, len(keys)):
            a, b = keys[i], keys[j]
            if a[0] != b[0] or (a[3] and b[3]):
                continue
            if a[1] == b[1] or difflib.SequenceMatcher(None, a[1], b[1]).ratio() >= SIMILAR:
                errors.append(f"repeat {a[0]}: '{a[1][:60]}' in {a[2]} and {b[2]}")

    for plat in PLATFORMS:
        plan = load(SOCIAL / plat / "posts.json")
        tz = ZoneInfo(plan.get("timezone", "America/Denver"))
        now = datetime.now(tz)
        slots = {}
        last = None
        for p in plan["posts"]:
            tag = f"{plat} #{p['n']} {p['date']}"
            cap = p.get("caption", "")
            if "—" in cap or "–" in cap:
                errors.append(f"{tag}: em or en dash in caption")
            if plat == "instagram" and cap.count("#") > 5:
                errors.append(f"{tag}: more than 5 hashtags")
            if plat == "instagram" and len(cap) > 2200:
                errors.append(f"{tag}: caption over 2,200 characters")
            slot = (p["date"], p["time"])
            if slot in slots:
                errors.append(f"{tag}: same time as #{slots[slot]}")
            slots[slot] = p["n"]
            when = datetime.fromisoformat(f"{p['date']}T{p['time']}").replace(tzinfo=tz)
            last = max(last, when) if last else when
            for m in p.get("media", []):
                if not (SOCIAL / plat / "media" / m).exists():
                    errors.append(f"{tag}: missing media {m}")
            if plat == "instagram" and when > now and not p.get("media"):
                warnings.append(f"{tag}: needs photos")
        if last and last - now < timedelta(days=14):
            warnings.append(f"{plat}: plan ends {last:%b %d, %Y}; load the next 90 days")
        print(f"{plat}: {len(plan['posts'])} posts" + (f", last {last:%b %d, %Y}" if last else ""))

    for w in warnings[:40]:
        print("WARN ", w)
    if len(warnings) > 40:
        print(f"WARN  ... {len(warnings) - 40} more")
    for e in errors:
        print("ERROR", e)
    print(f"{len(errors)} error(s), {len(warnings)} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
