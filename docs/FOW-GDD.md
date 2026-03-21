# Game Design Document — **Fog of War**

**Working title:** Fog of War
**Subtitle:** *Fire blind. Think sharp.*
**Repo:** [shoshin-labs/phil-game](https://github.com/shoshin-labs/phil-game)
**Engine:** TBD (Phaser 3 or dedicated physics engine)
**Last updated:** 2026-03-21

---

## 1. Elevator pitch

**Fog of War** is a turn-based, physics-driven strategy game that blends the hidden-information tension of Battleships with the chaotic, satisfying destruction of Angry Birds. Players fire blindly into a fog-covered battlefield, using intuition, memory, and deduction to locate and destroy hidden enemy positions.

**In one line:** *Aim through uncertainty — every shot teaches you something, if you're paying attention.*

### Origin

Inspired by a childhood paper game: two players drew ships and gun placements on opposite sides of an A4 sheet, then took turns closing their eyes and drawing a line across the page to see what they hit. Unpredictable, tactile, and full of laughter — part skill, part guesswork, part luck. Fog of War captures that feeling and transforms it into a modern digital experience.

---

## 2. Design pillars

| Pillar | What it means |
|--------|---------------|
| **Uncertainty as gameplay** | The fog isn't a visual gimmick — it's the core mechanic. Limited information drives every decision. |
| **Skill meets deduction** | Physics aim requires mechanical skill; locating targets requires memory and reasoning from partial feedback. |
| **Satisfying destruction** | Hits feel impactful. Environments crumble. Near-misses reveal just enough to make the next shot agonising. |
| **Accessible depth** | Easy to pick up (aim and fire), hard to master (trajectory prediction, fog reading, bluffing in placement). |
| **Respect the session** | Short matches (3–5 minutes). No bloat. Get in, play a tense round, get out. |

---

## 3. Audience & tone

- **Primary:** Casual-to-midcore players who enjoy strategy, physics games, and competitive turn-based play. Mobile-first audiences, scalable to PC and console.
- **Secondary:** Players who grew up with Battleships, Worms, or Angry Birds and want something that scratches all three itches.
- **Tone:** Playful tension. Not grim military sim — more like a fog-drenched duel between clever rivals. Light humour in cosmetics and feedback, serious stakes in gameplay.

---

## 4. Core gameplay

### 4.1 Match structure

1. **Setup phase** — Each player secretly places their units/structures on their half of the battlefield. Placement is hidden from the opponent.
2. **Battle phase** — Players alternate turns. On each turn, a player aims and fires a projectile into the opponent's fog-covered half.
3. **Resolution** — The match ends when one player's key structures are destroyed (or a point/health threshold is reached).

### 4.2 The fog

The opponent's battlefield is fully obscured at the start. Fog clears in limited ways:

| Reveal trigger | What it shows |
|----------------|---------------|
| **Direct hit** | Small area around impact fully revealed |
| **Near miss** | Brief flash or particle effect hinting at proximity |
| **Splash damage** | Partial reveal in blast radius |
| **Special abilities** | Scout shots, sonar pings (see 5.3) |

Revealed areas stay visible for the remainder of the match. Players build a mental map over time — memory matters.

### 4.3 Physics-based shooting

- **Aim:** Player sets angle and power (drag-to-aim or slider controls).
- **Trajectory:** Projectiles follow physics-based arcs influenced by gravity. Wind may be introduced as an optional modifier.
- **Impact:** Projectiles interact with terrain and structures — destructible environments react to hits.
- **Feedback:** Impact sounds, screen shake, particle effects. Audio cues vary based on what was hit (metal clang vs. dirt thud vs. water splash) even when fog hides the result visually.

### 4.4 Information model

This is what makes Fog of War unique — the information asymmetry:

| What you know | What you don't know |
|---------------|---------------------|
| Your own unit placement | Opponent's unit placement |
| Where your shots landed | Exactly what they hit (unless revealed) |
| Audio/visual feedback from impacts | Whether that was a key target or terrain |
| Your opponent's shot locations (on your side) | Their remaining ammo/abilities |

Players must synthesise partial information across multiple turns to deduce enemy positions.

---

## 5. Key systems

### 5.1 Battlefield & terrain

- **Grid-based placement** with free-aim shooting (hybrid system).
- **Destructible terrain:** Structures and landscape deform on impact. Craters persist. Terrain removal can expose hidden units.
- **Biomes/themes:** Visual variety (desert canyon, frozen lake, jungle ruins). Each may introduce unique terrain properties (ice = ricochet, sand = absorption).

### 5.2 Unit types (v1 — keep it simple)

| Unit | Role | HP | Size |
|------|------|----|------|
| **Cannon** | Primary offensive unit — fires standard projectiles | 2 | 1×1 |
| **Bunker** | Defensive structure — high HP, must be destroyed to win | 4 | 2×1 |
| **Scout tower** | Grants one recon ability per match | 1 | 1×1 |
| **Decoy** | Looks like a bunker on radar/sonar but has no HP value | 0 | 2×1 |

Players place a fixed loadout in v1. Customisable loadouts are a future feature.

### 5.3 Projectile & ability types

| Type | Behaviour |
|------|-----------|
| **Standard shell** | Parabolic arc, moderate blast radius, 1 damage |
| **Heavy shell** | Slower, steeper arc, larger blast radius, 2 damage |
| **Scatter shot** | Splits into 3 smaller projectiles at apex — wider coverage, less damage each |
| **Sonar ping** | No damage. Reveals a large area of fog temporarily (fades after 2 turns) |
| **Incendiary** | Leaves a burning area that reveals fog for 3 turns, 1 damage on contact |

Ammo is limited per match. Players choose their loadout before placement.

### 5.4 Win conditions

- **Primary:** Destroy the opponent's Bunker(s).
- **Alternative (timed mode):** Most damage dealt within a turn limit.
- **Draw:** Both bunkers destroyed on the same turn (simultaneous resolution variant).

---

## 6. Content scope

### v1 — Prototype / MVP

- [ ] 1v1 local multiplayer (hot-seat / same device).
- [ ] Single battlefield map with basic terrain.
- [ ] 3 unit types (cannon, bunker, decoy).
- [ ] 2 projectile types (standard shell, sonar ping).
- [ ] Fog system with reveal-on-impact.
- [ ] Basic physics (gravity arc, no wind).
- [ ] Win condition: destroy opponent's bunker.
- [ ] Simple UI: placement screen → battle screen → result screen.

### v2 — Online & polish

- [ ] Online 1v1 matchmaking.
- [ ] Asynchronous play-by-turn mode.
- [ ] Full projectile roster (5 types).
- [ ] Wind system.
- [ ] 3 battlefield biomes.
- [ ] Audio feedback system (distinct hit sounds through fog).
- [ ] Replay system.

### v3 — Expansion

- [ ] Ranked mode with leaderboards.
- [ ] Custom loadouts.
- [ ] Seasonal content / battle pass.
- [ ] 2v2 team mode.
- [ ] Map editor.

---

## 7. UX / UI

### 7.1 Screen flow

```
Main Menu
  ├── Play
  │   ├── Quick Match (online)
  │   ├── Local Match (hot-seat)
  │   └── Async Match (play-by-turn)
  ├── Loadout (unit & ammo selection)
  ├── Collection (cosmetics, unlocks)
  └── Settings
```

### 7.2 In-match UI

- **Placement phase:** Grid overlay on your half. Drag-to-place units. Confirm button.
- **Battle phase (your turn):** Aiming reticle with angle/power indicators. Ammo selector. Fire button. Mini-map showing your revealed fog data.
- **Battle phase (opponent's turn):** Watch incoming shot land on your side. Damage indicators.
- **End screen:** Match result, stats (shots fired, accuracy, units destroyed), replay option.

### 7.3 Controls

| Platform | Aim | Fire | Navigate |
|----------|-----|------|----------|
| **Mobile** | Drag to set angle/power | Release to fire | Swipe to pan |
| **PC** | Mouse aim + scroll for power | Click to fire | WASD / arrow keys to pan |
| **Controller** | Stick for angle, triggers for power | A/X to fire | Right stick to pan |

---

## 8. Monetisation strategy

| Model | Details |
|-------|---------|
| **Free-to-play core** | Full gameplay accessible for free (mobile) |
| **Cosmetic purchases** | Custom projectile trails, explosion effects, fog styles, unit skins |
| **Battle pass / seasonal** | Unlockable rewards, themed maps, limited-time modes |
| **Optional boosters** | Non-pay-to-win: visual aids (trajectory ghosting for last shot), replay tools |
| **Premium version** | One-time purchase (PC/console) with expanded content, no ads |

**Principle:** No gameplay advantage for paying players. Cosmetics and convenience only.

---

## 9. Platform strategy

| Aspect | Approach |
|--------|----------|
| **Primary platform** | Mobile (iOS & Android) — ideal session length, touch-native aiming |
| **Secondary platforms** | PC (Steam), console |
| **Multiplayer** | Async play-by-turn (mobile-first), real-time turns (all platforms) |
| **Cross-progression** | Shared accounts across devices |
| **Social** | Friend matches, leaderboards, shareable replays |

---

## 10. Technical considerations

### 10.1 Repo mapping (planned)

| Concern | Location |
|---------|----------|
| Shared types, game logic, physics constants | `packages/shared` or `packages/fow-shared` |
| Game client (Phaser / engine TBD) | `apps/fog-of-war` |
| This GDD | `docs/FOW-GDD.md` |
| Server (matchmaking, async state) | `apps/fow-server` (v2+) |

### 10.2 Key technical decisions (to resolve)

- **Engine:** Phaser 3 (consistent with The Atrium) vs. a more physics-oriented engine (Matter.js bundled with Phaser, or standalone).
- **Networking:** WebSocket for real-time turns; REST + polling for async mode.
- **State management:** Authoritative server for online play; local state machine for offline/hot-seat.
- **Physics:** Parabolic projectile math can be custom (simple ballistics) — full physics engine only needed if destructible terrain is complex.

---

## 11. What makes it different

Most artillery games show you the whole battlefield. Most hidden-information games have no physics skill component. Fog of War sits at the intersection:

```
         Battleships          Fog of War          Angry Birds
        (deduction)     (deduction + physics)      (physics)
         ←────────────────────┼────────────────────────→
```

The unique blend of mechanical skill and incomplete information creates suspenseful, surprising gameplay where every shot matters.

---

## 12. Success criteria (prototype)

- [ ] Two players can complete a full hot-seat match on a single device.
- [ ] Fog obscures the opponent's side; hits reveal areas correctly.
- [ ] Physics aiming feels satisfying (smooth arc, responsive controls).
- [ ] A player can win by deducing and destroying the opponent's bunker.
- [ ] Second match with different placement creates a noticeably different experience.
- [ ] Match completes in under 5 minutes.

---

## 13. Credits

- **Concept & design:** Philip Clyde-Smith
- **Shoshin Labs** — project home.

---

*© 2026 Philip Clyde-Smith*
