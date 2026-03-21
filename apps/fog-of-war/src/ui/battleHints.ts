import type { TrajectoryHit } from "@phil-game/fow-shared";

export function labelHitKind(kind: TrajectoryHit["kind"]): string {
  switch (kind) {
    case "unit":
      return "hits a unit";
    case "terrain":
      return "hits blocked ground";
    case "miss":
      return "misses (no collision)";
    case "out_of_bounds":
      return "leaves the map";
  }
}
