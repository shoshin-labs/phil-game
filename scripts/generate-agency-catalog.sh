#!/usr/bin/env bash
# Build .cursor/agency-catalog.md from .cursor/rules/*.mdc (description lines).
# Skips agency-discovery.mdc. Run after sync-agency-cursor-rules.sh.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RULES="$PROJECT_ROOT/.cursor/rules"
OUT="$PROJECT_ROOT/.cursor/agency-catalog.md"

if [[ ! -d "$RULES" ]]; then
  echo "Missing $RULES" >&2
  exit 1
fi

{
  echo "# Agency specialist catalog"
  echo ""
  echo "Auto-generated — do not edit. Regenerate: \`./scripts/sync-agency-cursor-rules.sh\`"
  echo ""
  echo "Search this file (or \`grep -i keyword .cursor/agency-catalog.md\`) to find a slug, then read \`.cursor/rules/<slug>.mdc\`."
  echo ""
  echo "---"
  echo ""

  while IFS= read -r -d '' f; do
    base="$(basename "$f")"
    [[ "$base" == "agency-discovery.mdc" ]] && continue
    slug="${base%.mdc}"
    desc="$(awk '/^description: /{sub(/^description: /,""); print; exit}' "$f")"
    echo "- **${slug}** — ${desc}"
  done < <(find "$RULES" -maxdepth 1 -name '*.mdc' -type f -print0 | sort -z)

} > "$OUT"

lines="$(grep -c '^- \*\*' "$OUT" || true)"
echo "Wrote $OUT ($lines specialists listed)"
