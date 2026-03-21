import {
  createInitialGameState,
  type GameState,
  type PlayerId,
} from "@phil-game/fow-shared";

let state: GameState = createInitialGameState();

/** Per-player battle hint for last sonar (shown on that player’s turns). */
let lastSonarByPlayer: Record<PlayerId, string | null> = {
  A: null,
  B: null,
};

export function getFowState(): GameState {
  return state;
}

export function setFowState(next: GameState): void {
  state = next;
}

export function setLastSonarLine(player: PlayerId, line: string | null): void {
  lastSonarByPlayer[player] = line;
}

export function getLastSonarLine(player: PlayerId): string | null {
  return lastSonarByPlayer[player];
}

export function resetFowSession(): void {
  state = createInitialGameState();
  lastSonarByPlayer = { A: null, B: null };
}
