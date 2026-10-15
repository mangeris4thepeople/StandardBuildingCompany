#!/usr/bin/env python3
"""Daily check that every platform has posts queued, run by .github/workflows/social-reminder.yml.

Writes reminder text to stdout and, for the workflow, to $GITHUB_OUTPUT as `reminders`
(empty when all is well). A reminder is raised when:
  - a platform has 2 or fewer posts left in its plan (so the next 90 days, photos included,
    get loaded before a day is missed),
  - an Instagram post in the next 7 days still has no photos,
  - the LinkedIn token is 55+ days old (LinkedIn tokens expire at 60 days), based on the
    LINKEDIN_TOKEN_DATE repository variable (YYYY-MM-DD) set when the token was created.
Platforms with an empty plan are skipped (they are not on the autopilot yet).
"""
import json
import os
from datetime import date, datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

SOCIAL = Path(__file__).resolve().parents[1]
POSTS_LEFT = int(os.environ.get("REMIND_POSTS_LEFT") or 2)


def main():
    tz = ZoneInfo("America/Denver")
    now = datetime.now(tz)
    notes = []
    for plat in ("instagram", "facebook", "linkedin"):
        plan = json.loads((SOCIAL / plat / "posts.json").read_text())
        posts = plan.get("posts", [])
        if not posts:
            continue
        when = lambda p: datetime.fromisoformat(f"{p['date']}T{p['time']}").replace(tzinfo=tz)
        last = max(when(p) for p in posts)
        left = sum(1 for p in posts if when(p) > now)
        if left == 0:
            notes.append(f"- **{plat.title()}**: the plan ran out on {last:%a %b %d}. Nothing is posting.")
        elif left <= POSTS_LEFT:
            notes.append(f"- **{plat.title()}**: only {left} post{'s' if left != 1 else ''} left "
                         f"(last one {last:%a %b %d}). Time to make the next 90 days, photos included.")
        if plat == "instagram":
            soon = [p for p in posts if now <= when(p) <= now + timedelta(days=7) and not p.get("media")]
            if soon:
                notes.append("- **Instagram**: posts in the next 7 days with no photos yet: "
                             + ", ".join(f"#{p['n']} ({p['date']})" for p in soon)
                             + ". Add them to `social/instagram/photos/`.")
    tok = os.environ.get("LINKEDIN_TOKEN_DATE", "").strip()
    if tok:
        age = (now.date() - date.fromisoformat(tok)).days
        if age >= 55:
            notes.append(f"- **LinkedIn token** is {age} days old and expires at 60. Generate a new one "
                         "and update the LINKEDIN_TOKEN secret and LINKEDIN_TOKEN_DATE variable.")
    text = "\n".join(notes)
    print(text or "All platforms have posts queued.")
    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a") as fh:
            fh.write("reminders<<EOF\n" + text + "\nEOF\n")


if __name__ == "__main__":
    main()
