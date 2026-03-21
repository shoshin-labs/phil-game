import { PLACEMENT_QUOTA, splitColumn } from "./constants";
import type { CellCoord, GameState, PlayerId, Unit, UnitKind } from "./types";
import { cellKey, inBounds, playerOwnsColumn } from "./grid";

function footprint(
  kind: UnitKind,
  anchor: CellCoord,
  horizontal2x1: boolean,
): CellCoord[] {
  if (kind === "cannon") return [{ ...anchor }];
  if (kind === "bunker" || kind === "decoy") {
    if (horizontal2x1) {
      return [
        { ...anchor },
        { row: anchor.row, col: anchor.col + 1 },
      ];
    }
    return [
      { ...anchor },
      { row: anchor.row + 1, col: anchor.col },
    ];
  }
  return [{ ...anchor }];
}

function cellsOverlap(a: CellCoord[], b: CellCoord[]): boolean {
  const set = new Set(a.map(cellKey));
  return b.some((c) => set.has(cellKey(c)));
}

export function canPlaceUnit(
  state: GameState,
  owner: PlayerId,
  kind: UnitKind,
  anchor: CellCoord,
  horizontal2x1: boolean,
): { ok: true; cells: CellCoord[] } | { ok: false; reason: string } {
  if (PLACEMENT_QUOTA[kind] <= 0) {
    return { ok: false, reason: "This unit is not in the current roster" };
  }
  const cap = PLACEMENT_QUOTA[kind];
  const already = state.units.filter(
    (u) => u.owner === owner && u.kind === kind,
  ).length;
  if (cap > 0 && already >= cap) {
    const name = kind === "cannon" ? "cannons" : kind === "bunker" ? "bunkers" : `${kind}s`;
    return {
      ok: false,
      reason: `Roster full — you can only place ${cap} ${name}`,
    };
  }
  const cells = footprint(kind, anchor, horizontal2x1);
  for (const c of cells) {
    if (!inBounds(c, state.gridW, state.gridH)) {
      return { ok: false, reason: "Out of bounds" };
    }
    if (!playerOwnsColumn(owner, c.col, state.gridW)) {
      return { ok: false, reason: "Must place on your half" };
    }
    if (state.blocked[c.row]![c.col]!) {
      return { ok: false, reason: "Blocked cell" };
    }
  }
  for (const u of state.units) {
    if (u.owner !== owner) continue;
    if (cellsOverlap(cells, u.cells)) {
      return { ok: false, reason: "Overlaps another unit" };
    }
  }
  return { ok: true, cells };
}

const HP: Record<UnitKind, number> = {
  cannon: 2,
  bunker: 4,
  decoy: 0,
};

export function placeUnit(
  state: GameState,
  owner: PlayerId,
  kind: UnitKind,
  anchor: CellCoord,
  horizontal2x1: boolean,
): { state: GameState } | { error: string } {
  const check = canPlaceUnit(state, owner, kind, anchor, horizontal2x1);
  if (!check.ok) return { error: check.reason };

  const seq = state.unitSeq + 1;
  const id = `u${seq}`;
  const maxHp = HP[kind];
  const unit: Unit = {
    id,
    owner,
    kind,
    cells: check.cells,
    hp: maxHp,
    maxHp,
  };

  return {
    state: {
      ...state,
      unitSeq: seq,
      units: [...state.units, unit],
    },
  };
}

/** v1: one bunker per player — call before allowing placement complete. */
export function hasBunker(state: GameState, owner: PlayerId): boolean {
  return state.units.some((u) => u.owner === owner && u.kind === "bunker");
}

export function opponentHalfColumns(
  player: PlayerId,
  gridW: number,
): { from: number; to: number } {
  const s = splitColumn(gridW);
  if (player === "A") return { from: 0, to: s - 1 };
  return { from: s, to: gridW - 1 };
}

export function countUnitsOfKind(
  state: GameState,
  player: PlayerId,
  kind: UnitKind,
): number {
  return state.units.filter((u) => u.owner === player && u.kind === kind)
    .length;
}

export function quotaMet(state: GameState, player: PlayerId): boolean {
  const kinds: UnitKind[] = ["cannon", "bunker", "decoy"];
  for (const kind of kinds) {
    const need = PLACEMENT_QUOTA[kind];
    if (need <= 0) continue;
    if (countUnitsOfKind(state, player, kind) < need) return false;
  }
  return true;
}
