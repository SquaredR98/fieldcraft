import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "postgres/index": "src/postgres/index.ts",
    "supabase/index": "src/supabase/index.ts",
    "webhook/index": "src/webhook/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: false,
  clean: true,
  external: [
    "@squaredr/fieldcraft-core",
    "@supabase/supabase-js",
    "drizzle-orm",
    "drizzle-orm/postgres-js",
    "postgres",
    "@paralleldrive/cuid2",
  ],
  treeshake: true,
});
