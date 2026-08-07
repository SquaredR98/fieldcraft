import './styles.css';

export function AdaptersOpenSource() {
  return (
    <div className="fc-illus-adapt">
      {/* Central hub */}
      <div className="fc-illus-adapt__hub">
        <div className="fc-illus-adapt__hub-inner" />
      </div>

      {/* Spokes */}
      <div className="fc-illus-adapt__spokes">
        {/* Top */}
        <div className="fc-illus-adapt__spoke fc-illus-adapt__spoke--top">
          <div className="fc-illus-adapt__spoke-line fc-illus-adapt__spoke-line--v" />
          <div className="fc-illus-adapt__node" />
        </div>
        {/* Right */}
        <div className="fc-illus-adapt__spoke fc-illus-adapt__spoke--right">
          <div className="fc-illus-adapt__spoke-line fc-illus-adapt__spoke-line--h" />
          <div className="fc-illus-adapt__node" />
        </div>
        {/* Bottom */}
        <div className="fc-illus-adapt__spoke fc-illus-adapt__spoke--bottom">
          <div className="fc-illus-adapt__spoke-line fc-illus-adapt__spoke-line--v" />
          <div className="fc-illus-adapt__node" />
        </div>
        {/* Left */}
        <div className="fc-illus-adapt__spoke fc-illus-adapt__spoke--left">
          <div className="fc-illus-adapt__spoke-line fc-illus-adapt__spoke-line--h" />
          <div className="fc-illus-adapt__node" />
        </div>
      </div>
    </div>
  );
}
