/** Three hidden philosophical dimensions; 0–100, start at 50. */
export type AxisState = {
  skepticism: number;
  selfWorld: number;
  fluxVsForm: number;
};

export type AxisDelta = Partial<{
  skepticism: number;
  selfWorld: number;
  fluxVsForm: number;
}>;

export type Choice = {
  id: string;
  label: string;
  /** Next narrative node id, or `__finale__` to end the run. */
  nextId: string;
  delta?: AxisDelta;
};

/** Chamber arc for UI progress (see GameScene chapter strip). */
export type ChapterId = "atrium" | "knowledge" | "self" | "value";

export type NarrativeNode = {
  id: string;
  /** Shown above body copy (chamber name). */
  title: string;
  body: string;
  choices: Choice[];
  /** Where this beat sits in the Atrium arc. */
  chapter: ChapterId;
};

export type NarrativeGraph = {
  startId: string;
  nodes: Record<string, NarrativeNode>;
};

export const FINALE_NODE_ID = "__finale__";
