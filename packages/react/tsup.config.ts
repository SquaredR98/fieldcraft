import { defineConfig } from "tsup";
import path from "path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  treeshake: true,
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve(__dirname, "src"),
    };
  },
});
