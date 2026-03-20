export type {
  AxisDelta,
  AxisState,
  ChapterId,
  Choice,
  NarrativeGraph,
  NarrativeNode,
} from "./narrative/types";
export { FINALE_NODE_ID } from "./narrative/types";
export { INITIAL_AXES, applyAxisDelta, clampAxis } from "./narrative/state";
export { ATRIUM_BEAT_COUNT, atriumGraph } from "./narrative/atrium";
export { buildPortrait, portraitAsText } from "./narrative/finale";
