import Phaser from "phaser";
import type { Scene } from "phaser";
import {
  CELL_PX,
  cellKey,
  inBounds,
  worldToCell,
  type TrajectoryHit,
} from "@phil-game/fow-shared";
import { GRID_OFFSET_X, GRID_OFFSET_Y } from "../config/layout";

/** Map shell impact to a grid cell for scorch marks (uses cell when present, else world→cell). */
export function craterKeyFromHit(
  hit: TrajectoryHit,
  gridW: number,
  gridH: number,
): string | null {
  if (hit.cell && inBounds(hit.cell, gridW, gridH)) {
    return cellKey(hit.cell);
  }
  const c = worldToCell(hit.impactWorld);
  if (inBounds(c, gridW, gridH)) return cellKey(c);
  return null;
}

/**
 * Persistent scorch marks — stronger tint when the same cell is hit repeatedly.
 */
export function drawCraterMarks(
  scene: Scene,
  gridW: number,
  gridH: number,
  counts: Readonly<Record<string, number>>,
): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.setDepth(2);

  for (const [key, count] of Object.entries(counts)) {
    if (count < 1) continue;
    const [rs, cs] = key.split(",");
    const row = Number(rs);
    const col = Number(cs);
    if (!Number.isFinite(row) || !Number.isFinite(col)) continue;
    if (!inBounds({ row, col }, gridW, gridH)) continue;

    const cx = GRID_OFFSET_X + col * CELL_PX + CELL_PX / 2;
    const cy = GRID_OFFSET_Y + row * CELL_PX + CELL_PX / 2;
    const intensity = Math.min(1, count / 5);
    const rx = 5 + intensity * 3.5;
    const ry = 4 + intensity * 2.8;

    g.fillStyle(0x1a1410, 0.28 + intensity * 0.32);
    g.fillEllipse(cx, cy, rx * 2, ry * 2);
    g.lineStyle(1, 0x2a2218, 0.35 + intensity * 0.2);
    g.strokeEllipse(cx, cy, rx * 2.2, ry * 2.2);

    if (count >= 2) {
      g.lineStyle(1, 0x3a3028, 0.45);
      g.strokeEllipse(cx, cy, rx * 2.8 + 2, ry * 2.2 + 1);
    }
  }

  return g;
}
