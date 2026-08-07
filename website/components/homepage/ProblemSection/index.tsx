import './styles.css';

const cards = [
  {
    kicker: 'Rented',
    title: 'Hosted form services',
    body: 'Your forms live on someone else\u2019s servers and your submissions sit in their database. The monthly bill never stops, and when it does, the forms go with it.',
  },
  {
    kicker: 'Licensed',
    title: 'Enterprise form SDKs',
    body: 'Annual seat licensing priced for procurement departments, not for a two-person team adding an intake form to a product.',
  },
  {
    kicker: 'Rebuilt',
    title: 'Rolling your own',
    body: 'Input libraries handle inputs. Step navigation, conditional visibility, scoring, calculated fields, draft recovery and submission fan-out are still yours to write and maintain.',
  },
];

export function ProblemSection() {
  return (
    <section className="fc-problem">
      <div className="fc-problem__inner">
        <div className="fc-problem__eyebrow">01 &middot; The problem</div>
        <h2 className="fc-problem__h2">
          Form tooling was not built for the people who ship forms.
        </h2>
        <p className="fc-problem__sub">
          You rent a hosted service, license an enterprise SDK, or build the
          whole thing yourself. Each choice costs you something you would rather
          keep.
        </p>
        <div className="fc-problem__grid">
          {cards.map((c) => (
            <div key={c.kicker} className="fc-problem__card">
              <div className="fc-problem__kicker">{c.kicker}</div>
              <div className="fc-problem__card-title">{c.title}</div>
              <div className="fc-problem__card-body">{c.body}</div>
            </div>
          ))}
        </div>
        <div className="fc-problem__callout">
          <div className="fc-problem__callout-dot" />
          <div className="fc-problem__callout-text">
            FieldCraft is the middle path: a complete form engine you install,
            own, and never pay rent on. MIT-licensed core and renderer. A
            one-time purchase if you want the visual builder.
          </div>
        </div>
      </div>
    </section>
  );
}
