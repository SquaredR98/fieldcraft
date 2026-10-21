import type { CSSProperties } from 'react';

import { SpecCounter } from './SpecCounter';

/*
 * Rule 1 — every figure is counted from source. Where to re-count:
 *
 *   18      POST-SPLIT input types: 34 today, minus the 19 deprecated
 *           for removal 2027-07-01 (react/src/utils/deprecations.ts).
 *           We claim 18 because 34 becomes a lie on that date; this
 *           number can only go up.
 *   25      ConditionOperator union, core/src/types/conditions.ts
 *   14      z.literal entries in validationRule,
 *           core/src/schema/schema-validator.ts — the RUNTIME list.
 *           types/validation.ts declares 21, 7 unimplemented (CORE-12).
 *   1,384   full `pnpm -r test`. Will drop with the field split.
 *   ~28 KB  gzipped core, asserted by the CORE-05 budget test.
 *           Approximate on purpose. Will also drop with the split.
 *
 * `lead` marks the two figures a developer actually weighs — is it
 * tested, what does it cost.
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
            /* Entrance stagger: the cell's transition-delay is calc()'d
               from this, so the sequence costs no JS. */
            style={{ '--i': i } as CSSProperties}
          >
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
