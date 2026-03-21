import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { BattleScene } from "./scenes/BattleScene";
import { HandoffScene } from "./scenes/HandoffScene";
import { HowToPlayScene } from "./scenes/HowToPlayScene";
import { MenuScene } from "./scenes/MenuScene";
import { PlacementScene } from "./scenes/PlacementScene";
import { ResultScene } from "./scenes/ResultScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: document.body,
  backgroundColor: "#0e1018",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
  },
  scene: [
    BootScene,
    MenuScene,
    HowToPlayScene,
    HandoffScene,
    PlacementScene,
    BattleScene,
    ResultScene,
  ],
};

new Phaser.Game(config);
