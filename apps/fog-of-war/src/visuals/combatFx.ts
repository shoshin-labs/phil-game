import type { Scene } from "phaser";
import type { TrajectoryHit } from "@phil-game/fow-shared";

const FX_DEPTH = 95;

function sparkBurst(
  scene: Scene,
  x: number,
  y: number,
  opts: { count: number; tint: number; spread: number; duration: number },
) {
  for (let i = 0; i < opts.count; i++) {
    const r = 1.5 + Math.random() * 2.5;
    const c = scene.add.circle(x, y, r, opts.tint, 0.88);
    c.setDepth(FX_DEPTH);
    const a = Math.random() * Math.PI * 2;
    const dist = opts.spread * (0.35 + Math.random() * 0.65);
    scene.tweens.add({
      targets: c,
      x: x + Math.cos(a) * dist,
      y: y + Math.sin(a) * dist,
      alpha: 0,
      scale: 0.15,
      duration: opts.duration + Math.random() * 120,
      ease: "Cubic.easeOut",
      onComplete: () => c.destroy(),
    });
  }
}

function shockRing(
  scene: Scene,
  x: number,
  y: number,
  tint: number,
  maxScale: number,
) {
  const ring = scene.add.circle(x, y, 4, tint, 0);
  ring.setStrokeStyle(2, tint, 0.85);
  ring.setDepth(FX_DEPTH - 1);
  scene.tweens.add({
    targets: ring,
    scaleX: maxScale,
    scaleY: maxScale,
    alpha: 0,
    duration: 340,
    ease: "Quad.easeOut",
    onComplete: () => ring.destroy(),
  });
}

/** Impact VFX at grid-aligned screen position (`impactWorld` from ballistics + grid offset). */
export function spawnShellImpactFromHit(
  scene: Scene,
  hit: TrajectoryHit,
  gridOffsetX: number,
  gridOffsetY: number,
) {
  const { kind } = hit;
  const x = gridOffsetX + hit.impactWorld.x;
  const y = gridOffsetY + hit.impactWorld.y;

  if (kind === "unit") {
    sparkBurst(scene, x, y, {
      count: 32,
      tint: 0xff6644,
      spread: 100,
      duration: 280,
    });
    shockRing(scene, x, y, 0xff8844, 14);
    return;
  }
  if (kind === "terrain") {
    sparkBurst(scene, x, y, {
      count: 24,
      tint: 0xc4a882,
      spread: 72,
      duration: 260,
    });
    shockRing(scene, x, y, 0xa89070, 11);
    return;
  }
  if (kind === "out_of_bounds") {
    sparkBurst(scene, x, y, {
      count: 10,
      tint: 0x6688aa,
      spread: 40,
      duration: 220,
    });
    return;
  }
  /* miss */
  sparkBurst(scene, x, y, {
    count: 14,
    tint: 0x8899b0,
    spread: 55,
    duration: 300,
  });
  shockRing(scene, x, y, 0x708090, 8);
}

/** Concentric sonar-style rings at screen position. */
export function spawnSonarRipple(scene: Scene, x: number, y: number) {
  for (let i = 0; i < 3; i++) {
    const ring = scene.add.circle(x, y, 3, 0x44ff88, 0);
    ring.setStrokeStyle(2, 0x5ecf8a, 0.65 - i * 0.12);
    ring.setDepth(FX_DEPTH);
    scene.tweens.add({
      delay: i * 85,
      targets: ring,
      scaleX: 12 + i * 2,
      scaleY: 12 + i * 2,
      alpha: 0,
      duration: 480,
      ease: "Sine.easeOut",
      onComplete: () => ring.destroy(),
    });
  }
}
