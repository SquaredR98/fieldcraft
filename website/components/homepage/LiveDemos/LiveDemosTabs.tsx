'use client';

import { useState } from 'react';
import { MultiStepDemo } from './demos/MultiStepDemo';
import { ConditionalDemo } from './demos/ConditionalDemo';
import { ValidationDemo } from './demos/ValidationDemo';
import { ComputedDemo } from './demos/ComputedDemo';

type Tab = 'multistep' | 'conditional' | 'validation' | 'computed';

const tabs: { key: Tab; label: string }[] = [
  { key: 'multistep', label: 'Multi-step' },
  { key: 'conditional', label: 'Conditional' },
  { key: 'validation', label: 'Validation' },
  { key: 'computed', label: 'Computed' },
];

const explanations: Record<
  Tab,
  { title: string; body: string; code: string[] }
> = {
  multistep: {
    title: 'Multi-step forms',
    body: 'Sections become steps. Progress, forward and back navigation are built in. Each step can declare its own showIf condition so the flow adapts to previous answers.',
    code: [
      'settings.showProgress: true',
      'settings.progressStyle: "steps"',
      'section.showIf: { ... }',
    ],
  },
  conditional: {
    title: 'Conditional logic',
    body: 'Any question or section can declare a showIf rule. The engine evaluates conditions on every change and shows or hides fields instantly \u2014 no re-renders, no flicker.',
    code: [
      'operators: eq \u00b7 neq \u00b7 gt \u00b7 lt',
      'in \u00b7 contains \u00b7 empty',
      'and / or groups',
    ],
  },
  validation: {
    title: 'Validation',
    body: 'Field rules compile to zod schemas at startup. The engine validates on change, on blur, or on submit \u2014 your choice. Custom validators plug in with a single function.',
    code: [
      'required \u00b7 min \u00b7 max \u00b7 pattern',
      'email \u00b7 url \u00b7 custom',
      'validateSchema(schema)',
    ],
  },
  computed: {
    title: 'Computed fields',
    body: 'Calculated questions reference other answers by id. Expressions evaluate in real time and update downstream fields automatically. Format as currency, percentage, or number.',
    code: [
      'expression: "{qty} * {price}"',
      'format: "currency"',
      'round \u00b7 min \u00b7 max \u00b7 if',
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
      <div className="fc-demos__tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`fc-demos__tab ${activeTab === t.key ? 'fc-demos__tab--active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="fc-demos__body" key={activeTab}>
        <div className="fc-demos__explain">
          <div className="fc-demos__explain-title">{explanation.title}</div>
          <p className="fc-demos__explain-body">{explanation.body}</p>
          <div className="fc-demos__explain-code">
            {explanation.code.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>

        <div className="fc-demos__panel fc-tab-panel-enter">
          <DemoComponent />
        </div>
      </div>
    </>
  );
}
