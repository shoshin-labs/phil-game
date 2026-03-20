import Phaser from "phaser";
import {
  INITIAL_AXES,
  portraitAsText,
  type AxisState,
} from "@phil-game/shared";
import { COL, FONT } from "../ui/theme";

const LABELS = [
  { key: "skepticism" as const, left: "Trust", right: "Doubt" },
  { key: "selfWorld" as const, left: "Inward", right: "Outward" },
  { key: "fluxVsForm" as const, left: "Form", right: "Flux" },
];

export class FinaleScene extends Phaser.Scene {
  private axes: AxisState = { ...INITIAL_AXES };

  constructor() {
    super("Finale");
  }

  init(data: { axes?: AxisState }) {
    if (data?.axes) this.axes = { ...data.axes };
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(COL.bgBot);

    const g = this.add.graphics().setDepth(-2);
    g.fillGradientStyle(COL.bgTop, COL.bgTop, COL.bgBot, COL.bgBot, 1, 1, 1, 1);
    g.fillRect(0, 0, width, height);

    this.add
      .text(width / 2, 44, "Your portrait", {
        fontFamily: FONT.serif,
        fontSize: "32px",
        color: COL.inkTitle,
      })
      .setOrigin(0.5, 0);

    this.add
      .text(width / 2, 96, "How you moved through the Atrium — not a verdict.", {
        fontFamily: FONT.sans,
        fontSize: "14px",
        color: COL.inkMuted,
      })
      .setOrigin(0.5, 0);

    const barW = Math.min(420, width - 80);
    const leftX = width / 2 - barW / 2;
    let y = 150;
    for (const row of LABELS) {
      const v = this.axes[row.key];
      this.add
        .text(leftX, y, `${row.left}  ←→  ${row.right}`, {
          fontFamily: FONT.sans,
          fontSize: "11px",
          color: "#6a6678",
        })
        .setOrigin(0, 0);
      this.add
        .text(leftX + barW, y + 18, `${Math.round(v)}`, {
          fontFamily: FONT.sans,
          fontSize: "12px",
          color: COL.inkMuted,
        })
        .setOrigin(1, 0);

      this.add
        .rectangle(width / 2, y + 26, barW, 10, 0x2a2a40, 1)
        .setStrokeStyle(1, 0x3a3a50);

      const fillW = (v / 100) * barW;
      this.add
        .rectangle(leftX + fillW / 2, y + 26, fillW, 10, 0xc9a227, 1)
        .setOrigin(0.5, 0.5);

      y += 52;
    }

    const prose = portraitAsText(this.axes);
    this.add
      .text(width / 2, y + 24, prose, {
        fontFamily: FONT.serif,
        fontSize: "18px",
        color: COL.inkBody,
        align: "center",
        wordWrap: { width: Math.min(760, width - 48), useAdvancedWrap: true },
        lineSpacing: 10,
      })
      .setOrigin(0.5, 0);

    const again = this.add
      .text(width / 2, height - 48, "Walk again", {
        fontFamily: FONT.sans,
        fontSize: "20px",
        color: "#8a8aaa",
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    again.on("pointerover", () => again.setStyle({ color: "#cfcfe8" }));
    again.on("pointerout", () => again.setStyle({ color: "#8a8aaa" }));
    again.on("pointerdown", () => this.scene.start("Menu"));

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }
}
