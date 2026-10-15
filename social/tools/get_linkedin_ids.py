#!/usr/bin/env python3
"""One-time helper: list the LinkedIn company pages a token can post for, to get LINKEDIN_ORG_ID.

  python social/tools/get_linkedin_ids.py

Paste the access token from the LinkedIn developer portal's OAuth token tool (scopes:
w_organization_social, r_organization_social, rw_organization_admin). Prints each
organization ID and your role. Standard library only; nothing is saved.
"""
import getpass
import json
import os
import urllib.request

VERSION = os.environ.get("LINKEDIN_VERSION") or "202606"


def get(url, token):
    req = urllib.request.Request(url, headers={
        "Authorization": f"Bearer {token}", "LinkedIn-Version": VERSION,
        "X-Restli-Protocol-Version": "2.0.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())


def main():
    token = getpass.getpass("LinkedIn access token (hidden): ").strip()
    acls = get("https://api.linkedin.com/rest/organizationAcls?q=roleAssignee&state=APPROVED", token)
    for el in acls.get("elements", []):
        org_id = el["organization"].split(":")[-1]
        try:
            name = get(f"https://api.linkedin.com/rest/organizations/{org_id}", token).get("localizedName")
        except Exception:
            name = "?"
        print(f"LINKEDIN_ORG_ID = {org_id}   ({name}, role {el.get('role')})")
    if not acls.get("elements"):
        print("No company pages found for this token. Check the scopes and that you are a page admin.")


if __name__ == "__main__":
    main()
