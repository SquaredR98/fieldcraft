import type { CSSProperties } from 'react';

/*
 * The numbers under the hero.
 *
 * Rule 1: every figure is counted from source, and the comment says which
 * file, so the next person can re-count rather than trust this list.
 *
 *   fields      THE POST-SPLIT COUNT, not today's. The registry holds 44
 *               entries — 34 input types plus the 10 structural ones in
 *               isStructuralField() (core/src/engine/validation-runner.ts),
 *               which render but never hold a value. 19 of those input
 *               types are deprecated with a removal date of 2027-07-01
 *               (packages/react/src/utils/deprecations.ts), leaving 18.
 *
 *               18 is what we claim. "34" is accurate today and becomes a
 *               lie on the removal date, at which point every surface
 *               quoting it has to change at once — and anyone who chose
 *               FieldCraft on that number finds half of them gone. A
 *               figure with a shelf life does not belong on a landing
 *               page. This one can only ever go up.
 *   validators  z.literal entries in the validationRule union,
 *               core/src/schema/schema-validator.ts. This is the RUNTIME
 *               list. The TS union in types/validation.ts declares 21, of
 *               which 7 are unimplemented — see CORE-12. The figure here was
 *               27 until 2026-10-14, which matched neither (WEB-10).
 *   operators   ConditionOperator union, core/src/types/conditions.ts.
 *   tests       full `pnpm -r test`: 845 core + 381 react + 102 templates
 *               + 56 adapters. NOTE: this WILL drop when the 19 field
 *               components and their test files go. Left at today's
 *               figure deliberately — unlike the field count there is no
 *               fixed target to count toward, and inventing a post-split
 *               number nobody can verify is worse than updating this once.
 *   size        gzipped dist/index.mjs, asserted by the CORE-05 budget test
 *               rather than measured by hand. "~28 KB" stays an
 *               approximation on purpose: a precise figure on a marketing
 *               page goes stale on the next dependency bump. Same caveat
 *               as tests — it should fall when the fields leave.
 *
 * Operators and validators are unaffected by the split: both live in
 * core and do not depend on which field components ship.
 */
import { SpecCounter } from './SpecCounter';

/*
 * HIERARCHY — the five figures are three different kinds of claim:
 *
 *   18 / 25 / 14   inventory: how much there is
 *   1,384          assurance: that it works
 *   ~28 KB         cost: what it weighs
 *
 * Five identical cells made them read as one undifferentiated set, so
 * nothing led and the two a developer actually weighs — is it tested, what
 * does it cost — sat level with "25 condition operators".
 *
 * The fix is weight, NOT structure. Merging the three inventory numbers
 * into one cell was considered and rejected: every evidence grid on this
 * page is one-cell-one-claim, SpecCounter animates a single value, and the
 * pip marks one figure — a composite cell would have broken all three and
 * forced a second value size into the same strip. So the contract holds
 * (one cell, one number, one pip, one counter) and `lead` marks the two
 * that carry the argument, using the same --lead-plate + --e2/--e3
 * treatment the Status section uses for the cell people come to read.
 */
const specs = [
  { value: '18', label: 'Input field types' },
  { value: '25', label: 'Condition operators' },
  { value: '14', label: 'Built-in validators' },
  { value: '1,384', label: 'Tests passing', lead: true },
  { value: '~28 KB', label: 'Core, gzipped', lead: true },
];

export function SpecStrip() {
  return (
    <section className="fc-spec-strip">
      <div className="fc-spec-strip__inner">
        {specs.map((s, i) => (
          <article
            key={s.label}
            className="fc-spec-strip__cell"
            data-lead={s.lead ? '' : undefined}
            /* Drives the entrance stagger from CSS — the cell's own
               transition-delay is calc()'d from it. Set here, server
               side, so the sequence costs no timers and no JavaScript. */
            style={{ '--i': i } as CSSProperties}
          >
            {/* No classes inside the cell: there is one of each element,
                so `.fc-spec-strip__cell b` and `… small` are exact. */}
            <b>
              <i aria-hidden="true" />
              <SpecCounter value={s.value} />
            </b>
            <small>{s.label}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
