import Phaser from "phaser";
import type { Scene } from "phaser";
import { CELL_PX, inBounds } from "@phil-game/fow-shared";
import type { ShellCraterRecord } from "../game/session";
import { GRID_OFFSET_X, GRID_OFFSET_Y } from "../config/layout";
import { craterPaletteForKind } from "./craters";

function hashSeed(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  }
  return Math.abs(h) + 1;
}

function rng(seed: number, i: number): number {
  const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Deterministic rubble shards around crater centres (palette from last hit kind). */
export function drawCraterRubble(
  scene: Scene,
  gridW: number,
  gridH: number,
  records: Readonly<Record<string, ShellCraterRecord>>,
): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.setDepth(2.5);

  for (const [key, rec] of Object.entries(records)) {
    if (rec.count < 1) continue;
    const [rs, cs] = key.split(",");
    const row = Number(rs);
    const col = Number(cs);
    if (!Number.isFinite(row) || !Number.isFinite(col)) continue;
    if (!inBounds({ row, col }, gridW, gridH)) continue;

    const pal = craterPaletteForKind(rec.lastKind);
    const rubbleFill = pal.fill;
    const rubbleStroke = pal.stroke;

    const cx = GRID_OFFSET_X + col * CELL_PX + CELL_PX / 2;
    const cy = GRID_OFFSET_Y + row * CELL_PX + CELL_PX / 2;
    const seed = hashSeed(key);
    const n = Math.min(8, 4 + rec.count);

    for (let i = 0; i < n; i++) {
      const a = rng(seed, i * 3) * Math.PI * 2;
      const dist = 6 + rng(seed, i * 3 + 1) * (10 + rec.count * 1.5);
      const px = cx + Math.cos(a) * dist;
      const py = cy + Math.sin(a) * dist;
      const w = 2 + rng(seed, i * 3 + 2) * 4;
      const h = 1.5 + rng(seed, i * 3 + 4) * 2.5;
      g.fillStyle(rubbleFill, 0.55 + rng(seed, i * 3 + 5) * 0.35);
      g.lineStyle(1, rubbleStroke, 0.35);
      g.fillTriangle(
        px,
        py,
        px + w,
        py + h * 0.3,
        px + w * 0.4,
        py - h,
      );
      g.strokeTriangle(
        px,
        py,
        px + w,
        py + h * 0.3,
        px + w * 0.4,
        py - h,
      );
    }
  }

  return g;
}
