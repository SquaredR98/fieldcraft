import './styles.css';

export function BuildWithoutCode() {
  return (
    <div className="fc-illus-nocode">
      {/* Sidebar: field palette */}
      <div className="fc-illus-nocode__sidebar">
        <div className="fc-illus-nocode__item">
          <div className="fc-illus-nocode__item-icon" />
          <div className="fc-illus-nocode__bar w-3/5" />
        </div>
        <div className="fc-illus-nocode__item">
          <div className="fc-illus-nocode__item-icon" />
          <div className="fc-illus-nocode__bar w-2/5" />
        </div>
        <div className="fc-illus-nocode__item">
          <div className="fc-illus-nocode__item-icon" />
          <div className="fc-illus-nocode__bar w-1/2" />
        </div>
      </div>

      {/* Canvas: placed fields */}
      <div className="fc-illus-nocode__canvas">
        <div className="fc-illus-nocode__field">
          <div className="fc-illus-nocode__label w-2/5" />
          <div className="fc-illus-nocode__input" />
        </div>
        <div className="fc-illus-nocode__field">
          <div className="fc-illus-nocode__label w-3/5" />
          <div className="fc-illus-nocode__input" />
        </div>
        <div className="fc-illus-nocode__btn" />
      </div>
    </div>
  );
}
