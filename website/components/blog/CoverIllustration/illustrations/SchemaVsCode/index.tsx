import './styles.css';

export function SchemaVsCode() {
  return (
    <div className="fc-illus-vs">
      {/* Schema column */}
      <div className="fc-illus-vs__col">
        <span className="fc-illus-vs__tag">Schema</span>
        <div className="fc-illus-vs__card">
          <div className="fc-illus-vs__bar fc-illus-vs__bar--teal w-2/5" />
          <div className="fc-illus-vs__bar w-4/5" />
          <div className="fc-illus-vs__bar fc-illus-vs__bar--teal w-3/5" />
          <div className="fc-illus-vs__bar w-1/2" />
        </div>
      </div>

      {/* Divider */}
      <div className="fc-illus-vs__divider">
        <div className="fc-illus-vs__divider-line" />
        <span className="fc-illus-vs__divider-text">vs</span>
        <div className="fc-illus-vs__divider-line" />
      </div>

      {/* Code column */}
      <div className="fc-illus-vs__col">
        <span className="fc-illus-vs__tag">Code</span>
        <div className="fc-illus-vs__card">
          <div className="fc-illus-vs__bar w-3/5" />
          <div className="fc-illus-vs__indent">
            <div className="fc-illus-vs__bar w-4/5" />
            <div className="fc-illus-vs__bar w-3/5" />
          </div>
          <div className="fc-illus-vs__bar w-2/5" />
        </div>
      </div>
    </div>
  );
}
