import {
  CELL_PX,
  DEFAULT_GRAVITY,
  DEFAULT_MAX_SPEED,
  TRAJECTORY_DT,
  TRAJECTORY_MAX_STEPS,
} from "./constants";
import type {
  AimInput,
  CellCoord,
  PlayerId,
  TrajectoryHit,
  Unit,
  Vec2,
} from "./types";
import { inBounds } from "./grid";

export function worldToCell(p: Vec2): CellCoord {
  return {
    row: Math.floor(p.y / CELL_PX),
    col: Math.floor(p.x / CELL_PX),
  };
}

export function cellCenterWorld(c: CellCoord): Vec2 {
  return {
    x: (c.col + 0.5) * CELL_PX,
    y: (c.row + 0.5) * CELL_PX,
  };
}

function unitAtCell(units: Unit[], cell: CellCoord): Unit | undefined {
  return units.find((u) =>
    u.cells.some((x) => x.row === cell.row && x.col === cell.col),
  );
}

/**
 * Simulate a parabolic shot from origin with aim; returns first hit along the path.
 * Coordinates: origin top-left of world, +y down, gravity pulls +y.
 */
export function simulateShot(
  origin: Vec2,
  aim: AimInput,
  gridW: number,
  gridH: number,
  blocked: boolean[][],
  units: Unit[],
): TrajectoryHit {
  return runTrajectory(origin, aim, gridW, gridH, blocked, units, null).hit;
}

/**
 * World-space samples along the path (for preview). Uses the same physics as `simulateShot`.
 * `sampleStride` = emit a point every N simulation steps (plus one at impact).
 */
export function sampleShotTrajectory(
  origin: Vec2,
  aim: AimInput,
  gridW: number,
  gridH: number,
  blocked: boolean[][],
  units: Unit[],
  sampleStride = 4,
): Vec2[] {
  return runTrajectory(
    origin,
    aim,
    gridW,
    gridH,
    blocked,
    units,
    sampleStride,
  ).samples;
}

function runTrajectory(
  origin: Vec2,
  aim: AimInput,
  gridW: number,
  gridH: number,
  blocked: boolean[][],
  units: Unit[],
  sampleStride: number | null,
): { hit: TrajectoryHit; samples: Vec2[] } {
  const samples: Vec2[] = [];
  const pushSample = (x: number, y: number) => {
    if (sampleStride !== null) {
      samples.push({ x, y });
    }
  };

  const power = Math.min(1, Math.max(0, aim.power));
  const speed = DEFAULT_MAX_SPEED * power;
  const vx = Math.cos(aim.angleRad) * speed;
  const vy = Math.sin(aim.angleRad) * speed;

  let x = origin.x;
  let y = origin.y;
  let vxCur = vx;
  let vyCur = vy;

  const worldW = gridW * CELL_PX;
  const worldH = gridH * CELL_PX;

  for (let i = 0; i < TRAJECTORY_MAX_STEPS; i++) {
    x += vxCur * TRAJECTORY_DT;
    y += vyCur * TRAJECTORY_DT;
    vyCur += DEFAULT_GRAVITY * TRAJECTORY_DT;

    if (sampleStride !== null && (i % sampleStride === 0 || i === 0)) {
      pushSample(x, y);
    }

    if (x < 0 || y < 0 || x >= worldW || y >= worldH) {
      const hit: TrajectoryHit = {
        kind: "out_of_bounds",
        cell: null,
        impactWorld: { x, y },
      };
      if (sampleStride !== null) {
        pushSample(x, y);
      }
      return { hit, samples };
    }

    const cell = worldToCell({ x, y });
    if (!inBounds(cell, gridW, gridH)) {
      const hit: TrajectoryHit = {
        kind: "out_of_bounds",
        cell: null,
        impactWorld: { x, y },
      };
      if (sampleStride !== null) {
        pushSample(x, y);
      }
      return { hit, samples };
    }

    if (blocked[cell.row]![cell.col]!) {
      const hit: TrajectoryHit = {
        kind: "terrain",
        cell,
        impactWorld: { x, y },
      };
      if (sampleStride !== null) {
        pushSample(x, y);
      }
      return { hit, samples };
    }

    const u = unitAtCell(units, cell);
    if (u) {
      const hit: TrajectoryHit = {
        kind: "unit",
        cell,
        unitId: u.id,
        impactWorld: { x, y },
      };
      if (sampleStride !== null) {
        pushSample(x, y);
      }
      return { hit, samples };
    }
  }

  const hit: TrajectoryHit = {
    kind: "miss",
    cell: null,
    impactWorld: { x, y },
  };
  if (sampleStride !== null) {
    pushSample(x, y);
  }
  return { hit, samples };
}

/**
 * Shell launch position: **first surviving cannon** tile center (deterministic order),
 * else middle of the back edge column (fallback if no cannon).
 */
export function launchOriginForPlayer(
  player: PlayerId,
  units: Unit[],
  gridW: number,
  gridH: number,
): Vec2 {
  const cannons = units
    .filter(
      (u) =>
        u.owner === player &&
        u.kind === "cannon" &&
        u.hp > 0 &&
        u.cells.length > 0,
    )
    .sort((a, b) => {
      const ac = a.cells[0]!;
      const bc = b.cells[0]!;
      if (ac.row !== bc.row) return ac.row - bc.row;
      return player === "A" ? ac.col - bc.col : bc.col - ac.col;
    });
  if (cannons.length > 0) {
    return cellCenterWorld(cannons[0]!.cells[0]!);
  }
  return launchOriginEdgeFallback(player, gridW, gridH);
}

/** Legacy edge-only origin (tests / no cannons left). */
export function launchOriginEdgeFallback(
  player: PlayerId,
  gridW: number,
  gridH: number,
  rowBias = 0.5,
): Vec2 {
  if (player === "A") {
    const col = 0;
    return {
      x: (col + 0.5) * CELL_PX,
      y: (gridH * rowBias) * CELL_PX,
    };
  }
  const col = gridW - 1;
  return {
    x: (col + 0.5) * CELL_PX,
    y: (gridH * rowBias) * CELL_PX,
  };
}
