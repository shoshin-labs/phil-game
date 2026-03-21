import Phaser from "phaser";
import { createInitialGameState } from "@phil-game/fow-shared";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    const { width, height } = this.scale;

    const probe = createInitialGameState();
    const gridOk = probe.gridW === 16 && probe.gridH === 12;

    this.add
      .text(width / 2, height / 3, "Fog of War", {
        fontFamily: "Outfit, sans-serif",
        fontSize: "48px",
        color: "#e8ecf4",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 3 + 56, "Fire blind. Think sharp.", {
        fontFamily: "Outfit, sans-serif",
        fontSize: "18px",
        color: "#7a8498",
      })
      .setOrigin(0.5);

    this.add
      .text(
        width / 2,
        height / 2 + 20,
        [
          "@phil-game/fow-shared",
          gridOk ? "✓ rules state (16×12)" : "⚠ grid mismatch",
          "",
          "Next: placement & battle scenes",
        ].join("\n"),
        {
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "14px",
          color: "#5c6578",
          align: "center",
        },
      )
      .setOrigin(0.5);

    this.cameras.main.fadeIn(400, 0, 0, 0);
  }
}
