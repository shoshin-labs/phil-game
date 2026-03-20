export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, "Loading...", {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Move to menu after a brief moment
    this.time.delayedCall(800, () => {
      this.scene.start("Menu");
    });
  }
}
