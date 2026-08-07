import './styles.css';

export function IntroducingFieldCraft() {
  return (
    <div className="fc-illus-intro">
      {/* JSON schema block */}
      <div className="fc-illus-intro__card fc-illus-intro__card--ruled">
        <span className="fc-illus-intro__brace">{'{'}</span>
        <div className="fc-illus-intro__indent">
          <div className="fc-illus-intro__kv">
            <div className="fc-illus-intro__key" />
            <div className="fc-illus-intro__val fc-illus-intro__val--teal w-3/5" />
          </div>
          <div className="fc-illus-intro__kv">
            <div className="fc-illus-intro__key" />
            <div className="fc-illus-intro__val w-4/5" />
          </div>
          <div className="fc-illus-intro__kv">
            <div className="fc-illus-intro__key" />
            <div className="fc-illus-intro__val fc-illus-intro__val--teal w-2/5" />
          </div>
          <div className="fc-illus-intro__kv">
            <div className="fc-illus-intro__key" />
            <div className="fc-illus-intro__val w-3/5" />
          </div>
          <div className="fc-illus-intro__kv">
            <div className="fc-illus-intro__key" />
            <div className="fc-illus-intro__val fc-illus-intro__val--teal w-full" />
          </div>
        </div>
        <span className="fc-illus-intro__brace">{'}'}</span>
      </div>

      {/* Arrow */}
      <div className="fc-illus-intro__arrow">
        <div className="fc-illus-intro__arrow-line" />
        <div className="fc-illus-intro__arrow-head" />
      </div>

      {/* Form UI block */}
      <div className="fc-illus-intro__card fc-illus-intro__card--teal fc-illus-intro__card--wide">
        {/* Field 1 */}
        <div className="fc-illus-intro__field">
          <div className="fc-illus-intro__label w-2/5" />
          <div className="fc-illus-intro__input">
            <div className="fc-illus-intro__input-text w-3/5" />
          </div>
        </div>
        {/* Field 2 */}
        <div className="fc-illus-intro__field">
          <div className="fc-illus-intro__label w-3/5" />
          <div className="fc-illus-intro__input">
            <div className="fc-illus-intro__input-text w-2/5" />
          </div>
        </div>
        {/* Field 3: select */}
        <div className="fc-illus-intro__field">
          <div className="fc-illus-intro__label w-1/3" />
          <div className="fc-illus-intro__select">
            <div className="fc-illus-intro__input-text w-1/3" />
            <div className="fc-illus-intro__select-caret" />
          </div>
        </div>
        {/* Submit */}
        <div className="fc-illus-intro__btn" />
      </div>
    </div>
  );
}
