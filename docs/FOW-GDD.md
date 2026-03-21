# Game Design Document — **Fog of War**

| Field | Value |
|-------|--------|
| **Working title** | Fog of War |
| **Subtitle** | *Fire blind. Think sharp.* |
| **Repo** | [shoshin-labs/phil-game](https://github.com/shoshin-labs/phil-game) |
| **Primary GDD** | This document (`docs/FOW-GDD.md`) |
| **Doc version** | 0.2 — implementation-ready draft |
| **Last updated** | 2026-03-21 |

**Changelog**

| Ver | Date | Notes |
|-----|------|--------|
| 0.1 | 2026-03-21 | Initial concept, pillars, systems overview |
| 0.2 | 2026-03-21 | v1 scope locked; hot-seat, turn pipeline, fog FSM, ADRs, tuning tables, MVP checklist |

---

## How to use this document

- **Design / product:** §1–6, §11–12, §14–15  
- **Engineering:** §7 (hot-seat), §8 (battlefield), §9 (turns), §10 (fog), §13 (technical), §16 (checklist)  
- **Art / audio:** §4.3, §10.4, §12 (feedback)  
- **Balance:** §11 (all values marked `[PLACEHOLDER]` until playtest)

Anything labelled **v1** is in scope for the first playable. **v2+** is explicitly out of scope until listed.

---

## 1. Elevator pitch

**Fog of War** is a turn-based, physics-driven strategy game that blends the hidden-information tension of Battleships with the chaotic, satisfying destruction of Angry Birds. Players fire blindly into a fog-covered battlefield, using intuition, memory, and deduction to locate and destroy hidden enemy positions.

**In one line:** *Aim through uncertainty — every shot teaches you something, if you're paying attention.*

### 1.1 Origin

Inspired by a childhood paper game: two players drew ships and gun placements on opposite sides of an A4 sheet, then took turns closing their eyes and drawing a line across the page to see what they hit. Unpredictable, tactile, and full of laughter — part skill, part guesswork, part luck. Fog of War captures that feeling and transforms it into a modern digital experience.

---

## 2. Design pillars

| Pillar | What it means |
|--------|---------------|
| **Uncertainty as gameplay** | The fog isn't a visual gimmick — it's the core mechanic. Limited information drives every decision. |
| **Skill meets deduction** | Physics aim requires mechanical skill; locating targets requires memory and reasoning from partial feedback. |
| **Satisfying destruction** | Hits feel impactful. **v1:** Impactful VFX, screen shake, and SFX on hit; **v2+:** Persistent terrain deformation where listed. |
| **Accessible depth** | Easy to pick up (aim and fire), hard to master (trajectory prediction, fog reading, bluffing in placement). |
| **Respect the session** | Short matches (3–5 minutes target). No bloat. |

---

## 3. Audience & tone

- **Primary:** Casual-to-midcore players who enjoy strategy, physics games, and competitive turn-based play. **v1 build target:** web + desktop (mouse); touch follows same patterns.
- **Secondary:** Players who grew up with Battleships, Worms, or Angry Birds.
- **Tone:** Playful tension — fog-drenched duel between rivals. Light humour in cosmetics (v2+); serious stakes in gameplay.

### 3.1 Voice & copy (UI / session)

| Context | Voice |
|---------|--------|
| Errors / rules | Short, neutral, no blame |
| Match transitions | Punchy, inviting |
| Win / loss | Celebrate deduction + skill, not luck |

*(Narrative designer lens: no lore required for v1; tone table above is enough for strings.)*

---

## 4. Core gameplay

### 4.1 Match structure

1. **Setup** — Each player places units on **their half** of a shared grid (hidden from opponent).  
2. **Battle** — Players **alternate turns**. On your turn you **aim and fire one projectile** from your baseline into the opponent’s half.  
3. **Resolution** — Match ends when a **win condition** is met (§9.3).

### 4.2 The fog (concept)

The opponent’s territory starts **fully obscured**. **You only see intel you have earned** — reveals from your own shots (and v2+ abilities). Your own side is always fully visible to you.

| Reveal trigger | v1 | v2+ |
|----------------|-----|-----|
| **Impact (any hit)** | Reveal cells in blast radius (§10) | Same |
| **Near-miss hint** | Optional minimal cue `[PLACEHOLDER]` | Stronger “proximity” feedback |
| **Splash** | Covered by blast radius | Same |
| **Sonar ping** | Reveals **temporary** overlay (§10.3) | May add charges / upgrades |
| **Scout tower passive** | — | See §6.2 |

Revealed knowledge **persists** for the rest of the match unless **temporary reveal** (sonar) says otherwise.

### 4.3 Physics-based shooting (v1)

| Element | v1 rule |
|---------|---------|
| **Aim** | Angle θ + power P (normalized), or drag-to-aim with visual arc preview **on your side only** |
| **Trajectory** | Parabolic arc; constant gravity g `[PLACEHOLDER]`; **no wind** |
| **Collision** | Ray/circle vs static grid obstacles + unit hitboxes; **no deformable terrain mesh in v1** |
| **Feedback** | Screen shake, particles, **distinct SFX per material** where possible (metal / earth / void) |

### 4.4 Information model

| You always know | You never know (until revealed) |
|-----------------|----------------------------------|
| Your placements | Opponent exact placements |
| Full state of **your** half | Opponent’s remaining **ammo counts** (v1: optional show counts — see §11) |
| Result of **your** shots (impact location + feedback tier) | Whether opponent’s last shot was a decoy vs bunker **through fog** — you infer from **their** feedback on your side when they fire at you |

**Design intent:** Deduction crosses turns — you triangulate from multiple impacts and from **incoming** fire on your visible side.

---

## 5. Glossary

| Term | Definition |
|------|------------|
| **Cell** | Single grid square; smallest placement unit |
| **Half** | One player’s deployment zone (§8) |
| **Fog** | Hidden state of opponent cells until revealed |
| **Reveal** | Persistent visibility of a cell’s contents (or “empty”) |
| **Blast radius** | Cells affected by an impact (damage + reveal) |
| **Baseline** | Edge from which shots are fired (left/right edge per player) |
| **Unit footprint** | Cells occupied by a unit (1×1 or 2×1) |
| **Hot-seat** | Same device; turns alternate; privacy enforced by UI (§7) |

---

## 6. Key systems — full vision vs v1

### 6.1 Units — full roster (reference)

| Unit | Role | HP | Footprint | Notes |
|------|------|-----|-----------|--------|
| **Cannon** | Target structure | `[2]` | 1×1 | Destroying reduces enemy “pressure” but not auto-win |
| **Bunker** | Win condition | `[4]` | 2×1 | Must be destroyed to win |
| **Scout tower** | Recon charges | `[1]` | 1×1 | **v2+** — grants extra sonar / reveal rules |
| **Decoy** | Misdirection | `0` (instant break) | 2×1 | Reads as bunker-sized target; **reveals as decoy** when hit |

### 6.2 v1 MVP roster (locked)

| Included | Count / notes |
|----------|----------------|
| **Cannon** | Fixed count `[PLACEHOLDER]` per player |
| **Bunker** | **Exactly 1** per player |
| **Decoy** | `[PLACEHOLDER]` (0–1 recommended for first build) |
| **Scout tower** | **Not in v1** — avoids overlapping “free recon” with sonar ping design |

### 6.3 Projectiles — full roster (reference)

| Type | Behaviour |
|------|-----------|
| **Standard shell** | Parabolic; blast R₁; damage 1 to units |
| **Heavy shell** | **v2+** — larger R, damage 2 |
| **Scatter shot** | **v2+** |
| **Sonar ping** | No damage; **temporary reveal** (§10.3) |
| **Incendiary** | **v2+** |

### 6.4 v1 MVP projectiles (locked)

| Included | Per match |
|----------|-----------|
| **Standard shell** | `[PLACEHOLDER]` rounds |
| **Sonar ping** | `[PLACEHOLDER]` charges (recommend **1–2** for first playtest) |

All other types **v2+**.

### 6.5 Win conditions

| Mode | Rule |
|------|------|
| **v1 default** | Destroy opponent’s **bunker** (HP ≤ 0) |
| **Draw** | If a single resolution step destroys **both** bunkers, match is a **draw** |
| **Timed mode** | **v2+** — most damage in N turns |

---

## 7. Hot-seat & privacy (v1 — required spec)

**Problem:** Two humans share one screen; fog only works if the inactive player cannot see the active player’s aim or hidden intel.

### 7.1 Principles

1. **Only the active player** may see aiming UI, trajectory preview, and projectile flight into the opponent’s fog.  
2. **Handoff** must be explicit — no accidental leaks between turns.  
3. **Trust boundary:** Digital “honour system” + UI that **defaults to hiding** sensitive views.

### 7.2 Recommended flow (implement v1)

```
[Player A turn start]
  → Fullscreen "Player A — take the device"
  → Tap "I'm ready" → Battle view (Player A perspective only)

[Player A fires → resolution runs]

  → Fullscreen "Pass to Player B"
  → Optional: blank / logo screen (no map) for 1s minimum

[Player B turn start]
  → "Player B — take the device" → "I'm ready" → …
```

### 7.3 Passive player view (opponent’s turn)

When **you are not aiming**, you may see:

- **Your half** of the map (full detail).  
- **Opponent’s shot** landing on your side (incoming trajectory + impact on **your** visible terrain).  
- You **do not** see opponent’s aim UI on their device before release (N/A if same screen — sequence above prevents peeking during aim).  

**Level-designer note:** First playable can use **same camera** with **input locked** to the active player only; handoff screens are the main anti-cheat for peeking during placement vs battle.

### 7.4 Placement phase privacy

- **Sequential placement recommended for v1:** Player A places all pieces → handoff → Player B places.  
- Alternative (simultaneous): both submit hidden — more complex state; **defer to v2** unless online.

---

## 8. Battlefield specification (v1)

### 8.1 Grid

| Parameter | v1 value |
|-----------|----------|
| **Dimensions** | `W` × `H` cells `[PLACEHOLDER e.g. 16×12]` |
| **Orientation** | **Vertical split:** Player A = columns `[0 … W/2 − 1]`, Player B = `[W/2 … W−1]` (adjust if odd — document centre column rule) |
| **Cell size** | World units `[PLACEHOLDER]` — must match physics scale |

### 8.2 Terrain (v1)

| Feature | v1 |
|---------|-----|
| **Obstacles** | Static **blocked** cells (optional simple pattern) |
| **Destructible mesh** | **Out of scope** — no heightmap deformation |
| **Visual-only** | Craters / decals **allowed** as VFX that do **not** change collision |

**v2+:** Biomes, material types affecting SFX, destructible props.

### 8.3 Baseline & firing

- Shots originate from **player’s back edge** (left player: column 0 edge; right player: column W−1 edge) at configurable height `[PLACEHOLDER]`.  
- Projectile **must** enter opponent half; **reject** shots that don’t cross the midline (or clamp — pick one rule and log in §16).

---

## 9. Turns & resolution pipeline

### 9.1 Turn order

1. Determine **active player** P.  
2. P selects **ammo type** (standard vs sonar if both available).  
3. P adjusts aim; **confirm fire**.  
4. **Simulate** trajectory until impact or out-of-bounds.  
5. **Resolve** damage, reveals, unit destruction.  
6. **Check win / draw** (§9.3).  
7. Switch active player; show handoff if hot-seat (§7).

### 9.2 Simultaneous damage

- All HP changes from **one shot** resolve in one **resolution step**.  
- If **both** bunkers are destroyed in that step → **draw**.

### 9.3 Win check order

1. If **either** bunker HP ≤ 0 → if **both** → draw; else surviving side wins.  
2. Else continue.

### 9.4 Out of bounds / misses

- **No unit hit:** Still apply **reveal rules** for **impact cell** (empty ground) if in opponent half — *optional design:* reveal only on “near structure” — **v1 default:** reveal blast radius around impact point always (supports deduction).  
- **Projectile leaves map:** “Miss”; optional minimal intel `[PLACEHOLDER]`.

---

## 10. Fog & reveal state machine

### 10.1 Per-cell state (opponent half, per player view)

| State | Meaning |
|-------|---------|
| `HIDDEN` | No intel |
| `REVEALED_EMPTY` | Known empty |
| `REVEALED_UNIT` | Unit type visible (and current HP if damaged) |

**v1:** No `HINT` state unless enabled by tuning (§11).

### 10.2 Reveal on impact (standard shell)

On impact at cell `C`:

- For all cells within **Manhattan or Euclidean radius R** `[PLACEHOLDER — pick one metric and stick to it]`:
  - Apply damage to units.  
  - Set each affected cell to `REVEALED_*` as appropriate.  
- **Empty cells** in radius become `REVEALED_EMPTY`.

### 10.3 Sonar ping (v1)

- **No damage.**  
- Player selects centre `S` on opponent half (or same aim UI with “sonar mode”).  
- Reveals cells in radius `R_sonar` `[PLACEHOLDER]`.  
- **Duration:** **Temporary** — options:  
  - **A)** Until end of **N** turns `[PLACEHOLDER]`, then revert to `HIDDEN` (memory test — harder), or  
  - **B)** Permanent reveal (easier — recommend for first playtest).  

**Pick A or B in implementation** and document in build notes.

### 10.4 Audio–visual contract (v1)

| Event | Minimum deliverable |
|-------|---------------------|
| Hit metal | Metal SFX + spark VFX |
| Hit earth / ground | Thud + dust |
| Hit decoy | Distinct “false alarm” sting |
| Bunker hit | Heavier impact |
| Miss | Whoosh / dull thud |

*(Game audio designer lens: distinct layers beat realistic mixing for readability.)*

---

## 11. Balance & tuning (`[PLACEHOLDER]`)

All values are **hypotheses** until first playtest. Track changes in a spreadsheet mirroring this table.

| Variable | Proposed range | Notes |
|----------|------------------|--------|
| Grid `W×H` | 12×8 – 20×14 | Smaller = faster reads |
| Bunker HP | 4 | From §6 |
| Cannon HP | 2 | |
| Standard shells / match | 8–20 | Tied to match length |
| Sonar charges / match | 1–3 | |
| Blast radius (cells) R | 1–2 | Larger = faster deduction |
| Sonar radius R_sonar | 2–4 | |
| Gravity / power scale | tune with “feel” | Same arc family as Angry Birds |
| Match time target | 3–5 min | Adjust ammo + grid |

### 11.1 Decoy (v1)

- **HP:** 0 — first hit removes it and plays decoy reveal.  
- **Placement:** Must respect 2×1 footprint; cannot overlap bunker **illegal overlap rules** `[define in code]`.

---

## 12. Feedback without vision (design intent)

Players often **cannot** see opponent structures. **Readable feedback** (SFX + short VFX + optional haptic later) is **not optional** for fun — it’s how players build a mental model.

**v1 minimum:** 3–4 materially distinct hit responses + clear “miss” line.

---

## 13. Technical design (v1 — ADRs)

These are **decisions for implementation**, not open questions.

### ADR-1 — Game engine (client)

- **Decision:** **Phaser 3** for rendering, input, scenes, tweens.  
- **Rationale:** Already in monorepo expertise; web-first; fast iteration.  
- **Consequence:** Coordinate all physics in world space; grid is a logical overlay.

### ADR-2 — Ballistics vs physics engine

- **Decision:** **v1 — Analytic ballistics** (parabola), circle vs AABB/grid tests. **No Matter.js requirement** for first milestone.  
- **Rationale:** Deterministic, easy to replay later; fewer tuning unknowns.  
- **Escape hatch:** Add **Matter.js** (or similar) in v2 if destructible terrain needs rigid bodies.

### ADR-3 — Simulation authority

- **Decision:** **Local deterministic sim** for v1 hot-seat (single client).  
- **Future online:** Server-authoritative state + locked RNG seed per match.

### ADR-4 — Data model

- **Decision:** Shared **pure Typescript** rules (`packages/shared` or `packages/fow-shared`) with **no** Phaser imports — enables tests & future server reuse.

### ADR-5 — Networking

- **Decision:** **v1 — none.**  
- **v2:** WebSocket + authoritative server outline TBD.

### 13.1 Repo layout (in repo)

| Concern | Location |
|---------|----------|
| Rules, types, ballistics, fog, shot resolution (pure TS, no Phaser) | `packages/fow-shared` |
| Phaser client (scenes TBD: placement, battle, handoff) | `apps/fog-of-war` |
| Build / dev notes | [`docs/FOW-BUILD.md`](FOW-BUILD.md) |
| This GDD | `docs/FOW-GDD.md` |
| Server | `apps/fow-server` — **v2+** |

---

## 14. UX — v1 screen flow (MVP)

Only paths marked **v1** are in first build.

```
Main Menu (v1: stub OK)
  └── Local Play (v1)
        ├── Player names (optional)
        ├── Placement — Player A
        ├── Handoff
        ├── Placement — Player B
        ├── Handoff
        └── Battle loop
              ├── Handoff overlay (§7)
              ├── Aim & fire
              └── … until result

Result screen (v1)
```

**Deferred:** Online, async, collection, loadout screens beyond minimal ammo counts.

### 14.1 Wireframes (ASCII)

**Handoff**

```
┌──────────────────────────────┐
│     PASS DEVICE TO           │
│         PLAYER B             │
│                              │
│      [ I'm ready ]           │
└──────────────────────────────┘
```

**Battle (active player)**

```
  [ Standard | Sonar: 2 ]     ← ammo
  angle: 62°   power: ████░
        \  preview arc on OWN half only
────────╲____________________
         \   FOG ████████████
```

---

## 15. Monetisation & platform (non-binding for v1)

Long-term **monetisation** and **multi-platform** plans (mobile stores, battle pass, etc.) remain **vision**, not v1 requirements. The **v1 prototype** ships **without** IAP or accounts unless explicitly scheduled.

| Topic | v1 |
|-------|-----|
| Monetisation | None |
| Platforms | Web (GitHub Pages / local) + desktop browser |
| Accounts | None |

---

## 16. Implementation checklist (engineering)

Use this as **Definition of Done** for first playable.

- [ ] Grid + halves + placement validation (overlap, bounds).  
- [ ] Hot-seat handoff screens (§7).  
- [ ] Turn FSM (§9).  
- [ ] Ballistics + impact point.  
- [ ] Fog state per viewer (§10).  
- [ ] Standard shell damage + reveal.  
- [ ] Sonar ping (one mode from §10.3).  
- [ ] Win / draw (§9.3).  
- [ ] Result screen with minimal stats (shots fired, hits).  
- [ ] Unit tests for rules layer (no Phaser).  

---

## 17. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Hot-seat peeking | Handoff screens; sequential placement; clear “active player” banner |
| Scope creep on terrain | v1 static collision; VFX-only “destruction” |
| Over-complex projectile roster | v1 only two types (§6.4) |
| Audio workload | Start with placeholder SFX library; swap later |
| Balance unknowns | §11 placeholders + rapid local playtests |

---

## 18. What makes it different

```
         Battleships          Fog of War          Angry Birds
        (deduction)     (deduction + physics)      (physics)
         ←────────────────────┼────────────────────────→
```

---

## 19. Success criteria (prototype)

- [ ] Two players complete a **full** hot-seat match on one device without ambiguous rules disputes.  
- [ ] Opponent half is **fogged** correctly; reveals match §10.  
- [ ] Aiming feels **responsive**; trajectory is readable.  
- [ ] A player can **win by destroying the bunker** using deduction + skill.  
- [ ] Second match feels **different** with different placements.  
- [ ] Match completes in **under 5 minutes** with default tuning (or tuning is adjusted until it does).

---

## 20. Out of scope — v1 (explicit)

| Cut | Notes |
|-----|--------|
| Online / matchmaking / accounts | v2+ |
| Scout tower unit | v2+ |
| Heavy, scatter, incendiary shells | v2+ |
| Wind | v2+ |
| Biomes | v2+ |
| Replays | v2+ |
| Destructible terrain geometry | v2+ |
| Ranked / battle pass | v3 |
| Map editor | v3 |

---

## 21. Credits

- **Concept & design:** Philip Clyde-Smith  
- **Shoshin Labs** — project home  
- **GDD revision 0.2:** expanded for implementation (hot-seat, FSM, ADRs, MVP locks)

---

*© 2026 Philip Clyde-Smith*
