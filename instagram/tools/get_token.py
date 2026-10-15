#!/usr/bin/env python3
"""One-time helper: turn a short-lived Graph API Explorer token into the two GitHub secrets.

Prints IG_USER_ID and a Page access token that does not expire. Standard library only.

  python instagram/tools/get_token.py

It asks for your Meta app ID, app secret, and the short-lived user token you generated in
Graph API Explorer (permissions: instagram_basic, instagram_content_publish,
pages_show_list, pages_read_engagement, business_management). Nothing is saved to disk.
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
        ig = page.get("instagram_business_account")
        if not ig:
            continue
        found = True
        username = get(ig["id"], access_token=page["access_token"], fields="username").get("username")
        print("\nPage:", page["name"], "| Instagram:", username)
        print("IG_USER_ID      =", ig["id"])
        print("IG_ACCESS_TOKEN =", page["access_token"])
    if not found:
        print("No Page with a linked Instagram business account was returned. Check the token's permissions.")


if __name__ == "__main__":
    main()
