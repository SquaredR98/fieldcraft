import './styles.css';

export function ConversationalForms() {
  return (
    <div className="fc-illus-convo">
      {/* Single question card */}
      <div className="fc-illus-convo__card">
        <div className="fc-illus-convo__label w-3/5" />
        <div className="fc-illus-convo__input">
          <div className="fc-illus-convo__input-text w-2/5" />
        </div>
        <div className="fc-illus-convo__footer">
          {/* Step dots */}
          <div className="fc-illus-convo__dots">
            <div className="fc-illus-convo__dot fc-illus-convo__dot--active" />
            <div className="fc-illus-convo__dot" />
            <div className="fc-illus-convo__dot" />
          </div>
          {/* Next arrow */}
          <div className="fc-illus-convo__next">
            <div className="fc-illus-convo__next-line" />
            <div className="fc-illus-convo__next-head" />
          </div>
        </div>
      </div>
    </div>
  );
}
