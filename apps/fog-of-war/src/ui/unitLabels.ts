import type { Unit } from "@phil-game/fow-shared";

/** Per-cell caption so 2×1 units show both tiles (not “B4” style). */
export function unitCellCaption(u: Unit, cellIndex: number): string {
  if (u.kind === "cannon") {
    return `Cannon\n${u.hp} HP`;
  }
  if (u.kind === "bunker") {
    if (cellIndex === 0) {
      return `Bunker\n${u.hp}/${u.maxHp} HP`;
    }
    return "2×1\n(2 of 2)";
  }
  if (u.kind === "decoy") {
    if (cellIndex === 0) return `Decoy\n${u.maxHp} HP`;
    return "·\n(tile 2)";
  }
  return "?";
}
