import Link from 'next/link';
import { CodeBlock } from '@/components/shared/CodeBlock';
import './styles.css';

interface ConditionalLogicViewProps {
  operatorCount: number;
}

const IMPERATIVE = `function ApplicationForm() {
  const [employment, setEmployment] = useState('')
  const [hasKids, setHasKids] = useState(false)
  const [income, setIncome] = useState(0)

  const showEmployer = employment === 'employed' || employment === 'part-time'
  const showBusiness = employment === 'self-employed'
  const showDependants = hasKids
  const showSupport = hasKids && income < 40000

  return (
    <form>
      {/* ...and every one of these has to stay in sync by hand */}
      {showEmployer && <EmployerFields />}
      {showBusiness && <BusinessFields />}
      {showDependants && <DependantFields />}
      {showSupport && <SupportFields />}
    </form>
  )
}`;

const DECLARATIVE = `{
  "id": "employer",
  "type": "short_text",
  "label": "Employer name",
  "showIf": {
    "field": "employment",
    "operator": "in",
    "value": ["employed", "part-time"]
  }
}`;

const COMBINED = `{
  "id": "support",
  "type": "single_select",
  "label": "Do you receive support payments?",
  "showIf": {
    "combine": "AND",
    "conditions": [
      { "field": "hasKids", "operator": "eq", "value": true },
      { "field": "income", "operator": "lt", "value": 40000 }
    ]
  }
}`;

const JUMP = `{
  "id": "plan",
  "title": "Choose a plan",
  "exitAction": {
    "rules": [
      {
        "condition": { "field": "type", "operator": "eq", "value": "enterprise" },
        "jumpTo": "enterprise-details"
      }
    ],
    "default": "payment"
  }
}`;

export function ConditionalLogicView({
  operatorCount,
}: ConditionalLogicViewProps) {
  return (
    <div className="fc-cl">
      <div className="fc-cl__backdrop" aria-hidden="true">
        <div className="fc-v2-grid fc-v2-grid--center" />
      </div>

      <div className="fc-cl__inner">
        <header className="fc-cl__masthead">
          <div className="fc-cl__eyebrow">Reference</div>
          <h1 className="fc-cl__h1">Conditional logic in React forms</h1>
          <p className="fc-cl__lead">
            Showing a field only when an earlier answer warrants it is the
            point where most React forms start to rot. Done as component
            state it spreads across the file; done as data it stays one
            property on the field it belongs to.
          </p>
        </header>

        <section className="fc-cl__section">
          <h2>The problem with doing it in components</h2>
          <p>
            Four conditional fields in a form built the usual way. Nothing
            here is wrong, and it is already hard to read.
          </p>
          <CodeBlock code={IMPERATIVE} lang="tsx" />
          <p>
            The rules live in one place, the fields in another, and the state
            in a third. Adding a fifth condition means touching all three.
            Nothing tells you that <code>showSupport</code> depends on two
            answers, and nothing stops the next person adding a rule that
            contradicts an existing one.
          </p>
        </section>

        <section className="fc-cl__section">
          <h2>The same rule as data</h2>
          <p>
            The condition becomes a property of the field it governs. There is
            no state to keep in sync, because the rule is evaluated from the
            answers the engine already holds.
          </p>
          <CodeBlock code={DECLARATIVE} lang="json" />
          <p>
            That is the whole change. The field knows when it applies, so
            reading the field tells you the rule &mdash; and deleting the
            field deletes the rule with it.
          </p>
        </section>

        <section className="fc-cl__section">
          <h2>Combining conditions</h2>
          <p>
            Conditions nest with <code>AND</code> and <code>OR</code>, to any
            depth. This is the <code>showSupport</code> rule from the first
            example, which took two pieces of derived state.
          </p>
          <CodeBlock code={COMBINED} lang="json" />
        </section>

        <section className="fc-cl__section">
          <h2>Branching whole sections</h2>
          <p>
            Conditions are not only for fields. A section can decide where the
            form goes next, which is how a questionnaire skips a branch that
            does not apply rather than showing empty steps.
          </p>
          <CodeBlock code={JUMP} lang="json" />
          <p>
            Because the engine owns navigation, progress and step counts
            follow the branch automatically &mdash; the thing that is most
            often wrong in hand-built multi-step forms.
          </p>
        </section>

        <section className="fc-cl__section">
          <h2>What you can compare</h2>
          <p>
            {operatorCount} operators, covering equality, ordering, set
            membership, presence, substring and pattern matching, dates,
            array contents and length.
          </p>

          <div className="fc-cl__ops">
            <div className="fc-cl__op-group">
              <h3>Equality &amp; order</h3>
              <code>eq neq gt gte lt lte between</code>
            </div>
            <div className="fc-cl__op-group">
              <h3>Sets &amp; presence</h3>
              <code>in notIn exists notExists isEmpty isNotEmpty</code>
            </div>
            <div className="fc-cl__op-group">
              <h3>Text</h3>
              <code>
                contains notContains startsWith endsWith matches matchesRegex
              </code>
            </div>
            <div className="fc-cl__op-group">
              <h3>Dates &amp; arrays</h3>
              <code>
                dateAfter dateBefore arrayContains arrayNotContains
                lengthGreaterThan lengthLessThan
              </code>
            </div>
          </div>

          <div className="fc-cl__callout">
            <p>
              The same expression drives <code>showIf</code>,{' '}
              <code>disabled</code>, conditional <code>required</code> and
              section jump rules &mdash; one syntax to learn, not four.
            </p>
          </div>
        </section>

        <section className="fc-cl__section">
          <h2>Why the order matters</h2>
          <p>
            A field&rsquo;s visibility can depend on an answer that is itself
            computed from other answers. That makes the rules a dependency
            graph, not a list, and evaluating them in the order they happen to
            be written gives stale results on the first pass.
          </p>
          <p>
            An engine resolves the graph instead. It is the part that is
            tedious to get right by hand and invisible when it works &mdash;
            which is why hand-built conditional forms tend to be correct until
            the day someone adds a rule in the wrong place.
          </p>
        </section>

        <section className="fc-cl__section">
          <h2>Try it</h2>
          <p>
            The conditional demo on the homepage runs the real renderer
            against a real schema &mdash; tick the box and watch the field
            appear.
          </p>
          <div className="fc-cl__actions">
            <Link href="/#demos" className="fc-v2-cta">
              See the demo <span className="fc-v2-cta__arrow">&rarr;</span>
            </Link>
            <Link href="/docs/core-concepts/conditional-logic" className="fc-v2-btn">
              Read the docs
            </Link>
          </div>
        </section>

        <section className="fc-cl__section">
          <h2>Related</h2>
          <ul className="fc-cl__links">
            <li>
              <Link href="/form-engine">What is a form engine?</Link>
              <span>The category this belongs to.</span>
            </li>
            <li>
              <Link href="/blog/build-multi-step-survey">
                Building a multi-step survey
              </Link>
              <span>Branching and navigation end to end.</span>
            </li>
            <li>
              <Link href="/blog/why-schema-driven">
                Why schema-driven forms
              </Link>
              <span>The wider argument for forms as data.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
