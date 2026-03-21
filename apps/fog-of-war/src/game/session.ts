import {
  createInitialGameState,
  type GameState,
  type PlayerId,
  type TrajectoryHit,
} from "@phil-game/fow-shared";

let state: GameState = createInitialGameState();

/** Per-player battle hint for last sonar (shown on that player’s turns). */
let lastSonarByPlayer: Record<PlayerId, string | null> = {
  A: null,
  B: null,
};

/** Client-only shell marks per cell — count + last hit kind for palette / rubble. */
export interface ShellCraterRecord {
  count: number;
  lastKind: TrajectoryHit["kind"];
}

let shellCraterRecords: Record<string, ShellCraterRecord> = {};

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

export function recordShellCrater(
  cellKeyStr: string,
  kind: TrajectoryHit["kind"],
): void {
  const prev = shellCraterRecords[cellKeyStr];
  const count = (prev?.count ?? 0) + 1;
  shellCraterRecords[cellKeyStr] = { count, lastKind: kind };
}

export function getShellCraterRecords(): Readonly<Record<string, ShellCraterRecord>> {
  return shellCraterRecords;
}

export function resetFowSession(): void {
  state = createInitialGameState();
  lastSonarByPlayer = { A: null, B: null };
  shellCraterRecords = {};
}
