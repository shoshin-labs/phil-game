import Phaser from "phaser";
import { FONT_UI } from "../config/fonts";
import { resetFowSession } from "../game/session";
import { addTitleBackdrop } from "../visuals/arenaParallax";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    const { width, height } = this.scale;

    addTitleBackdrop(this);

    this.add
      .text(width / 2, height / 3 - 20, "Fog of War", {
        fontFamily: FONT_UI,
        fontSize: "52px",
        color: "#e8ecf4",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 3 + 44, "Hot-seat tactics: place hidden units, then fight blind.", {
        fontFamily: FONT_UI,
        fontSize: "18px",
        color: "#7a8498",
      })
      .setOrigin(0.5);

    this.add
      .text(
        width / 2,
        height / 3 + 88,
        "Two players · one keyboard · pass the device when asked",
        {
          fontFamily: FONT_UI,
          fontSize: "15px",
          color: "#5a6070",
        },
      )
      .setOrigin(0.5);

    const play = this.add
      .text(width / 2, height / 2 + 28, "Play", {
        fontFamily: FONT_UI,
        fontSize: "26px",
        color: "#7a9cff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const how = this.add
      .text(width / 2, height / 2 + 88, "How to play", {
        fontFamily: FONT_UI,
        fontSize: "22px",
        color: "#6a7898",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    play.on("pointerover", () => play.setColor("#a8c0ff"));
    play.on("pointerout", () => play.setColor("#7a9cff"));
    play.on("pointerdown", () => {
      resetFowSession();
      this.scene.start("Placement", { player: "A" as const });
    });

    how.on("pointerover", () => how.setColor("#8a9cb8"));
    how.on("pointerout", () => how.setColor("#6a7898"));
    how.on("pointerdown", () => {
      this.scene.start("HowToPlay");
    });

    this.add
      .text(width / 2, height - 28, "Release 0.5.0 — comet tracer · kind-aware craters · rubble", {
        fontFamily: FONT_UI,
        fontSize: "12px",
        color: "#4a5568",
      })
      .setOrigin(0.5);

    this.cameras.main.fadeIn(400, 0, 0, 0);
  }
}
