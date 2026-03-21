import Phaser from "phaser";
import type { Scene } from "phaser";
import type { Vec2 } from "@phil-game/fow-shared";

function strokePolyline(
  gfx: Phaser.GameObjects.Graphics,
  pts: Vec2[],
  toScreen: (p: Vec2) => { x: number; y: number },
) {
  gfx.beginPath();
  const p0 = toScreen(pts[0]!);
  gfx.moveTo(p0.x, p0.y);
  for (let i = 1; i < pts.length; i++) {
    const p = toScreen(pts[i]!);
    gfx.lineTo(p.x, p.y);
  }
  gfx.strokePath();
}

/** Multi-layer glow + arc beads for the aim preview (standard mode). */
export function drawRichTrajectoryPreview(
  scene: Scene,
  pts: Vec2[],
  gridOffsetX: number,
  gridOffsetY: number,
): Phaser.GameObjects.Graphics {
  const gfx = scene.add.graphics();
  gfx.setDepth(8);

  if (pts.length < 2) return gfx;

  const toScreen = (p: Vec2) => ({
    x: p.x + gridOffsetX,
    y: p.y + gridOffsetY,
  });

  gfx.lineStyle(6, 0x203058, 0.14);
  strokePolyline(gfx, pts, toScreen);
  gfx.lineStyle(4, 0x3a5080, 0.22);
  strokePolyline(gfx, pts, toScreen);
  gfx.lineStyle(2, 0x5a78b8, 0.42);
  strokePolyline(gfx, pts, toScreen);
  gfx.lineStyle(1, 0x9ec0ff, 0.62);
  strokePolyline(gfx, pts, toScreen);

  // Brighter tip toward impact
  const n = pts.length;
  for (let i = 0; i < n; i += 3) {
    const t = i / Math.max(1, n - 1);
    const s = toScreen(pts[i]!);
    const a = 0.35 + 0.45 * t;
    const r = 1.5 + t * 1.2;
    gfx.fillStyle(0x88b0ff, a * 0.55);
    gfx.fillCircle(s.x, s.y, r);
  }

  return gfx;
}
