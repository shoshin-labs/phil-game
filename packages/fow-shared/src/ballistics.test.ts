import { describe, expect, it } from "vitest";
import { DEFAULT_GRID_H, DEFAULT_GRID_W } from "./constants";
import { launchOriginForPlayer, simulateShot } from "./ballistics";
import type { AimInput } from "./types";

describe("ballistics", () => {
  const blocked = Array.from({ length: DEFAULT_GRID_H }, () =>
    Array(DEFAULT_GRID_W).fill(false),
  );

  it("finds an impact in opponent half for a forward shot from A", () => {
    const origin = launchOriginForPlayer("A", DEFAULT_GRID_W, DEFAULT_GRID_H);
    const aim: AimInput = { angleRad: -0.45, power: 0.85 };
    const hit = simulateShot(
      origin,
      aim,
      DEFAULT_GRID_W,
      DEFAULT_GRID_H,
      blocked,
      [],
    );
    expect(hit.kind).not.toBe("miss");
    if (hit.cell) {
      expect(hit.cell.col).toBeGreaterThanOrEqual(8);
    }
  });
});
