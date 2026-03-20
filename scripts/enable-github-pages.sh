#!/usr/bin/env bash
# Enable GitHub Pages with GitHub Actions as the build source (equivalent to:
# Settings → Pages → GitHub Actions). Requires: gh auth, repo admin, and a plan
# that allows Pages (see README for private-repo limits).
#
# Usage: ./scripts/enable-github-pages.sh [owner/repo]

set -euo pipefail

REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)}"
if [[ -z "$REPO" || "$REPO" == "null" ]]; then
  echo "Usage: $0 [owner/repo]" >&2
  exit 1
fi

BODY='{"build_type":"workflow","source":{"branch":"main","path":"/"}}'

if gh api "repos/${REPO}/pages" >/dev/null 2>&1; then
  echo "Updating Pages to workflow build for: $REPO"
  gh api "repos/${REPO}/pages" -X PUT --input - <<<"$BODY"
else
  echo "Creating Pages (workflow build) for: $REPO"
  gh api "repos/${REPO}/pages" -X POST --input - <<<"$BODY"
fi

OWNER="${REPO%%/*}"
NAME="${REPO#*/}"
echo "Done. Expected site: https://${OWNER}.github.io/${NAME}/"
