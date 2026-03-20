import Phaser from "phaser";
import { FONT } from "../ui/theme";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x000000);

    this.add
      .text(width / 2, height / 2 - 12, "The Atrium", {
        fontFamily: FONT.serif,
        fontSize: "28px",
        color: "#4a4858",
      })
      .setOrigin(0.5);

    this.time.delayedCall(400, () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start("Menu");
      });
    });
  }
}
