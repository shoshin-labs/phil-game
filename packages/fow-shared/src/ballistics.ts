import {
  CELL_PX,
  DEFAULT_GRAVITY,
  DEFAULT_MAX_SPEED,
  TRAJECTORY_DT,
  TRAJECTORY_MAX_STEPS,
} from "./constants";
import type { AimInput, CellCoord, TrajectoryHit, Unit, Vec2 } from "./types";
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

    if (x < 0 || y < 0 || x >= worldW || y >= worldH) {
      return {
        kind: "out_of_bounds",
        cell: null,
        impactWorld: { x, y },
      };
    }

    const cell = worldToCell({ x, y });
    if (!inBounds(cell, gridW, gridH)) {
      return {
        kind: "out_of_bounds",
        cell: null,
        impactWorld: { x, y },
      };
    }

    if (blocked[cell.row]![cell.col]!) {
      return {
        kind: "terrain",
        cell,
        impactWorld: { x, y },
      };
    }

    const hit = unitAtCell(units, cell);
    if (hit) {
      return {
        kind: "unit",
        cell,
        unitId: hit.id,
        impactWorld: { x, y },
      };
    }
  }

  return {
    kind: "miss",
    cell: null,
    impactWorld: { x, y },
  };
}

/** Baseline launch point: middle of back edge column for the shooter. */
export function launchOriginForPlayer(
  player: "A" | "B",
  gridW: number,
  gridH: number,
  rowBias = 0.5,
): Vec2 {
  const s = Math.floor(gridW / 2);
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
