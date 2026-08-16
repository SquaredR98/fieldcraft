const specs = [
  { value: '44', label: 'Field types' },
  { value: '573', label: 'Tests passing' },
  { value: '6', label: 'Theme presets' },
  { value: '<15 KB', label: 'Core, minified' },
  { value: '1', label: 'Dependency \u00b7 zod' },
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
