import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { checkBudgets, formatRow } from "@squaredr/size-budget";

/**
 * `CORE-05` — the react bundle is asserted too.
 *
 * This is the half that actually went wrong. The site advertised "~27 KB"
 * while react had reached 95.7 KB — 3.5x core — because nothing measured it.
 * A consumer downloads core + react + styles, so this is the figure that
 * matters most and the one nobody was watching.
 *
 * The budget is deliberately tight. `REACT-17` (lazy field registration)
 * should cut this substantially, and the budget must be revised DOWN when it
 * lands: a budget set above the achieved figure stops being a budget.
 */

const PKG = resolve(__dirname, "..");

const BUDGETS = [
  {
    file: "dist/index.mjs",
    budgetKb: 100,
    note:
      "95.7 KB measured 2026-10-11. ~4% headroom, deliberately tight. " +
      "REACT-17 should take this toward 30 — lower the budget when it does.",
  },
  {
    file: "dist/styles.css",
    budgetKb: 12,
    note: "9.4 KB measured 2026-10-11.",
  },
];

describe("CORE-05 — bundle size budget", () => {
  it("stays within budget", () => {
    const rows = checkBudgets(PKG, BUDGETS);
    console.info("\nreact bundle:\n" + rows.map(formatRow).join("\n") + "\n");

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

  it("the react bundle is the figure a consumer actually pays", () => {
    // Guards the framing, not just the number. "~27 KB" is core alone; the
    // site must keep saying "core" or state the real total.
    const rows = checkBudgets(PKG, BUDGETS);
    const js = rows.find((r) => r.file === "dist/index.mjs");
    expect(js!.actual).toBeGreaterThan(30);
  });
});
