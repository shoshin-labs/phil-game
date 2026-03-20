#!/usr/bin/env bash
# Regenerate Cursor rules from The Agency agents (~/.claude/agents by default).
# Usage: from repo root, ./scripts/sync-agency-cursor-rules.sh
# Env:   AGENCY_ROOT=/path/to/agency-agents to use a different clone.

set -euo pipefail

AGENCY_ROOT="${AGENCY_ROOT:-${HOME}/.claude/agents}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ ! -f "$AGENCY_ROOT/scripts/convert.sh" ]] || [[ ! -f "$AGENCY_ROOT/scripts/install.sh" ]]; then
  echo "Expected Agency repo at: $AGENCY_ROOT (with scripts/convert.sh and scripts/install.sh)" >&2
  exit 1
fi

echo "Converting agents -> Cursor rules (source: $AGENCY_ROOT)"
(cd "$AGENCY_ROOT" && ./scripts/convert.sh --tool cursor)

echo "Installing into $PROJECT_ROOT/.cursor/rules"
(cd "$PROJECT_ROOT" && "$AGENCY_ROOT/scripts/install.sh" --tool cursor --no-interactive)

count="$(find "$PROJECT_ROOT/.cursor/rules" -maxdepth 1 -name '*.mdc' -type f | wc -l | tr -d ' ')"
echo "Done. $count .mdc rule files in .cursor/rules/"

echo "Generating searchable catalog..."
"$SCRIPT_DIR/generate-agency-catalog.sh"
