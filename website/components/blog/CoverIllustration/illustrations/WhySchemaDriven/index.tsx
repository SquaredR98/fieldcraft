import './styles.css';

export function WhySchemaDriven() {
  return (
    <div className="fc-illus-schema">
      {/* Schema layer */}
      <div className="fc-illus-schema__layer">
        <span className="fc-illus-schema__tag">Schema</span>
        <div className="fc-illus-schema__rows">
          <div className="fc-illus-schema__kv">
            <div className="fc-illus-schema__key" />
            <div className="fc-illus-schema__val fc-illus-schema__val--teal w-3/5" />
          </div>
          <div className="fc-illus-schema__kv">
            <div className="fc-illus-schema__key" />
            <div className="fc-illus-schema__val w-4/5" />
          </div>
          <div className="fc-illus-schema__kv">
            <div className="fc-illus-schema__key" />
            <div className="fc-illus-schema__val fc-illus-schema__val--teal w-2/5" />
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="fc-illus-schema__sep" />

      {/* UI layer */}
      <div className="fc-illus-schema__layer">
        <span className="fc-illus-schema__tag">UI</span>
        <div className="fc-illus-schema__rows">
          <div className="fc-illus-schema__field">
            <div className="fc-illus-schema__label w-2/5" />
            <div className="fc-illus-schema__input" />
          </div>
          <div className="fc-illus-schema__field">
            <div className="fc-illus-schema__label w-1/2" />
            <div className="fc-illus-schema__input" />
          </div>
          <div className="fc-illus-schema__btn" />
        </div>
      </div>
    </div>
  );
}
