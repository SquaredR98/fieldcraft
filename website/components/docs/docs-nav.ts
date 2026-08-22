import type { DocNavItem, DocNavSection } from './docs-types';

const base = '/docs';

export const docsNav: DocNavSection[] = [
  {
    label: 'Getting started',
    items: [
      { title: 'Introduction', href: base },
      { title: 'Installation', href: `${base}/getting-started/installation` },
      { title: 'Your first form', href: `${base}/getting-started/your-first-form` },
      { title: 'Project structure', href: `${base}/getting-started/project-structure` },
    ],
  },
  {
    label: 'Core concepts',
    items: [
      { title: 'Schema anatomy', href: `${base}/core-concepts/schema-anatomy` },
      { title: 'Field types', href: `${base}/core-concepts/field-types` },
      { title: 'Conditional logic', href: `${base}/core-concepts/conditional-logic` },
      { title: 'Validation', href: `${base}/core-concepts/validation` },
      { title: 'Computed fields', href: `${base}/core-concepts/computed-fields` },
      { title: 'Multi-step forms', href: `${base}/core-concepts/multi-step-forms` },
      { title: 'Telemetry', href: `${base}/core-concepts/telemetry` },
    ],
  },
  {
    label: 'React',
    items: [
      { title: '<FormRenderer />', href: `${base}/react/form-renderer` },
      { title: 'Hooks', href: `${base}/react/hooks` },
      { title: 'Theming', href: `${base}/react/theming` },
      { title: 'Custom field types', href: `${base}/react/custom-field-types` },
    ],
  },
  {
    label: 'Submission',
    items: [
      { title: 'Adapters overview', href: `${base}/submission/adapters-overview` },
      { title: 'Drafts & prefill', href: `${base}/submission/drafts-and-prefill` },
      { title: 'Server validation', href: `${base}/submission/server-validation` },
    ],
  },
  {
    label: 'Pro',
    items: [
      { title: 'Visual builder', href: `${base}/pro/visual-builder`, badge: 'Pro' },
      { title: 'Theme editor', href: `${base}/pro/theme-editor`, badge: 'Pro' },
      { title: 'Response viewer', href: `${base}/pro/response-viewer`, badge: 'Pro' },
      { title: 'Templates', href: `${base}/pro/templates` },
      { title: 'Licence & activation', href: `${base}/pro/licence-and-activation` },
    ],
  },
];

/** Flat list of all doc pages for prev/next navigation */
export const allDocPages: DocNavItem[] = docsNav.flatMap((s) => s.items);

/** Get prev and next page relative to current path */
export function getDocPagination(currentPath: string) {
  const idx = allDocPages.findIndex((p) => p.href === currentPath);
  return {
    prev: idx > 0 ? allDocPages[idx - 1] : null,
    next: idx < allDocPages.length - 1 ? allDocPages[idx + 1] : null,
  };
}
