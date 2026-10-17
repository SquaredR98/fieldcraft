'use client';

import { useState } from 'react';
import { MultiStepDemo } from './demos/MultiStepDemo';
import { ConditionalDemo } from './demos/ConditionalDemo';
import { ValidationDemo } from './demos/ValidationDemo';
import { ComputedDemo } from './demos/ComputedDemo';

type Tab = 'multistep' | 'conditional' | 'validation' | 'computed';

/*
 * The three demos you are NOT currently looking at appear as cards under
 * the panel, each saying what it does in one line.
 *
 * They were a tab strip of four bare labels — "Multi-step",
 * "Conditional", "Validation", "Computed" — which hid three quarters of
 * the only section where a visitor can operate the real product. A label
 * gives no reason to click; a line saying what you would see does.
 *
 * Deliberately no schema on the cards. They exist to make someone click,
 * and four code blocks on screen at once would compete with the one in
 * the panel that is actually making the argument.
 */
const teasers: Record<Tab, { label: string; teaser: string }> = {
  multistep: {
    label: 'Multi-step',
    teaser: 'Sections become steps, with progress and back-navigation.',
  },
  conditional: {
    label: 'Conditional',
    teaser: 'Answer one question, watch another appear.',
  },
  validation: {
    label: 'Validation',
    teaser: 'Get it wrong on purpose and see what the engine says.',
  },
  computed: {
    label: 'Computed',
    teaser: 'Change a number and watch a total follow it.',
  },
};

const tabOrder: Tab[] = ['multistep', 'conditional', 'validation', 'computed'];

/*
 * Code lines are split into key/value so they can be syntax-coloured
 * like every other code surface on the site. They were plain strings,
 * which made the one genuinely technical detail in the section read as
 * body copy.
 */
type CodeLine = { k: string; v?: string };

const explanations: Record<
  Tab,
  { title: string; body: string; hint: string; code: CodeLine[] }
> = {
  multistep: {
    title: 'Multi-step forms',
    body: 'Sections become steps. Progress, forward and back navigation are built in. Each step can declare its own showIf condition so the flow adapts to previous answers.',
    hint: 'Fill a step, then press Continue',
    code: [
      { k: 'settings.showProgress', v: 'true' },
      { k: 'settings.progressStyle', v: '"steps"' },
      { k: 'section.showIf', v: '{ … }' },
    ],
  },
  conditional: {
    title: 'Conditional logic',
    body: 'Any question or section can declare a showIf rule. The engine evaluates conditions on every change and shows or hides fields instantly — no re-renders, no flicker.',
    hint: 'Tick the box and watch the field appear',
    code: [
      { k: 'operators', v: 'eq · neq · gt · lt' },
      { k: 'also', v: 'in · contains · empty' },
      { k: 'groups', v: 'and / or' },
    ],
  },
  validation: {
    title: 'Validation',
    body: 'Field rules compile to zod schemas at startup. The engine validates on change, on blur, or on submit — your choice. Custom validators plug in with a single function.',
    hint: 'Type something invalid on purpose',
    code: [
      { k: 'rules', v: 'required · min · max' },
      { k: 'formats', v: 'email · url · pattern' },
      { k: 'validateSchema(schema)' },
    ],
  },
  computed: {
    title: 'Computed fields',
    body: 'Calculated questions reference other answers by id. Expressions evaluate in real time and update downstream fields automatically. Format as currency, percentage, or number.',
    hint: 'Change a quantity and watch the total',
    code: [
      { k: 'expression', v: '"{qty} * {price}"' },
      { k: 'format', v: '"currency"' },
      { k: 'helpers', v: 'round · min · max · if' },
    ],
  },
};

const demoComponents: Record<Tab, React.ComponentType> = {
  multistep: MultiStepDemo,
  conditional: ConditionalDemo,
  validation: ValidationDemo,
  computed: ComputedDemo,
};

export function LiveDemosTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('multistep');

  const explanation = explanations[activeTab];
  const DemoComponent = demoComponents[activeTab];

  return (
    <>
      {/* No key on the body: keying it here remounted the explanation
          column too, so both halves flashed on every tab change. The key
          sits on the panel, which is the part that should transition. */}
      <div className="fc-demos__body">
        <div className="fc-v2-bracket fc-v2-bracket--tl" aria-hidden="true" />
        <div className="fc-v2-bracket fc-v2-bracket--br" aria-hidden="true" />

        <div className="fc-demos__explain">
          <div className="fc-demos__explain-title">{explanation.title}</div>
          <p className="fc-demos__explain-body">{explanation.body}</p>

          <div className="fc-demos__explain-foot">
            <div className="fc-demos__explain-code">
              <div className="fc-demos__explain-code-label">
                Schema that does this
              </div>
              {explanation.code.map((line) => (
                <div key={line.k} className="fc-demos__explain-code-line">
                  <span className="fc-demos__explain-code-k">{line.k}</span>
                  {line.v && (
                    <>
                      <span>: </span>
                      <span className="fc-demos__explain-code-v">{line.v}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          key={activeTab}
          className="fc-demos__panel fc-tab-panel-enter"
          /* Not role="tabpanel" any more: there is no tablist, and a
             tabpanel with no tab referencing it is worse than none.
             aria-live announces the swap, since the trigger that caused
             it is a button further down the page. */
          aria-live="polite"
          id={`fc-demo-panel-${activeTab}`}
        >
          <div className="fc-demos__panel-head">
            <span className="fc-demos__panel-label">
              {explanation.title} &middot; live
            </span>
            <span className="fc-demos__live">
              <span className="fc-demos__live-dot" />
              Running
            </span>
          </div>

          <DemoComponent />

          <div className="fc-demos__hint">
            <span className="fc-demos__hint-key">Try it</span>
            {explanation.hint}
          </div>
        </div>
      </div>

      {/* The other three, each saying what it does. These ARE the
          navigation — clicking one swaps it into the panel above and the
          current demo takes its place here, so nothing is ever hidden
          behind a label. */}
      <div className="fc-demos__more">
        {tabOrder
          .filter((key) => key !== activeTab)
          .map((key) => (
            <button
              key={key}
              type="button"
              className="fc-demos__more-card"
              aria-label={`Show the ${teasers[key].label} demo`}
              onClick={() => setActiveTab(key)}
            >
              <span className="fc-demos__more-label">
                {teasers[key].label}
              </span>
              <span className="fc-demos__more-teaser">
                {teasers[key].teaser}
              </span>
              <span className="fc-demos__more-cue" aria-hidden="true">
                Run it
                <svg viewBox="0 0 16 16" focusable="false">
                  <path d="M6 3.5 10.5 8 6 12.5" />
                </svg>
              </span>
            </button>
          ))}
      </div>
    </>
  );
}
