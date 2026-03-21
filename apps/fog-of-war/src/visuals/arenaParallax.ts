import Phaser from "phaser";
import type { Scene } from "phaser";
import {
  GRID_OFFSET_X,
  GRID_OFFSET_Y,
  GRID_PX_H,
  GRID_PX_W,
} from "../config/layout";

const SKY_DEPTH = -40;
const HILL_DEPTH = -38;
const ARENA_PAD_DEPTH = -36;

/** Margin so subtle aim parallax does not reveal empty edges. */
const SKY_BLEED = 120;

export interface ArenaParallaxHandles {
  sky: Phaser.GameObjects.Graphics;
  hills: Phaser.GameObjects.Graphics;
  slab: Phaser.GameObjects.Graphics;
  /** Tiled noise over the grid; null if `fow_grain` texture missing. */
  grain: Phaser.GameObjects.TileSprite | null;
}

/**
 * Full-screen sky gradient + distant hills + soft arena slab behind the grid.
 * Keeps side HUD columns readable; sits under scene chrome (negative depth).
 */
export function addArenaParallax(scene: Scene): ArenaParallaxHandles {
  const { width, height } = scene.scale;

  const sky = scene.add.graphics();
  sky.setDepth(SKY_DEPTH);
  sky.fillGradientStyle(
    0x06080e,
    0x080c14,
    0x0c1220,
    0x0a101c,
    1,
    1,
    1,
    1,
  );
  sky.fillRect(-SKY_BLEED, -SKY_BLEED, width + SKY_BLEED * 2, height + SKY_BLEED * 2);

  const hills = scene.add.graphics();
  hills.setDepth(HILL_DEPTH);
  const hillY = GRID_OFFSET_Y + GRID_PX_H * 0.08;
  hills.fillStyle(0x0a1422, 0.55);
  hills.beginPath();
  hills.moveTo(GRID_OFFSET_X - 40, hillY + 48);
  hills.lineTo(GRID_OFFSET_X + GRID_PX_W * 0.22, hillY - 6);
  hills.lineTo(GRID_OFFSET_X + GRID_PX_W * 0.5, hillY + 12);
  hills.lineTo(GRID_OFFSET_X + GRID_PX_W * 0.78, hillY - 4);
  hills.lineTo(GRID_OFFSET_X + GRID_PX_W + 40, hillY + 40);
  hills.lineTo(GRID_OFFSET_X + GRID_PX_W + 40, hillY + 120);
  hills.lineTo(GRID_OFFSET_X - 40, hillY + 120);
  hills.closePath();
  hills.fillPath();

  const slab = scene.add.graphics();
  slab.setDepth(ARENA_PAD_DEPTH);
  const pad = 10;
  const sx = GRID_OFFSET_X - pad;
  const sy = GRID_OFFSET_Y - pad;
  const sw = GRID_PX_W + pad * 2;
  const sh = GRID_PX_H + pad * 2;
  slab.fillGradientStyle(
    0x101828,
    0x101828,
    0x182838,
    0x162434,
    0.92,
    0.92,
    1,
    1,
  );
  slab.fillRect(sx, sy, sw, sh);
  slab.lineStyle(1, 0x2a3848, 0.45);
  slab.strokeRect(sx + 0.5, sy + 0.5, sw - 1, sh - 1);

  let grain: Phaser.GameObjects.TileSprite | null = null;
  if (scene.textures.exists("fow_grain")) {
    grain = scene.add.tileSprite(
      GRID_OFFSET_X,
      GRID_OFFSET_Y,
      GRID_PX_W,
      GRID_PX_H,
      "fow_grain",
    );
    grain.setDepth(-35);
    grain.setAlpha(0.07);
    grain.setBlendMode(Phaser.BlendModes.MULTIPLY);
  }

  return { sky, hills, slab, grain };
}

/** Aim-driven micro-shift: hills move more than sky (classic parallax). */
export function updateAimParallax(
  h: ArenaParallaxHandles,
  angleRad: number,
  power: number,
): void {
  const angleRef = 0.45;
  const powerRef = 0.55;
  const ax = angleRad - angleRef;
  const py = power - powerRef;
  const ox = Phaser.Math.Clamp(ax * 26, -18, 18);
  const oy = Phaser.Math.Clamp(py * -12, -9, 9);

  h.sky.setPosition(ox * 0.22, oy * 0.18);
  h.hills.setPosition(ox * 0.72, oy * 0.45);
  h.slab.setPosition(ox * 0.12, oy * 0.08);
  if (h.grain) {
    h.grain.setPosition(GRID_OFFSET_X + ox * 0.12, GRID_OFFSET_Y + oy * 0.08);
  }
}

export function resetAimParallax(h: ArenaParallaxHandles): void {
  h.sky.setPosition(0, 0);
  h.hills.setPosition(0, 0);
  h.slab.setPosition(0, 0);
  if (h.grain) {
    h.grain.setPosition(GRID_OFFSET_X, GRID_OFFSET_Y);
  }
}

/** Menu / title: lighter horizon band without the arena slab. */
export function addTitleBackdrop(scene: Scene): void {
  const { width, height } = scene.scale;
  const g = scene.add.graphics();
  g.setDepth(-30);
  g.fillGradientStyle(
    0x06080e,
    0x0a0e16,
    0x101a28,
    0x0c1420,
    1,
    1,
    1,
    1,
  );
  g.fillRect(0, 0, width, height);

  const band = scene.add.graphics();
  band.setDepth(-29);
  band.fillStyle(0x142030, 0.35);
  band.fillRect(0, height * 0.42, width, height * 0.58);
}
