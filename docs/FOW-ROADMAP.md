# Fog of War — roadmap

## 0.3.0 (current)

- **0.2.0** visuals plus **aim parallax**, **impact particles**, **sonar ripples**, **ground stripes** on the board; short delay before handoff so effects finish.

## 0.2.0

- Same **0.1.0** gameplay and rules; visual pass: **parallax** backdrop, arena framing, **row depth tint** on cells, **screen shake** on shells, menu title gradient.

## 0.1.0

- **2D** Phaser 3 + Vite client, shared deterministic rules (`@phil-game/fow-shared`).
- Hot-seat placement → battle → result.
- GitHub Pages deploy from `main`.

## Next: toward a funkier, more spatial feel

Likely directions (pick one or combine):

1. **More 2.5D** — sprite terrain layers, animated craters / decals on repeat hits, richer tracer along the arc; still Phaser + grid rules.
2. **Real 3D client** — new renderer (e.g. Three.js / Babylon / Godot export) with the **same** `@phil-game/fow-shared` rules driving simulation; bigger engineering lift, clearer “funky 3D” payoff.

Decisions to lock before heavy build: camera model (side vs orbit), whether terrain is still grid-backed, and what stays in 2D rules vs moves into 3D physics.

See also [`CHANGELOG.md`](CHANGELOG.md).
