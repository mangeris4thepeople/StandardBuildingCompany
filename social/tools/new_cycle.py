#!/usr/bin/env python3
"""Close out a finished 90-day cycle and make room for the next one.

  python social/tools/new_cycle.py            (archive everything already published)
  python social/tools/new_cycle.py --dry-run

For each platform, posts dated before today move from social/<platform>/posts.json into
social/archive/<YYYY-MM-DD>/<platform>.json (captions and topics only), and their media files
and raw photos are deleted so the repo stays small. Archived captions are still checked by check_plan.py,
so the next cycle can't repeat them. Then add the new posts to each posts.json, run
check_plan.py, and commit.
"""
import json
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

SOCIAL = Path(__file__).resolve().parents[1]
KEEP = ("n", "date", "time", "type", "topic", "caption", "location")


def main(argv):
    dry = "--dry-run" in argv
    tz = ZoneInfo("America/Denver")
    today = datetime.now(tz).date()
    out_dir = SOCIAL / "archive" / today.isoformat()
    for plat in ("instagram", "facebook", "linkedin"):
        path = SOCIAL / plat / "posts.json"
        if not path.exists():
            continue
        plan = json.loads(path.read_text())
        done = [p for p in plan["posts"] if datetime.fromisoformat(p["date"]).date() < today]
        keep = [p for p in plan["posts"] if p not in done]
        files = [SOCIAL / plat / "media" / m for p in done for m in p.get("media", [])]
        files += [f for p in done for f in (SOCIAL / plat / "photos").glob(f"post{p['n']:02d}_*")]
        print(f"{plat}: archiving {len(done)} posts, deleting {len(files)} media files, {len(keep)} remain")
        if dry or not done:
            continue
        out_dir.mkdir(parents=True, exist_ok=True)
        arch = out_dir / f"{plat}.json"
        old = json.loads(arch.read_text())["posts"] if arch.exists() else []
        arch.write_text(json.dumps({"posts": old + [{k: p.get(k) for k in KEEP} for p in done]},
                                   indent=1, ensure_ascii=False) + "\n")
        for f in files:
            f.unlink(missing_ok=True)
        plan["posts"] = keep
        path.write_text(json.dumps(plan, indent=1, ensure_ascii=False) + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
