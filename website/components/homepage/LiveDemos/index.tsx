import { LiveDemosTabs } from './LiveDemosTabs';
import './styles.css';

export function LiveDemos() {
  return (
    <section id="demos" className="fc-demos">
      <div className="fc-demos__inner">
        <div className="fc-demos__eyebrow">04 &middot; Live demos</div>
        <h2 className="fc-demos__h2">
          What JSON can do. Running here, on this page.
        </h2>
        <p className="fc-demos__sub">
          These four demos are the engine&rsquo;s core behaviours &mdash;
          multi-step navigation, conditional visibility, real-time validation
          and computed fields &mdash; running live in your browser.
        </p>
        <LiveDemosTabs />
      </div>
    </section>
  );
}
