# Changelog

All notable changes to this monorepo are summarized here. Fog of War and The Atrium version independently where it matters.

## Fog of War

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
