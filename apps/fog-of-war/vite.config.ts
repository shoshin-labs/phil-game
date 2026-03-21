import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/phil-game/" : "/",
  build: {
    outDir: "dist",
  },
}));
