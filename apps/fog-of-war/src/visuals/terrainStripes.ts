import Phaser from "phaser";
import type { Scene } from "phaser";
import { CELL_PX } from "@phil-game/fow-shared";
import { GRID_OFFSET_X, GRID_OFFSET_Y } from "../config/layout";

/** Subtle horizontal “ground” lines + sparse vertical grain (depth between cells and units). */
export function drawTerrainStripes(
  scene: Scene,
  gridW: number,
  gridH: number,
): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.setDepth(1);
  const x1 = GRID_OFFSET_X;
  const x2 = GRID_OFFSET_X + gridW * CELL_PX;

  for (let row = 0; row < gridH; row++) {
    const y = GRID_OFFSET_Y + (row + 1) * CELL_PX - 1;
    g.lineStyle(1, 0x1c2434, 0.14);
    g.lineBetween(x1, y, x2, y);
  }

  for (let col = 0; col < gridW; col += 2) {
    const x = GRID_OFFSET_X + col * CELL_PX;
    g.lineStyle(1, 0x141a22, 0.07);
    g.lineBetween(
      x,
      GRID_OFFSET_Y,
      x,
      GRID_OFFSET_Y + gridH * CELL_PX,
    );
  }

  return g;
}
