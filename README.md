# phil-game

Monorepo for **The Atrium** — a short philosophy game about *how you move through ideas* (branching choices, hidden axes, reflective finale). Design lives in [`docs/GDD.md`](docs/GDD.md).

## Games

- **`apps/philosophy`** — Phaser 3 player; narrative data in `@phil-game/shared`.

## Setup

```bash
pnpm install
```

## Development

From the repo root:

```bash
pnpm dev
```

Or:

```bash
cd apps/philosophy
pnpm dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

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
