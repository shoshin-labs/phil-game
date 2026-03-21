export type PlayerId = "A" | "B";

export type GamePhase =
  | "setup_a"
  | "setup_b"
  | "battle"
  | "ended";

export type UnitKind = "cannon" | "bunker" | "decoy";

export type ProjectileKind = "standard" | "sonar";

export interface CellCoord {
  row: number;
  col: number;
}

export type UnitId = string;

export interface Unit {
  id: UnitId;
  owner: PlayerId;
  kind: UnitKind;
  /** Occupied cells (1×1 or 2×1 horizontal/vertical). */
  cells: CellCoord[];
  hp: number;
  maxHp: number;
}

export interface AmmoState {
  standard: number;
  sonar: number;
}

export interface FogCell {
  /** Hidden until revealed. */
  hidden: boolean;
  /** Known empty after reveal. */
  empty?: boolean;
  /** If a unit is visible here, which unit id. */
  unitId?: UnitId;
}

/**
 * Per-player view of opponent territory.
 * Keys: "row,col" for opponent cells only.
 */
export type FogMap = Record<string, FogCell>;

export interface GameState {
  phase: GamePhase;
  /** Monotonic id source for `Unit.id`. */
  unitSeq: number;
  gridW: number;
  gridH: number;
  /** Blocked terrain (not traversable by projectile through — v1 static). */
  blocked: boolean[][];
  units: Unit[];
  activePlayer: PlayerId;
  ammo: Record<PlayerId, AmmoState>;
  /** Winner if phase ended. */
  winner: PlayerId | "draw" | null;
  fogA: FogMap;
  fogB: FogMap;
}

export interface Vec2 {
  x: number;
  y: number;
}

/** Aim: angle radians from +x axis; power 0..1. */
export interface AimInput {
  angleRad: number;
  power: number;
}

export interface TrajectoryHit {
  kind: "unit" | "terrain" | "out_of_bounds" | "miss";
  cell: CellCoord | null;
  unitId?: UnitId;
  /** Sampled impact position in world px. */
  impactWorld: Vec2;
}
