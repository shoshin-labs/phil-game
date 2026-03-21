import Phaser from "phaser";
import type { Scene } from "phaser";
import {
  CELL_PX,
  cellKey,
  inBounds,
  worldToCell,
  type TrajectoryHit,
} from "@phil-game/fow-shared";
import type { ShellCraterRecord } from "../game/session";
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

export function craterPaletteForKind(kind: TrajectoryHit["kind"]): {
  fill: number;
  stroke: number;
  ring: number;
} {
  switch (kind) {
    case "unit":
      return { fill: 0x2a1008, stroke: 0xcc5534, ring: 0xff6644 };
    case "terrain":
      return { fill: 0x1a1410, stroke: 0x3a3228, ring: 0x5a4a38 };
    case "miss":
      return { fill: 0x151820, stroke: 0x3a4558, ring: 0x607088 };
    case "out_of_bounds":
      return { fill: 0x101828, stroke: 0x2a5080, ring: 0x4080c0 };
    default:
      return { fill: 0x1a1410, stroke: 0x2a2218, ring: 0x3a3028 };
  }
}

/**
 * Persistent scorch marks — palette follows last hit kind; intensity scales with repeats.
 */
export function drawCraterMarks(
  scene: Scene,
  gridW: number,
  gridH: number,
  records: Readonly<Record<string, ShellCraterRecord>>,
): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.setDepth(2);

  for (const [key, rec] of Object.entries(records)) {
    if (rec.count < 1) continue;
    const [rs, cs] = key.split(",");
    const row = Number(rs);
    const col = Number(cs);
    if (!Number.isFinite(row) || !Number.isFinite(col)) continue;
    if (!inBounds({ row, col }, gridW, gridH)) continue;

    const pal = craterPaletteForKind(rec.lastKind);
    const cx = GRID_OFFSET_X + col * CELL_PX + CELL_PX / 2;
    const cy = GRID_OFFSET_Y + row * CELL_PX + CELL_PX / 2;
    const intensity = Math.min(1, rec.count / 5);
    const rx = 5 + intensity * 3.5;
    const ry = 4 + intensity * 2.8;

    g.fillStyle(pal.fill, 0.28 + intensity * 0.32);
    g.fillEllipse(cx, cy, rx * 2, ry * 2);
    g.lineStyle(1, pal.stroke, 0.35 + intensity * 0.2);
    g.strokeEllipse(cx, cy, rx * 2.2, ry * 2.2);
    g.lineStyle(1, pal.ring, 0.2 + intensity * 0.15);
    g.strokeEllipse(cx, cy, rx * 1.4, ry * 1.2);

    if (rec.count >= 2) {
      g.lineStyle(1, pal.stroke, 0.45);
      g.strokeEllipse(cx, cy, rx * 2.8 + 2, ry * 2.2 + 1);
    }
  }

  return g;
}
