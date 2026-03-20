export class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#1a1a2e");

    this.add
      .text(width / 2, 40, "Philosophy Game", {
        fontSize: "28px",
        color: "#e8d5b7",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2, '"I think, therefore I am"\n— Descartes', {
        fontSize: "20px",
        color: "#cccccc",
        align: "center",
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height - 40, "Game prototype — more to come!", {
        fontSize: "16px",
        color: "#666666",
      })
      .setOrigin(0.5);
  }
}
