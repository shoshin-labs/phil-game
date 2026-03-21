/** Single source for “how to play” copy (menu + optional in-game). */
export const HOW_TO_PLAY_BODY = [
  "Goal — destroy the enemy bunker before yours is destroyed. You only see your side clearly; the rest is fog until you reveal it.",
  "",
  "Setup — each player places on their half. You must place exactly 2 cannons (one tile each) and 1 bunker (two tiles in a line). You cannot place more than the roster allows. Rotate the bunker with R or the toggle before placing.",
  "",
  "Battle — This is a 2D grid (not 3D). You place cannons and a bunker; shells and sonar are the only attack types right now (decoys exist in rules but are off in the default roster). Standard shells fire from your cannon tiles — the arc starts there, not from empty map edge. The orange outline shows the first cell the shell will strike; a lighter ring shows blast radius. A/D = aim angle, W/S = power, Space = fire. Click the game once if keys do not respond (browser focus). Sonar: switch mode, move over the enemy half, then click; green tiles show the ping area.",
  "",
  "Hot-seat — one keyboard; pass the device when the handoff screen appears.",
].join("\n");
