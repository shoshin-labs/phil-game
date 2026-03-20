import Phaser from "phaser";
import {
  ATRIUM_BEAT_COUNT,
  FINALE_NODE_ID,
  INITIAL_AXES,
  applyAxisDelta,
  atriumGraph,
  type AxisState,
  type Choice,
  type ChapterId,
  type NarrativeNode,
} from "@phil-game/shared";
import { playUiChime } from "../audio/uiChime";
import { COL, FONT } from "../ui/theme";

const CHAPTER_ORDER: ChapterId[] = ["atrium", "knowledge", "self", "value"];

const WRAP = 780;

export class GameScene extends Phaser.Scene {
  private axes: AxisState = { ...INITIAL_AXES };
  private nodeId = atriumGraph.startId;
  private step = 1;
  private lockInput = false;
  private currentChoices: Choice[] = [];

  private bgGradient?: Phaser.GameObjects.Graphics;
  private motes: Phaser.GameObjects.Arc[] = [];
  private titleText?: Phaser.GameObjects.Text;
  private bodyText?: Phaser.GameObjects.Text;
  private stepText?: Phaser.GameObjects.Text;
  private hintText?: Phaser.GameObjects.Text;
  private chapterLabels: { bg: Phaser.GameObjects.Rectangle; txt: Phaser.GameObjects.Text }[] =
    [];
  private choiceRows: Phaser.GameObjects.Container[] = [];

  constructor() {
    super("Game");
  }

  create() {
    this.axes = { ...INITIAL_AXES };
    this.nodeId = atriumGraph.startId;
    this.step = 1;
    this.lockInput = false;

    this.buildBackground();
    this.spawnMotes();

    this.makeChapterStrip();
    this.stepText = this.add
      .text(0, 0, "", {
        fontFamily: FONT.sans,
        fontSize: "13px",
        color: COL.inkMuted,
      })
      .setOrigin(0, 0);

    this.titleText = this.add
      .text(0, 0, "", {
        fontFamily: FONT.serif,
        fontSize: "24px",
        color: COL.inkTitle,
      })
      .setOrigin(0.5, 0);

    this.bodyText = this.add
      .text(0, 0, "", {
        fontFamily: FONT.serif,
        fontSize: "19px",
        color: COL.inkBody,
        align: "center",
        wordWrap: { width: WRAP, useAdvancedWrap: true },
        lineSpacing: 8,
      })
      .setOrigin(0.5, 0);

    this.hintText = this.add
      .text(0, 0, "[1]–[3] choose  ·  Esc to menu", {
        fontFamily: FONT.sans,
        fontSize: "12px",
        color: "#5c5868",
      })
      .setOrigin(0.5, 1);

    this.input.keyboard?.on("keydown", (e: KeyboardEvent) => {
      if (this.lockInput) return;
      if (e.key === "Escape") {
        this.scene.start("Menu");
        return;
      }
      const n = Number.parseInt(e.key, 10);
      if (n >= 1 && n <= 3 && n <= this.currentChoices.length) {
        this.onChoose(this.currentChoices[n - 1]!);
      }
    });

    this.scale.on("resize", this.layout, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off("resize", this.layout, this);
    });

    this.renderCurrentNode(false);
    this.layout(this.scale.gameSize);
    this.cameras.main.fadeIn(420, 0, 0, 0);
  }

  private buildBackground() {
    this.bgGradient = this.add.graphics().setDepth(-30);
  }

  private drawGradient(w: number, h: number) {
    if (!this.bgGradient) return;
    this.bgGradient.clear();
    this.bgGradient.fillGradientStyle(
      COL.bgTop,
      COL.bgTop,
      COL.bgBot,
      COL.bgBot,
      1,
      1,
      1,
      1,
    );
    this.bgGradient.fillRect(0, 0, w, h);
  }

  private spawnMotes() {
    for (const m of this.motes) m.destroy();
    this.motes = [];
    const w = this.scale.width;
    const h = this.scale.height;
    for (let i = 0; i < 48; i++) {
      const x = Phaser.Math.Between(0, w);
      const y = Phaser.Math.Between(0, h);
      const r = Phaser.Math.Between(1, 3);
      const a = Phaser.Math.FloatBetween(0.06, 0.22);
      const c = this.add.circle(x, y, r, 0xe8d5b7, a).setDepth(-8);
      this.motes.push(c);
      this.tweens.add({
        targets: c,
        y: { from: y, to: y - Phaser.Math.Between(60, 180) },
        x: { from: x, to: x + Phaser.Math.Between(-30, 30) },
        duration: Phaser.Math.Between(9000, 18000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }

  private makeChapterStrip() {
    for (const p of this.chapterLabels) {
      p.bg.destroy();
      p.txt.destroy();
    }
    this.chapterLabels = [];
    const labels = ["Atrium", "Knowledge", "Self", "Value"];
    const w = this.scale.width;
    const pad = 24;
    const gap = 8;
    const pillW = (w - pad * 2 - gap * 3) / 4;
    for (let i = 0; i < 4; i++) {
      const x = pad + i * (pillW + gap);
      const bg = this.add
        .rectangle(x + pillW / 2, 36, pillW, 32, COL.pillIdle, 1)
        .setStrokeStyle(1, 0x444455)
        .setOrigin(0.5)
        .setDepth(2);
      const txt = this.add
        .text(x + pillW / 2, 36, labels[i]!, {
          fontFamily: FONT.sans,
          fontSize: "12px",
          color: "#a8a4b8",
        })
        .setOrigin(0.5)
        .setDepth(3);
      this.chapterLabels.push({ bg, txt });
    }
  }

  private updateChapterStrip(chapter: ChapterId) {
    const ci = CHAPTER_ORDER.indexOf(chapter);
    this.chapterLabels.forEach((p, i) => {
      const done = i < ci;
      const active = i === ci;
      p.bg.setFillStyle(
        active ? COL.pillActive : done ? 0x243028 : COL.pillIdle,
        1,
      );
      p.bg.setStrokeStyle(active ? 2 : 1, active ? 0xc9a227 : 0x444455);
      p.txt.setColor(active ? "#f0e8d8" : done ? "#8a9a90" : "#7a7688");
    });
  }

  private layout = (size: Phaser.Structs.Size) => {
    const w = size.width;
    const h = size.height;
    this.drawGradient(w, h);

    const pad = 24;
    const gap = 8;
    const pillW = (w - pad * 2 - gap * 3) / 4;
    for (let i = 0; i < this.chapterLabels.length; i++) {
      const x = pad + i * (pillW + gap);
      const p = this.chapterLabels[i]!;
      p.bg.setPosition(x + pillW / 2, 36);
      p.bg.setSize(pillW, 32);
      p.txt.setPosition(x + pillW / 2, 36);
    }

    this.stepText?.setPosition(pad, h - 22);
    this.titleText?.setPosition(w / 2, 92);
    this.bodyText?.setPosition(w / 2, 148);
    this.bodyText?.setStyle({
      wordWrap: { width: Math.min(WRAP, w - 48), useAdvancedWrap: true },
    });
    this.hintText?.setPosition(w / 2, h - 18);

    this.layoutChoices();
  };

  private clearChoices() {
    for (const row of this.choiceRows) row.destroy();
    this.choiceRows = [];
  }

  private renderCurrentNode(useFade: boolean) {
    const node = atriumGraph.nodes[this.nodeId];
    if (!node) {
      this.bodyText?.setText(`(Missing node: ${this.nodeId})`);
      return;
    }

    this.updateChapterStrip(node.chapter);
    this.stepText?.setText(`Passage ${this.step} / ${ATRIUM_BEAT_COUNT}`);
    this.titleText?.setText(node.title);
    this.bodyText?.setText(node.body);
    this.currentChoices = node.choices;
    this.clearChoices();
    this.layoutChoices();

    if (useFade) {
      this.cameras.main.fadeIn(220, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE,
        () => {
          this.lockInput = false;
        },
      );
    }
  }

  private layoutChoices() {
    const node = atriumGraph.nodes[this.nodeId];
    if (!node) return;

    for (const row of this.choiceRows) row.destroy();
    this.choiceRows = [];

    const w = this.scale.width;
    const h = this.scale.height;
    const choices = node.choices;
    const rowH = 56;
    const gap = 10;
    const bottomPad = 52;
    let y0 = h - bottomPad - choices.length * (rowH + gap);

    choices.forEach((choice, i) => {
      const row = this.buildChoiceRow(choice, i + 1, w / 2, y0 + i * (rowH + gap), rowH);
      this.choiceRows.push(row);
    });
  }

  private buildChoiceRow(
    choice: Choice,
    num: number,
    cx: number,
    cy: number,
    rowH: number,
  ) {
    const w = Math.min(760, this.scale.width - 48);
    const container = this.add.container(cx, cy);

    const bg = this.add
      .rectangle(0, 0, w, rowH, COL.choiceBg, 1)
      .setStrokeStyle(1, COL.choiceStroke)
      .setInteractive({ useHandCursor: true });

    const label = this.add
      .text(0, 0, `[${num}]  ${choice.label}`, {
        fontFamily: FONT.serif,
        fontSize: "16px",
        color: "#e8e4dc",
        wordWrap: { width: w - 36, useAdvancedWrap: true },
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    bg.on("pointerover", () => bg.setFillStyle(COL.choiceBgHi));
    bg.on("pointerout", () => bg.setFillStyle(COL.choiceBg));
    bg.on("pointerdown", () => {
      if (!this.lockInput) this.onChoose(choice);
    });

    container.add([bg, label]);
    return container;
  }

  private onChoose(choice: Choice) {
    if (this.lockInput) return;
    playUiChime();
    this.axes = applyAxisDelta(this.axes, choice.delta);

    if (choice.nextId === FINALE_NODE_ID) {
      this.lockInput = true;
      this.cameras.main.fadeOut(240, 0, 0, 0);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start("Finale", { axes: this.axes });
      });
      return;
    }

    if (!atriumGraph.nodes[choice.nextId]) {
      this.bodyText?.setText(`(Missing node: ${choice.nextId})`);
      this.clearChoices();
      return;
    }

    this.lockInput = true;
    this.cameras.main.fadeOut(150, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.nodeId = choice.nextId;
      this.step++;
      this.renderCurrentNode(true);
      this.layout(this.scale.gameSize);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
        this.lockInput = false;
      });
    });
  }
}
