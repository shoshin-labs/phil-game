import Phaser from "phaser";
import { ensureUnitTextures } from "../visuals/unitSprites";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create() {
    const canvas = this.game.canvas;
    canvas.setAttribute("tabindex", "0");
    if (canvas instanceof HTMLElement) {
      canvas.style.outline = "none";
    }

    if (!this.textures.exists("fow_grain")) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x8899aa);
      g.fillRect(0, 0, 64, 64);
      for (let i = 0; i < 140; i++) {
        g.fillStyle(0x1a2030, 0.06 + Math.random() * 0.1);
        g.fillRect(Math.random() * 64, Math.random() * 64, 2, 2);
      }
      g.generateTexture("fow_grain", 64, 64);
      g.destroy();
    }

    ensureUnitTextures(this);

    this.cameras.main.fadeOut(0, 0, 0, 0);
    this.time.delayedCall(200, () => {
      this.scene.start("Menu");
    });
  }
}
