import './styles.css';

export function AccessibleFormsGuide() {
  return (
    <div className="fc-illus-a11y">
      {/* Form mockup */}
      <div className="fc-illus-a11y__form">
        <div className="fc-illus-a11y__field">
          <div className="fc-illus-a11y__label w-2/5" />
          <div className="fc-illus-a11y__input" />
        </div>
        <div className="fc-illus-a11y__field">
          <div className="fc-illus-a11y__label w-3/5" />
          <div className="fc-illus-a11y__input" />
        </div>
        <div className="fc-illus-a11y__field">
          <div className="fc-illus-a11y__label w-1/3" />
          <div className="fc-illus-a11y__input" />
        </div>
      </div>

      {/* Annotation callouts */}
      <div className="fc-illus-a11y__callouts">
        <div className="fc-illus-a11y__callout">
          <div className="fc-illus-a11y__line" />
          <div className="fc-illus-a11y__badge">
            <span className="fc-illus-a11y__check">&#x2713;</span>
            <span className="fc-illus-a11y__text">label</span>
          </div>
        </div>
        <div className="fc-illus-a11y__callout">
          <div className="fc-illus-a11y__line" />
          <div className="fc-illus-a11y__badge">
            <span className="fc-illus-a11y__check">&#x2713;</span>
            <span className="fc-illus-a11y__text">role</span>
          </div>
        </div>
        <div className="fc-illus-a11y__callout">
          <div className="fc-illus-a11y__line" />
          <div className="fc-illus-a11y__badge">
            <span className="fc-illus-a11y__check">&#x2713;</span>
            <span className="fc-illus-a11y__text">focus</span>
          </div>
        </div>
      </div>
    </div>
  );
}
