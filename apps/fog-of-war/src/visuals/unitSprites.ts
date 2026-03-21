import Phaser from "phaser";
import type { Scene } from "phaser";
import type { UnitKind } from "@phil-game/fow-shared";

export function ensureUnitTextures(scene: Scene): void {
  if (scene.textures.exists("fow_unit_cannon")) return;

  const mk = (
    key: string,
    w: number,
    h: number,
    draw: (g: Phaser.GameObjects.Graphics) => void,
  ) => {
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    draw(g);
    g.generateTexture(key, w, h);
    g.destroy();
  };

  mk("fow_unit_cannon", 28, 28, (g) => {
    g.fillStyle(0x4a6a8a, 1);
    g.fillRoundedRect(5, 14, 18, 8, 2);
    g.fillStyle(0x2a3a50, 1);
    g.fillRect(5, 14, 18, 3);
    g.fillStyle(0x3a4a60, 1);
    g.fillRect(6, 7, 9, 9);
  });

  mk("fow_unit_bunker", 28, 28, (g) => {
    g.fillStyle(0x2a3440, 1);
    g.fillRoundedRect(4, 10, 20, 14, 4);
    g.lineStyle(2, 0x7a9cff, 0.95);
    g.strokeRoundedRect(4, 10, 20, 14, 4);
    g.lineStyle(1, 0x5a8ac8, 0.5);
    g.strokeRect(8, 14, 12, 6);
  });

  mk("fow_unit_decoy", 28, 28, (g) => {
    g.fillStyle(0x5a5a68, 1);
    g.fillCircle(14, 14, 9);
    g.lineStyle(1, 0x8a8a98, 0.85);
    g.strokeCircle(14, 14, 9);
  });
}

export function textureKeyForUnitKind(kind: UnitKind): string {
  switch (kind) {
    case "cannon":
      return "fow_unit_cannon";
    case "bunker":
      return "fow_unit_bunker";
    case "decoy":
      return "fow_unit_decoy";
  }
}
