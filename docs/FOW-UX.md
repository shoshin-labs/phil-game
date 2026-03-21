# Fog of War — UX notes

## What the game is

- **2D grid + ballistics**, not a 3D shooter or tile-picker. You **aim** with angle and power; the simulation finds the **first** cell struck along the arc.
- Expectations are set on the **menu** and **battle** header so players are not looking for a 3D camera or direct “click a square to land” control.

## Landing / targeting

- **Orange preview** — outlines the **first grid tile** the shell will hit (same simulation as the actual shot).
- **Lighter ring** — Manhattan blast radius around that tile (from shared rules).
- **Right HUD** — text row + column and a short human label for hit type (unit / terrain / miss / out of bounds).
- **No direct “land on square X”** without adjusting aim — that is intentional; if we ever add a “snap to cell” assist, it would be a separate feature.

## Controls

- **Left column** — always-visible key list for the active mode (Standard vs Sonar).
- **Keyboard** — `A`/`D` angle, `W`/`S` power, `Space` fire. Browsers only send keys when the canvas is focused; **clicking the board** (or any pointer down) focuses the canvas (`tabindex` + focus in `BootScene` / `pointerdown`).

## Help

- **?** opens full help (same copy as How to play).
- **First-visit overlay** on battle (v2 key in `localStorage`) explains 2D grid + orange cell + keys in plain language.

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for UX-related releases.
