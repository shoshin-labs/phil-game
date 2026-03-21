# Fog of War — build & run

## Packages

| Package | Role |
|---------|------|
| `@phil-game/fow-shared` | Deterministic game rules: grid, ballistics, placement, fog, `fireStandardShot` / `fireSonar`. **Vitest** unit tests live here. |
| `@phil-game/fog-of-war` | Phaser 3 + Vite shell; imports shared rules. |

## Commands (repo root)

```bash
pnpm install

# Run Fog of War client (dev server)
pnpm dev:fow

# Run shared package tests
pnpm test:fow

# Production build (output: apps/fog-of-war/dist)
pnpm build:fow
```

## Defaults (code)

- Grid **16×12**, vertical split at column **8** (`DEFAULT_GRID_W` / `DEFAULT_GRID_H` in `packages/fow-shared/src/constants.ts`).
- Tuning is still `[PLACEHOLDER]` in the GDD; change constants after playtests.

## Next implementation steps (engineering)

1. **Placement scene** — grid render, drag units, call `placeUnit`, `advancePhaseAfterSetup`.
2. **Handoff scene** — §7 FOW-GDD.
3. **Battle scene** — aim UI → `fireStandardShot` / `fireSonar`; fog overlay for opponent half.
4. **Audio** — hook SFX to impact kinds from `simulateShot` / resolution.
