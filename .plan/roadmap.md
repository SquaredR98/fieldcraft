# FieldCraft OSS — Roadmap

> All shippable items for the OSS packages. Updated as tasks complete.
> Start: June 13, 2026 · Daily effort: 2-4 hours
> This plan covers: core, react, adapters, templates-free, website, docs, blog, community.

---

## Status Legend

- ✅ Done
- 🔄 In Progress
- ⬚ Pending

---

## Category A: Core Engine (95 items)

### A1. Bug Fixes & Stability

| # | Status | Item | Version |
|---|--------|------|---------|
| A1.01 | ✅ | Fix email regex with TLD check | patch |
| A1.02 | ✅ | Custom validator try/catch in validation-runner | patch |
| A1.03 | ✅ | Silent validator skip — add console.warn | patch |
| A1.04 | 🔄 | Calculated field errors — surface as warnings (code done, tests pending) | patch |
| A1.05 | ⬚ | Fix RepeaterConfig.fields circular import | patch |
| A1.06 | ⬚ | Add `maxItems`/`minItems` validation to repeater fields | patch |
| A1.07 | ⬚ | Add `url` built-in validator with protocol check | patch |
| A1.08 | ⬚ | Add `phone` built-in validator (E.164) | patch |
| A1.09 | ⬚ | Add `date` built-in validator with min/max | patch |
| A1.10 | ⬚ | Add `fileSize` validator | patch |
| A1.11 | ⬚ | Add `fileType` validator | patch |
| A1.12 | ⬚ | Add `integer` validator | patch |
| A1.13 | ⬚ | Add `positiveNumber` validator | patch |
| A1.14 | ⬚ | Add `alphanumeric` validator | patch |
| A1.15 | ⬚ | Add `noSpecialChars` validator | patch |

### A2. Validator System Enhancements

| # | Status | Item | Version |
|---|--------|------|---------|
| A2.01 | ⬚ | Conditional validation with `applyIf` | minor |
| A2.02 | ⬚ | `compareToField` validator | minor |
| A2.03 | ⬚ | Async validator support in validation-runner | minor |
| A2.04 | ⬚ | Validator composition (`and`, `or`, `not`) | minor |
| A2.05 | ⬚ | Custom error message override per validator | patch |
| A2.06 | ⬚ | `validateOnBlur` vs `validateOnChange` field-level config | patch |
| A2.07 | ⬚ | Validator registry `listAll()` method | patch |
| A2.08 | ⬚ | Validator registry `getMetadata(name)` method | patch |
| A2.09 | ⬚ | Debounced validation support | patch |
| A2.10 | ⬚ | Cross-field validation groups | minor |
| A2.11 | ⬚ | Validation error severity levels (error/warning/info) | minor |
| A2.12 | ⬚ | Schema-level validation utility | minor |

### A3. Engine & State Improvements

| # | Status | Item | Version |
|---|--------|------|---------|
| A3.01 | ⬚ | Form-level `onSubmitValidation` hook | patch |
| A3.02 | ⬚ | `setFieldValue(id, value)` method (already exists as `setValue`) | patch |
| A3.03 | ⬚ | `setFieldValues(map)` batch method (already exists as `setValues`) | patch |
| A3.04 | ⬚ | `resetField(id)` method | patch |
| A3.05 | ⬚ | `resetForm()` method | patch |
| A3.06 | ⬚ | `getFieldState(id)` method | patch |
| A3.07 | ⬚ | `isFormDirty()` method (already exists as `state.isDirty`) | patch |
| A3.08 | ⬚ | `getChangedFields()` method | patch |
| A3.09 | ⬚ | Field dependency graph builder (already exists as `buildDependencyGraph`) | minor |
| A3.10 | ⬚ | `onFieldChange` event (already exists in EngineOptions) | patch |
| A3.11 | ⬚ | `onSectionChange` event (already exists in EngineOptions) | patch |
| A3.12 | ⬚ | `onValidationComplete` event | patch |
| A3.13 | ⬚ | Auto-save drafts with configurable interval | patch |
| A3.14 | ⬚ | Draft versioning (warn if schema changed) | patch |
| A3.15 | ⬚ | `exportFormData(format)` — JSON, CSV, flat key-value | minor |
| A3.16 | ⬚ | `focusField(fieldId)` engine method — records focus timestamp for analytics timing. Required by A3.18 `onEvent`. | minor |
| A3.17 | ⬚ | `beforeSubmit` hook — `(response) => response \| false \| Promise`. Runs after validation, before adapters. Return modified response to continue, `false` to cancel. Needed for SaaS response relay interception. | minor |
| A3.18 | ⬚ | `onEvent` unified analytics callback — single firehose emitting `FieldCraftEvent` objects (`fc_form_view`, `fc_form_start`, `fc_field_focus`, `fc_field_complete`, `fc_section_complete`, `fc_form_submit`, `fc_form_abandon`, `fc_validation_error`, `fc_draft_save`, `fc_draft_resume`). New file `analytics-emitter.ts`. Depends on A3.16. | minor |
| A3.19 | ⬚ | Draft migration hook — `draftMigrations: Record<string, (draft) => draft>` in EngineOptions. On `loadDraft()`, if schema version differs, apply migration chain or discard with console.warn. | minor |
| A3.20 | ⬚ | `metadata` prop on engine — verify `FormResponse.metadata` is populated from both schema-level and runtime-provided metadata (prop wins on conflict). | patch |

### A4. Condition & Expression System

| # | Status | Item | Version |
|---|--------|------|---------|
| A4.01 | ⬚ | `isEmpty`/`isNotEmpty` condition operators | patch |
| A4.02 | ⬚ | `matchesRegex` condition operator | patch |
| A4.03 | ⬚ | `dateAfter`/`dateBefore` condition operators | patch |
| A4.04 | ⬚ | `arrayContains`/`arrayNotContains` operators | patch |
| A4.05 | ⬚ | `lengthGreaterThan`/`lengthLessThan` operators | patch |
| A4.06 | ⬚ | `startsWith`/`endsWith` operators (already in schema — verify implementation) | patch |
| A4.07 | ⬚ | String functions in expression-parser (`UPPER`, `LOWER`, `TRIM`, `LEN`, `CONCAT`) | patch |
| A4.08 | ⬚ | Date functions in expression-parser (`TODAY`, `DATEDIFF`, `DATEADD`) | patch |
| A4.09 | ⬚ | Conditional expressions in parser (`IF(cond, true, false)`) | minor |
| A4.10 | ⬚ | Math functions (`ROUND`, `FLOOR`, `CEIL`, `ABS`) | patch |

### A5. Type System & Exports

| # | Status | Item | Version |
|---|--------|------|---------|
| A5.01 | ✅ | JSDoc on all exported types in `types/` | patch |
| A5.02 | ✅ | JSDoc on all public engine methods | patch |
| A5.03 | ✅ | JSDoc on all built-in validators | patch |
| A5.04 | ⬚ | JSDoc on condition-evaluator exports | patch |
| A5.05 | ⬚ | JSDoc on expression-parser exports | patch |
| A5.06 | ⬚ | JSDoc on draft-manager exports | patch |
| A5.07 | ⬚ | JSDoc on prefill-resolver exports | patch |
| A5.08 | ⬚ | Audit + export all public types from root `index.ts` | patch |
| A5.09 | ⬚ | Add `/testing` subpath export | patch |
| A5.10 | ⬚ | Add `/validators` subpath export | patch |

### A6. Adapter Layer (Core-side)

| # | Status | Item | Version |
|---|--------|------|---------|
| A6.01 | ⬚ | JSDoc on http-adapter.ts | patch |
| A6.02 | ⬚ | JSDoc on http-schema-adapter.ts | patch |
| A6.03 | ⬚ | `onRetry` callback for http-adapter | patch |
| A6.04 | ⬚ | Request timeout configuration | patch |
| A6.05 | ⬚ | Response transform hook | patch |
| A6.06 | ⬚ | Health check method on schema adapter | patch |
| A6.07 | ⬚ | Cache invalidation method | patch |
| A6.08 | ⬚ | Adapter interface for custom adapter authors | minor |

### A7. Schema & Metadata

| # | Status | Item | Version |
|---|--------|------|---------|
| A7.01 | ⬚ | `metadata` property on FormSchema | patch |
| A7.02 | ⬚ | `tags` property on FormSchema | patch |
| A7.03 | ⬚ | `version` property on FormSchema (already exists) | patch |
| A7.04 | ⬚ | `createdAt`/`updatedAt` on FormSchema | patch |
| A7.05 | ⬚ | Form versioning support | minor |
| A7.06 | ⬚ | Schema migration helpers | minor |
| A7.07 | ⬚ | Schema diff utility | minor |
| A7.08 | ⬚ | `placeholder` property (already exists on Question type) | patch |
| A7.09 | ⬚ | `helpText` property (already exists on Question type) | patch |
| A7.10 | ⬚ | A11y attributes in schema field config | minor |
| A7.11 | ⬚ | `readonly` field state — `readonly?: boolean \| ConditionExpression` on Question type. Condition evaluator evaluates alongside `disabled`. Readonly fields are submitted but not editable by user. `isFieldReadonly(fieldId)` engine method. `setValue()` still works programmatically (only UI locked). | minor |
| A7.12 | ⬚ | Consent field enhancement — add `consentVersion: string` and `recordTimestamp: boolean` to consent field type config. When `recordTimestamp: true`, `FormResponse.values` stores `{ agreed: boolean, timestamp: string, version: string }` instead of just `boolean`. Needed by Telehealth consent workflows. | minor |

### A8. Utilities & Helpers

| # | Status | Item | Version |
|---|--------|------|---------|
| A8.01 | ⬚ | `flattenFormValues()` utility | patch |
| A8.02 | ⬚ | `unflattenFormValues()` utility | patch |
| A8.03 | ⬚ | `getFieldById()` utility (engine already has `getQuestionById`) | patch |
| A8.04 | ⬚ | `getAllFieldIds()` utility | patch |
| A8.05 | ⬚ | `getRequiredFieldIds()` utility | patch |
| A8.06 | ⬚ | `getVisibleFields()` utility (engine already has this) | patch |
| A8.07 | ⬚ | `cloneSchema()` deep clone | patch |
| A8.08 | ⬚ | `mergeSchemas()` utility | minor |
| A8.09 | ⬚ | `createEmptySchema()` factory | patch |
| A8.10 | ⬚ | `validateSchemaStructure()` runtime checker (already exists as `validateSchema`) | patch |
| A8.11 | ⬚ | `validateResponse(response, schema)` — validate a response object matches the schema's fields. Throws on unknown fields or missing required. | minor |
| A8.12 | ⬚ | `formatResponseValues(response, schema)` — human-readable labels + formatted values. Handles select→label lookup, dates, booleans→Yes/No. | minor |
| A8.13 | ⬚ | `flattenResponse(response, schema)` — flatten repeater/matrix values for CSV export (e.g., `medications.0.name`). | minor |

### A9. i18n & Localization

| # | Status | Item | Version |
|---|--------|------|---------|
| A9.01 | ⬚ | i18n translation system core | minor |
| A9.02 | ⬚ | English locale default messages | patch |
| A9.03 | ⬚ | Locale message type definitions | patch |
| A9.04 | ⬚ | `setLocale()` method on engine | patch |
| A9.05 | ⬚ | RTL support flag | patch |

---

## Category B: React Renderer (70 items)

### B1. Field Component Fixes

| # | Status | Item | Version |
|---|--------|------|---------|
| B1.01 | ✅ | Full 250+ country list in CountrySelectField | patch |
| B1.02 | ⬚ | Update PhoneInternationalField with full country codes | patch |
| B1.03 | ✅ | Error boundary wraps field rendering | patch |
| B1.04 | ⬚ | aria-label on all 44 field components | patch |
| B1.05 | ⬚ | aria-describedby for help text | patch |
| B1.06 | ⬚ | aria-invalid + aria-errormessage for errors | patch |
| B1.07 | ⬚ | Keyboard navigation for RatingField | patch |
| B1.08 | ⬚ | Keyboard navigation for SliderField | patch |
| B1.09 | ⬚ | Placeholder support on all text inputs | patch |
| B1.10 | ⬚ | autoFocus on first visible field | patch |
| B1.11 | ⬚ | disabled state on all field components | patch |
| B1.12 | ⬚ | readOnly state on all field components | patch |
| B1.13 | ⬚ | DateField locale formatting | patch |
| B1.14 | ⬚ | TimeField 12h/24h format | patch |
| B1.15 | ⬚ | FileUploadField drag-and-drop z-index fix | patch |
| B1.16 | ⬚ | `onFocus` in FieldProps — add `onFocus?: () => void` to FieldProps interface. Wire in FieldRenderer to call `engine.focusField(field.id)`. All 44 field components attach `onFocus` to primary input. Required for analytics timing (A3.18). | minor |

### B2. New Field Components

| # | Status | Item | Version |
|---|--------|------|---------|
| B2.01-B2.10 | ⬚ | ColorPicker, Password, Autocomplete, TagInput, Currency, PhoneMask, DateRange, TimeRange, LikertScale, RichTextEditor | minor each |

### B3. Hooks & API

| # | Status | Item | Version |
|---|--------|------|---------|
| B3.01 | ✅ | JSDoc on useFormEngine | patch |
| B3.02 | ✅ | JSDoc on useFieldValue | patch |
| B3.03 | ✅ | JSDoc on useFieldError | patch |
| B3.04 | ✅ | JSDoc on useSectionProgress | patch |
| B3.05-B3.10 | ⬚ | useFormDirty, useFieldVisibility, useFormProgress, useConditionalFields, useFormSubmit, useFieldOptions | patch/minor |

### B4. Theme System

| # | Status | Item | Version |
|---|--------|------|---------|
| B4.01-B4.10 | ⬚ | Dark theme, minimal theme, compact theme, accessible theme, CSS docs, ThemeProvider, useTheme, override support, print styles, responsive breakpoints | patch/minor |

### B5. Layout & UX Components

| # | Status | Item | Version |
|---|--------|------|---------|
| B5.01-B5.10 | ⬚ | Conversational renderer, auto-advance, keyboard nav, progress bar, step indicator, collapsible sections, submit confirmation, form result, error summary, unsaved changes warning | patch/minor |

### B6. React Testing

| # | Status | Item | Version |
|---|--------|------|---------|
| B6.01-B6.15 | ⬚ | Tests for ShortText, Email, Number, Dropdown, SingleSelect, MultiSelect, Boolean, Rating, Date, FileUpload, LongText, FormEngineRenderer integration, useFormEngine hook, useFieldValue hook, error boundary | patch |

### B7. Embed Build (SaaS Prerequisite)

| # | Status | Item | Version |
|---|--------|------|---------|
| B7.01 | ⬚ | Embed IIFE build target — self-contained bundle: React 19 + ReactDOM + core engine + all 44 field components + default theme. New `tsup.embed.config.ts` or `packages/embed/`. Output: `embed.iife.js` (~120-150KB gzipped) + `embed.css`. Exposes `window.FieldCraft.render()`. | minor |
| B7.02 | ⬚ | CSS scoping — randomized prefix at build time (e.g., `fc-x7k2-`). Tailwind `prefix` option + PostCSS transform. All rules scoped inside `[data-fc-embed]`. Host page CSS cannot target form elements. | — |
| B7.03 | ⬚ | Auto-GTAG mode — when `analytics: 'gtag'` is set in render options and `window.gtag` exists, auto-fire all `fc_*` events. Same for `'gtm'` with `window.dataLayer`. | patch |
| B7.04 | ⬚ | Multiple instances — verify multiple `FieldCraft.render()` calls on same page work (separate React roots, shared CSS, no global state conflicts). | — |
| B7.05 | ⬚ | Bundle size budget — track in CI. Target < 150KB gzipped. Alert on regression. Consider lazy-loading uncommon field types if over budget. | — |

---

## Category C: Adapters (20 items)

### C1. Existing Adapter Improvements

| # | Status | Item | Version |
|---|--------|------|---------|
| C1.01-C1.10 | ⬚ | Postgres JSDoc, cleanup, connection pool, query logging, health check, transactions, schema CRUD, soft delete, pagination | patch/minor |

### C2. New Adapters

| # | Status | Item | Version |
|---|--------|------|---------|
| C2.01-C2.10 | ⬚ | Supabase response, Supabase schema, Firebase response, Firebase schema, REST generic, S3 file, localStorage, CSV export, webhook notification, email notification | minor each |

---

## Category D: Templates (20 OSS items)

### D1. Free Template Improvements

| # | Status | Item | Version |
|---|--------|------|---------|
| D1.01-D1.10 | ⬚ | Metadata, tags, preview images, README, build validation, getTemplateById, listTemplates, getByCategory, improve contact-form, improve feedback-survey | patch |

### D2. New Free Templates

| # | Status | Item | Version |
|---|--------|------|---------|
| D2.01-D2.10 | ⬚ | E-commerce checkout, job application, event registration, newsletter signup, bug report, feature request, employee onboarding, course evaluation, permit application, multi-step wizard | minor each |

---

## Category G: Testing & Quality (OSS items — 40 items)

### G1. Core Engine Tests

| # | Status | Item | Version |
|---|--------|------|---------|
| G1.01 | ✅ | Test draft-manager.ts | patch |
| G1.02 | ✅ | Test expression-parser.ts | patch |
| G1.03 | ✅ | Test prefill-resolver.ts | patch |
| G1.04 | ✅ | Test condition-evaluator.ts (all 16 operators) | patch |
| G1.05 | ✅ | Test calculated-resolver.ts | patch |
| G1.06 | ✅ | Test validator-registry.ts | patch |
| G1.07 | ✅ | Test all built-in validators | patch |
| G1.08-G1.20 | ⬚ | validation-runner, form-engine state, http-adapter, http-schema-adapter, schema-validator, section-navigator, computed-values, event-emitter, submission-handler, field-visibility, formatting, schema-utils, full lifecycle integration | patch |

### G2. React Component Tests

| # | Status | Item | Version |
|---|--------|------|---------|
| G2.01-G2.15 | ⬚ | Phone, URL, Slider, CheckboxGroup, RadioGroup, Repeater, SectionHeader, InfoBlock, WelcomeScreen, ThankYouScreen, Conversational, ProgressBar, StepIndicator, ErrorSummary, ThemeProvider | patch |

### G3. Adapter & Template Tests

| # | Status | Item | Version |
|---|--------|------|---------|
| G3.01-G3.07 | ⬚ | Postgres schema CRUD, Postgres response CRUD, Supabase, REST, CSV export, localStorage, free templates render | patch |

### G4. Infrastructure Tests

| # | Status | Item | Version |
|---|--------|------|---------|
| G4.01-G4.05 | ⬚ | Bundle size tracking, strict mode, exports validation, CJS/ESM, Node version CI matrix | — |

---

## Category H: Documentation & Website (OSS items)

### H1. Package Documentation

| # | Status | Item |
|---|--------|------|
| H1.01 | ✅ | CHANGELOG.md for Core |
| H1.02 | ✅ | CHANGELOG.md for React |
| H1.03 | ✅ | CHANGELOG.md for Adapters |
| H1.04 | ✅ | CHANGELOG.md for Templates-Free |
| H1.05 | ✅ | README.md for Templates-Free |
| H1.06 | ⬚ | CONTRIBUTING.md |
| H1.07 | ⬚ | CODE_OF_CONDUCT.md |
| H1.08 | ⬚ | Update Core README with full API docs |
| H1.09 | ⬚ | Update React README with component catalog |
| H1.10 | ⬚ | Update Adapters README with adapter catalog |
| H1.11 | ⬚ | Update root README with download badges |
| H1.12 | ⬚ | SECURITY.md |
| H1.14 | ⬚ | Migration guide |
| H1.15 | ⬚ | Architecture overview doc |
| H1.16 | ⬚ | README audit and polish across all packages |

### H2. Website & Docs (moved to website/ — see restructuring-plan.md)

All docs site pages (H2.01-H2.15) are now part of the website restructure. Content goes into `website/content/docs/` as MDX files.

### H3. Blog Posts

| # | Status | Item |
|---|--------|------|
| H3.01-H3.07 | ✅ | Multi-step survey, schema vs code, validation pipeline, conversational forms, cost of building, self-hosted vs cloud, accessible forms |
| H3.08 | ⬚ | Conditional logic engine deep-dive |
| H3.09-H3.25 | ⬚ | 17 more blog posts planned |

---

## Category I: Infrastructure & Community (20 items)

### I1. npm & Package Infra

| # | Status | Item |
|---|--------|------|
| I1.01 | ⬚ | Deprecate 9 old packages on npm |
| I1.02 | ⬚ | GitHub Actions CI for formengine |
| I1.03 | ⬚ | GitHub Actions CI for fieldcraft-pro |
| I1.04 | ⬚ | Automated npm publish on tag |
| I1.05 | ⬚ | npm download badges |
| I1.06 | ⬚ | FUNDING.yml |
| I1.07 | ⬚ | Polar.sh integration |
| I1.08 | ⬚ | Test coverage reporting in CI |

### I2. Community & Marketing

| # | Status | Item |
|---|--------|------|
| I2.01-I2.12 | ⬚ | Discord, GitHub Discussions, awesome-react, awesome-forms, Product Hunt, HN, Reddit, Dev.to, Twitter/X, YouTube, Gumroad/Stripe |

---

## Priority Order (What to Do Next)

### Immediate — SaaS prerequisites (engine hardening)

These items are required by FieldCraft Pro and SaaS (tracked in `fieldcraft-pro/.plan/`). They must ship before Pro completion and SaaS build.

1. **A3.16** — `focusField()` engine method (needed by A3.18)
2. **B1.16** — `onFocus` in FieldProps (needed by A3.18)
3. **A3.18** — `onEvent` unified analytics callback (needed by SaaS embed GTAG)
4. **A7.11** — `readonly` field state (needed by Pro prefill workflows)
5. **A3.19** — Draft migration hook (prevents stale draft issues)
6. **A3.20** — `metadata` prop verification (needed by SaaS attribution)
7. **A3.17** — `beforeSubmit` hook (needed by SaaS response relay)
8. **A8.11-A8.13** — Response serialization utilities (needed by Pro ResponseViewer + SaaS)
9. **B7.01-B7.05** — Embed IIFE build (needed by SaaS embed script)
10. Version bump: core 1.3.13 → 1.4.0, react 1.2.12 → 1.3.0. Build + test + publish.

### Carry-over — prior immediate items (still needed)

11. **A1.04** — Finish calculated field warning tests (4 tests needed)
12. **H1.06** — CONTRIBUTING.md
13. **H1.07** — CODE_OF_CONDUCT.md
14. **A5.04-A5.07** — JSDoc on 4 core files
15. **A6.01-A6.02** — JSDoc on HTTP adapters
16. **Website restructure** — demo → website with Fumadocs (see website-rebuild-plan.md)

### Short-term (Month 2-3)

17. **G1.08-G1.12** — Core engine tests (validation-runner, form-engine, http-adapter, schema-validator)
18. **B6.01-B6.05** — React field component tests
19. **H3.08** — Conditional logic blog post
20. **Website content** — Getting Started, Schema, Engine docs as MDX

### Medium-term (Month 3-6)

21. **B5.01-B5.03** — Conversational mode renderer
22. **A9.01-A9.05** — i18n system
23. **B4.01-B4.04** — Theme presets
24. **C2.01-C2.02** — Supabase adapters

---

## Version Progression

| Phase | Core | React | Focus |
|-------|------|-------|-------|
| Month 1-2 | 1.3.4 → 1.3.x | 1.2.10 → 1.2.x | Bug fixes, validators, JSDoc, tests |
| Month 3-4 | 1.3.x → 1.6.x | 1.2.x → 1.5.x | Conversational mode, new field components |
| Month 5-6 | 1.6.x → 1.8.x | 1.5.x → 1.7.x | i18n, a11y, new adapters, templates |
| Month 7-8 | 1.8.x → 1.10.x | 1.7.x → 1.9.x | Schema migration, file upload v2 |
| Month 9-10 | 1.10.x → 1.12.x | 1.9.x → 1.11.x | Enterprise features, plugin system |
| Month 11-12 | 1.12.x → 2.0.0-preview | 1.11.x → 2.0.0-preview | React Native, offline-first, v2 |
