# Game Design Document — **The Atrium**

**Working title:** The Atrium  
**Subtitle:** *A walk through philosophy*  
**Repo:** [shoshin-labs/phil-game](https://github.com/shoshin-labs/phil-game) (private)  
**Engine:** Phaser 3 (`apps/philosophy`)  
**Last updated:** 2026-03-20

### Changelog (implementation)

- **Session UX:** Chapter strip (Atrium → Knowledge → Self → Value), passage counter, choice hotkeys `[1]–[3]`, Esc to menu, camera fades between beats, subtle UI chime on choice, ambient motes + gradient background, finale shows axis bars + prose portrait.

---

## 1. Elevator pitch

**The Atrium** is a short, replayable philosophy game about *how you move through ideas*, not about memorizing names. You wander an impossible library—the Atrium—where each chamber poses a tension (knowledge, self, value). Your choices don’t “quiz” you; they **bend three hidden philosophical axes**. At the end, the game mirrors back a **portrait of your path**: not a grade, but a readable stance.

**In one line:** *Branching dialogue that reveals your philosophical posture through consequence, not trivia.*

---

## 2. Design pillars

| Pillar | What it means |
|--------|----------------|
| **Consequence over correctness** | Few binary “right answers.” Choices shift a model of how you lean, not a scorecard. |
| **Accessible depth** | Plain language first; optional precision in the GDD for designers, not walls of jargon in play. |
| **Replay as variation** | Short run (target **8–12 minutes** for full arc). Different choices → different finale texture. |
| **Respect the medium** | Text + mood + light motion (Phaser); no fake complexity—systems we can ship and iterate. |

---

## 3. Audience & tone

- **Primary:** Curious adults and students who like “games about ideas” but bounce off pure trivia or dry edutainment.
- **Tone:** Calm, curious, slightly uncanny (library between worlds). Not snarky, not academic gatekeeping.

---

## 4. Fantasy & framing

You awaken in **the Atrium**: a circular library whose corridors don’t quite obey distance. Shelves hold not books but **ink trails**—arguments left as paths. You are not debating historical figures in a lecture hall; you are **walking your own synthesis** through three chambers:

1. **The Lantern Hall (Knowledge)** — perception, doubt, justification.  
2. **The Mirror Walk (Self)** — identity, continuity, other minds (lightly).  
3. **The Scale Room (Value)** — means and ends, rules vs outcomes, stability vs change.

The **finale** is a **Portrait**: three short paragraphs, each tied to one axis, reflecting how you leaned through the run.

---

## 5. Core systems

### 5.1 Hidden axes (0–100)

All start at **50** (neutral). Choices apply small deltas (typically **±5 to ±15**).

| Axis | Low (0) end | High (100) end |
|------|-------------|----------------|
| **Skepticism** | Trust in reaching stable knowledge | Comfort holding doubt open |
| **Self / World** | Inward: mind & narrative as home | Outward: meaning in relation & world |
| **Flux vs Form** | Permanence, principles that hold | Becoming, change as basic |

*These are caricatures for gameplay clarity—not claims about “what Kant really meant.”*

### 5.2 Narrative graph

- **Nodes** contain: title (optional), body text, **2–3 choices**.
- **Choices** contain: label, `next` node id, optional axis `delta`.
- Linear beats and branches live in **data** (`packages/shared`) so writers can extend without rewriting Phaser glue.

### 5.3 Finale

- Triggered when the narrative reaches the terminal node.
- **Portrait** = three generated sentences (one per axis band: low / mid / high thirds), concatenated with spacing—no combinatorial explosion in v1.

---

## 6. Content scope (v1)

- **~12–15 nodes** across three chambers + finale.
- **No combat.** Pointer/keyboard input for choices.
- **Locales:** English copy in v1.

---

## 7. UX / UI (Phaser)

- **Menu:** Title, subtitle, pulse “Begin.”
- **Game:** Title bar (chamber name), wrapped body text, stacked choice controls.
- **Finale:** Portrait text + “Walk again” → Menu.

---

## 8. Technical mapping (repo)

| Concern | Location |
|---------|----------|
| Types, narrative graph, axis logic, finale copy | `packages/shared` |
| Scenes, layout, input | `apps/philosophy/src/scenes` |
| This GDD | `docs/GDD.md` |

---

## 9. Future hooks (not v1)

- Save slots / run history.
- More chambers (aesthetics, political philosophy) with same axis model.
- Optional “footnotes” UI: tap a term for a one-sentence gloss.
- Localization.

---

## 10. Success criteria (prototype)

- [ ] Player can finish one run and read a coherent Portrait.  
- [ ] Second run with different choices **noticeably** changes finale text.  
- [ ] GDD matches shipped data (`atrium` graph) and README tells devs how to run the game.  

---

## 11. Credits

- **Shoshin Labs** — project home.  
- Game design & implementation aligned with this document and the shipped narrative data in `@phil-game/shared`.
