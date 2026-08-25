'use client';

import { ResponseViewer } from '@squaredr/fieldcraft-pro/response-viewer';
import { FieldCraftProProvider } from '@squaredr/fieldcraft-pro';
import '@squaredr/fieldcraft-pro/styles.css';
import '../shared.css';

import type { FormEngineSchema, FormResponse } from '@squaredr/fieldcraft-core';

const demoSchema: FormEngineSchema = {
  id: 'demo-feedback',
  version: '1',
  title: 'Customer Feedback',
  submitAction: { type: 'callback' },
  sections: [
    {
      id: 'main',
      title: 'Feedback',
      questions: [
        { id: 'name', type: 'short_text', label: 'Full Name', required: true },
        { id: 'email', type: 'email', label: 'Email', required: true },
        { id: 'rating', type: 'number', label: 'Rating (1\u201310)', required: true },
        { id: 'category', type: 'dropdown', label: 'Category', required: true, options: [
          { label: 'Bug report', value: 'bug' },
          { label: 'Feature request', value: 'feature' },
          { label: 'General feedback', value: 'general' },
          { label: 'Billing', value: 'billing' },
        ]},
        { id: 'message', type: 'long_text', label: 'Message', required: true },
        { id: 'subscribe', type: 'yes_no', label: 'Subscribe to updates?' },
      ],
    },
  ],
};

const mockResponses: FormResponse[] = [
  { schemaId: 'demo-feedback', schemaVersion: '1', submittedAt: '2026-08-15T09:23:00Z', sessionToken: 'sess-001', values: { name: 'Sarah Chen', email: 'sarah@example.com', rating: 9, category: 'general', message: 'Love the drag-and-drop builder. Saves us hours every sprint.', subscribe: true } },
  { schemaId: 'demo-feedback', schemaVersion: '1', submittedAt: '2026-08-14T14:47:00Z', sessionToken: 'sess-002', values: { name: 'Marcus Rivera', email: 'marcus@clinic.io', rating: 10, category: 'feature', message: 'The response viewer is exactly what we needed for our admin panel. CSV export and filtering are solid.', subscribe: true } },
  { schemaId: 'demo-feedback', schemaVersion: '1', submittedAt: '2026-08-13T11:05:00Z', sessionToken: 'sess-003', values: { name: 'Priya Patel', email: 'priya@devstudio.com', rating: 8, category: 'feature', message: 'Would love a logic map visualiser for complex conditional flows.', subscribe: false } },
  { schemaId: 'demo-feedback', schemaVersion: '1', submittedAt: '2026-08-12T16:30:00Z', sessionToken: 'sess-004', values: { name: 'James O\u2019Brien', email: 'james@startup.co', rating: 7, category: 'bug', message: 'Minor rendering glitch on Safari when using the theme editor.', subscribe: true } },
  { schemaId: 'demo-feedback', schemaVersion: '1', submittedAt: '2026-08-11T08:12:00Z', sessionToken: 'sess-005', values: { name: 'Elena Voss', email: 'elena@healthtech.de', rating: 9, category: 'general', message: 'Replaced our Typeform integration with FieldCraft. Data stays in our Postgres now.', subscribe: true } },
  { schemaId: 'demo-feedback', schemaVersion: '1', submittedAt: '2026-08-10T13:55:00Z', sessionToken: 'sess-006', values: { name: 'David Kim', email: 'dkim@agency.io', rating: 8, category: 'billing', message: 'Can we get volume licensing for 5 production domains?', subscribe: false } },
  { schemaId: 'demo-feedback', schemaVersion: '1', submittedAt: '2026-08-09T10:40:00Z', sessionToken: 'sess-007', values: { name: 'Aisha Mohammed', email: 'aisha@govtech.org', rating: 10, category: 'general', message: 'The self-hosted aspect was the deciding factor for our compliance team.', subscribe: true } },
  { schemaId: 'demo-feedback', schemaVersion: '1', submittedAt: '2026-08-08T15:20:00Z', sessionToken: 'sess-008', values: { name: 'Tom Novak', email: 'tom@freelance.dev', rating: 9, category: 'feature', message: 'Would pay extra for a Figma plugin that exports FieldCraft themes.', subscribe: true } },
];

const badges = ['4 view modes', 'Search & filter', 'CSV / JSON export', 'Bulk actions'];

export function ProResponseDemo() {
  return (
    <section className="fc-pro-section fc-pro-section--surface">
      <div className="fc-pro-section__inner">
        <div className="fc-pro-demo-header">
          <div style={{ maxWidth: 620 }}>
            <div className="fc-pro-eyebrow">
              <div className="fc-pro-eyebrow__dot" />
              Live demo &middot; ResponseViewer
            </div>
            <h2 className="fc-pro-h2">Read the submissions without writing a table</h2>
            <p className="fc-pro-sub">
              Point it at your rows. Table, cards, detail and split views, search,
              filters, bulk actions and exports come with it.
            </p>
          </div>
          <div className="fc-pro-demo-header__tag">&lt;ResponseViewer /&gt;</div>
        </div>

        <div className="fc-pro-demo">
          <div className="fc-pro-demo__chrome">
            <div className="fc-pro-demo__dots">
              <div className="fc-pro-demo__dot" />
              <div className="fc-pro-demo__dot fc-pro-demo__dot--muted" />
              <div className="fc-pro-demo__dot fc-pro-demo__dot--muted" />
            </div>
            <span className="fc-pro-demo__chrome-label">
              ResponseViewer &middot; 8 submissions &middot; table view
            </span>
            <span className="fc-pro-demo__chrome-tag">Interactive</span>
          </div>
          <div className="fc-pro-demo__body">
            <FieldCraftProProvider licenseKey={process.env.NEXT_PUBLIC_FC_PRO_KEY ?? ''}>
              <ResponseViewer
                schema={demoSchema}
                responses={mockResponses}
                height="500px"
                selectable
              />
            </FieldCraftProProvider>
          </div>
        </div>

        <div className="fc-pro-badges">
          {badges.map((b) => (
            <div key={b} className="fc-pro-badge">{b}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
