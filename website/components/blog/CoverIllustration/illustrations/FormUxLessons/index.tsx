import './styles.css';

export function FormUxLessons() {
  return (
    <div className="fc-illus-ux">
      <div className="fc-illus-ux__grid">
        {/* Vignette 1: label bar */}
        <div className="fc-illus-ux__cell">
          <div className="fc-illus-ux__bar w-3/5" />
          <div className="fc-illus-ux__bar fc-illus-ux__bar--teal w-full" />
        </div>
        {/* Vignette 2: input */}
        <div className="fc-illus-ux__cell">
          <div className="fc-illus-ux__input" />
        </div>
        {/* Vignette 3: dots */}
        <div className="fc-illus-ux__cell fc-illus-ux__cell--row">
          <div className="fc-illus-ux__dot fc-illus-ux__dot--active" />
          <div className="fc-illus-ux__dot" />
          <div className="fc-illus-ux__dot" />
        </div>
        {/* Vignette 4: two bars */}
        <div className="fc-illus-ux__cell">
          <div className="fc-illus-ux__bar w-4/5" />
          <div className="fc-illus-ux__bar w-2/5" />
        </div>
        {/* Vignette 5: checkbox */}
        <div className="fc-illus-ux__cell fc-illus-ux__cell--row">
          <div className="fc-illus-ux__checkbox" />
          <div className="fc-illus-ux__bar w-3/5" />
        </div>
        {/* Vignette 6: button */}
        <div className="fc-illus-ux__cell">
          <div className="fc-illus-ux__btn" />
        </div>
      </div>
    </div>
  );
}
