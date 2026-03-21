# Fog of War — roadmap

## 0.2.0 (current)

- Same **0.1.0** gameplay and rules; visual pass: **parallax** backdrop, arena framing, **row depth tint** on cells, **screen shake** on shells, menu title gradient.

## 0.1.0

- **2D** Phaser 3 + Vite client, shared deterministic rules (`@phil-game/fow-shared`).
- Hot-seat placement → battle → result.
- GitHub Pages deploy from `main`.

## Next: toward a funkier, more spatial feel

Likely directions (pick one or combine):

1. **More 2.5D** — sprite terrain layers, subtle parallax scroll on aim, particles on impacts; still Phaser + grid rules.
2. **Real 3D client** — new renderer (e.g. Three.js / Babylon / Godot export) with the **same** `@phil-game/fow-shared` rules driving simulation; bigger engineering lift, clearer “funky 3D” payoff.

Decisions to lock before heavy build: camera model (side vs orbit), whether terrain is still grid-backed, and what stays in 2D rules vs moves into 3D physics.

See also [`CHANGELOG.md`](CHANGELOG.md).
