#!/usr/bin/env python3
"""One-time helper: turn a short-lived Graph API Explorer token into the Meta GitHub secrets.

Prints FB_PAGE_ID, IG_USER_ID and a Page access token (META_PAGE_TOKEN) that does not expire.
Standard library only.

  python social/tools/get_meta_token.py

It asks for your Meta app ID, app secret, and the short-lived user token you generated in
Graph API Explorer (permissions: instagram_basic, instagram_content_publish,
pages_show_list, pages_read_engagement, pages_manage_posts, business_management). Nothing is saved to disk.
"""
import getpass
import json
import urllib.parse
import urllib.request

GRAPH = "https://graph.facebook.com/v25.0"


def get(path, **params):
    url = f"{GRAPH}/{path}?{urllib.parse.urlencode(params)}"
    with urllib.request.urlopen(url, timeout=60) as r:
        return json.loads(r.read().decode())


def main():
    app_id = input("Meta app ID: ").strip()
    app_secret = getpass.getpass("Meta app secret (hidden): ").strip()
    short = getpass.getpass("Short-lived user token from Graph API Explorer (hidden): ").strip()

    long_user = get("oauth/access_token", grant_type="fb_exchange_token", client_id=app_id,
                    client_secret=app_secret, fb_exchange_token=short)["access_token"]
    pages = get("me/accounts", access_token=long_user, fields="id,name,access_token,instagram_business_account")
    found = False
    for page in pages.get("data", []):
        found = True
        ig = page.get("instagram_business_account")
        print("\nPage:", page["name"])
        print("FB_PAGE_ID      =", page["id"])
        if ig:
            username = get(ig["id"], access_token=page["access_token"], fields="username").get("username")
            print("IG_USER_ID      =", ig["id"], f"(@{username})")
        else:
            print("IG_USER_ID      = (no Instagram business account linked to this Page)")
        print("META_PAGE_TOKEN =", page["access_token"])
    if not found:
        print("No Pages were returned. Check the token's permissions.")


if __name__ == "__main__":
    main()
