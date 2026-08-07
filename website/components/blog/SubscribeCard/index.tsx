import './styles.css';

export function SubscribeCard() {
  return (
    <div className="fc-blog-subscribe">
      <div className="fc-blog-subscribe__eyebrow">Subscribe</div>
      <p className="fc-blog-subscribe__desc">
        One email per release. No marketing.
      </p>
      {/* TODO: Wire to email backend */}
      <div className="fc-blog-subscribe__form">
        <input
          type="email"
          placeholder="you@company.com"
          className="fc-blog-subscribe__input"
          aria-label="Email address"
          disabled
        />
        <button className="fc-blog-subscribe__join" disabled>
          Join
        </button>
      </div>
      <div className="fc-blog-subscribe__links">
        <span>RSS</span>
        <span>Atom</span>
        <a href="https://github.com/SquaredR98/fieldcraft/releases">
          Changelog
        </a>
      </div>
    </div>
  );
}
