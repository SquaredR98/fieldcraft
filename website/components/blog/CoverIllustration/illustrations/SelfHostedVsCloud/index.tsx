import './styles.css';

export function SelfHostedVsCloud() {
  return (
    <div className="fc-illus-host">
      {/* Self-hosted column */}
      <div className="fc-illus-host__col">
        <span className="fc-illus-host__tag">Self-hosted</span>
        <div className="fc-illus-host__card">
          {/* Server rack bars */}
          <div className="fc-illus-host__rack">
            <div className="fc-illus-host__rack-row">
              <div className="fc-illus-host__rack-dot fc-illus-host__rack-dot--teal" />
              <div className="fc-illus-host__bar w-3/5" />
            </div>
            <div className="fc-illus-host__rack-row">
              <div className="fc-illus-host__rack-dot" />
              <div className="fc-illus-host__bar w-4/5" />
            </div>
            <div className="fc-illus-host__rack-row">
              <div className="fc-illus-host__rack-dot fc-illus-host__rack-dot--teal" />
              <div className="fc-illus-host__bar w-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="fc-illus-host__divider">
        <div className="fc-illus-host__divider-line" />
        <span className="fc-illus-host__divider-text">vs</span>
        <div className="fc-illus-host__divider-line" />
      </div>

      {/* Cloud column */}
      <div className="fc-illus-host__col">
        <span className="fc-illus-host__tag">Cloud</span>
        <div className="fc-illus-host__card">
          {/* Cloud shape + bars */}
          <div className="fc-illus-host__cloud-shape" />
          <div className="fc-illus-host__bar w-4/5" />
          <div className="fc-illus-host__bar fc-illus-host__bar--teal w-3/5" />
          <div className="fc-illus-host__bar w-2/5" />
        </div>
      </div>
    </div>
  );
}
