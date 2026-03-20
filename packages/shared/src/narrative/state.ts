import type { AxisDelta, AxisState } from "./types";

export const INITIAL_AXES: AxisState = {
  skepticism: 50,
  selfWorld: 50,
  fluxVsForm: 50,
};

export function clampAxis(n: number): number {
  return Math.min(100, Math.max(0, n));
}

export function applyAxisDelta(state: AxisState, delta?: AxisDelta): AxisState {
  if (!delta) return state;
  return {
    skepticism: clampAxis(state.skepticism + (delta.skepticism ?? 0)),
    selfWorld: clampAxis(state.selfWorld + (delta.selfWorld ?? 0)),
    fluxVsForm: clampAxis(state.fluxVsForm + (delta.fluxVsForm ?? 0)),
  };
}
