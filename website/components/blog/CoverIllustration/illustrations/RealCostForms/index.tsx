import './styles.css';

export function RealCostForms() {
  return (
    <div className="fc-illus-cost">
      {/* Visible: simple form */}
      <div className="fc-illus-cost__visible">
        <div className="fc-illus-cost__bar w-2/5" />
        <div className="fc-illus-cost__input" />
        <div className="fc-illus-cost__btn" />
      </div>

      {/* Waterline */}
      <div className="fc-illus-cost__waterline" />

      {/* Hidden: complexity stack */}
      <div className="fc-illus-cost__hidden">
        <div className="fc-illus-cost__row">
          <div className="fc-illus-cost__bar w-3/5" />
          <div className="fc-illus-cost__bar w-1/3" />
        </div>
        <div className="fc-illus-cost__row">
          <div className="fc-illus-cost__bar fc-illus-cost__bar--teal w-4/5" />
        </div>
        <div className="fc-illus-cost__row">
          <div className="fc-illus-cost__bar w-2/5" />
          <div className="fc-illus-cost__bar w-2/5" />
        </div>
        <div className="fc-illus-cost__row">
          <div className="fc-illus-cost__bar fc-illus-cost__bar--teal w-1/2" />
          <div className="fc-illus-cost__bar w-1/4" />
        </div>
        <div className="fc-illus-cost__row">
          <div className="fc-illus-cost__bar w-full" />
        </div>
      </div>
    </div>
  );
}
