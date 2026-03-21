import Phaser from "phaser";
import { FONT_UI } from "../config/fonts";
import { HOW_TO_PLAY_BODY } from "../ui/howToPlayText";

export class HowToPlayScene extends Phaser.Scene {
  constructor() {
    super("HowToPlay");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .rectangle(width / 2, height / 2, width, height, 0x0a0c12, 1)
      .setDepth(0);

    this.add
      .text(width / 2, 48, "How to play", {
        fontFamily: FONT_UI,
        fontSize: "32px",
        color: "#e8ecf4",
      })
      .setOrigin(0.5)
      .setDepth(1);

    this.add
      .text(width / 2, height / 2 + 8, HOW_TO_PLAY_BODY, {
        fontFamily: FONT_UI,
        fontSize: "17px",
        color: "#a8b0c0",
        align: "center",
        lineSpacing: 4,
        wordWrap: { width: Math.min(720, width - 80) },
      })
      .setOrigin(0.5)
      .setDepth(1);

    const back = this.add
      .text(width / 2, height - 56, "← Back to menu", {
        fontFamily: FONT_UI,
        fontSize: "20px",
        color: "#7a9cff",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setInteractive({ useHandCursor: true });

    back.on("pointerover", () => back.setColor("#a8c0ff"));
    back.on("pointerout", () => back.setColor("#7a9cff"));
    back.on("pointerdown", () => {
      this.scene.start("Menu");
    });
  }
}
