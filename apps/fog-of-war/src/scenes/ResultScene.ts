import Phaser from "phaser";
import { FONT_UI } from "../config/fonts";
import { getFowState, resetFowSession } from "../game/session";

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("Result");
  }

  create() {
    const { width, height } = this.scale;
    const s = getFowState();

    let line = "Game over";
    if (s.winner === "draw") line = "Draw";
    else if (s.winner === "A" || s.winner === "B") {
      line = `Player ${s.winner} wins`;
    }

    this.add
      .text(width / 2, height / 2 - 40, line, {
        fontFamily: FONT_UI,
        fontSize: "36px",
        color: "#e8ecf4",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 40, "Back to menu", {
        fontFamily: FONT_UI,
        fontSize: "22px",
        color: "#7a9cff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        resetFowSession();
        this.scene.start("Menu");
      });
  }
}
