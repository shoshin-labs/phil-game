import Phaser from "phaser";
import {
  CELL_PX,
  DEFAULT_AMMO_SONAR,
  DEFAULT_AMMO_STANDARD,
  DEFAULT_SONAR_RADIUS_CELLS,
  cellKey,
  cellCenterWorld,
  cellsInManhattanRadius,
  fireSonar,
  fireStandardShot,
  inBounds,
  launchOriginForPlayer,
  opponentOf,
  playerOwnsColumn,
  sampleShotTrajectory,
  simulateShot,
  type FogMap,
  type GameState,
  type Unit,
} from "@phil-game/fow-shared";
import { playGameEnd, playShoot, playSonar } from "../audio/sfx";
import { FONT_UI, FONT_MONO } from "../config/fonts";
import {
  GRID_OFFSET_X,
  GRID_OFFSET_Y,
  GRID_PX_W,
} from "../config/layout";
import {
  getFowState,
  getLastSonarLine,
  getShellCraterCounts,
  recordShellCrater,
  setFowState,
  setLastSonarLine,
} from "../game/session";
import {
  addArenaParallax,
  resetAimParallax,
  updateAimParallax,
  type ArenaParallaxHandles,
} from "../visuals/arenaParallax";
import { craterKeyFromHit, drawCraterMarks } from "../visuals/craters";
import { spawnShellImpactFromHit, spawnSonarRipple } from "../visuals/combatFx";
import { drawRichTrajectoryPreview } from "../visuals/trajectoryPreview";
import { drawTerrainStripes } from "../visuals/terrainStripes";
import { cellTintByRowDepth } from "../visuals/terrainDepth";
import { openHelpOverlay } from "../ui/helpOverlay";
import { unitCellCaption } from "../ui/unitLabels";

type FireMode = "standard" | "sonar";

const GRID_TOP = GRID_OFFSET_Y;
const HINT_KEY = "fow_battle_hint_v1";

export class BattleScene extends Phaser.Scene {
  private cellGraphics?: Phaser.GameObjects.Graphics;
  private previewGraphics?: Phaser.GameObjects.Graphics;
  private hoverGraphics?: Phaser.GameObjects.Graphics;
  private unitLabels: Phaser.GameObjects.Text[] = [];
  private hud?: Phaser.GameObjects.Text;
  private modeStripe?: Phaser.GameObjects.Rectangle;
  private mode: FireMode = "standard";
  private angleRad = 0.45;
  private power = 0.55;
  private modeButtons: Phaser.GameObjects.Text[] = [];
  private hoverCell: { row: number; col: number } | null = null;
  private ammoHud: Phaser.GameObjects.GameObject[] = [];
  private keyBindings: Phaser.Input.Keyboard.Key[] = [];
  private gridCenterX = 0;
  private hudErrorTimer?: Phaser.Time.TimerEvent;
  private parallaxHandles?: ArenaParallaxHandles;
  private terrainStripesGfx?: Phaser.GameObjects.Graphics;
  private craterMarksGfx?: Phaser.GameObjects.Graphics;
  private transitionTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super("Battle");
  }

  create() {
    const { width } = this.scale;
    this.gridCenterX = GRID_OFFSET_X + GRID_PX_W / 2;

    this.parallaxHandles = addArenaParallax(this);

    const gridRight = GRID_OFFSET_X + GRID_PX_W;
    this.add
      .rectangle(160, 360, 320, 720, 0x0a0e14, 0.85)
      .setDepth(-20);
    this.add
      .rectangle(gridRight + 192, 360, 384, 720, 0x0a0e14, 0.75)
      .setDepth(-20);

    this.add
      .text(this.gridCenterX, 30, "Battle", {
        fontFamily: FONT_UI,
        fontSize: "26px",
        color: "#e8ecf4",
      })
      .setOrigin(0.5);

    this.hud = this.add
      .text(width - 36, 44, "", {
        fontFamily: FONT_UI,
        fontSize: "15px",
        color: "#a8b0c0",
        align: "right",
        lineSpacing: 6,
        wordWrap: { width: 420 },
      })
      .setOrigin(1, 0)
      .setDepth(50);

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

    this.modeStripe = this.add.rectangle(
      this.gridCenterX,
      124,
      GRID_PX_W,
      4,
      0x3a5a8a,
    );
    this.modeStripe.setDepth(200);

    const std = this.add
      .text(this.gridCenterX - 100, 116, "Standard", {
        fontFamily: FONT_UI,
        fontSize: "16px",
        color: "#5a6070",
      })
      .setInteractive({ useHandCursor: true });
    const sn = this.add
      .text(this.gridCenterX + 100, 116, "Sonar", {
        fontFamily: FONT_UI,
        fontSize: "16px",
        color: "#5a6070",
      })
      .setInteractive({ useHandCursor: true });
    this.modeButtons = [std, sn];
    std.on("pointerdown", () => {
      this.mode = "standard";
      this.syncModeButtons();
      this.syncAimParallax();
      this.refreshHud();
      this.drawTrajectoryPreview();
      this.drawHover();
    });
    sn.on("pointerdown", () => {
      this.mode = "sonar";
      this.syncModeButtons();
      this.syncAimParallax();
      this.refreshHud();
      this.drawTrajectoryPreview();
      this.drawHover();
    });
    this.syncModeButtons();

    const K = Phaser.Input.Keyboard.KeyCodes;
    const kb = this.input.keyboard;
    const bindKey = (code: number, fn: () => void) => {
      const k = kb?.addKey(code);
      k?.on("down", fn);
      if (k) this.keyBindings.push(k);
    };
    bindKey(K.A, () => {
      this.angleRad -= 0.05;
      this.syncAimParallax();
      this.refreshHud();
      this.drawTrajectoryPreview();
    });
    bindKey(K.D, () => {
      this.angleRad += 0.05;
      this.syncAimParallax();
      this.refreshHud();
      this.drawTrajectoryPreview();
    });
    bindKey(K.W, () => {
      this.power = Math.min(1, this.power + 0.05);
      this.syncAimParallax();
      this.refreshHud();
      this.drawTrajectoryPreview();
    });
    bindKey(K.S, () => {
      this.power = Math.max(0.05, this.power - 0.05);
      this.syncAimParallax();
      this.refreshHud();
      this.drawTrajectoryPreview();
    });
    bindKey(K.SPACE, () => {
      if (this.mode === "standard") this.fireStandard();
    });

    const onPointerMove = (p: Phaser.Input.Pointer) => {
      if (p.y < GRID_TOP) {
        this.hoverCell = null;
        this.drawHover();
        return;
      }
      const s = getFowState();
      const wx = p.worldX - GRID_OFFSET_X;
      const wy = p.worldY - GRID_OFFSET_Y;
      const col = Math.floor(wx / CELL_PX);
      const row = Math.floor(wy / CELL_PX);
      const cell = { row, col };
      if (!inBounds(cell, s.gridW, s.gridH)) {
        this.hoverCell = null;
        this.drawHover();
        return;
      }
      this.hoverCell = cell;
      this.drawHover();
    };

    const onPointerDown = (p: Phaser.Input.Pointer) => {
      if (p.y < GRID_TOP) return;
      const s = getFowState();
      const wx = p.worldX - GRID_OFFSET_X;
      const wy = p.worldY - GRID_OFFSET_Y;
      const col = Math.floor(wx / CELL_PX);
      const row = Math.floor(wy / CELL_PX);
      const cell = { row, col };
      if (!inBounds(cell, s.gridW, s.gridH)) return;

      if (this.mode === "sonar") {
        this.fireSonarAt(cell);
      }
    };

    this.input.on("pointermove", onPointerMove);
    this.input.on("pointerdown", onPointerDown);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off("pointermove", onPointerMove);
      this.input.off("pointerdown", onPointerDown);
      for (const k of this.keyBindings) k.destroy();
      this.keyBindings = [];
      this.hudErrorTimer?.remove();
      this.transitionTimer?.remove();
    });

    this.refreshHud();
    this.syncAimParallax();
    this.redrawBattlefield();
    this.maybeShowBattleHint();
  }

  private syncAimParallax() {
    const h = this.parallaxHandles;
    if (!h) return;
    if (this.mode === "standard") {
      updateAimParallax(h, this.angleRad, this.power);
    } else {
      resetAimParallax(h);
    }
  }

  private clearAmmoHud() {
    for (const o of this.ammoHud) o.destroy();
    this.ammoHud = [];
  }

  private drawAmmoPips() {
    this.clearAmmoHud();
    const s = getFowState();
    const p = s.activePlayer;
    const a = s.ammo[p];
    const segW = 7;
    const gap = 2;
    const x0 = 24;
    const yShell = 52;
    const ySonar = 74;
    const depth = 150;

    const labShell = this.add
      .text(x0, yShell - 14, "Shells", {
        fontFamily: FONT_UI,
        fontSize: "11px",
        color: "#5a6070",
      })
      .setDepth(depth);
    this.ammoHud.push(labShell);

    const g = this.add.graphics();
    g.setDepth(depth);
    for (let i = 0; i < DEFAULT_AMMO_STANDARD; i++) {
      const x = x0 + i * (segW + gap);
      const spent = i >= a.standard;
      g.fillStyle(spent ? 0x252830 : 0x4a7a9a, 1);
      g.fillRect(x, yShell, segW, 6);
    }
    this.ammoHud.push(g);

    const shellCount = this.add
      .text(
        x0 + DEFAULT_AMMO_STANDARD * (segW + gap) + 8,
        yShell - 2,
        `${a.standard}/${DEFAULT_AMMO_STANDARD}`,
        {
          fontFamily: FONT_MONO,
          fontSize: "12px",
          color: "#8a90a0",
        },
      )
      .setDepth(depth);
    this.ammoHud.push(shellCount);

    const labSonar = this.add
      .text(x0, ySonar - 14, "Sonar", {
        fontFamily: FONT_UI,
        fontSize: "11px",
        color: "#5a6070",
      })
      .setDepth(depth);
    this.ammoHud.push(labSonar);

    const g2 = this.add.graphics();
    g2.setDepth(depth);
    for (let i = 0; i < DEFAULT_AMMO_SONAR; i++) {
      const x = x0 + i * (segW + gap);
      const spent = i >= a.sonar;
      g2.fillStyle(spent ? 0x252830 : 0x2a7a55, 1);
      g2.fillRect(x, ySonar, segW, 6);
    }
    this.ammoHud.push(g2);

    const sonarCount = this.add
      .text(
        x0 + DEFAULT_AMMO_SONAR * (segW + gap) + 8,
        ySonar - 2,
        `${a.sonar}/${DEFAULT_AMMO_SONAR}`,
        {
          fontFamily: FONT_MONO,
          fontSize: "12px",
          color: "#8a90a0",
        },
      )
      .setDepth(depth);
    this.ammoHud.push(sonarCount);

    const legend = this.add
      .text(
        x0,
        108,
        "Click the game\nto use keys",
        {
          fontFamily: FONT_UI,
          fontSize: "12px",
          color: "#5a6070",
          lineSpacing: 4,
        },
      )
      .setDepth(depth);
    this.ammoHud.push(legend);
  }

  private maybeShowBattleHint() {
    try {
      if (typeof localStorage !== "undefined" && localStorage.getItem(HINT_KEY)) {
        return;
      }
    } catch {
      return;
    }

    const { width, height } = this.scale;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x040608, 0.78);
    overlay.setDepth(1000);

    const title = this.add
      .text(width / 2, height / 2 - 140, "Before you shoot", {
        fontFamily: FONT_UI,
        fontSize: "22px",
        color: "#e8ecf4",
      })
      .setOrigin(0.5)
      .setDepth(1001);

    const body = this.add
      .text(
        width / 2,
        height / 2 - 20,
        [
          "Your units and ammo are on the left.",
          "Aim and mode help are on the right.",
          "",
          "Standard — blue arc = shell path. A/D · W/S · Space",
          "Sonar — green tiles = reveal area. Click enemy side.",
        ].join("\n"),
        {
          fontFamily: FONT_UI,
          fontSize: "16px",
          color: "#b8c0d0",
          align: "center",
          wordWrap: { width: width - 120 },
        },
      )
      .setOrigin(0.5)
      .setDepth(1001);

    const btn = this.add
      .text(width / 2, height / 2 + 150, "Got it", {
        fontFamily: FONT_UI,
        fontSize: "22px",
        color: "#7a9cff",
      })
      .setOrigin(0.5)
      .setDepth(1001)
      .setInteractive({ useHandCursor: true });

    const dismiss = () => {
      try {
        localStorage.setItem(HINT_KEY, "1");
      } catch {
        /* ignore */
      }
      overlay.destroy();
      title.destroy();
      body.destroy();
      btn.destroy();
    };
    btn.on("pointerdown", dismiss);
  }

  private syncModeButtons() {
    this.modeButtons.forEach((t, i) => {
      const active =
        (i === 0 && this.mode === "standard") ||
        (i === 1 && this.mode === "sonar");
      t.setColor(active ? "#a8c0ff" : "#5a6070");
    });
    this.modeStripe?.setFillStyle(
      this.mode === "standard" ? 0x3a5a8a : 0x2a7a55,
      1,
    );
  }

  private refreshHud() {
    this.hudErrorTimer?.remove();
    this.hudErrorTimer = undefined;

    const s = getFowState();
    const p = s.activePlayer;
    const last = getLastSonarLine(p);
    const aimHelp =
      this.mode === "standard"
        ? "Standard — A/D angle · W/S power · Space fire"
        : "Sonar — click a tile on the enemy half";

    const parts: string[] = [`Player ${p}`];
    if (last) parts.push(last, "");
    parts.push(
      aimHelp,
      "",
      `Angle ${this.angleRad.toFixed(2)}   Power ${this.power.toFixed(2)}`,
    );
    this.hud?.setText(parts.join("\n"));
    this.drawAmmoPips();
  }

  private showHudError(msg: string) {
    this.hudErrorTimer?.remove();
    this.hud?.setText(msg);
    this.hudErrorTimer = this.time.delayedCall(2800, () => {
      this.hudErrorTimer = undefined;
      this.refreshHud();
    });
  }

  private opponentUnitVisible(fog: FogMap, u: Unit): boolean {
    return u.cells.some((c) => {
      const f = fog[cellKey(c)];
      return f !== undefined && f.unitId === u.id;
    });
  }

  private redrawBattlefield() {
    const s = getFowState();
    const viewer = s.activePlayer;
    const fog: FogMap = viewer === "A" ? s.fogA : s.fogB;

    this.terrainStripesGfx?.destroy();
    this.terrainStripesGfx = drawTerrainStripes(this, s.gridW, s.gridH);

    this.cellGraphics?.destroy();
    const g = this.add.graphics();
    this.cellGraphics = g;
    g.setDepth(0);

    for (let row = 0; row < s.gridH; row++) {
      for (let col = 0; col < s.gridW; col++) {
        const x = GRID_OFFSET_X + col * CELL_PX;
        const y = GRID_OFFSET_Y + row * CELL_PX;
        const own = playerOwnsColumn(viewer, col, s.gridW);

        if (own) {
          g.fillStyle(cellTintByRowDepth(0x1a2330, row, s.gridH), 1);
        } else {
          const k = cellKey({ row, col });
          const fc = fog[k];
          if (fc === undefined) {
            g.fillStyle(
              cellTintByRowDepth(0x0a0c12, row, s.gridH),
              0.92,
            );
          } else if (fc.empty) {
            g.fillStyle(cellTintByRowDepth(0x151820, row, s.gridH), 1);
          } else {
            g.fillStyle(cellTintByRowDepth(0x1c2230, row, s.gridH), 1);
          }
        }

        g.fillRect(x, y, CELL_PX - 1, CELL_PX - 1);
        g.lineStyle(1, 0x2a2a38, 1);
        g.strokeRect(x, y, CELL_PX - 1, CELL_PX - 1);
      }
    }

    this.craterMarksGfx?.destroy();
    this.craterMarksGfx = drawCraterMarks(
      this,
      s.gridW,
      s.gridH,
      getShellCraterCounts(),
    );

    for (const t of this.unitLabels) t.destroy();
    this.unitLabels = [];

    for (const u of s.units) {
      const show =
        u.owner === viewer || this.opponentUnitVisible(fog, u);
      if (!show) continue;
      const ally = u.owner === viewer;
      u.cells.forEach((c, idx) => {
        if (!ally) {
          const fc = fog[cellKey(c)];
          if (!fc || fc.unitId !== u.id) return;
        }
        const px = GRID_OFFSET_X + c.col * CELL_PX + 2;
        const py = GRID_OFFSET_Y + c.row * CELL_PX + 2;
        const label = this.add
          .text(px, py, unitCellCaption(u, idx), {
            fontFamily: FONT_UI,
            fontSize: "9px",
            color: ally ? "#e8ecf4" : "#d4b898",
            lineSpacing: 1,
            wordWrap: { width: CELL_PX - 4 },
          })
          .setOrigin(0, 0);
        label.setDepth(10);
        this.unitLabels.push(label);
      });
    }

    this.drawTrajectoryPreview();
    this.drawHover();
  }

  private drawTrajectoryPreview() {
    this.previewGraphics?.destroy();
    if (this.mode !== "standard") return;

    const s = getFowState();
    const p = s.activePlayer;
    const origin = launchOriginForPlayer(p, s.gridW, s.gridH);
    const opponentUnits = s.units.filter((u) => u.owner === opponentOf(p));
    const pts = sampleShotTrajectory(
      origin,
      { angleRad: this.angleRad, power: this.power },
      s.gridW,
      s.gridH,
      s.blocked,
      opponentUnits,
    );
    if (pts.length < 2) return;

    this.previewGraphics = drawRichTrajectoryPreview(
      this,
      pts,
      GRID_OFFSET_X,
      GRID_OFFSET_Y,
    );
  }

  private drawHover() {
    this.hoverGraphics?.destroy();
    if (this.mode !== "sonar" || !this.hoverCell) return;

    const s = getFowState();
    const p = s.activePlayer;
    const opp = opponentOf(p);
    if (!playerOwnsColumn(opp, this.hoverCell.col, s.gridW)) return;

    const cells = cellsInManhattanRadius(
      this.hoverCell,
      DEFAULT_SONAR_RADIUS_CELLS,
      s.gridW,
      s.gridH,
    ).filter((c) => playerOwnsColumn(opp, c.col, s.gridW));

    const gfx = this.add.graphics();
    this.hoverGraphics = gfx;
    gfx.setDepth(9);
    gfx.lineStyle(1, 0x5ecf8a, 0.75);
    for (const c of cells) {
      const x = GRID_OFFSET_X + c.col * CELL_PX;
      const y = GRID_OFFSET_Y + c.row * CELL_PX;
      gfx.strokeRect(x + 0.5, y + 0.5, CELL_PX - 2, CELL_PX - 2);
    }
  }

  private fireStandard() {
    const s = getFowState();
    const aim = { angleRad: this.angleRad, power: this.power };
    const origin = launchOriginForPlayer(s.activePlayer, s.gridW, s.gridH);
    const opponentUnits = s.units.filter(
      (u) => u.owner === opponentOf(s.activePlayer),
    );
    const hit = simulateShot(
      origin,
      aim,
      s.gridW,
      s.gridH,
      s.blocked,
      opponentUnits,
    );

    const r = fireStandardShot(s, aim);
    if ("error" in r) {
      this.showHudError(r.error);
      return;
    }

    const craterKey = craterKeyFromHit(hit, s.gridW, s.gridH);
    if (craterKey) recordShellCrater(craterKey);

    this.applyFireState(r.state);
    playShoot(this);
    this.cameras.main.shake(110, 0.0028);
    spawnShellImpactFromHit(this, hit, GRID_OFFSET_X, GRID_OFFSET_Y);
    this.scheduleBattleTransition(r.state);
  }

  private fireSonarAt(cell: { row: number; col: number }) {
    const s = getFowState();
    const p = s.activePlayer;
    if (!playerOwnsColumn(opponentOf(p), cell.col, s.gridW)) {
      this.showHudError("Sonar must target the enemy half.");
      return;
    }
    const fogBefore = p === "A" ? s.fogA : s.fogB;
    const before = Object.keys(fogBefore).length;
    const r = fireSonar(s, cell);
    if ("error" in r) {
      this.showHudError(r.error);
      return;
    }
    const fogAfter = p === "A" ? r.state.fogA : r.state.fogB;
    const delta = Object.keys(fogAfter).length - before;
    setLastSonarLine(
      p,
      `Last ping: +${delta} cells (centre row ${cell.row}, col ${cell.col})`,
    );

    const wc = cellCenterWorld(cell);
    spawnSonarRipple(
      this,
      GRID_OFFSET_X + wc.x,
      GRID_OFFSET_Y + wc.y,
    );

    this.applyFireState(r.state);
    playSonar(this);
    this.scheduleBattleTransition(r.state);
  }

  private applyFireState(next: GameState) {
    setFowState(next);
    this.refreshHud();
    this.redrawBattlefield();
  }

  private scheduleBattleTransition(next: GameState) {
    this.transitionTimer?.remove();
    this.transitionTimer = this.time.delayedCall(440, () => {
      this.transitionTimer = undefined;
      if (next.phase === "ended") {
        playGameEnd(this);
        this.scene.start("Result");
        return;
      }

      const passTo = next.activePlayer;
      this.scene.start("Handoff", {
        title: `Pass device to Player ${passTo}`,
        subtitle: "Give them privacy — don't peek at their map.",
        nextScene: "Battle",
      });
    });
  }
}
