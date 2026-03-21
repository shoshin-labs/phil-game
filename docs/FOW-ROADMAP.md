# Fog of War — roadmap

## 0.1.0 (current)

- **2D** Phaser 3 + Vite client, shared deterministic rules (`@phil-game/fow-shared`).
- Hot-seat placement → battle → result.
- GitHub Pages deploy from `main`.

## Next: toward a funkier, more spatial feel

**Target: a post-0.1 release** (version TBD when work starts — e.g. **0.2.0** or **0.5.0** depending on scope).

Likely directions (pick one or combine):

1. **2.5D / “Worms-ish” without full 3D** — parallax, layered terrain art, shader depth on the existing grid; **fastest** iteration on the current stack.
2. **Real 3D client** — new renderer (e.g. Three.js / Babylon / Godot export) with the **same** `@phil-game/fow-shared` rules driving simulation; bigger engineering lift, clearer “funky 3D” payoff.

Decisions to lock before heavy build: camera model (side vs orbit), whether terrain is still grid-backed, and what stays in 2D rules vs moves into 3D physics.

See also [`CHANGELOG.md`](CHANGELOG.md).
