import './styles.css';

type Row = {
  label: string;
  hosted: string;
  hostedDanger?: boolean;
  diy: string;
  fc: string;
};

const rows: Row[] = [
  {
    label: 'Where data lives',
    hosted: 'Vendor\u2019s database',
    diy: 'Yours',
    fc: 'Yours, self-hosted',
  },
  {
    label: 'Recurring cost',
    hosted: 'Monthly, per volume',
    diy: 'None, but engineering time',
    fc: 'None',
  },
  {
    label: 'Field types',
    hosted: 'Whatever the vendor ships',
    diy: 'Each one you write',
    fc: '44 included, extensible',
  },
  {
    label: 'Conditional logic',
    hosted: 'Configured in their UI',
    diy: 'From scratch',
    fc: 'In the schema, or your own',
  },
  {
    label: 'Multi-step & drafts',
    hosted: 'Vendor-styled, vendor-stored',
    diy: 'From scratch',
    fc: 'Built in, with branching',
  },
  {
    label: 'If you walk away',
    hosted: 'Forms stop working',
    hostedDanger: true,
    diy: 'You maintain it forever',
    fc: 'MIT source, keeps running',
  },
];

export function ComparisonTable() {
  return (
    <section id="compare" className="fc-compare">
      <div className="fc-compare__inner">
        <div className="fc-compare__eyebrow">09 &middot; How it compares</div>
        <h2 className="fc-compare__h2">
          Rent it, build it, or own it.
        </h2>

        <div className="fc-compare__table">
          {/* Header row */}
          <div className="fc-compare__row fc-compare__row--header">
            <div className="fc-compare__header" />
            <div className="fc-compare__header">Hosted service</div>
            <div className="fc-compare__header">Build it yourself</div>
            <div className="fc-compare__header fc-compare__header--fc">
              FieldCraft
            </div>
          </div>

          {/* Data rows */}
          {rows.map((row) => (
            <div key={row.label} className="fc-compare__row">
              <div className="fc-compare__cell fc-compare__cell--label">
                {row.label}
              </div>
              <div
                className={`fc-compare__cell ${
                  row.hostedDanger
                    ? 'fc-compare__cell--danger'
                    : 'fc-compare__cell--muted'
                }`}
              >
                {row.hosted}
              </div>
              <div className="fc-compare__cell fc-compare__cell--muted">
                {row.diy}
              </div>
              <div className="fc-compare__cell fc-compare__cell--fc">
                {row.fc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
