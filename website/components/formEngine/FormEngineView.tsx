import Link from 'next/link';
import { CodeBlock } from '@/components/shared/CodeBlock';
import './styles.css';

interface FormEngineViewProps {
  fieldCount: number;
  operatorCount: number;
  validatorCount: number;
  templateCount: number;
}

const SCHEMA_EXAMPLE = `{
  "version": "1.0",
  "sections": [
    {
      "id": "contact",
      "title": "Get in touch",
      "questions": [
        { "id": "name",  "type": "short_text", "label": "Name", "required": true },
        { "id": "email", "type": "email",      "label": "Email", "required": true },
        {
          "id": "budget",
          "type": "single_select",
          "label": "Budget",
          "options": [
            { "value": "small", "label": "Under $5k" },
            { "value": "large", "label": "$5k+" }
          ]
        },
        {
          "id": "details",
          "type": "long_text",
          "label": "Tell us more",
          "showIf": { "field": "budget", "operator": "eq", "value": "large" }
        }
      ]
    }
  ]
}`;

export function FormEngineView({
  fieldCount,
  operatorCount,
  validatorCount,
  templateCount,
}: FormEngineViewProps) {
  return (
    <div className="fc-fe">
      <div className="fc-fe__backdrop" aria-hidden="true">
        <div className="fc-v2-grid fc-v2-grid--center" />
      </div>

      <div className="fc-fe__inner">
        <header className="fc-fe__masthead">
          <div className="fc-fe__eyebrow">Reference</div>
          <h1 className="fc-fe__h1">What is a form engine?</h1>
          <p className="fc-fe__lead">
            A form engine turns a data structure into a working form. You
            describe the fields, rules and flow once; the engine handles
            rendering, validation, conditional visibility, navigation and
            submission. The form becomes data you can version and review
            rather than components you maintain by hand.
          </p>
        </header>

        <section className="fc-fe__section">
          <h2>Form engine vs. form library</h2>
          <p>
            The terms get used interchangeably, but they solve different
            halves of the problem.
          </p>

          <div className="fc-fe__compare">
            <div className="fc-fe__compare-cell">
              <h3>A form library</h3>
              <p>
                Manages state, validation and submission for a form{' '}
                <em>you have already built</em>. You write the JSX for every
                field, wire each one to the library, and express conditional
                logic in your own component code.
              </p>
              <p className="fc-fe__compare-foot">
                You own the markup. The library owns the state.
              </p>
            </div>

            <div className="fc-fe__compare-cell" data-lead="">
              <h3>A form engine</h3>
              <p>
                Takes a description of the form and renders it. Fields,
                validation rules, conditional visibility, multi-step
                navigation and submission all come from the same object, so
                adding a question is a data change rather than a code change.
              </p>
              <p className="fc-fe__compare-foot">
                You own the schema. The engine owns the rest.
              </p>
            </div>
          </div>

          <p>
            Neither is better in the abstract. A library is the right tool for
            a login box. An engine earns its place when forms are numerous,
            change often, or are authored by someone who does not write React.
          </p>
        </section>

        <section className="fc-fe__section">
          <h2>What that looks like</h2>
          <p>
            This is a complete, working form — four fields, one of which
            appears only when the budget answer warrants it. There is no
            component code, and the conditional rule is a property rather
            than a branch.
          </p>
          <CodeBlock code={SCHEMA_EXAMPLE} lang="json" />
        </section>

        <section className="fc-fe__section">
          <h2>When you need one</h2>
          <ul className="fc-fe__list">
            <li>
              <strong>Many forms, one codebase.</strong> Intake, onboarding,
              surveys and applications share a renderer instead of each
              growing its own.
            </li>
            <li>
              <strong>Forms that change without a deploy.</strong> A schema can
              live in a database row, so editing a form is editing data.
            </li>
            <li>
              <strong>Non-developers authoring forms.</strong> JSON is
              reviewable by people who would not open a React file.
            </li>
            <li>
              <strong>Logic that outgrows components.</strong>{' '}
              <Link href="/conditional-logic-forms">Conditional visibility</Link>,
              computed fields and cross-field validation become unreadable as
              nested JSX long before they become hard as data.
            </li>
            <li>
              <strong>Forms you must audit.</strong> A schema diffs cleanly in
              review; a form spread across components does not.
            </li>
          </ul>

          <div className="fc-fe__callout">
            <p>
              <strong>When you do not.</strong> A single short form with no
              conditional logic is more code with an engine than without one.
              Reach for a library, or plain React.
            </p>
          </div>
        </section>

        <section className="fc-fe__section">
          <h2>What an engine has to do</h2>
          <p>
            A renderer that maps field types to components is not an engine.
            These are the parts that make it one.
          </p>

          <div className="fc-fe__grid">
            <article className="fc-fe__cell">
              <h3>Validate before it renders</h3>
              <p>
                A malformed schema should fail at load with a useful message,
                not halfway through a form a respondent is filling in.
              </p>
            </article>
            <article className="fc-fe__cell">
              <h3>Resolve conditions as a graph</h3>
              <p>
                Visibility and computed values depend on other answers, which
                depend on others. That is a dependency graph, and evaluating
                it in declaration order gets stale results.
              </p>
            </article>
            <article className="fc-fe__cell">
              <h3>Own navigation</h3>
              <p>
                If a question can be hidden, then step counts, progress and
                the meaning of &ldquo;next&rdquo; all change at runtime.
              </p>
            </article>
            <article className="fc-fe__cell">
              <h3>Separate delivery from rendering</h3>
              <p>
                Where a response goes is a deployment concern, not a form
                design one. The schema should not know your database.
              </p>
            </article>
          </div>
        </section>

        <section className="fc-fe__section">
          <h2>FieldCraft</h2>
          <p>
            FieldCraft is a schema-driven form engine for React, MIT licensed
            and self-hosted. {fieldCount} input field types,{' '}
            {operatorCount} condition operators, {validatorCount} validator
            rules and {templateCount} ready-made schemas. Responses go
            straight from the browser to an endpoint you control — there is no
            server of ours in the path.
          </p>

          <div className="fc-fe__actions">
            <Link href="/docs" className="fc-v2-cta">
              Read the docs <span className="fc-v2-cta__arrow">&rarr;</span>
            </Link>
            <Link href="/templates" className="fc-v2-btn">
              Browse templates
            </Link>
          </div>
        </section>

        {/* Outbound links make this a hub rather than a dead end:
            authority flows on to the posts, and a reader who wants
            depth has somewhere to go. */}
        <section className="fc-fe__section">
          <h2>Going deeper</h2>
          <ul className="fc-fe__links">
            <li>
              <Link href="/conditional-logic-forms">
                Conditional logic in React forms
              </Link>
              <span>Show, hide and branch as data rather than state.</span>
            </li>
            <li>
              <Link href="/blog/why-schema-driven">
                Why schema-driven forms
              </Link>
              <span>The argument for describing a form as data.</span>
            </li>
            <li>
              <Link href="/blog/schema-vs-code-driven-forms">
                Schema-driven vs code-driven forms
              </Link>
              <span>Where each approach stops paying off.</span>
            </li>
            <li>
              <Link href="/blog/build-multi-step-survey">
                Building a multi-step survey
              </Link>
              <span>Navigation and conditional logic in practice.</span>
            </li>
            <li>
              <Link href="/blog/fieldcraft-validation-pipeline">
                How validation runs
              </Link>
              <span>Schema validation, field rules and async checks.</span>
            </li>
            <li>
              <Link href="/docs/core-concepts/schema-anatomy">
                Schema anatomy
              </Link>
              <span>Every property, with types.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
