import { DEFAULT_BLAST_RADIUS_CELLS } from "./constants";
import { launchOriginForPlayer, simulateShot } from "./ballistics";
import { applyBlastReveal, applySonarReveal } from "./fog";
import {
  cellKey,
  cellsInManhattanRadius,
  inBounds,
  opponentOf,
  playerOwnsColumn,
} from "./grid";
import { switchTurn } from "./game-state";
import type { AimInput, GameState, PlayerId, Unit } from "./types";

function unitsWithBlastDamage(
  units: Unit[],
  centre: { row: number; col: number },
  radius: number,
  gridW: number,
  gridH: number,
  damage: number,
  /** Only units owned by this player receive damage. */
  damageOwner: PlayerId,
): Unit[] {
  const blast = cellsInManhattanRadius(centre, radius, gridW, gridH);
  const blastKeys = new Set(blast.map(cellKey));
  const damaged = new Set<string>();

  const out: Unit[] = [];
  for (const u of units) {
    if (u.owner !== damageOwner) {
      out.push(u);
      continue;
    }
    const touched = u.cells.some((c) => blastKeys.has(cellKey(c)));
    if (!touched) {
      out.push(u);
      continue;
    }
    if (damaged.has(u.id)) {
      out.push(u);
      continue;
    }
    damaged.add(u.id);

    if (u.kind === "decoy") {
      continue;
    }

    const hp = u.hp - damage;
    if (hp <= 0) continue;
    out.push({ ...u, hp });
  }
  return out;
}

function bunkerAlive(units: Unit[], owner: PlayerId): boolean {
  return units.some(
    (u) => u.owner === owner && u.kind === "bunker" && u.hp > 0,
  );
}

/** Exported for tests and tooling that need win detection without firing. */
export function evaluateEnd(state: GameState): GameState {
  const aAlive = bunkerAlive(state.units, "A");
  const bAlive = bunkerAlive(state.units, "B");
  if (!aAlive && !bAlive) {
    return { ...state, phase: "ended", winner: "draw" };
  }
  if (!aAlive) {
    return { ...state, phase: "ended", winner: "B" };
  }
  if (!bAlive) {
    return { ...state, phase: "ended", winner: "A" };
  }
  return state;
}

export function fireStandardShot(
  state: GameState,
  aim: AimInput,
): { state: GameState } | { error: string } {
  if (state.phase !== "battle") return { error: "Not in battle phase" };
  const p = state.activePlayer;
  if (state.ammo[p].standard <= 0) return { error: "No standard shells" };

  const opponent = opponentOf(p);
  const opponentUnits = state.units.filter((u) => u.owner === opponent);

  const origin = launchOriginForPlayer(p, state.gridW, state.gridH);
  const hit = simulateShot(
    origin,
    aim,
    state.gridW,
    state.gridH,
    state.blocked,
    opponentUnits,
  );

  let next: GameState = {
    ...state,
    ammo: {
      ...state.ammo,
      [p]: { ...state.ammo[p], standard: state.ammo[p].standard - 1 },
    },
  };

  const impactCell =
    hit.cell && inBounds(hit.cell, state.gridW, state.gridH) ? hit.cell : null;

  if (impactCell) {
    next = {
      ...next,
      units: unitsWithBlastDamage(
        next.units,
        impactCell,
        DEFAULT_BLAST_RADIUS_CELLS,
        state.gridW,
        state.gridH,
        1,
        opponent,
      ),
    };
    next = applyBlastReveal(next, p, impactCell, DEFAULT_BLAST_RADIUS_CELLS);
  }

  next = evaluateEnd(next);
  if (next.phase === "ended") return { state: next };

  return { state: switchTurn(next) };
}

export function fireSonar(
  state: GameState,
  centre: { row: number; col: number },
): { state: GameState } | { error: string } {
  if (state.phase !== "battle") return { error: "Not in battle phase" };
  const p = state.activePlayer;
  if (state.ammo[p].sonar <= 0) return { error: "No sonar charges" };
  if (!inBounds(centre, state.gridW, state.gridH)) {
    return { error: "Invalid cell" };
  }
  if (!playerOwnsColumn(opponentOf(p), centre.col, state.gridW)) {
    return { error: "Sonar must target opponent half" };
  }

  let next: GameState = {
    ...state,
    ammo: {
      ...state.ammo,
      [p]: { ...state.ammo[p], sonar: state.ammo[p].sonar - 1 },
    },
  };

  next = applySonarReveal(next, p, centre);
  next = evaluateEnd(next);
  if (next.phase === "ended") return { state: next };

  return { state: switchTurn(next) };
}
