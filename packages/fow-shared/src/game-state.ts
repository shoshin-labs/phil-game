import {
  DEFAULT_AMMO_SONAR,
  DEFAULT_AMMO_STANDARD,
  DEFAULT_GRID_H,
  DEFAULT_GRID_W,
} from "./constants";
import type { GameState, PlayerId } from "./types";

function emptyBlocked(gridW: number, gridH: number): boolean[][] {
  return Array.from({ length: gridH }, () => Array<boolean>(gridW).fill(false));
}

export function createInitialGameState(
  gridW = DEFAULT_GRID_W,
  gridH = DEFAULT_GRID_H,
): GameState {
  return {
    phase: "setup_a",
    gridW,
    gridH,
    blocked: emptyBlocked(gridW, gridH),
    units: [],
    activePlayer: "A",
    ammo: {
      A: { standard: DEFAULT_AMMO_STANDARD, sonar: DEFAULT_AMMO_SONAR },
      B: { standard: DEFAULT_AMMO_STANDARD, sonar: DEFAULT_AMMO_SONAR },
    },
    winner: null,
    fogA: {},
    fogB: {},
    unitSeq: 0,
  };
}

export function advancePhaseAfterSetup(state: GameState): GameState {
  if (state.phase === "setup_a") {
    return { ...state, phase: "setup_b" };
  }
  if (state.phase === "setup_b") {
    return { ...state, phase: "battle", activePlayer: "A" };
  }
  return state;
}

export function switchTurn(state: GameState): GameState {
  const next: PlayerId = state.activePlayer === "A" ? "B" : "A";
  return { ...state, activePlayer: next };
}
