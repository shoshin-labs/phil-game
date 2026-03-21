import { describe, expect, it } from "vitest";
import { splitColumn } from "./constants";
import { opponentOf, playerOwnsColumn } from "./grid";

describe("grid", () => {
  it("splits halves for 16-wide grid", () => {
    expect(splitColumn(16)).toBe(8);
    expect(playerOwnsColumn("A", 0, 16)).toBe(true);
    expect(playerOwnsColumn("A", 7, 16)).toBe(true);
    expect(playerOwnsColumn("A", 8, 16)).toBe(false);
    expect(playerOwnsColumn("B", 8, 16)).toBe(true);
  });

  it("opponentOf", () => {
    expect(opponentOf("A")).toBe("B");
    expect(opponentOf("B")).toBe("A");
  });
});
