# Fog of War — manual playtest checklist

Run **`pnpm dev`** from the repo root, open the printed URL, and walk through once before a release or tuning pass.

**Desktop recommended** for v1 (keyboard aim). **Click once inside the game** after load if **A / D / W / S / Space** do nothing — the canvas needs focus for keyboard input.

## Automated checks (run first)

```bash
pnpm test
pnpm build
```

## Full flow (hot-seat)

1. **Menu** — Read tagline; open **How to play** if you want the full rules; **Play** starts a match.
2. **Placement — Player A** — Left column explains the goal; **right** shows cannon/bunker quota. Place **two cannons** and **one bunker** on the lit (your) half; **?** opens full rules; **Confirm** when the checklist is complete.
3. **Handoff** — “Pass device to Player B” → **Continue**.
4. **Placement — Player B** — Same quota on the right half → **Confirm**.
5. **Handoff** — “Battle — pass to Player A” → **Continue**.
6. **Battle — first visit** — Short **layout** tip appears once (`localStorage` `fow_battle_hint_v1`). **?** (top-right) always opens full rules. Left = ammo; center = map + arc; right = turn + controls.
7. **Standard fire** — Blue **arc preview** updates with **A/D** and **W/S**; **Space** fires; shell count drops; device handoff after each shot.
8. **Sonar** — Switch **Sonar**; green **Manhattan footprint** follows the pointer on the enemy half; **click** to ping; **last ping** line appears; sonar charges decrease; handoff after each action.
9. **End** — Destroy the enemy bunker (standard hits); **Result** shows winner or draw.
10. **Back to menu** — Returns to menu with a **fresh session** (new game should start clean).

## Edge cases

- **Out of ammo** — With **0** shells, Space should show an error message (no crash).
- **Wrong sonar target** — Clicking your own half in Sonar mode should show an error.
- **Audio** — First interaction may be required before browser plays SFX (Web Audio).

## Notes

- Balance (`packages/fow-shared/src/constants.ts`) is still **[PLACEHOLDER]**; log anything that feels unfair or too fast after a real two-player session.
