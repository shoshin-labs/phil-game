import type Phaser from "phaser";
import { FONT_UI } from "../config/fonts";
import { HOW_TO_PLAY_BODY } from "./howToPlayText";

/** Full-screen help modal (shared by Placement + Battle). */
export function openHelpOverlay(scene: Phaser.Scene) {
  const { width, height } = scene.scale;
  const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x040608, 0.82);
  overlay.setDepth(2500);
  const title = scene.add
    .text(width / 2, 56, "How to play", {
      fontFamily: FONT_UI,
      fontSize: "24px",
      color: "#e8ecf4",
    })
    .setOrigin(0.5)
    .setDepth(2501);
  const body = scene.add
    .text(width / 2, height / 2, HOW_TO_PLAY_BODY, {
      fontFamily: FONT_UI,
      fontSize: "16px",
      color: "#b8c0d0",
      align: "center",
      lineSpacing: 5,
      wordWrap: { width: Math.min(760, width - 80) },
    })
    .setOrigin(0.5)
    .setDepth(2501);
  const close = scene.add
    .text(width / 2, height - 64, "Close", {
      fontFamily: FONT_UI,
      fontSize: "22px",
      color: "#7a9cff",
    })
    .setOrigin(0.5)
    .setDepth(2501)
    .setInteractive({ useHandCursor: true });
  const destroy = () => {
    overlay.destroy();
    title.destroy();
    body.destroy();
    close.destroy();
  };
  close.on("pointerdown", destroy);
}
