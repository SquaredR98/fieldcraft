/**
 * Gzipped size budget for the published bundles.
 *
 * Exists because the site advertised "~27 KB" while the react bundle had
 * grown to 95.7 KB and nothing guarded either figure. A public number with no
 * assertion behind it is true by luck.
 *
 * Deliberately measures the BUILT artifact, not the source. What a consumer
 * downloads is the only figure worth asserting, and it is affected by things
 * source size cannot see — a dependency bundled rather than externalised, a
 * tree-shake that stops working because a barrel file made everything
 * reachable.
 *
 * Run via each package's `test` script, which turbo makes depend on `build`,
 * so `dist/` is always present.
 */
import { gzipSync } from "node:zlib";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/** @typedef {{ file: string, budgetKb: number, note?: string }} Budget */

/**
 * Measures one file and returns its gzipped size in KB, to one decimal.
 * Throws if the file is missing — a budget that silently passes when the
 * artifact is absent is worse than no budget.
 */
export function gzipKb(path) {
  if (!existsSync(path)) {
    throw new Error(
      `size-budget: ${path} does not exist. Run the package build first — ` +
        `turbo makes \`test\` depend on \`build\`, so this usually means the ` +
        `build failed silently.`,
    );
  }
  const bytes = gzipSync(readFileSync(path)).length;
  return Math.round((bytes / 1024) * 10) / 10;
}

/**
 * Checks every budget and returns a report.
 *
 * Reports every file rather than failing on the first, so one run tells you
 * the whole picture instead of one line at a time.
 *
 * @param {string} pkgDir absolute path to the package root
 * @param {Budget[]} budgets
 */
export function checkBudgets(pkgDir, budgets) {
  return budgets.map((b) => {
    const actual = gzipKb(resolve(pkgDir, b.file));
    const headroomKb = Math.round((b.budgetKb - actual) * 10) / 10;
    const headroomPct = Math.round((headroomKb / b.budgetKb) * 1000) / 10;
    return {
      file: b.file,
      actual,
      budget: b.budgetKb,
      over: actual > b.budgetKb,
      headroomKb,
      headroomPct,
      note: b.note,
    };
  });
}

/** Human-readable line, printed so a deliberate increase is a visible decision. */
export function formatRow(r) {
  const state = r.over ? "OVER" : "ok";
  return `  ${state.padEnd(5)} ${r.file.padEnd(28)} ${String(r.actual).padStart(6)} KB / ${String(r.budget).padStart(5)} KB budget  (${r.headroomKb >= 0 ? "+" : ""}${r.headroomKb} KB, ${r.headroomPct}%)`;
}
