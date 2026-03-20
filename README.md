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

**One-time setup (repo admin):** GitHub → **Settings** → **Pages** → **Build and deployment** → source **GitHub Actions**. After the first workflow run finishes, the site should be available within a minute or two.

> **Private repos:** GitHub Pages for private repositories may require a paid GitHub plan depending on your org settings. If the workflow succeeds but the site doesn’t load, check Pages availability for your account or make the repo public.

## Repo

Remote: `https://github.com/shoshin-labs/phil-game` (private, `main`).
