# Fog of War — build & run

**Release:** **0.6.0** (`@phil-game/fog-of-war` / `@phil-game/fow-shared`). UX notes: [`FOW-UX.md`](FOW-UX.md). Optional **3D** client: [`FOW-ROADMAP.md`](FOW-ROADMAP.md).

## Packages

| Package | Role |
|---------|------|
| `@phil-game/fow-shared` | Deterministic game rules: grid, ballistics, placement, fog, `fireStandardShot` / `fireSonar`. **Vitest** unit tests live here. |
| `@phil-game/fog-of-war` | Phaser 3 + Vite shell; imports shared rules. |

## Commands (repo root)

```bash
pnpm install

# Run Fog of War client (dev server) — default `pnpm dev`
pnpm dev

# Run shared package tests (rules + ballistics + placement + combat resolution)
pnpm test
# (alias: pnpm test:fow)

# Production build (output: apps/fog-of-war/dist)
pnpm build
```

## Defaults (code)

- Grid **16×12**, vertical split at column **8** (`DEFAULT_GRID_W` / `DEFAULT_GRID_H` in `packages/fow-shared/src/constants.ts`).
- Tuning is still `[PLACEHOLDER]` in the GDD; change constants after playtests.
- Battle **Standard** mode draws a **trajectory preview** from `sampleShotTrajectory()` (same integration loop as `simulateShot`). **Sonar** mode shows a **Manhattan-radius** hover outline on the opponent half (`DEFAULT_SONAR_RADIUS_CELLS`).
- **Ammo** is shown as left-rail **segment bars** + numeric `remaining/total` (defaults from `DEFAULT_AMMO_STANDARD` / `DEFAULT_AMMO_SONAR`). **Last sonar** result per player is stored in session (`getLastSonarLine` / `setLastSonarLine`) and echoed on that player’s turns.
- **SFX** in `apps/fog-of-war/src/audio/sfx.ts` uses the Web Audio **context** from Phaser’s `WebAudioSoundManager` (no asset files). If audio is unavailable, calls no-op safely.
- **First battle** shows a one-time **tooltip** (`localStorage` key `fow_battle_hint_v1`). Marketing copy / store page is out of scope until the build is further along.

## Manual QA

See [`docs/PLAYTEST.md`](PLAYTEST.md) for a step-by-step checklist before releases.

## Next implementation steps (engineering)

1. **Polish** — trajectory preview, clearer placement UX, audio (SFX from `simulateShot` / resolution).
