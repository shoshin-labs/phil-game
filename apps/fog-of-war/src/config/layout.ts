/** Screen layout: grid is horizontally centered; side columns hold HUD and instructions. */
import { CELL_PX, DEFAULT_GRID_H, DEFAULT_GRID_W } from "@phil-game/fow-shared";

/** Grid size in pixels (used to center the board). */
export const GRID_PX_W = DEFAULT_GRID_W * CELL_PX;
export const GRID_PX_H = DEFAULT_GRID_H * CELL_PX;

/** Left edge of the grid (centers 16×12 board in 1280px width). */
export const GRID_OFFSET_X = Math.floor((1280 - GRID_PX_W) / 2);

/**
 * Top edge of the grid — everything above is chrome (titles, mode, sidebars).
 * Keep this high enough that labels never overlap the board.
 */
export const GRID_OFFSET_Y = 168;

export { CELL_PX };
