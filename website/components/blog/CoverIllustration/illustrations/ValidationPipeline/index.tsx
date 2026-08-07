import './styles.css';

export function ValidationPipeline() {
  return (
    <div className="fc-illus-valid">
      {/* Layer 1: Field */}
      <div className="fc-illus-valid__layer fc-illus-valid__layer--active">
        <span className="fc-illus-valid__tag">Field</span>
        <div className="fc-illus-valid__bars">
          <div className="fc-illus-valid__bar fc-illus-valid__bar--teal w-3/5" />
          <div className="fc-illus-valid__bar w-4/5" />
        </div>
      </div>

      {/* Arrow down */}
      <div className="fc-illus-valid__arrow">
        <div className="fc-illus-valid__arrow-line" />
        <div className="fc-illus-valid__arrow-head" />
      </div>

      {/* Layer 2: Cross-field */}
      <div className="fc-illus-valid__layer">
        <span className="fc-illus-valid__tag">Cross</span>
        <div className="fc-illus-valid__bars">
          <div className="fc-illus-valid__bar w-4/5" />
          <div className="fc-illus-valid__bar w-2/5" />
        </div>
      </div>

      {/* Arrow down */}
      <div className="fc-illus-valid__arrow">
        <div className="fc-illus-valid__arrow-line" />
        <div className="fc-illus-valid__arrow-head" />
      </div>

      {/* Layer 3: Submit */}
      <div className="fc-illus-valid__layer">
        <span className="fc-illus-valid__tag">Submit</span>
        <div className="fc-illus-valid__bars">
          <div className="fc-illus-valid__bar w-full" />
        </div>
      </div>
    </div>
  );
}
