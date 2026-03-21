import type { Unit } from "@phil-game/fow-shared";

/** HP line under unit icon (icon shows type). */
export function unitCellCaption(u: Unit, cellIndex: number): string {
  if (u.kind === "cannon") {
    return `${u.hp} HP`;
  }
  if (u.kind === "bunker") {
    if (cellIndex === 0) {
      return `${u.hp}/${u.maxHp} HP`;
    }
    return "·";
  }
  if (u.kind === "decoy") {
    if (cellIndex === 0) return `${u.maxHp} HP`;
    return "·";
  }
  return "?";
}
