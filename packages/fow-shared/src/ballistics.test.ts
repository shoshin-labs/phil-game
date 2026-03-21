import { describe, expect, it } from "vitest";
import { DEFAULT_GRID_H, DEFAULT_GRID_W } from "./constants";
import {
  cellCenterWorld,
  launchOriginForPlayer,
  sampleShotTrajectory,
  simulateShot,
} from "./ballistics";
import type { AimInput, Unit } from "./types";

describe("ballistics", () => {
  const blocked = Array.from({ length: DEFAULT_GRID_H }, () =>
    Array(DEFAULT_GRID_W).fill(false),
  );

  it("finds an impact in opponent half for a forward shot from A", () => {
    const origin = launchOriginForPlayer("A", [], DEFAULT_GRID_W, DEFAULT_GRID_H);
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

  it("sampleShotTrajectory returns a polyline for preview", () => {
    const origin = launchOriginForPlayer("A", [], DEFAULT_GRID_W, DEFAULT_GRID_H);
    const aim: AimInput = { angleRad: -0.45, power: 0.85 };
    const pts = sampleShotTrajectory(
      origin,
      aim,
      DEFAULT_GRID_W,
      DEFAULT_GRID_H,
      blocked,
      [],
      4,
    );
    expect(pts.length).toBeGreaterThanOrEqual(2);
  });

  it("launch origin uses first surviving cannon cell center", () => {
    const units: Unit[] = [
      {
        id: "c1",
        owner: "A",
        kind: "cannon",
        cells: [{ row: 4, col: 2 }],
        hp: 2,
        maxHp: 2,
      },
    ];
    const o = launchOriginForPlayer("A", units, DEFAULT_GRID_W, DEFAULT_GRID_H);
    const want = cellCenterWorld({ row: 4, col: 2 });
    expect(o.x).toBeCloseTo(want.x);
    expect(o.y).toBeCloseTo(want.y);
  });
});
