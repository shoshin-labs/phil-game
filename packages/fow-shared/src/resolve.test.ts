import { describe, expect, it } from "vitest";
import { createInitialGameState } from "./game-state";
import { evaluateEnd, fireSonar, fireStandardShot } from "./resolve";
import type { GameState, Unit } from "./types";

function battleWithUnits(units: Unit[], active: "A" | "B" = "A"): GameState {
  const s = createInitialGameState();
  return {
    ...s,
    phase: "battle",
    activePlayer: active,
    units,
  };
}

describe("evaluateEnd", () => {
  it("declares B winner when A has no bunker alive", () => {
    const units: Unit[] = [
      {
        id: "b1",
        owner: "B",
        kind: "bunker",
        cells: [{ row: 1, col: 9 }],
        hp: 4,
        maxHp: 4,
      },
    ];
    const s = battleWithUnits(units, "A");
    const next = evaluateEnd(s);
    expect(next.phase).toBe("ended");
    expect(next.winner).toBe("B");
  });

  it("declares draw when both bunkers destroyed", () => {
    const units: Unit[] = [
      {
        id: "a1",
        owner: "A",
        kind: "bunker",
        cells: [{ row: 1, col: 1 }],
        hp: 0,
        maxHp: 4,
      },
      {
        id: "b1",
        owner: "B",
        kind: "bunker",
        cells: [{ row: 1, col: 9 }],
        hp: 0,
        maxHp: 4,
      },
    ];
    const next = evaluateEnd(battleWithUnits(units));
    expect(next.phase).toBe("ended");
    expect(next.winner).toBe("draw");
  });

  it("declares A winner when B bunker destroyed", () => {
    const units: Unit[] = [
      {
        id: "a1",
        owner: "A",
        kind: "bunker",
        cells: [{ row: 1, col: 1 }],
        hp: 4,
        maxHp: 4,
      },
      {
        id: "b1",
        owner: "B",
        kind: "bunker",
        cells: [{ row: 1, col: 9 }],
        hp: 0,
        maxHp: 4,
      },
    ];
    const next = evaluateEnd(battleWithUnits(units));
    expect(next.phase).toBe("ended");
    expect(next.winner).toBe("A");
  });

  it("continues battle when both bunkers alive", () => {
    const units: Unit[] = [
      {
        id: "a1",
        owner: "A",
        kind: "bunker",
        cells: [{ row: 1, col: 1 }],
        hp: 4,
        maxHp: 4,
      },
      {
        id: "b1",
        owner: "B",
        kind: "bunker",
        cells: [{ row: 1, col: 9 }],
        hp: 4,
        maxHp: 4,
      },
    ];
    const next = evaluateEnd(battleWithUnits(units));
    expect(next.phase).toBe("battle");
  });
});

describe("fireStandardShot", () => {
  it("rejects when not in battle", () => {
    const s = createInitialGameState();
    expect(s.phase).toBe("setup_a");
    const r = fireStandardShot(s, { angleRad: 0, power: 0.5 });
    expect("error" in r).toBe(true);
  });

  it("rejects when no standard ammo", () => {
    let s = battleWithUnits([]);
    s = {
      ...s,
      ammo: {
        A: { standard: 0, sonar: 2 },
        B: { standard: 12, sonar: 2 },
      },
    };
    const r = fireStandardShot(s, { angleRad: -0.4, power: 0.8 });
    expect("error" in r).toBe(true);
    if ("error" in r) expect(r.error).toMatch(/shell/i);
  });
});

describe("fireSonar", () => {
  it("rejects sonar on own half", () => {
    const s = battleWithUnits([]);
    const r = fireSonar(s, { row: 2, col: 2 });
    expect("error" in r).toBe(true);
  });

  it("reveals opponent cells on valid ping", () => {
    const s = battleWithUnits([]);
    const before = Object.keys(s.fogA).length;
    const r = fireSonar(s, { row: 2, col: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    const after = Object.keys(r.state.fogA).length;
    expect(after).toBeGreaterThan(before);
  });
});
