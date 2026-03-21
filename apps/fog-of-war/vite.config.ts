import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/fog-of-war/" : "/",
  build: {
    outDir: "dist",
  },
}));
