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

> **Private repos on Free:** GitHub may return *“Your current plan does not support GitHub Pages for this repository.”* In that case make the repo **public**, upgrade the org/account, or host the `dist` output elsewhere (e.g. Cloudflare Pages / Netlify).

## Repo

Remote: `https://github.com/shoshin-labs/phil-game` (private, `main`).
