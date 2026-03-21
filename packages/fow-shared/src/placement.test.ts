import { describe, expect, it } from "vitest";
import { createInitialGameState } from "./game-state";
import { hasBunker, placeUnit } from "./placement";

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
});
