import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create() {
    this.cameras.main.fadeOut(0, 0, 0, 0);
    this.time.delayedCall(200, () => {
      this.scene.start("Menu");
    });
  }
}
