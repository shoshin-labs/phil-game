# Changelog

All notable changes to this monorepo are summarized here. Fog of War and The Atrium version independently where it matters.

## Fog of War

### 0.6.0 — 2026-03-21

**Units:** Generated **icons** for cannon / bunker / decoy on the grid; HP as a short line under the icon. **Ballistics:** Shells now launch from the **first surviving cannon tile** (deterministic order), with **edge fallback** only if no cannon remains; HUD line shows source tile. **Copy:** How-to-play explains default roster (decoys off), only **standard shells + sonar** as weapons, and that shells fire **from cannons** not “nowhere”.

### 0.5.1 — 2026-03-21

**UX pass:** Orange **impact preview** + blast ring on the grid (first tile struck); **HUD** shows row/col and hit type; **left** panel lists keys with **Standard vs Sonar** copy; **menu** + **battle** subtitle set **2D / not 3D** expectations; **canvas** `tabindex` + focus on pointer **down**; first-run **battle** overlay and **How to play** copy updated. See [`FOW-UX.md`](FOW-UX.md).

### 0.5.0 — 2026-03-21

**2.5D “next pass” (Phaser grid client):** **Animated comet** — bright head loops along the aim arc (`pointOnPolyline` + `update`). **Hit-kind crater palettes** — scorch fill/stroke/ring colours follow `TrajectoryHit.kind` (unit / terrain / miss / out-of-bounds); session stores `{ count, lastKind }` per cell. **Rubble shards** — deterministic triangles around each crater, denser on repeat hits. Cleared with `resetFowSession()` like other client-only battle marks.

### 0.4.0 — 2026-03-21

**2.5D pass:** **Rich aim arc** — layered glow + beads along the trajectory preview. **Scorch marks** persist per cell for the battle (darker / double ring on repeat hits; client-only, cleared on new game). **Terrain grain** — boot-generated noise texture, tiled over the arena with multiply blend, moves with aim parallax.

### 0.3.0 — 2026-03-21

**More 2.5D juice:** backdrop layers shift subtly with **aim** (standard mode); **shell impact** sparks + shock rings by hit type (unit / terrain / miss / out); **sonar** concentric ripples at the ping cell; **terrain stripe** overlay on the grid (placement + battle). Handoff to the next player is delayed briefly so VFX can play.

### 0.2.0 — 2026-03-21

**2.5D polish (still grid-backed rules):** parallax sky and distant hill silhouette behind the arena, soft gradient slab framing the board, per-row terrain tint (nearer rows read slightly closer), light camera shake on standard shots, title menu backdrop.

### 0.1.0 — 2026-03-21

First tagged **playable** release: hot-seat flow, placement with quotas, 2D Phaser + Vite client, rules in `@phil-game/fow-shared` (ballistics, fog, combat resolution). Deployed as the default GitHub Pages build (`/phil-game/`).

**Not in scope for 0.1.0:** 3D rendering, online multiplayer.

---

## The Atrium

Unchanged versioning in this pass; see `apps/philosophy/package.json`.
