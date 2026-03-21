# phil-game

Monorepo for games by **Shoshin Labs**. Currently houses two projects:

- **The Atrium** — a short philosophy game about *how you move through ideas* (branching choices, hidden axes, reflective finale). Design: [`docs/GDD.md`](docs/GDD.md).
- **Fog of War** — **v0.5.0** — hot-seat prototype with full **2.5D** polish (parallax, FX, craters, comet tracer, rubble). Optional **3D client** track remains future work: [`docs/FOW-ROADMAP.md`](docs/FOW-ROADMAP.md). Design: [`docs/FOW-GDD.md`](docs/FOW-GDD.md). Build: [`docs/FOW-BUILD.md`](docs/FOW-BUILD.md). Changelog: [`docs/CHANGELOG.md`](CHANGELOG.md).

## Games

- **`apps/philosophy`** — **The Atrium** — Phaser 3 philosophy game; narrative data in `@phil-game/shared`. Design: [`docs/GDD.md`](docs/GDD.md).
- **`apps/fog-of-war`** — **Fog of War** — Phaser client; rules in `@phil-game/fow-shared`. Default: `pnpm dev` / `pnpm build`.

## Setup

```bash
pnpm install
```

**Tests (Fog of War rules engine):** `pnpm test`

## Development

From the repo root:

```bash
pnpm dev
```

**The Atrium:**

```bash
pnpm dev:atrium
```

Or from an app folder:

```bash
cd apps/fog-of-war && pnpm dev
cd apps/philosophy && pnpm dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

**Production builds:** `pnpm build` (Fog of War) · `pnpm build:atrium` (The Atrium).

## Play on GitHub Pages

Production build deploys automatically on every push to `main` (see [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)).

**Live URL:** [https://shoshin-labs.github.io/phil-game/](https://shoshin-labs.github.io/phil-game/)

**One-time setup (repo admin)** — pick one:

- **GitHub CLI** (same effect as the UI: workflow-based Pages):

  ```bash
  gh api repos/shoshin-labs/phil-game/pages -X POST --input - <<'EOF'
  {
    "build_type": "workflow",
    "source": { "branch": "main", "path": "/" }
  }
  EOF
  ```

  Or run **`./scripts/enable-github-pages.sh`** from this repo (requires [`gh`](https://cli.github.com/) and admin on the repo).

- **Web UI:** **Settings** → **Pages** → **Build and deployment** → source **GitHub Actions**.

After Pages is enabled, a successful run of [Deploy to GitHub Pages](.github/workflows/deploy-pages.yml) publishes the site (usually within a minute).

## Repo

Remote: [`shoshin-labs/phil-game`](https://github.com/shoshin-labs/phil-game) — **public**, default branch `main`. GitHub Pages is enabled with **GitHub Actions** as the publishing source.
