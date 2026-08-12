export type ItemStatus = 'shipped' | 'planned';

export type RoadmapItem = {
  title: string;
  status: ItemStatus;
};

export type RoadmapGroup = {
  period: string;
  items: RoadmapItem[];
};

export const roadmap: RoadmapGroup[] = [
  {
    period: 'June 2026',
    items: [
      { title: 'Core engine with 44 field types', status: 'shipped' },
      { title: 'JSON schema-driven form definition', status: 'shipped' },
      { title: 'Validation engine (required, min/max, pattern, custom)', status: 'shipped' },
      { title: 'Conditional visibility with nested AND/OR groups', status: 'shipped' },
      { title: 'Multi-step sections with progress tracking', status: 'shipped' },
      { title: 'Computed/calculated fields with expression engine', status: 'shipped' },
      { title: 'Draft persistence with auto-save', status: 'shipped' },
      { title: '6 theme presets (Clean, Dark, Modern, High Contrast, Clinical, Playful)', status: 'shipped' },
      { title: 'Custom field registry', status: 'shipped' },
      { title: 'Full TypeScript support, 403 passing tests', status: 'shipped' },
    ],
  },
  {
    period: 'July 2026',
    items: [
      { title: 'PostgreSQL adapter (Drizzle ORM)', status: 'shipped' },
      { title: 'Supabase adapter', status: 'shipped' },
      { title: 'Webhook adapter (HMAC-SHA256 signed payloads)', status: 'shipped' },
      { title: 'AES-256-GCM field-level encryption', status: 'shipped' },
      { title: 'CSV export for form responses', status: 'shipped' },
      { title: 'All adapters open-sourced under MIT', status: 'shipped' },
      { title: '16 free form templates', status: 'shipped' },
      { title: 'Drag-and-drop form builder with undo/redo (Pro)', status: 'shipped' },
      { title: 'Response viewer with filtering, pagination, CSV export (Pro)', status: 'shipped' },
      { title: 'Monaco schema editor with live preview (Pro)', status: 'shipped' },
      { title: 'Theme editor with real-time preview (Pro)', status: 'shipped' },
    ],
  },
  {
    period: 'August 2026',
    items: [
      { title: 'FieldCraft website + documentation site', status: 'shipped' },
      { title: '7 blog posts (multi-step, validation, accessibility, and more)', status: 'shipped' },
      { title: 'JSDoc on remaining core exports', status: 'shipped' },
      { title: 'CONTRIBUTING.md and CODE_OF_CONDUCT.md', status: 'shipped' },
      { title: 'Calculated field warning system', status: 'shipped' },
      { title: 'Analytics event system (onEvent callback)', status: 'planned' },
      { title: 'Readonly field state', status: 'planned' },
      { title: 'Response viewer search and bulk actions (Pro)', status: 'planned' },
    ],
  },
  {
    period: 'September 2026',
    items: [
      { title: 'Telehealth package 1.0.0 (PHQ-9, GAD-7, body diagram, vitals)', status: 'planned' },
      { title: 'Healthcare templates (Patient Intake, Consent, Medical History)', status: 'planned' },
      { title: 'Embed IIFE build for hosted forms', status: 'planned' },
      { title: 'Conditional logic visual builder (Pro)', status: 'planned' },
      { title: 'beforeSubmit hook for response interception', status: 'planned' },
      { title: 'i18n foundation (TranslationProvider)', status: 'planned' },
    ],
  },
  {
    period: 'October 2026',
    items: [
      { title: 'Conversational mode (one question per screen)', status: 'planned' },
      { title: 'Embed modes (Inline, Popup, Slider, Fullpage)', status: 'planned' },
      { title: 'New fields: RichText (Tiptap), ColorPicker, Autocomplete', status: 'planned' },
      { title: 'New adapters: MongoDB, REST', status: 'planned' },
      { title: 'CSS-only mode (no Tailwind dependency)', status: 'planned' },
      { title: 'Accessibility pass (aria-live, focus management)', status: 'planned' },
    ],
  },
];
