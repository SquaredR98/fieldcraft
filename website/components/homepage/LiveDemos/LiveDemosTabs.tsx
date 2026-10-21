'use client';

import { useEffect, useRef, useState } from 'react';
import { MultiStepDemo } from './demos/MultiStepDemo';
import { ConditionalDemo } from './demos/ConditionalDemo';
import { ValidationDemo } from './demos/ValidationDemo';
import { ComputedDemo } from './demos/ComputedDemo';

type Tab = 'multistep' | 'conditional' | 'validation' | 'computed';

/*
 * Icons are inline paths rather than an icon library: the site imports
 * none, and four 14px glyphs do not justify adding one. Each draws its
 * own behaviour — steps as a progression, a branch that forks, a tick
 * inside a field, an equals sign — so on a phone, where the inactive
 * tabs drop their labels, the icon still says which is which.
 */
const teasers: Record<
  Tab,
  { label: string; teaser: string; icon: string }
> = {
  multistep: {
    label: 'Multi-step',
    teaser: 'Sections become steps, with progress and back-navigation.',
    // Three nodes on a line: a progression.
    icon: 'M2 8h12M5 8a1.6 1.6 0 1 0 0-.01M11 8a1.6 1.6 0 1 0 0-.01',
  },
  conditional: {
    label: 'Conditional',
    teaser: 'Answer one question, watch another appear.',
    // A path that forks.
    icon: 'M3 12h3l3-4h4M13 8l-2-2M13 8l-2 2',
  },
  validation: {
    label: 'Validation',
    teaser: 'Get it wrong on purpose and see what the engine says.',
    // A tick inside a field.
    icon: 'M2.5 4.5h11v7h-11zM5 8l2 2 4-4',
  },
  computed: {
    label: 'Computed',
    teaser: 'Change a number and watch a total follow it.',
    // Equals: one value following from others.
    icon: 'M3 6.5h10M3 9.5h10',
  },
};

const tabOrder: Tab[] = ['multistep', 'conditional', 'validation', 'computed'];

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

  /*
   * Smooth height on tab change.
   *
   * Each demo is a different height, so swapping one jumped the panel.
   * CSS cannot transition `height: auto`, so the body's height is
   * measured and written as a pixel value, which IS animatable.
   *
   * A ResizeObserver rather than a one-off measurement: the demos are
   * live forms whose own height changes as you use them — a conditional
   * field appears, a step advances — and a fixed height taken at swap
   * time would clip that.
   */
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(([entry]) => {
      /*
       * offsetHeight, NOT entry.contentRect.height.
       *
       * contentRect is the CONTENT box: it excludes the body's 1px
       * border on each side. Setting the shell to that value left it
       * 2px shorter than its child, and since the shell is
       * overflow-hidden it clipped the body's bottom border clean off —
       * the panel looked open at the bottom.
       */
      const el = entry.target as HTMLElement;
      setHeight(el.offsetHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const explanation = explanations[activeTab];
  const DemoComponent = demoComponents[activeTab];

  return (
    <>
      <div className="fc-demos__chrome">
        {/* Window lights, matching the hero panel's. Inert and
            unlabelled — chrome can say "this is an application" and
            nothing more without making a claim it cannot back. */}
        <span className="fc-demos__lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        <div
          className="fc-demos__tabs"
          role="tablist"
          aria-label="Engine behaviours"
        >
          {tabOrder.map((key) => (
            <button
              key={key}
              role="tab"
              id={`fc-demo-tab-${key}`}
              aria-selected={activeTab === key}
              aria-controls={`fc-demo-panel-${key}`}
              /* The teaser the preview cards used to show. Here it is
                 the tooltip, so the explanation survives without
                 costing a row of vertical space on a phone. */
              title={teasers[key].teaser}
              className={`fc-demos__tab ${
                activeTab === key ? 'fc-demos__tab--active' : ''
              }`}
              onClick={() => setActiveTab(key)}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path d={teasers[key].icon} />
              </svg>
              {/* Hidden on a phone unless this tab is active, so four
                  tabs fit a narrow bar without scrolling: the icon
                  identifies the inactive ones, and the label is only
                  needed on the one you are looking at. Always in the
                  DOM — a screen reader reads it either way. */}
              <span className="fc-demos__tab-label">
                {teasers[key].label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Height is animated on the OUTER element while the inner one is
          measured, so the measurement is never affected by the
          transition it drives. */}
      <div
        className="fc-demos__body-shell"
        style={height ? { height } : undefined}
      >
        {/* No key on the body: keying it here remounted the explanation
            column too, so both halves flashed on every tab change. The
            key sits on the panel, which is the part that transitions. */}
        <div className="fc-demos__body" ref={bodyRef}>
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
          role="tabpanel"
          id={`fc-demo-panel-${activeTab}`}
          aria-labelledby={`fc-demo-tab-${activeTab}`}
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
      </div>
    </>
  );
}
