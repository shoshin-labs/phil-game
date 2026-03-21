/**
 * Default tuning — all [PLACEHOLDER] until playtest (see docs/FOW-GDD.md §11).
 */
export const DEFAULT_GRID_W = 16;
export const DEFAULT_GRID_H = 12;

/** World pixels per cell edge (Phaser scales from this). */
export const CELL_PX = 32;

/** First column index of player B’s half (A is 0 .. splitCol-1). */
export function splitColumn(gridW: number): number {
  return Math.floor(gridW / 2);
}

export const DEFAULT_BLAST_RADIUS_CELLS = 1;
export const DEFAULT_SONAR_RADIUS_CELLS = 3;

/** Gravity in px/s² (screen coords, +y down). */
export const DEFAULT_GRAVITY = 980;

/** Max launch speed scale (multiplied by power 0–1). */
export const DEFAULT_MAX_SPEED = 520;

/** Simulation timestep seconds. */
export const TRAJECTORY_DT = 1 / 120;

/** Max trajectory steps before giving up (miss / out of bounds). */
export const TRAJECTORY_MAX_STEPS = 8000;

export const DEFAULT_AMMO_STANDARD = 12;
export const DEFAULT_AMMO_SONAR = 2;
