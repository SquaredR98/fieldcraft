import './styles.css';

export function BuildMultiStepSurvey() {
  return (
    <div className="fc-illus-steps">
      {/* Step 1 — active */}
      <div className="fc-illus-steps__step fc-illus-steps__step--active">
        <div className="fc-illus-steps__dot fc-illus-steps__dot--active" />
        <div className="fc-illus-steps__card">
          <div className="fc-illus-steps__bar w-3/5" />
          <div className="fc-illus-steps__bar fc-illus-steps__bar--teal w-4/5" />
          <div className="fc-illus-steps__bar w-2/5" />
        </div>
      </div>

      {/* Connector */}
      <div className="fc-illus-steps__line" />

      {/* Step 2 */}
      <div className="fc-illus-steps__step">
        <div className="fc-illus-steps__dot" />
        <div className="fc-illus-steps__card">
          <div className="fc-illus-steps__bar w-4/5" />
          <div className="fc-illus-steps__bar w-3/5" />
          <div className="fc-illus-steps__bar w-full" />
        </div>
      </div>

      {/* Connector */}
      <div className="fc-illus-steps__line" />

      {/* Step 3 */}
      <div className="fc-illus-steps__step">
        <div className="fc-illus-steps__dot" />
        <div className="fc-illus-steps__card">
          <div className="fc-illus-steps__bar w-2/5" />
          <div className="fc-illus-steps__bar w-3/5" />
        </div>
      </div>
    </div>
  );
}
