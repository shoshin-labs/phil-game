# The Agency — Cursor rules

This project includes **specialist agent rules** generated from [The Agency](https://github.com/msitarzewski/agency-agents) agent definitions (installed at `~/.claude/agents` on this machine).

## Discovery (no need to memorize 120 names)

- **`agency-discovery.mdc`** is `alwaysApply: true` — the assistant is instructed to search **`agency-catalog.md`** for keywords, then read the matching **`rules/<slug>.mdc`** files.
- **`agency-catalog.md`** is a **generated** searchable list of every slug with its one-line description. Regenerated whenever you run the sync script.

You can still **@** a rule when you know the slug (`@frontend-developer`); discovery covers the rest.

## Optional: explicit @ mention

```text
@frontend-developer Refactor this component for accessibility.
@game-designer Review this loop for pacing and risk/reward.
```

Most specialist rules use `alwaysApply: false` so they only load when discovered or **@**’d.

## Regenerating after you update agents

From the **repository root**:

```bash
chmod +x scripts/sync-agency-cursor-rules.sh   # once
./scripts/sync-agency-cursor-rules.sh
```

To point at a different Agency checkout:

```bash
AGENCY_ROOT=/path/to/agency-agents ./scripts/sync-agency-cursor-rules.sh
```

## Count note

The upstream `convert.sh` only emits agents whose `.md` files start with YAML frontmatter (`---`, `name:`, `description:`). That is **120 personalities** in the current tree. Other markdown under `~/.claude/agents` (e.g. NEXUS strategy docs, phase playbooks without YAML headers) are documentation, not separate rule files unless you add frontmatter and extend `AGENT_DIRS` in `convert.sh`.
