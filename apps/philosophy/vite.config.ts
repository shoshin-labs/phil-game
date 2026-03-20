import { defineConfig } from "vite";

/** GitHub Pages serves at /phil-game/; local dev uses /. */
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/phil-game/" : "/",
  build: {
    outDir: "dist",
  },
}));
