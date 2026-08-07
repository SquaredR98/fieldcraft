import Link from 'next/link';
import './styles.css';

export function Logo() {
  return (
    <Link href="/" className="fc-logo">
      <div className="fc-logo-bars">
        <div className="fc-logo-bar fc-logo-bar--outlined" />
        <div className="fc-logo-bar fc-logo-bar--filled" />
        <div className="fc-logo-bar fc-logo-bar--amber" />
      </div>
      <div className="fc-logo-text">
        <div className="fc-logo-wordmark">FieldCraft</div>
        <div className="fc-logo-endorsement">by SquaredR</div>
      </div>
    </Link>
  );
}
