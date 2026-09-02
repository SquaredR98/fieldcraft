const specs = [
  { value: '1,151', label: 'Tests passing' },
  { value: '27', label: 'Built-in validators' },
  { value: '25', label: 'Condition operators' },
  { value: '~27 KB', label: 'Core, gzipped' },
  { value: '4', label: 'Packages' },
];

export function SpecStrip() {
  return (
    <div className="fc-spec-strip">
      <div className="fc-spec-strip__inner">
        {specs.map((s) => (
          <div key={s.label} className="fc-spec-strip__cell">
            <div className="fc-spec-strip__value">{s.value}</div>
            <div className="fc-spec-strip__label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
