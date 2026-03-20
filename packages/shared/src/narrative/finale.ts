import type { AxisState } from "./types.js";

type Band = "low" | "mid" | "high";

function band(value: number): Band {
  if (value <= 33) return "low";
  if (value <= 66) return "mid";
  return "high";
}

const SKEPTICISM: Record<Band, string> = {
  low: "You reach for solid ground: clarity feels like something that can be earned, not merely suspected.",
  mid: "You hold doubt and conviction in the same hand—neither a fortress nor a void.",
  high: "You keep questions open; certainty feels like a rare visitor you rarely grant a long stay.",
};

const SELF_WORLD: Record<Band, string> = {
  low: "The self, for you, is a private thread—memory, intention, the story you tell under your breath.",
  mid: "You place the self neither inside nor outside alone, but in the hinge between mind and world.",
  high: "Meaning, for you, lives in the weave between minds—in testimony, relation, and shared world.",
};

const FLUX_FORM: Record<Band, string> = {
  low: "What matters ought to hold still long enough to be honored—principles as anchors, not chains.",
  mid: "You refuse the war between change and constancy; you negotiate truces between them.",
  high: "Becoming—not a finished thing—feels like the pulse of the real; forms are temporary gestures.",
};

/** Three short paragraphs for the finale “portrait.” */
export function buildPortrait(axes: AxisState): string[] {
  return [
    SKEPTICISM[band(axes.skepticism)],
    SELF_WORLD[band(axes.selfWorld)],
    FLUX_FORM[band(axes.fluxVsForm)],
  ];
}

export function portraitAsText(axes: AxisState): string {
  return buildPortrait(axes).join("\n\n");
}
