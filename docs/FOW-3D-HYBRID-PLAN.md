# Fog of War — hybrid 3D client plan

**Intent:** Move from the Phaser **2D grid** client to a **3D** presentation while keeping **`@phil-game/fow-shared`** as the **single source of truth** for rules, fog, and ballistics. **Top-down** is the **ground-truth** view; a **side / low “artillery”** camera is the **spectacle** layer for aiming and impact—not a second simulation.

**Status:** planning — not implemented.

---

## 1. Principles

| Principle | Meaning |
|-----------|---------|
| **Sim first** | Match state, fog, hits, and win/loss stay in `fow-shared`; the 3D client **reflects** state, it does not fork rules in v1. |
| **Top-down owns truth** | Placement, fog reading, sonar targeting, and post-shot intel are always legible from the **overview** camera (or an equivalent minimap if side cam is active). |
| **Side cam is juice** | Low/side view exists for **aiming theatre**, trajectory read, and impact punch—then **return** to overview so players never “live” in a confusing angle. |
| **One clock** | Transitions are **scripted**: overview → aim cam → fire → impact → overview (with optional skip for repeat players). |

---

## 2. Camera model (authoritative vs fun)

### 2.1 Ground truth — **top-down 3D**

- Camera **high**, **near-orthogonal** (small perspective ok for depth cues).
- **Grid** and **fog** map 1:1 to the existing row/col model; tiles are **3D quads or instanced mesh** on a plane (optionally **slight** height noise later—out of scope until base works).
- **Units** as simple meshes or billboards per cell; bunkers span two cells as today.
- **Sonar** hover/selection happens here; green preview matches current Manhattan rules.

### 2.2 Fun layer — **side / low artillery**

- Activated when the player **enters aim mode** for a **standard** shot (sonar may stay overview-only in v1 to reduce scope).
- Framing: **profile** or **slightly elevated** so the arc reads clearly; **horizon** optional; **same** launch point and impact as sim (see §4).
- **Duration:** short **sequence**—not a second game loop. End state always reconciles to shared `GameState`.

### 2.3 Optional v2 niceties

- **Skip** side cam (setting).
- **Replay** of last shot from side cam.
- **Picture-in-picture** top-down during side cam so fog never “disappears” from cognition.

---

## 3. Architecture (monorepo)

| Piece | Role |
|-------|------|
| **`@phil-game/fow-shared`** | Unchanged contract for v1: `GameState`, `fireStandardShot`, `fireSonar`, fog, placement. Optional later: hooks for **visual-only** events (e.g. impact intensity) without rule changes. |
| **New app** (e.g. `apps/fog-of-war-3d/`) | Vite + **Three.js** (or Babylon—pick one in spike). Owns render loop, cameras, input → calls into `fow-shared`. |
| **Current `apps/fog-of-war`** | Remains the **2D** reference / fallback / rapid iteration until 3D reaches parity; then policy (deprecate vs dual-ship) is a product call. |

**Stack spike (default assumption):** Three.js + `@react-three/fiber` *or* vanilla Three—decide in **Week 0 spike** based on team preference and bundle size for Pages.

---

## 4. Mapping sim ↔ 3D (critical path)

1. **Grid → world:** Fixed scale: e.g. `1 cell = 1 world unit` on XZ plane; Y up. **Single convention** document in code (`WORLD_CELL` constant).
2. **Launch origin:** Already from **cannon tile center** in shared code—3D spawns muzzle / shell at that **world** position.
3. **Trajectory preview:** Reuse `sampleShotTrajectory` points → polyline or ribbon in 3D; side cam uses same samples for the **visible** arc.
4. **Impact:** Shared `TrajectoryHit` + `GameState` update → 3D plays VFX at **world position** of impact cell center; **top-down** updates fog tiles from state (no duplicate fog logic in renderer).

If side cam and top-down **ever disagree**, **sim wins**—renderer bugs get fixed, not rules.

---

## 5. Phased delivery

### Phase 0 — Spike (small)

- One **scene**: flat plane, 16×12 grid, **one** cannon mesh, **top-down** + **orbit or side** preset buttons.
- Pipe **one** `simulateShot` → draw arc in 3D → confirm hit cell matches shared output.
- **Exit:** “We can trust the bridge; pick Three vs Babylon.”

### Phase 1 — Ground truth parity

- Top-down **placement** + **battle** with fog rendering from `GameState` (no side cam yet).
- Input: same logical controls as 2D (angle, power, fire) with 3D HUD.
- Hot-seat handoff screens (can reuse 2D overlay or minimal HTML).

### Phase 2 — Side / low shot pass

- **State machine:** `Overview` → `AimPresentation` (side) → `Resolve` (VFX) → `Overview`.
- Shell animation **cosmetic**; result from `fireStandardShot` only.
- Polish: camera shake, particles, **skip** toggle.

### Phase 3 — Parity + ship

- Feature-match current Phaser client (sonar UX, help, result screen).
- Performance: mobile / low-end; **GitHub Pages** asset budget.
- Decide fate of Phaser app.

---

## 6. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Double fog / desync | Never compute fog in renderer; only **paint** from `fow-shared` output. |
| Side cam confuses players | PIP top-down or **forced** return to overview after shot; tutorial string. |
| Scope creep (destructible mesh) | **Out of v1**; craters stay **visual decals** tied to cell, not mesh CSG. |
| Bundle size / load | Code-split 3D app; lazy Three chunk. |

---

## 7. Open decisions (before build)

1. **Three.js vs Babylon.js** — one spike settles this.
2. **Sonar** in v1 of hybrid: **overview-only** vs light side-cam ping (recommend overview-only first).
3. **Coexistence:** ship 3D on `/play3d` vs replace `fog-of-war` default route.

---

## 8. References

- Rules & fog: [`FOW-GDD.md`](FOW-GDD.md), [`packages/fow-shared`](../packages/fow-shared/)
- UX principles: [`FOW-UX.md`](FOW-UX.md)
- Release history: [`CHANGELOG.md`](CHANGELOG.md)

When this plan is approved for execution, add milestones to the main roadmap and optionally split Phase 0–2 into issues or `aaa` / project tasks.
