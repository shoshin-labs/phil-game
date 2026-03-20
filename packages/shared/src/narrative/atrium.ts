import type { NarrativeGraph } from "./types";

/** Beats from entry through sr_end (finale is separate). */
export const ATRIUM_BEAT_COUNT = 8;

/**
 * The Atrium — v1 narrative graph (see docs/GDD.md).
 * Three chambers: Knowledge → Self → Value → finale.
 */
export const atriumGraph: NarrativeGraph = {
  startId: "atrium_entry",
  nodes: {
    atrium_entry: {
      id: "atrium_entry",
      chapter: "atrium",
      title: "The Atrium",
      body: [
        "The shelves breathe. You don’t remember a door—only that the air tastes like old paper and distant rain.",
        "",
        "Somewhere, not quite a voice: *You may leave when you know what kind of walker you are.*",
      ].join("\n"),
      choices: [
        {
          id: "step_forward",
          label: "Walk deeper into the light.",
          nextId: "kh_1",
        },
      ],
    },
    kh_1: {
      id: "kh_1",
      chapter: "knowledge",
      title: "The Lantern Hall — Knowledge",
      body: [
        "A lantern hangs where a fact should be. Its light falls on a book that opens to a blank page.",
        "",
        "The page does not accuse you. It waits.",
      ].join("\n"),
      choices: [
        {
          id: "light_enough",
          label: "The light is enough to begin.",
          nextId: "kh_2",
          delta: { skepticism: -8, selfWorld: 6 },
        },
        {
          id: "earn_letters",
          label: "I won’t commit until the page earns its letters.",
          nextId: "kh_2",
          delta: { skepticism: 10, fluxVsForm: 5 },
        },
        {
          id: "write_first",
          label: "I will write the first line myself.",
          nextId: "kh_2",
          delta: { selfWorld: -8, fluxVsForm: 8 },
        },
      ],
    },
    kh_2: {
      id: "kh_2",
      chapter: "knowledge",
      title: "The Lantern Hall — Knowledge",
      body: [
        "When you touch the margin, the ink runs. A question forms without a mouth:",
        "",
        "*What failed first—your eyes, or the world?*",
      ].join("\n"),
      choices: [
        {
          id: "calibrate",
          label: "My eyes are instruments; they can be calibrated.",
          nextId: "mw_1",
          delta: { skepticism: -10 },
        },
        {
          id: "world_obligation",
          label: "The world owes me no obligation to stay sensible.",
          nextId: "mw_1",
          delta: { skepticism: 8, fluxVsForm: 6 },
        },
        {
          id: "both_blind",
          label: "Maybe both are too proud to admit they’re half-blind.",
          nextId: "mw_1",
          delta: { selfWorld: 10 },
        },
      ],
    },
    mw_1: {
      id: "mw_1",
      chapter: "self",
      title: "The Mirror Walk — Self",
      body: [
        "Mirrors line a corridor that should be too narrow for them. Your face returns a half-second late.",
        "",
        "The delay is not theatrical. It feels like evidence.",
      ].join("\n"),
      choices: [
        {
          id: "noticing_delay",
          label: "Whoever I am, I’m the one noticing the delay.",
          nextId: "mw_2",
          delta: { selfWorld: -10 },
        },
        {
          id: "others_see",
          label: "If others see me this way too, I’m not alone inside the glitch.",
          nextId: "mw_2",
          delta: { selfWorld: 12 },
        },
        {
          id: "refuse_glitch",
          label: "I refuse to identify with a malfunction.",
          nextId: "mw_2",
          delta: { fluxVsForm: 8 },
        },
      ],
    },
    mw_2: {
      id: "mw_2",
      chapter: "self",
      title: "The Mirror Walk — Self",
      body: [
        "A mirror asks a cruel, ordinary question:",
        "",
        "*If you forgot a whole year, did you survive it?*",
      ].join("\n"),
      choices: [
        {
          id: "story_continuity",
          label: "Continuity is a story; I can own the telling.",
          nextId: "sr_1",
          delta: { selfWorld: -8 },
        },
        {
          id: "others_remember",
          label: "Others remembering me holds me together.",
          nextId: "sr_1",
          delta: { selfWorld: 10 },
        },
        {
          id: "not_memories",
          label: "I am not a pile of memories with a name tag.",
          nextId: "sr_1",
          delta: { fluxVsForm: -8 },
        },
      ],
    },
    sr_1: {
      id: "sr_1",
      chapter: "value",
      title: "The Scale Room — Value",
      body: [
        "Scales balance a feather against a ledger. An inscription curls beneath them:",
        "",
        "*Sometimes the heavier thing is lighter.*",
      ].join("\n"),
      choices: [
        {
          id: "rules_break",
          label: "Rules matter because they can fail—not because they’re perfect.",
          nextId: "sr_2",
          delta: { fluxVsForm: 10 },
        },
        {
          id: "principles_hold",
          label: "A principle must hold still when the world convulses.",
          nextId: "sr_2",
          delta: { fluxVsForm: -10 },
        },
        {
          id: "care_heavy",
          label: "Care is heavier than proof.",
          nextId: "sr_2",
          delta: { selfWorld: 8 },
        },
      ],
    },
    sr_2: {
      id: "sr_2",
      chapter: "value",
      title: "The Scale Room — Value",
      body: [
        "The scale tips without being touched. You are offered two outcomes; both leave a bruise.",
        "",
        "There is no clever third option printed here—only your posture toward harm.",
      ].join("\n"),
      choices: [
        {
          id: "live_with",
          label: "Choose the outcome I can live beside afterward.",
          nextId: "sr_end",
          delta: { skepticism: -8 },
        },
        {
          id: "fewer_ghosts",
          label: "Choose the path that leaves fewer ghosts for others.",
          nextId: "sr_end",
          delta: { selfWorld: 10 },
        },
        {
          id: "refuse_frame",
          label: "Refuse the frame—demand a costlier, truer third.",
          nextId: "sr_end",
          delta: { skepticism: 10, fluxVsForm: 6 },
        },
      ],
    },
    sr_end: {
      id: "sr_end",
      chapter: "value",
      title: "The Atrium",
      body: [
        "The library exhales. Walls forget which way is inward.",
        "",
        "A mirror stands with nothing inside—only room for a sentence that was always going to be yours.",
      ].join("\n"),
      choices: [
        {
          id: "into_finale",
          label: "Listen.",
          nextId: "__finale__",
        },
      ],
    },
  },
};
