import Phaser from "phaser";
import { COL, FONT } from "../ui/theme";

export class MenuScene extends Phaser.Scene {
  private started = false;

  constructor() {
    super("Menu");
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(COL.bgBot);

    const g = this.add.graphics().setDepth(-2);
    g.fillGradientStyle(COL.bgTop, COL.bgTop, COL.bgBot, COL.bgBot, 1, 1, 1, 1);
    g.fillRect(0, 0, width, height);

    for (let i = 0; i < 36; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const c = this.add
        .circle(x, y, Phaser.Math.Between(1, 2), 0xe8d5b7, Phaser.Math.FloatBetween(0.04, 0.18))
        .setDepth(-1);
      this.tweens.add({
        targets: c,
        y: y - Phaser.Math.Between(40, 100),
        duration: Phaser.Math.Between(7000, 14000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    this.add
      .text(width / 2, height / 3 - 28, "The Atrium", {
        fontFamily: FONT.serif,
        fontSize: "52px",
        color: COL.inkTitle,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 3 + 28, "A walk through philosophy", {
        fontFamily: FONT.sans,
        fontSize: "17px",
        color: COL.inkMuted,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 3 + 58, "shoshin labs", {
        fontFamily: FONT.sans,
        fontSize: "12px",
        color: "#5a5668",
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(width / 2, height / 2 + 70, "Begin", {
        fontFamily: FONT.sans,
        fontSize: "26px",
        color: "#b8b4c8",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: startText,
      alpha: 0.35,
      duration: 900,
      yoyo: true,
      repeat: -1,
    });

    const goGame = () => {
      if (this.started) return;
      this.started = true;
      this.cameras.main.fadeOut(280, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => this.scene.start("Game"),
      );
    };

    startText.on("pointerover", () => startText.setStyle({ color: "#e8e4f4" }));
    startText.on("pointerout", () => startText.setStyle({ color: "#b8b4c8" }));
    startText.on("pointerdown", goGame);

    const space = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    const enter = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER,
    );
    space?.once("down", goGame);
    enter?.once("down", goGame);

    this.cameras.main.fadeIn(600, 0, 0, 0);
  }
}
