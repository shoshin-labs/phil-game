import { DEFAULT_BLAST_RADIUS_CELLS, DEFAULT_SONAR_RADIUS_CELLS } from "./constants";
import {
  cellKey,
  cellsInManhattanRadius,
  playerOwnsColumn,
} from "./grid";
import type { CellCoord, FogMap, GameState, PlayerId, Unit } from "./types";

function isOpponentCell(
  viewer: PlayerId,
  cell: CellCoord,
  gridW: number,
): boolean {
  return !playerOwnsColumn(viewer, cell.col, gridW);
}

/** Merge reveal intel into the viewer's fog map (opponent cells only). */
export function revealCells(
  fog: FogMap,
  viewer: PlayerId,
  gridW: number,
  gridH: number,
  cells: CellCoord[],
  units: Unit[],
): FogMap {
  const next = { ...fog };
  for (const cell of cells) {
    if (!isOpponentCell(viewer, cell, gridW)) continue;
    const u = units.find((x) =>
      x.cells.some((c) => c.row === cell.row && c.col === cell.col),
    );
    next[cellKey(cell)] = u
      ? { hidden: false, unitId: u.id }
      : { hidden: false, empty: true };
  }
  return next;
}

export function applyBlastReveal(
  state: GameState,
  viewer: PlayerId,
  centre: CellCoord,
  radiusCells: number = DEFAULT_BLAST_RADIUS_CELLS,
): GameState {
  const cells = cellsInManhattanRadius(
    centre,
    radiusCells,
    state.gridW,
    state.gridH,
  ).filter((c) => isOpponentCell(viewer, c, state.gridW));

  const fogKey = viewer === "A" ? "fogA" : "fogB";
  const prev = state[fogKey];
  const merged = revealCells(prev, viewer, state.gridW, state.gridH, cells, state.units);
  return { ...state, [fogKey]: merged };
}

export function applySonarReveal(
  state: GameState,
  viewer: PlayerId,
  centre: CellCoord,
  radiusCells: number = DEFAULT_SONAR_RADIUS_CELLS,
): GameState {
  return applyBlastReveal(state, viewer, centre, radiusCells);
}
