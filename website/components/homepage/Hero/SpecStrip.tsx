/*
 * Counted from source, not estimated — see Rule 1 in CLAUDE.md.
 * fields: packages/react/src/registry/default-registry.ts
 * operators: packages/core/src/types/conditions.ts (ConditionOperator)
 * validators: packages/core/src/validators/built-in.ts (dispatch cases)
 * tests: full run — 824 core + 288 react + 56 adapters + 102 templates
 */
import { SpecCounter } from './SpecCounter';

const specs = [
  { value: '41', label: 'Field types' },
  { value: '27', label: 'Built-in validators' },
  { value: '25', label: 'Condition operators' },
  { value: '1,270', label: 'Tests passing' },
  { value: '~27 KB', label: 'Core, gzipped' },
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
