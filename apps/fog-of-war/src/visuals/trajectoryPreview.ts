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

/** Interpolate along polyline by normalized distance [0,1] (by arc length). */
export function pointOnPolyline(pts: Vec2[], t: number): Vec2 {
  if (pts.length === 0) return { x: 0, y: 0 };
  if (pts.length === 1) return { ...pts[0]! };
  const tt = t - Math.floor(t);
  let total = 0;
  const segLens: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1]!.x - pts[i]!.x;
    const dy = pts[i + 1]!.y - pts[i]!.y;
    const len = Math.hypot(dx, dy);
    segLens.push(len);
    total += len;
  }
  if (total <= 0) return { ...pts[pts.length - 1]! };
  let target = tt * total;
  for (let i = 0; i < segLens.length; i++) {
    const sl = segLens[i]!;
    if (target <= sl || i === segLens.length - 1) {
      const u = sl > 0 ? target / sl : 0;
      return {
        x: pts[i]!.x + (pts[i + 1]!.x - pts[i]!.x) * u,
        y: pts[i]!.y + (pts[i + 1]!.y - pts[i]!.y) * u,
      };
    }
    target -= sl;
  }
  return { ...pts[pts.length - 1]! };
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
