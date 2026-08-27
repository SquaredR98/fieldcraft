export type ChangeType = 'added' | 'fixed' | 'changed';

export type ChangelogEntry = {
  version: string;
  date: string;
  package: 'core' | 'react' | 'pro';
  packageLabel: string;
  changes: { type: ChangeType; text: string }[];
};

export type PlannedItem = {
  title: string;
};

export type PlannedGroup = {
  period: string;
  items: PlannedItem[];
};

export const changelog: ChangelogEntry[] = [
  // ── Core ──────────────────────────────────────────────

  {
    version: '1.7.0',
    date: '2026-08-27',
    package: 'core',
    packageLabel: '@squaredr/fieldcraft-core',
    changes: [
      { type: 'added', text: 'Repeater aggregate functions: SUM(), AVG(), COUNT(), MIN(), MAX() with dot-notation sub-field references' },
      { type: 'added', text: 'Per-row expressions inside aggregates: SUM({items.price} * {items.qty})' },
      { type: 'added', text: 'extractFieldRefs() now returns repeater parent IDs from dot-notation references' },
      { type: 'changed', text: 'Dev console banner version is now injected dynamically from package.json at build time' },
    ],
  },
  {
    version: '1.6.0',
    date: '2026-08-21',
    package: 'core',
    packageLabel: '@squaredr/fieldcraft-core',
    changes: [
      { type: 'changed', text: 'Preset exports removed — theming now uses auto-inherit from host page CSS variables' },
    ],
  },
  {
    version: '1.5.0',
    date: '2026-08-18',
    package: 'core',
    packageLabel: '@squaredr/fieldcraft-core',
    changes: [
      { type: 'added', text: 'Conversational display mode with question-level navigation' },
      { type: 'added', text: 'nextQuestion() / prevQuestion() engine methods' },
      { type: 'added', text: 'getVisibleQuestions() returns all visible input questions across sections' },
      { type: 'fixed', text: 'isStructuralField() now correctly identifies all 10 non-input types' },
    ],
  },
  {
    version: '1.4.1',
    date: '2026-08-10',
    package: 'core',
    packageLabel: '@squaredr/fieldcraft-core',
    changes: [
      { type: 'added', text: 'beforeSubmit hook for response interception' },
      { type: 'added', text: 'onEvent analytics callback with 10 event types' },
      { type: 'added', text: 'resetField(), resetForm(), getFieldState(), getChangedFields() engine methods' },
      { type: 'added', text: 'Schema utilities: cloneSchema, mergeSchemas, schemaDiff, migrateSchema' },
      { type: 'added', text: 'exportFormData() utility (JSON, CSV, flat formats)' },
      { type: 'added', text: 'Draft auto-save interval and schema versioning' },
      { type: 'added', text: 'Readonly field state support' },
      { type: 'added', text: '/validators and /testing subpath exports' },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-07-28',
    package: 'core',
    packageLabel: '@squaredr/fieldcraft-core',
    changes: [
      { type: 'added', text: '6 new validators: integer, positiveNumber, alphanumeric, noSpecialChars, minItems, maxItems' },
      { type: 'added', text: '9 new condition operators: isEmpty, isNotEmpty, matchesRegex, dateAfter, dateBefore, arrayContains, and more' },
      { type: 'added', text: 'Expression functions: UPPER, LOWER, TRIM, LEN, CONCAT, TODAY, DATEDIFF, DATEADD, IF' },
      { type: 'added', text: 'Conditional validation with applyIf and severity levels (error/warning/info)' },
      { type: 'added', text: 'compareToField validator for field comparison rules' },
    ],
  },
  {
    version: '1.3.6',
    date: '2026-06-16',
    package: 'core',
    packageLabel: '@squaredr/fieldcraft-core',
    changes: [
      { type: 'fixed', text: 'Email regex now requires minimum 2 characters after last dot (TLD check)' },
      { type: 'fixed', text: 'Custom validator execution wrapped in try/catch — throwing validators no longer crash the form' },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-05-27',
    package: 'core',
    packageLabel: '@squaredr/fieldcraft-core',
    changes: [
      { type: 'fixed', text: 'NaN guard in calculated fields — isNaN/isFinite checks prevent invalid computed values' },
      { type: 'fixed', text: 'Silent validator skip now logs warning instead of silently ignoring unknown validators' },
      { type: 'added', text: 'HTTP schema adapter caching with TTL' },
      { type: 'added', text: 'HTTP submit adapter retry with exponential backoff' },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-05-19',
    package: 'core',
    packageLabel: '@squaredr/fieldcraft-core',
    changes: [
      { type: 'added', text: '10 content/visual field types for FormBuilder support: info_block, divider, spacer, section_header, page_break, welcome-screen, thank-you-screen, rich-text, image, video' },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-05-16',
    package: 'core',
    packageLabel: '@squaredr/fieldcraft-core',
    changes: [
      { type: 'added', text: 'SchemaAdapter interface for loading/saving schemas from external sources' },
      { type: 'added', text: 'HttpSchemaAdapter with TTL caching' },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-04-08',
    package: 'core',
    packageLabel: '@squaredr/fieldcraft-core',
    changes: [
      { type: 'added', text: 'Initial release: form engine with multi-section support, condition evaluator with 16 operators, expression parser, validation runner, draft manager, prefill resolver, HTTP adapter' },
    ],
  },

  // ── React ─────────────────────────────────────────────

  {
    version: '1.6.0',
    date: '2026-08-21',
    package: 'react',
    packageLabel: '@squaredr/fieldcraft-react',
    changes: [
      { type: 'changed', text: 'Preset exports removed — FormRenderer auto-inherits host page CSS variables when no theme prop is passed' },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-08-18',
    package: 'react',
    packageLabel: '@squaredr/fieldcraft-react',
    changes: [
      { type: 'added', text: 'Display modes: classic (all sections visible), stepped (one section at a time), conversational (one question at a time)' },
      { type: 'added', text: 'ConversationalRenderer component for single-question-per-screen forms' },
    ],
  },
  {
    version: '1.2.11',
    date: '2026-07-14',
    package: 'react',
    packageLabel: '@squaredr/fieldcraft-react',
    changes: [
      { type: 'added', text: 'Full country list with phone codes for CountrySelectField and PhoneInternationalField' },
      { type: 'added', text: 'JSDoc documentation on all React hooks' },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-05-22',
    package: 'react',
    packageLabel: '@squaredr/fieldcraft-react',
    changes: [
      { type: 'added', text: 'Exported UI primitives (Button, Input, Select, Card, etc.) for consumer reuse' },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-05-19',
    package: 'react',
    packageLabel: '@squaredr/fieldcraft-react',
    changes: [
      { type: 'added', text: '10 content/visual field components: InfoBlock, Divider, Spacer, SectionHeader, PageBreak, WelcomeScreen, ThankYouScreen, RichText, Image, Video' },
      { type: 'changed', text: 'Core moved from dependencies to peerDependencies' },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-04-08',
    package: 'react',
    packageLabel: '@squaredr/fieldcraft-react',
    changes: [
      { type: 'added', text: 'Initial release: FormEngineRenderer, 34 input field components, useFormEngine/useFieldValue/useFieldError/useSectionProgress hooks, CSS variable theming' },
    ],
  },

  // ── Pro ────────────────────────────────────────────────

  {
    version: '1.6.3',
    date: '2026-08-21',
    package: 'pro',
    packageLabel: '@squaredr/fieldcraft-pro',
    changes: [
      { type: 'fixed', text: 'ThemeEditor re-resolves theme from DOM when host page toggles dark/light mode (MutationObserver)' },
    ],
  },
  {
    version: '1.6.0',
    date: '2026-08-21',
    package: 'pro',
    packageLabel: '@squaredr/fieldcraft-pro',
    changes: [
      { type: 'added', text: 'PRESET_FAMILIES export — 5 preset families with light/dark variants' },
      { type: 'added', text: 'resolveThemeFromDOM() utility for reading host page CSS variables' },
      { type: 'added', text: 'All Pro components auto-inherit host page CSS variables (no theme prop needed)' },
      { type: 'changed', text: 'Presets moved from OSS to Pro as ThemeEditor exploration tools' },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-08-18',
    package: 'pro',
    packageLabel: '@squaredr/fieldcraft-pro',
    changes: [
      { type: 'added', text: 'FormBuilder: logic flow map, template gallery, import/export, keyboard shortcuts, schemaUrl prop' },
      { type: 'added', text: 'ResponseViewer: search, bulk actions, statistics dashboard, timeline/card/detail views, custom field renderers' },
      { type: 'added', text: 'ThemeEditor: preset families, comparison view, palette generator, CSS/JSON export' },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-07-14',
    package: 'pro',
    packageLabel: '@squaredr/fieldcraft-pro',
    changes: [
      { type: 'added', text: 'ResponseViewer: CSV export, pagination, column filtering, date range filtering' },
      { type: 'fixed', text: 'FormBuilder mobile-responsive sidebars with overlay toggles' },
      { type: 'fixed', text: 'ResponseViewer toolbar overflow and table horizontal scroll on narrow viewports' },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-06-09',
    package: 'pro',
    packageLabel: '@squaredr/fieldcraft-pro',
    changes: [
      { type: 'added', text: 'FormBuilder: drag-and-drop form designer, schema editor, live preview, undo/redo, conditional logic UI, validation UI' },
      { type: 'added', text: 'ResponseViewer: table view with sortable columns, response detail view, CSV/JSON export' },
      { type: 'added', text: 'ThemeEditor: visual colour/typography/spacing/shape editor with real-time preview' },
      { type: 'added', text: 'FieldCraftProProvider for license key activation' },
    ],
  },
];

export const planned: PlannedGroup[] = [
  {
    period: 'September 2026',
    items: [
      { title: 'Embed IIFE build for hosted forms' },
      { title: 'Conditional logic visual builder (Pro)' },
      { title: 'i18n foundation (TranslationProvider)' },
    ],
  },
  {
    period: 'October 2026',
    items: [
      { title: 'Embed modes (Inline, Popup, Slider, Fullpage)' },
      { title: 'New fields: RichText (Tiptap), ColorPicker, Autocomplete' },
      { title: 'New adapters: MongoDB, REST' },
      { title: 'CSS-only mode (no Tailwind dependency)' },
      { title: 'Accessibility pass (aria-live, focus management)' },
    ],
  },
];
