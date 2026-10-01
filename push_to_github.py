#!/usr/bin/env python3
"""
WAFFLE HOUSE - GitHub Push Utility
Pushes local repository to https://github.com/vd2260434-maker/Waffle-House.git
"""

import sys
import os
import dulwich.porcelain as porcelain

REPO_PATH = os.path.dirname(os.path.abspath(__file__))
REMOTE_BASE = "github.com/vd2260434-maker/Waffle-House.git"

def push_with_token(token):
    token = token.strip()
    auth_url = f"https://{token}@{REMOTE_BASE}"
    print(f"Connecting to https://***@{REMOTE_BASE}...")
    try:
        # Push main branch
        porcelain.push(REPO_PATH, auth_url, "refs/heads/main:refs/heads/main", force=True)
        print(" Successfully pushed 'main' branch to GitHub!")
        return True
    except Exception as e:
        print(f"Push error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        token = sys.argv[1]
    else:
        token = input("Enter your GitHub Personal Access Token (PAT): ").strip()

    if not token:
        print("Error: No GitHub token provided.")
        sys.exit(1)

    success = push_with_token(token)
    sys.exit(0 if success else 1)
