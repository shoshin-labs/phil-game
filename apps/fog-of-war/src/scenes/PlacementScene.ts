import Phaser from "phaser";
import {
  CELL_PX,
  PLACEMENT_QUOTA,
  advancePhaseAfterSetup,
  countUnitsOfKind,
  hasBunker,
  placeUnit,
  quotaMet,
  type PlayerId,
  type UnitKind,
} from "@phil-game/fow-shared";
import { FONT_UI, FONT_MONO } from "../config/fonts";
import { GRID_OFFSET_X, GRID_OFFSET_Y, GRID_PX_W } from "../config/layout";
import { getFowState, setFowState } from "../game/session";
import { addArenaParallax } from "../visuals/arenaParallax";
import { drawTerrainStripes } from "../visuals/terrainStripes";
import { cellTintByRowDepth } from "../visuals/terrainDepth";
import { openHelpOverlay } from "../ui/helpOverlay";
import { unitCellCaption } from "../ui/unitLabels";

interface PlacementInit {
  player: PlayerId;
}

const PLACE_HINT = [
  "Use brighter tiles — that is your half of the map.",
  "You must place exactly 2 cannons and 1 bunker (the game will stop you from placing more).",
  "Bunkers use two squares: pick an orientation with R, then click — both tiles get a highlight.",
  "Cannons are one square each. When the checklist is green, click Confirm.",
].join("\n");

export class PlacementScene extends Phaser.Scene {
  private forPlayer!: PlayerId;
  private kind: UnitKind = "cannon";
  private horizontal2x1 = true;
  private statusLabel?: Phaser.GameObjects.Text;
  private cellGraphics?: Phaser.GameObjects.Graphics;
  private footprintGraphics?: Phaser.GameObjects.Graphics;
  private terrainStripesGfx?: Phaser.GameObjects.Graphics;
  private unitLabels: Phaser.GameObjects.Text[] = [];
  private kindButtons: Phaser.GameObjects.Text[] = [];
  private keyBindings: Phaser.Input.Keyboard.Key[] = [];

  constructor() {
    super("Placement");
  }

  init(data: PlacementInit) {
    this.forPlayer = data.player;
  }

  create() {
    const { width, height } = this.scale;

    addArenaParallax(this);

    const gridRight = GRID_OFFSET_X + GRID_PX_W;
    this.add
      .rectangle(160, 360, 320, 720, 0x0a0e14, 0.88)
      .setDepth(-15);
    this.add
      .rectangle(gridRight + 192, 360, 384, 720, 0x0a0e14, 0.78)
      .setDepth(-15);

    const roster = (["cannon", "bunker", "decoy"] as const).filter(
      (k) => PLACEMENT_QUOTA[k] > 0,
    );
    if (!roster.includes(this.kind)) {
      this.kind = roster[0] ?? "cannon";
    }

    this.add
      .text(width / 2, 30, `Place units — Player ${this.forPlayer}`, {
        fontFamily: FONT_UI,
        fontSize: "24px",
        color: "#e8ecf4",
      })
      .setOrigin(0.5);

    this.add
      .text(24, 52, PLACE_HINT, {
        fontFamily: FONT_UI,
        fontSize: "15px",
        color: "#7a8498",
        lineSpacing: 5,
        wordWrap: { width: 340 },
      })
      .setDepth(5);

    const help = this.add
      .text(width - 28, 20, "?", {
        fontFamily: FONT_UI,
        fontSize: "22px",
        color: "#6a7898",
      })
      .setOrigin(1, 0)
      .setDepth(200)
      .setInteractive({ useHandCursor: true });
    help.on("pointerover", () => help.setColor("#a8c0ff"));
    help.on("pointerout", () => help.setColor("#6a7898"));
    help.on("pointerdown", () => openHelpOverlay(this));

    this.statusLabel = this.add
      .text(width - 36, 48, "", {
        fontFamily: FONT_UI,
        fontSize: "15px",
        color: "#a8b0c0",
        align: "right",
        lineSpacing: 6,
        wordWrap: { width: 420 },
      })
      .setOrigin(1, 0)
      .setDepth(50);

    const kinds = roster;
    let bx = width / 2 - ((kinds.length - 1) * 60);
    this.kindButtons = [];
    for (const k of kinds) {
      const t = this.add
        .text(bx, 132, k, {
          fontFamily: FONT_UI,
          fontSize: "16px",
          color: "#5a6070",
        })
        .setOrigin(0.5, 0)
        .setInteractive({ useHandCursor: true });
      this.kindButtons.push(t);
      t.on("pointerdown", () => {
        this.kind = k;
        this.syncKindButtons();
        this.refreshStatus();
      });
      bx += 120;
    }
    this.syncKindButtons();

    this.add
      .text(width / 2, 164, "Toggle 2×1 orientation (R)", {
        fontFamily: FONT_UI,
        fontSize: "14px",
        color: "#6a7080",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.horizontal2x1 = !this.horizontal2x1;
        this.refreshStatus();
      });

    const keyR = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.R,
    );
    keyR?.on("down", () => {
      this.horizontal2x1 = !this.horizontal2x1;
      this.refreshStatus();
    });
    if (keyR) this.keyBindings.push(keyR);

    const onPointerDown = (p: Phaser.Input.Pointer) => {
      if (p.y < GRID_OFFSET_Y) return;
      const wx = p.worldX - GRID_OFFSET_X;
      const wy = p.worldY - GRID_OFFSET_Y;
      const col = Math.floor(wx / CELL_PX);
      const row = Math.floor(wy / CELL_PX);
      this.tryPlace({ row, col });
    };
    this.input.on("pointerdown", onPointerDown);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off("pointerdown", onPointerDown);
      for (const k of this.keyBindings) k.destroy();
      this.keyBindings = [];
    });

    this.add
      .text(width / 2, height - 48, "Confirm placement", {
        fontFamily: FONT_UI,
        fontSize: "20px",
        color: "#8bc34a",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.confirmPlacement());

    this.drawGrid();
    this.drawUnits();
    this.refreshStatus();
  }

  private syncKindButtons() {
    const kinds = (["cannon", "bunker", "decoy"] as const).filter(
      (k) => PLACEMENT_QUOTA[k] > 0,
    );
    this.kindButtons.forEach((t, i) => {
      const k = kinds[i];
      if (!k) return;
      t.setColor(k === this.kind ? "#a8c0ff" : "#5a6070");
    });
  }

  private refreshStatus() {
    const s = getFowState();
    const p = this.forPlayer;
    const cannons = countUnitsOfKind(s, p, "cannon");
    const bunkers = countUnitsOfKind(s, p, "bunker");
    this.statusLabel?.setText(
      [
        `Checklist`,
        `Cannon ${cannons}/${PLACEMENT_QUOTA.cannon} · Bunker ${bunkers}/${PLACEMENT_QUOTA.bunker}`,
        `Selected: ${this.kind} · 2×1 ${this.horizontal2x1 ? "horizontal" : "vertical"}`,
        hasBunker(s, p) ? "Bunker placed ✓" : "Bunker required",
      ].join("\n"),
    );
  }

  private tryPlace(anchor: { row: number; col: number }) {
    const s = getFowState();
    const r = placeUnit(s, this.forPlayer, this.kind, anchor, this.horizontal2x1);
    if ("error" in r) {
      this.statusLabel?.setText(
        ["Can't place there", r.error, "", "Tip: stay on your side; avoid overlaps."].join(
          "\n",
        ),
      );
      return;
    }
    setFowState(r.state);
    this.drawGrid();
    this.drawUnits();
    this.refreshStatus();
  }

  private confirmPlacement() {
    const s = getFowState();
    if (!hasBunker(s, this.forPlayer)) {
      this.statusLabel?.setText(
        ["Bunker required", "", "Select “bunker”, rotate with R if needed, then tap your side."].join(
          "\n",
        ),
      );
      return;
    }
    if (!quotaMet(s, this.forPlayer)) {
      this.statusLabel?.setText(
        ["Incomplete roster", "", `Need ${PLACEMENT_QUOTA.cannon} cannons and ${PLACEMENT_QUOTA.bunker} bunker.`].join(
          "\n",
        ),
      );
      return;
    }

    const next = advancePhaseAfterSetup(s);
    setFowState(next);

    if (next.phase === "setup_b") {
      this.scene.start("Handoff", {
        title: "Pass the device to Player B",
        subtitle: "Let them place without peeking.",
        nextScene: "Placement",
        nextData: { player: "B" as const },
      });
      return;
    }

    if (next.phase === "battle") {
      this.scene.start("Handoff", {
        title: "Battle — pass to Player A",
        subtitle: "Player A takes the first shot.",
        nextScene: "Battle",
      });
    }
  }

  private drawGrid() {
    const s = getFowState();
    this.terrainStripesGfx?.destroy();
    this.terrainStripesGfx = drawTerrainStripes(this, s.gridW, s.gridH);

    this.cellGraphics?.destroy();
    this.footprintGraphics?.destroy();
    const g = this.add.graphics();
    this.cellGraphics = g;
    g.setDepth(0);
    const split = Math.floor(s.gridW / 2);

    for (let row = 0; row < s.gridH; row++) {
      for (let col = 0; col < s.gridW; col++) {
        const x = GRID_OFFSET_X + col * CELL_PX;
        const y = GRID_OFFSET_Y + row * CELL_PX;
        const own =
          this.forPlayer === "A" ? col < split : col >= split;
        const base = own ? 0x1a2330 : 0x12141c;
        g.fillStyle(cellTintByRowDepth(base, row, s.gridH), 1);
        g.fillRect(x, y, CELL_PX - 1, CELL_PX - 1);
        g.lineStyle(1, 0x2a2a38, 1);
        g.strokeRect(x, y, CELL_PX - 1, CELL_PX - 1);
      }
    }

    const fg = this.add.graphics();
    this.footprintGraphics = fg;
    fg.setDepth(2);
    for (const u of s.units) {
      if (u.owner !== this.forPlayer) continue;
      const stroke =
        u.kind === "bunker" ? 0x7a9cff : u.kind === "cannon" ? 0x8aabb8 : 0x6a7080;
      for (const c of u.cells) {
        const x = GRID_OFFSET_X + c.col * CELL_PX;
        const y = GRID_OFFSET_Y + c.row * CELL_PX;
        fg.lineStyle(2, stroke, 1);
        fg.strokeRect(x + 1.5, y + 1.5, CELL_PX - 4, CELL_PX - 4);
      }
    }
  }

  private drawUnits() {
    for (const t of this.unitLabels) t.destroy();
    this.unitLabels = [];
    const s = getFowState();

    for (const u of s.units) {
      if (u.owner !== this.forPlayer) continue;
      u.cells.forEach((c, idx) => {
        const x = GRID_OFFSET_X + c.col * CELL_PX + 2;
        const y = GRID_OFFSET_Y + c.row * CELL_PX + 2;
        const label = this.add
          .text(x, y, unitCellCaption(u, idx), {
            fontFamily: FONT_UI,
            fontSize: "9px",
            color: "#e8ecf4",
            lineSpacing: 1,
            align: "left",
            wordWrap: { width: CELL_PX - 4 },
          })
          .setOrigin(0, 0)
          .setDepth(4);
        this.unitLabels.push(label);
      });
    }
  }
}
