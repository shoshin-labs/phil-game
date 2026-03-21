import type { CellCoord, PlayerId } from "./types";
import { splitColumn } from "./constants";

export function cellKey(c: CellCoord): string {
  return `${c.row},${c.col}`;
}

export function parseCellKey(key: string): CellCoord {
  const [r, c] = key.split(",").map(Number);
  return { row: r!, col: c! };
}

export function inBounds(
  c: CellCoord,
  gridW: number,
  gridH: number,
): boolean {
  return c.row >= 0 && c.row < gridH && c.col >= 0 && c.col < gridW;
}

export function playerOwnsColumn(
  player: PlayerId,
  col: number,
  gridW: number,
): boolean {
  const s = splitColumn(gridW);
  if (player === "A") return col < s;
  return col >= s;
}

export function opponentOf(p: PlayerId): PlayerId {
  return p === "A" ? "B" : "A";
}

/** Manhattan distance between two cells. */
export function manhattan(a: CellCoord, b: CellCoord): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/** All cells within Manhattan radius R of centre (inclusive). */
export function cellsInManhattanRadius(
  centre: CellCoord,
  radius: number,
  gridW: number,
  gridH: number,
): CellCoord[] {
  const out: CellCoord[] = [];
  for (let row = 0; row < gridH; row++) {
    for (let col = 0; col < gridW; col++) {
      const c = { row, col };
      if (manhattan(c, centre) <= radius) out.push(c);
    }
  }
  return out;
}
