export class MenuScene extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 3, "Philosophy Game", {
        fontSize: "48px",
        color: "#e8d5b7",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(width / 2, height / 2 + 40, "Click to Start", {
        fontSize: "24px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    // Pulse the start text
    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
