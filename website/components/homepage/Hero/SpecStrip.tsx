/*
 * The numbers under the hero.
 *
 * Rule 1: every figure is counted from source, and the comment says which
 * file, so the next person can re-count rather than trust this list.
 *
 *   fields      44 registry entries in packages/react/src/registry/
 *               default-registry.ts, minus the 10 structural types in
 *               isStructuralField() (core/src/engine/validation-runner.ts) —
 *               those render but never hold a value, so counting them
 *               inflates the figure by 30%.
 *   validators  z.literal entries in the validationRule union,
 *               core/src/schema/schema-validator.ts. This is the RUNTIME
 *               list. The TS union in types/validation.ts declares 21, of
 *               which 7 are unimplemented — see CORE-12. The figure here was
 *               27 until 2026-10-14, which matched neither (WEB-10).
 *   operators   ConditionOperator union, core/src/types/conditions.ts.
 *   tests       full `pnpm -r test`: 845 core + 381 react + 102 templates
 *               + 56 adapters.
 *   size        gzipped dist/index.mjs, asserted by the CORE-05 budget test
 *               rather than measured by hand. "~28 KB" stays an
 *               approximation on purpose: a precise figure on a marketing
 *               page goes stale on the next dependency bump.
 */
import { SpecCounter } from './SpecCounter';

const specs = [
  { value: '34', label: 'Input field types' },
  { value: '25', label: 'Condition operators' },
  { value: '14', label: 'Built-in validators' },
  { value: '1,384', label: 'Tests passing' },
  { value: '~28 KB', label: 'Core, gzipped' },
];

export function SpecStrip() {
  return (
    <div className="fc-spec-strip">
      <div className="fc-spec-strip__inner">
        {specs.map((s) => (
          <div key={s.label} className="fc-spec-strip__cell">
            <div className="fc-spec-strip__head">
              <div className="fc-spec-strip__pip" />
              <div className="fc-spec-strip__value">
                <SpecCounter value={s.value} />
              </div>
            </div>
            <div className="fc-spec-strip__label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
