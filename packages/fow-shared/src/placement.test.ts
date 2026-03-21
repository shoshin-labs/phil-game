import { describe, expect, it } from "vitest";
import { createInitialGameState } from "./game-state";
import { hasBunker, placeUnit, quotaMet } from "./placement";

describe("placement", () => {
  it("places a bunker on player A half", () => {
    let s = createInitialGameState(16, 12);
    const r = placeUnit(s, "A", "bunker", { row: 2, col: 0 }, true);
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      s = r.state;
      expect(s.units).toHaveLength(1);
      expect(hasBunker(s, "A")).toBe(true);
    }
  });

  it("rejects overlap", () => {
    let s = createInitialGameState(16, 12);
    const a = placeUnit(s, "A", "cannon", { row: 0, col: 0 }, true);
    if ("error" in a) throw new Error(String(a.error));
    s = a.state;
    const b = placeUnit(s, "A", "cannon", { row: 0, col: 0 }, true);
    expect("error" in b).toBe(true);
  });

  it("rejects placing more cannons than the quota allows", () => {
    let s = createInitialGameState(16, 12);
    const a = placeUnit(s, "A", "cannon", { row: 0, col: 0 }, true);
    if ("error" in a) throw new Error(String(a.error));
    s = a.state;
    const b = placeUnit(s, "A", "cannon", { row: 2, col: 2 }, true);
    if ("error" in b) throw new Error(String(b.error));
    s = b.state;
    const c = placeUnit(s, "A", "cannon", { row: 4, col: 4 }, true);
    expect("error" in c).toBe(true);
  });

  it("quotaMet after placing two cannons and one bunker", () => {
    let s = createInitialGameState(16, 12);
    const placements: { kind: "cannon" | "bunker"; row: number; col: number; h: boolean }[] = [
      { kind: "cannon", row: 0, col: 0, h: true },
      { kind: "cannon", row: 2, col: 2, h: true },
      { kind: "bunker", row: 4, col: 0, h: true },
    ];
    for (const p of placements) {
      const r = placeUnit(s, "A", p.kind, { row: p.row, col: p.col }, p.h);
      if ("error" in r) throw new Error(`${p.kind}: ${r.error}`);
      s = r.state;
    }
    expect(quotaMet(s, "A")).toBe(true);
  });
});
