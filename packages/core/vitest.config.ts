import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // playground/ is scratch space for learning — excluded so it never
    // affects the published test count (workspace Rule M3).
    // Run it explicitly: pnpm vitest --watch playground
    exclude: ["**/node_modules/**", "**/dist/**", "playground/**"],
  },
});
