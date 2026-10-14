import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { checkBudgets, formatRow } from "@squaredr/size-budget";

/**
 * `CORE-05` — the bundle size is asserted, not hoped for.
 *
 * The homepage states "~27 KB, Core gzipped" as a headline figure. It was
 * accurate when measured, but true by luck: nothing failed if a dependency
 * pushed it to 40. Meanwhile the react bundle had quietly reached 95.7 KB
 * while the site advertised 27, which is exactly the failure this prevents.
 *
 * Runs as a test because turbo makes `test` depend on `build`, so `dist/` is
 * guaranteed present.
 */

const PKG = resolve(__dirname, "..");

const BUDGETS = [
  {
    file: "dist/index.mjs",
    budgetKb: 30,
    note: "The public claim is ~27 KB. 30 gives headroom without letting it double.",
  },
];

describe("CORE-05 — bundle size budget", () => {
  it("stays within budget", () => {
    const rows = checkBudgets(PKG, BUDGETS);

    // Printed on every run, pass or fail. A deliberate increase should be a
    // visible decision in the log rather than something noticed months later.
    console.info("\ncore bundle:\n" + rows.map(formatRow).join("\n") + "\n");

    const over = rows.filter((r) => r.over);
    expect(
      over,
      over.length
        ? `Over budget:\n${over.map(formatRow).join("\n")}\n\n` +
            `If this increase is intended, raise the budget in this file and ` +
            `say why in the commit — and check whether the public figure on ` +
            `the site still matches.`
        : "",
    ).toEqual([]);
  });
});
