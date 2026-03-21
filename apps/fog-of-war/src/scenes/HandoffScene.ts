import Phaser from "phaser";
import { FONT_UI } from "../config/fonts";

export interface HandoffPayload {
  title: string;
  /** Optional second line (privacy / flow hint). */
  subtitle?: string;
  nextScene: string;
  nextData?: object;
}

export class HandoffScene extends Phaser.Scene {
  private payload!: HandoffPayload;

  constructor() {
    super("Handoff");
  }

  init(data: HandoffPayload) {
    this.payload = data;
  }

  create() {
    const { width, height } = this.scale;
    this.add
      .text(width / 2, height / 2 - 56, this.payload.title, {
        fontFamily: FONT_UI,
        fontSize: "28px",
        color: "#e8ecf4",
        align: "center",
      })
      .setOrigin(0.5);

    if (this.payload.subtitle) {
      this.add
        .text(width / 2, height / 2 - 8, this.payload.subtitle, {
          fontFamily: FONT_UI,
          fontSize: "16px",
          color: "#7a8498",
          align: "center",
          wordWrap: { width: width - 120 },
        })
        .setOrigin(0.5);
    }

    const btn = this.add
      .text(width / 2, height / 2 + 56, "Continue", {
        fontFamily: FONT_UI,
        fontSize: "22px",
        color: "#7a9cff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setColor("#a8c0ff"));
    btn.on("pointerout", () => btn.setColor("#7a9cff"));
    btn.on("pointerdown", () => {
      this.scene.start(this.payload.nextScene, this.payload.nextData ?? {});
    });
  }
}
