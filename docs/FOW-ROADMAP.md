# Fog of War — roadmap

## 0.6.0 (current)

- **Units** — **Icons** for cannon / bunker / decoy; **shells** launch from **cannon tiles** (see `launchOriginForPlayer` + `FOW-UX.md`).

## 0.5.1

- **UX** — grid **impact preview** (orange first-hit + blast ring), **HUD** row/col + hit label, **left key legend**, **2D vs not-3D** copy, **canvas focus**, updated **How to play** + first-run overlay. See [`FOW-UX.md`](FOW-UX.md).

## 0.5.0

- **2.5D track (Phaser + grid rules)** — parallax, grain, row tint, ground stripes, impact + sonar FX, **rich tracer**, **comet head** on the arc, **hit-kind crater palettes**, **rubble shards**, repeat-hit emphasis, handoff delay for VFX.

## 0.4.0

- **0.3.0** juice plus **layered trajectory preview**, **persistent shell craters** (repeat-hit emphasis), **grain texture** on the arena slab.

## 0.3.0

- **0.2.0** visuals plus **aim parallax**, **impact particles**, **sonar ripples**, **ground stripes** on the board; short delay before handoff so effects finish.

## 0.2.0

- Same **0.1.0** gameplay and rules; visual pass: **parallax** backdrop, arena framing, **row depth tint** on cells, **screen shake** on shells, menu title gradient.

## 0.1.0

- **2D** Phaser 3 + Vite client, shared deterministic rules (`@phil-game/fow-shared`).
- Hot-seat placement → battle → result.
- GitHub Pages deploy from `main`.

## Next (optional)

1. **Juice / content** — sound variety, tutorial copy, balance passes; still the same stack.
2. **Real 3D client** — new renderer (e.g. Three.js / Babylon / Godot) driven by the **same** `@phil-game/fow-shared` simulation; lock camera model and what stays rule-based vs rendered.

See also [`CHANGELOG.md`](CHANGELOG.md).
