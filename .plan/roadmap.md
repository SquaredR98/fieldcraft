# FieldCraft OSS — Roadmap

> All shippable items for the OSS packages. Updated as tasks complete.
> Start: June 13, 2026 · Updated: 2026-08-27
> This plan covers: core, react, adapters, templates, website, docs, blog, community.
> Current versions: core 1.7.0, react 1.7.0, adapters 1.0.1, templates 1.1.1

---

## Status Legend

- ✅ Done
- 🔄 In Progress
- ⬚ Pending
- 🚫 Deferred

---

## Category A: Core Engine

### A1. Bug Fixes & Stability

| # | Status | Item | Version |
|---|--------|------|---------|
| A1.01 | ✅ | Fix email regex with TLD check | patch |
| A1.02 | ✅ | Custom validator try/catch in validation-runner | patch |
| A1.03 | ✅ | Silent validator skip — add console.warn | patch |
| A1.04 | ✅ | Calculated field errors — surface as warnings | patch |
| A1.05 | ✅ | Fix RepeaterConfig.fields circular import | patch |
| A1.06 | ✅ | Add `maxItems`/`minItems` validation to repeater fields | patch |
| A1.07 | ✅ | `url` built-in validator with protocol check | — (already exists) |
| A1.08 | ✅ | `phone` built-in validator | — (already exists) |
| A1.09 | ✅ | `date` built-in validator with min/max | — (already exists) |
| A1.10 | ✅ | `fileSize` validator | — (already exists) |
| A1.11 | ✅ | `fileType` validator | — (already exists) |
| A1.12 | ✅ | Add `integer` validator | patch |
| A1.13 | ✅ | Add `positiveNumber` validator | patch |
| A1.14 | ✅ | Add `alphanumeric` validator | patch |
| A1.15 | ✅ | Add `noSpecialChars` validator | patch |

### A2. Validator System Enhancements

| # | Status | Item | Version |
|---|--------|------|---------|
| A2.01 | ✅ | Conditional validation with `applyIf` | minor |
| A2.02 | ✅ | `compareToField` validator | minor |
| A2.03 | 🚫 | Async validator support in validation-runner | minor |
| A2.04 | 🚫 | Validator composition (`and`, `or`, `not`) | minor |
| A2.05 | ✅ | Custom error message override per validator (verify all respect `message?`) | patch |
| A2.06 | ✅ | `validateOnBlur` vs `validateOnChange` field-level config | patch |
| A2.07 | ✅ | Validator registry `listAll()` method | patch |
| A2.08 | ✅ | Validator registry `getMetadata(name)` method | patch |
| A2.09 | 🚫 | Debounced validation support — `debounceMs` exists in schema type but not wired. Intentionally deferred: consumers can debounce in onChange. Wire when A2.03 (async validators) ships. | patch |
| A2.10 | 🚫 | Cross-field validation groups | minor |
| A2.11 | ✅ | Validation error severity levels (error/warning/info) | minor |
| A2.12 | 🚫 | Schema-level validation utility | minor |

### A3. Engine & State Improvements

| # | Status | Item | Version |
|---|--------|------|---------|
| A3.01 | 🚫 | Form-level `onSubmitValidation` hook | patch |
| A3.02 | ✅ | `setFieldValue(id, value)` method | — (already exists as `setValue`) |
| A3.03 | ✅ | `setFieldValues(map)` batch method | — (already exists as `setValues`) |
| A3.04 | ✅ | `resetField(id)` method | patch |
| A3.05 | ✅ | `resetForm()` method | patch |
| A3.06 | ✅ | `getFieldState(id)` method | patch |
| A3.07 | ✅ | `isFormDirty()` method | — (already exists as `state.isDirty`) |
| A3.08 | ✅ | `getChangedFields()` method | patch |
| A3.09 | ✅ | Field dependency graph builder | — (already exists as `buildDependencyGraph`) |
| A3.10 | ✅ | `onFieldChange` event | — (already exists in EngineOptions) |
| A3.11 | ✅ | `onSectionChange` event | — (already exists in EngineOptions) |
| A3.12 | ✅ | `onValidationComplete` event | patch |
| A3.13 | ✅ | Auto-save drafts with configurable interval | patch |
| A3.14 | ✅ | Draft versioning (warn if schema changed) | patch |
| A3.15 | ✅ | `exportFormData(format)` — JSON, CSV, flat key-value | minor |
| A3.16 | ✅ | `focusField(fieldId)` engine method — records focus timestamp. Required by A3.18. | minor |
| A3.17 | ✅ | `beforeSubmit` hook — `(response) => response \| false \| Promise`. Runs after validation, before adapters. | minor |
| A3.18 | ✅ | `onEvent` unified analytics callback — `FieldCraftEvent` objects. New file `analytics-emitter.ts`. Depends on A3.16. | minor |
| A3.19 | ✅ | Draft migration hook — `draftMigrations: Record<string, (draft) => draft>` in EngineOptions. | minor |
| A3.20 | ✅ | `metadata` prop on engine — verify `FormResponse.metadata` is populated from both schema-level and runtime-provided metadata. | patch |

### A4. Condition & Expression System

| # | Status | Item | Version |
|---|--------|------|---------|
| A4.01 | ✅ | `isEmpty`/`isNotEmpty` condition operators | patch |
| A4.02 | ✅ | `matchesRegex` condition operator | patch |
| A4.03 | ✅ | `dateAfter`/`dateBefore` condition operators | patch |
| A4.04 | ✅ | `arrayContains`/`arrayNotContains` operators | patch |
| A4.05 | ✅ | `lengthGreaterThan`/`lengthLessThan` operators | patch |
| A4.06 | ✅ | `startsWith`/`endsWith` operators | — (already exists) |
| A4.07 | ✅ | String functions in expression-parser (`UPPER`, `LOWER`, `TRIM`, `LEN`, `CONCAT`) | patch |
| A4.08 | ✅ | Date functions in expression-parser (`TODAY`, `DATEDIFF`, `DATEADD`) | patch |
| A4.09 | ✅ | Conditional expressions in parser (`IF(cond, true, false)`) | minor |
| A4.10 | ✅ | Math functions (`ROUND`, `FLOOR`, `CEIL`, `ABS`, `MIN`, `MAX`) | — (already exists) |

### A5. Type System & Exports

| # | Status | Item | Version |
|---|--------|------|---------|
| A5.01 | ✅ | JSDoc on all exported types in `types/` | patch |
| A5.02 | ✅ | JSDoc on all public engine methods | patch |
| A5.03 | ✅ | JSDoc on all built-in validators | patch |
| A5.04 | ✅ | JSDoc on condition-evaluator exports | patch |
| A5.05 | ✅ | JSDoc on expression-parser exports | patch |
| A5.06 | ✅ | JSDoc on draft-manager exports | patch |
| A5.07 | ✅ | JSDoc on prefill-resolver exports | patch |
| A5.08 | ✅ | Audit + export all public types from root `index.ts` | patch |
| A5.09 | ✅ | Add `/testing` subpath export | patch |
| A5.10 | ✅ | Add `/validators` subpath export | patch |

### A6. Adapter Layer (Core-side)

| # | Status | Item | Version |
|---|--------|------|---------|
| A6.01 | ✅ | JSDoc on http-adapter.ts | patch |
| A6.02 | ✅ | JSDoc on http-schema-adapter.ts | patch |
| A6.03 | ✅ | `onRetry` callback for http-adapter | patch |
| A6.04 | ✅ | Request timeout configuration | patch |
| A6.05 | ✅ | Response transform hook | patch |
| A6.06 | ✅ | Health check method on schema adapter | patch |
| A6.07 | ✅ | Cache invalidation method | patch |
| A6.08 | ✅ | Adapter interface for custom adapter authors | minor |

### A7. Schema & Metadata

| # | Status | Item | Version |
|---|--------|------|---------|
| A7.01 | ✅ | `metadata` property on FormSchema | patch |
| A7.02 | ✅ | `tags` property on FormSchema | patch |
| A7.03 | ✅ | `version` property on FormSchema | — (already exists) |
| A7.04 | ✅ | `createdAt`/`updatedAt` on FormSchema | patch |
| A7.05 | ✅ | Form versioning support | minor |
| A7.06 | ✅ | Schema migration helpers | minor |
| A7.07 | ✅ | Schema diff utility | minor |
| A7.08 | ✅ | `placeholder` property on Question | — (already exists) |
| A7.09 | ✅ | `helpText` property on Question | — (already exists) |
| A7.10 | ✅ | A11y attributes in schema field config (`ariaLabel`, `ariaDescription`) | minor |
| A7.11 | ✅ | `readonly` field state — `readonly?: boolean \| ConditionExpression` on Question type. `isFieldReadonly(fieldId)` engine method. | minor |
| A7.12 | ✅ | Consent field enhancement — `consentVersion`, `recordTimestamp` | minor |

### A8. Utilities & Helpers

| # | Status | Item | Version |
|---|--------|------|---------|
| A8.01 | ✅ | `flattenFormValues()` utility | patch |
| A8.02 | ✅ | `unflattenFormValues()` utility | patch |
| A8.03 | ✅ | `getFieldById()` utility | patch |
| A8.04 | ✅ | `getAllFieldIds()` utility | patch |
| A8.05 | ✅ | `getRequiredFieldIds()` utility | patch |
| A8.06 | ✅ | `getVisibleFields()` utility | — (already exists on engine) |
| A8.07 | ✅ | `cloneSchema()` deep clone | patch |
| A8.08 | ✅ | `mergeSchemas()` utility | minor |
| A8.09 | ✅ | `createEmptySchema()` factory | patch |
| A8.10 | ✅ | `validateSchemaStructure()` runtime checker | — (already exists as `validateSchema`) |
| A8.11 | ✅ | `validateResponse(response, schema)` | minor |
| A8.12 | ✅ | `formatResponseValues(response, schema)` — human-readable labels + formatted values | minor |
| A8.13 | ✅ | `flattenResponse(response, schema)` — flatten repeater/matrix values for CSV export | minor |

### A9. i18n & Localization (🚫 Deferred)

| # | Status | Item | Version |
|---|--------|------|---------|
| A9.01 | 🚫 | i18n translation system core | minor |
| A9.02 | 🚫 | English locale default messages | patch |
| A9.03 | 🚫 | Locale message type definitions | patch |
| A9.04 | 🚫 | `setLocale()` method on engine | patch |
| A9.05 | 🚫 | RTL support flag | patch |

---

## Category B: React Renderer

### B1. Field Component Fixes

| # | Status | Item | Version |
|---|--------|------|---------|
| B1.01 | ✅ | Full 250+ country list in CountrySelectField | patch |
| B1.02 | ✅ | Update PhoneInternationalField with full country codes | patch |
| B1.03 | ✅ | Error boundary wraps field rendering | patch |
| B1.04 | ✅ | Verify aria-label on all 44 field components (centralized via `fieldAria()` in FieldWrapper) | patch |
| B1.05 | ✅ | Verify aria-describedby for help text (centralized via `fieldAria()` in FieldWrapper) | patch |
| B1.06 | ✅ | Verify aria-invalid + aria-errormessage for errors (centralized via `fieldAria()` in FieldWrapper) | patch |
| B1.07 | ✅ | Keyboard navigation for RatingField | patch |
| B1.08 | ✅ | Keyboard navigation for SliderField | patch |
| B1.09 | ✅ | Placeholder support on all text inputs | patch |
| B1.10 | ✅ | autoFocus on first visible field | patch |
| B1.11 | ✅ | Verify disabled state on all field components | patch |
| B1.12 | ✅ | readOnly state on all field components | patch |
| B1.13 | ✅ | DateField locale formatting | patch |
| B1.14 | ✅ | TimeField 12h/24h format | patch |
| B1.15 | ✅ | FileUploadField drag-and-drop z-index fix | patch |
| B1.16 | ✅ | `onFocus` in FieldProps — wire to `engine.focusField(field.id)`. All 44 components. | minor |

### B2. New Field Components (🚫 Deferred)

| # | Status | Item | Version |
|---|--------|------|---------|
| B2.01-B2.10 | 🚫 | ColorPicker, Password, Autocomplete, TagInput, Currency, PhoneMask, DateRange, TimeRange, LikertScale, RichTextEditor | minor each |

### B3. Hooks & API

| # | Status | Item | Version |
|---|--------|------|---------|
| B3.01 | ✅ | JSDoc on useFormEngine | patch |
| B3.02 | ✅ | JSDoc on useFieldValue | patch |
| B3.03 | ✅ | JSDoc on useFieldError | patch |
| B3.04 | ✅ | JSDoc on useSectionProgress | patch |
| B3.05 | ✅ | `useFormDirty()` | patch |
| B3.06 | ✅ | `useFieldVisibility(fieldId)` | patch |
| B3.07 | ✅ | `useFormProgress()` | patch |
| B3.08 | ✅ | `useConditionalFields()` | patch |
| B3.09 | ✅ | `useFormSubmit()` | minor |
| B3.10 | ✅ | `useFieldOptions(fieldId)` | patch |

### B4. Theme System (🚫 Deferred)

| # | Status | Item | Version |
|---|--------|------|---------|
| B4.01-B4.10 | 🚫 | Dark theme, minimal theme, compact theme, accessible theme, CSS docs, ThemeProvider, useTheme, override support, print styles, responsive breakpoints | patch/minor |

### B5. Display Modes & Layout (✅ Shipped in core 1.6.0 + react 1.6.0)

> Shipped ahead of schedule. Core question-level navigation, all 3 display modes, and Pro integration are live.
> B5.B05 (prefers-reduced-motion) and B5.B06 (auto-advance) shipped in react 1.7.0.

#### B5-A. Core Engine — Question-Level Navigation (shipped in core 1.6.0)

| # | Status | Item |
|---|--------|------|
| B5.A01 | ✅ | Add `currentQuestionId`, `currentQuestionIndex`, `totalVisibleQuestions` to `NavigationState` |
| B5.A02 | ✅ | Add `resolveNextQuestionId()` and `resolvePrevQuestionId()` to navigation module |
| B5.A03 | ✅ | Add `nextQuestion()` and `prevQuestion()` methods to state-manager / engine |
| B5.A04 | ✅ | Add question-level progress: `questionProgressPercent` to FormState |
| B5.A05 | ✅ | Validate single question on `nextQuestion()` (not entire section) |
| B5.A06 | ✅ | Update `displayMode` Zod enum in schema-validator to accept `conversational` |
| B5.A07 | ✅ | Export question-level nav types from core index |
| B5.A08 | ✅ | Tests for question-level navigation (next/prev/boundary/showIf skip) |
| B5.A09 | ✅ | Bump core version, update CHANGELOG (shipped as 1.6.0, exceeded planned 1.5.0) |

#### B5-B. React Renderer — Display Mode Branching (shipped in react 1.6.0)

| # | Status | Item |
|---|--------|------|
| B5.B01 | ✅ | Refactor `FormEngineRenderer` — read `schema.settings?.displayMode` and branch |
| B5.B02 | ✅ | `classic` mode — render ALL visible sections at once (ClassicModeRenderer) |
| B5.B03 | ✅ | `stepped` mode — one section at a time (SteppedModeContent) |
| B5.B04 | ✅ | `conversational` mode — one question at a time (ConversationalRenderer) |
| B5.B05 | ✅ | Conversational: add `prefers-reduced-motion` media query — global reset in `formengine.css` |
| B5.B06 | ✅ | Conversational: auto-advance on selection fields (single_select, boolean, rating, nps, opinion_scale, likert, dropdown, country_select) — 350ms delay, `autoAdvance` prop |
| B5.B07 | ✅ | Conversational: keyboard Enter to advance on text/number fields |
| B5.B08 | ✅ | Respect `settings.showProgress` — hide progress bar when false |
| B5.B09 | ✅ | Respect `settings.progressStyle` — bar, steps, percentage |
| B5.B10 | ✅ | Respect `settings.navigation` — showBack, custom labels |
| B5.B11 | ✅ | CSS: `.fc-mode-classic`, `.fc-mode-stepped`, `.fc-mode-conversational` on form root |
| B5.B12 | ✅ | Bump react version, update CHANGELOG (shipped as 1.6.0, exceeded planned 1.4.0) |

#### B5-C. Publish & Pro Integration (✅ All shipped)

| # | Status | Item |
|---|--------|------|
| B5.C01 | ✅ | Build + test core |
| B5.C02 | ✅ | Build + test react |
| B5.C03 | ✅ | Publish core to npm (shipped as 1.6.0) |
| B5.C04 | ✅ | Publish react to npm (shipped as 1.6.0) |
| B5.C05 | ✅ | Update Pro peer deps to core ^1.6.0, react ^1.6.0 |
| B5.C06 | ✅ | Add display mode selector to Pro FormBuilder settings panel |
| B5.C07 | ✅ | Verify FormPreviewPanel renders correctly in all 3 modes |
| B5.C08 | ✅ | Bump Pro version (shipped as 1.6.4) |

#### B5-D. Remaining Layout Components (Deferred)

| # | Status | Item | Version |
|---|--------|------|---------|
| B5.D01-D05 | 🚫 | Collapsible sections, submit confirmation, form result screen enhancements, unsaved changes warning, section list sidebar | patch/minor |

### B6. React Testing (🚫 Deferred)

| # | Status | Item | Version |
|---|--------|------|---------|
| B6.01-B6.15 | 🚫 | Tests for ShortText, Email, Number, Dropdown, SingleSelect, MultiSelect, Boolean, Rating, Date, FileUpload, LongText, FormEngineRenderer integration, hooks, error boundary | patch |

### B7. Embed Build (🚫 Deferred — SaaS phase)

| # | Status | Item | Version |
|---|--------|------|---------|
| B7.01-B7.05 | 🚫 | Embed IIFE build, CSS scoping, Auto-GTAG, multiple instances, bundle size budget | minor |

### B8. React Performance & Compatibility

| # | Status | Item | Version |
|---|--------|------|---------|
| B8.01 | 🚫 | ~~`React.memo` on field components~~ — Not needed. Fields are stateless, parent re-renders regardless. `useSyncExternalStore` on full state is intentional. Optimize only if real perf issues on 100+ field forms. | — |
| B8.02 | 🚫 | ~~`"use client"` directives~~ — Not needed. Standard library pattern: consumer adds `"use client"`, not the library. Adding would prevent tree-shaking in non-RSC apps. | — |
| B8.03 | 🚫 | Scroll-to-first-error — deferred. `firstErrorFieldId` is computed but not wired. Wait for community requests or contributor PRs. | patch |
| B8.04 | 🚫 | ~~`forwardRef` on field components~~ — Not needed. `engine.focusField(fieldId)` via querySelector is cleaner. Ref would point to wrapper div, not inner input. | — |
| B8.05 | 🚫 | Section transition animations — deferred to focus on higher-priority features. | minor |

---

## Category C: Adapters (🚫 Deferred)

| # | Status | Item | Version |
|---|--------|------|---------|
| C1.01-C1.10 | 🚫 | Postgres improvements | patch/minor |
| C2.01-C2.10 | 🚫 | New adapters (Firebase, REST, S3, localStorage, etc.) | minor each |

---

## Category D: Templates (🚫 Deferred)

| # | Status | Item | Version |
|---|--------|------|---------|
| D1.01-D1.10 | 🚫 | Free template improvements | patch |
| D2.01-D2.10 | 🚫 | New free templates | minor each |

---

## Category G: Testing & Quality

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
| G1.08-G1.20 | 🚫 | Remaining engine tests | patch |

### G2-G4 (🚫 Deferred)

React component tests, adapter tests, infrastructure tests — deferred to post-Pro.

---

## Category H: Documentation & Website

### H1. Package Documentation

| # | Status | Item |
|---|--------|------|
| H1.01 | ✅ | CHANGELOG.md for Core |
| H1.02 | ✅ | CHANGELOG.md for React |
| H1.03 | ✅ | CHANGELOG.md for Adapters |
| H1.04 | ✅ | CHANGELOG.md for Templates-Free |
| H1.05 | ✅ | README.md for Templates-Free |
| H1.06 | ✅ | CONTRIBUTING.md |
| H1.07 | ✅ | CODE_OF_CONDUCT.md |
| H1.08 | ✅ | Update Core README with full API docs |
| H1.09 | ✅ | Update React README with component catalog |
| H1.10 | ⬚ | Update Adapters README with adapter catalog |
| H1.11 | ⬚ | Update root README with download badges |
| H1.12 | ✅ | SECURITY.md |
| H1.14 | ⬚ | Migration guide |
| H1.15 | ⬚ | Architecture overview doc |
| H1.16 | ⬚ | README audit and polish across all packages |

### H2. Website & Docs

✅ Website restructure complete. All docs in `website/content/docs/` as MDX.

### H3. Blog Posts (12 published, calendar below)

| # | Status | Item |
|---|--------|------|
| H3.01 | ✅ | Introducing FieldCraft |
| H3.02 | ✅ | FieldCraft Adapters Now Open Source |
| H3.03 | ✅ | Why Schema-Driven? Architecture Behind FieldCraft |
| H3.04 | ✅ | 6 Hard-Won UX Lessons from Building a Form Engine |
| H3.05 | ✅ | Build Forms Without Code: Introducing FormBuilder |
| H3.06 | ✅ | Schema-Driven vs Code-Driven Forms |
| H3.07 | ✅ | Build a Multi-Step Survey in 5 Minutes |
| H3.08 | ✅ | How FieldCraft's Validation Pipeline Works |
| H3.09 | ✅ | The Real Cost of Building Forms From Scratch |
| H3.10 | ✅ | Self-Hosted vs Cloud Forms: Developer's Guide |
| H3.11 | ✅ | Building Accessible Forms |
| H3.12 | ✅ | Conversational Forms: One Question at a Time |

### H4. Website — Technical SEO Fixes

| # | Status | Item |
|---|--------|------|
| H4.01 | ⬚ | Add JSON-LD `TechArticle` structured data to docs pages |
| H4.02 | ⬚ | Add OpenGraph metadata to docs pages |
| H4.03 | ⬚ | Add canonical URLs to all pages |
| H4.04 | ⬚ | Add BreadcrumbList structured data (homepage, blog, docs) |
| H4.05 | ⬚ | Fix docs "Edit on GitHub" link (currently `#`) |
| H4.06 | ⬚ | Submit sitemap to Google Search Console (manual) |
| H4.07 | ⬚ | Submit sitemap to Bing Webmaster Tools (manual) |
| H4.08 | ✅ | Fix console banners: core v1.5.1→1.6.0, react v1.3.0→1.6.0. Also fixed field count 44→42, removed stale telemetry line from core. |
| H4.09 | ⬚ | npm README overhaul — add links to docs, blog, /pro page |
| H4.10 | ⬚ | Cross-post top 3 existing blogs to Dev.to (with canonical URLs) |

### H5. New Docs Pages

| # | Status | Item | Ships After |
|---|--------|------|-------------|
| H5.01 | ⬚ | Pro: Getting Started (install → activate → render) | Pro QA sprint (Week 2) |
| H5.02 | ⬚ | Migrating from Formik | Week 9 |
| H5.03 | ⬚ | Migrating from React Hook Form | Week 11 |
| H5.04 | ⬚ | Next.js Integration guide | Week 10 |
| H5.05 | ⬚ | API Reference (FormEngine class) | Week 13 |
| H5.06 | ⬚ | Performance & Bundle Size benchmarks | Week 14 |
| H5.07 | ⬚ | i18n / Localization guide | Week 15 (after A9 ships) |
| H5.08 | ⬚ | Telehealth: Clinical Fields reference | Week 12 |
| H5.09 | ⬚ | Telehealth: Instruments & Scoring reference | Week 16 |
| H5.10 | ⬚ | Telehealth: Intake Templates gallery | Week 16 |
| H5.11 | ⬚ | Display Modes guide (classic/stepped/conversational) | B5 shipped — ready to write |

### H6. Blog Calendar — Sequenced to Feature Releases

**Rule:** A blog post about a feature must ship AFTER that feature is live. Posts about existing features can ship any time.

**Pillar rotation:** Build (tutorial) → Solve (use case) → Build (tutorial) → Compare → repeat

| Week | Pillar | Blog Post | Depends On | Feature shipped same week |
|------|--------|-----------|------------|--------------------------|
| 1 | — | *(QA sprint, no post)* | — | QA.01–QA.05 |
| 2 | — | *(QA sprint, no post)* | — | QA.06–QA.09 |
| 3 | Build | How FieldCraft Handles Form Validation — Schema to Error | Already shipped | H4.01–H4.04 (SEO fixes) |
| 4 | Solve | Building HIPAA-Compliant Forms with FieldCraft Pro | Pro live (Week 2-3) | H4.05–H4.07 (SEO fixes) |
| 5 | Build | Create a Theme-Aware Form with CSS Variables | Already shipped | D3.01–D3.02 (Pro templates) |
| 6 | Compare | FieldCraft vs SurveyJS vs Form.io | Already shipped | D3.03–D3.04 (Pro templates) |
| 7 | Build | Conversational Forms: One-Question-at-a-Time UX | Already shipped (blog exists, but new angle) | H4.09 (npm README overhaul) |
| 8 | Build | Display Modes — Classic vs Stepped vs Conversational | Already shipped (B5) | H5.11 (Display Modes doc) |
| 9 | Compare | Migrating from Formik to FieldCraft | Already shipped | H5.02 (Formik migration doc) |
| 10 | Build | Building Forms in Next.js with FieldCraft | Already shipped | H5.04 (Next.js doc) |
| 11 | Compare | Migrating from React Hook Form to FieldCraft | Already shipped | H5.03 (RHF migration doc) |
| 12 | Solve | Clinical Instruments in React — PHQ-9, GAD-7 | Telehealth shipped | H5.08 (Telehealth clinical docs) |
| 13 | Build | FieldCraft API Reference Deep Dive | Already shipped | H5.05 (API reference doc) |
| 14 | Compare | React Form Library Bundle Sizes (2026) | Already shipped | H5.06 (Bundle size doc) |
| 15 | Build | Internationalized Forms with FieldCraft | A9 i18n must ship first | A9.01–A9.05 (i18n) + H5.07 |
| 16 | Solve | Patient Intake Forms for Telehealth Apps | Telehealth shipped | H5.09–H5.10 (Telehealth docs) |
| 17 | Build | Self-Hosted vs Cloud Forms (updated) | Already shipped | — |
| 18 | Build | Multi-Tenant Form Hosting Architecture | SaaS S1 must ship first | — |
| 19 | Build | Embed a Form on Any Website | SaaS S3 must ship first | — |
| 20 | Build | Zero-PII Form Submission Architecture | SaaS S4 must ship first | — |
| 21 | Build | Custom Domains for Hosted Forms | SaaS S3.04 must ship first | — |
| 22 | Compare | Webhooks vs Database — Form Submission Patterns | SaaS S4 must ship first | — |
| 23 | Solve | Launching FieldCraft SaaS — Free Tier Live | SaaS S5 must ship first | — |
| 24 | Build | From npm Package to SaaS Platform | SaaS live | — |

**Note:** Weeks 18-24 depend on SaaS features shipping (tracked in `fieldcraft-pro/.plan/roadmap.md` Track 3). These posts must NOT be published before those features go live.

### H7. Website — Developer Attraction & Positioning

> Goal: Make the website the obvious choice for a React developer evaluating form libraries.
> Positioning: Open-source, React-first (community adapters for other frameworks welcome), self-hosted, MIT licensed.

| # | Status | Item |
|---|--------|------|
| H7.01 | ✅ | **Hero rewrite** — Added `GitHubStars` async server component (fetches star count at build time, 1h ISR). GitHub icon badge in hero badges row. GitHub icon link in nav + mobile drawer. |
| H7.02 | ✅ | **Data ownership & trust strip** — Added `TrustStrip` section between SubmissionPipeline and ComparisonTable: 4 cards covering data ownership, no tracking, HIPAA/GDPR-ready, MIT auditable source. Open-source messaging is also in hero eyebrow, badges, and footer. |
| H7.03 | ⬚ | **Interactive playground page** (`/playground`) — Live form editor: JSON schema on left, rendered form on right. Let devs try before installing. (shadcn has a theme playground, Radix has live examples.) |
| H7.04 | ⬚ | **"Why FieldCraft" page** (`/why`) — Feature grid comparing FieldCraft vs building from scratch vs hosted services vs SurveyJS-style tools. Focus on: bundle size, data ownership, field type count, React-native DX, one-time pricing vs recurring. Use your own data, not their branding. |
| H7.05 | ✅ | **Framework contribution callout** — Added to Architecture section sidebar: "Built for React. Open to every framework." callout with teal accent, explains core is framework-free, links to GitHub for contributions. |
| H7.06 | ⬚ | **Code-first hero demo** — Replace or supplement HeroTabs with a 10-line code snippet showing schema → rendered form. Devs want to see code, not prose. |
| H7.07 | ⬚ | **Feature stats strip** — Homepage strip with live-from-source numbers: "44 field types · 19 validators · 25 condition operators · 3 display modes · 4 adapters". Update via M3 rule. |
| H7.08 | ⬚ | **"Used by" / social proof section** — Even if early, show GitHub contributor avatars, npm download chart, or community Discord member count. SurveyJS shows G2 badges — you show GitHub activity. |
| H7.09 | ✅ | **Quick start on homepage** — Already exists in HowItWorks section (3-step: install → schema → render with inline code), plus CopyInstall button in hero. No changes needed. |
| H7.10 | ⬚ | **Comparison page** (`/compare`) — Standalone page: FieldCraft vs React Hook Form vs Formik vs SurveyJS. Feature table with honest ticks/crosses. Note: Compare categories (bundle size, field types, schema-driven, builder, i18n, pricing), never use competitor logos or copy their text. |
| H7.11 | ⬚ | **Bundle size badge** — Add minified+gzip size to hero or SpecStrip. Developers care about this. Show it proudly if it's small. |
| H7.12 | ✅ | **"Contribute" nav link** — GitHub icon in nav + mobile drawer links to repo. Footer already has GitHub/npm/Discord column. Separate "Contribute" link not needed — repo README links to CONTRIBUTING.md. |
| H7.13 | ⬚ | **Docs: "Extend for other frameworks"** — Doc page explaining how core is headless, how the React renderer works, and how someone could build a Vue/Svelte/Angular renderer. Architecture diagram. |

---

## Category I: Infrastructure & Community

| # | Status | Item |
|---|--------|------|
| I1.06 | ✅ | FUNDING.yml |
| I1.01-I1.05, I1.07-I1.08 | 🚫 | CI/CD, npm badges, deprecations — deferred |

### I2. Community Seeding (ongoing, with each blog post)

| Platform | Frequency | Content |
|----------|-----------|---------|
| Dev.to | Every blog post | Cross-post with canonical URL back to fieldcraft.squaredr.tech |
| Reddit r/reactjs | 2x/month | Tutorials only, not product pitches |
| Reddit r/healthIT | 1x/month | Healthcare/telehealth posts |
| X/Twitter | Every blog post | Thread format (hook → 3 key points → CTA) |
| LinkedIn | 2x/month | Engineering deep dives |
| Hacker News | 1x/month max | Only engineering deep dives, never product pitches |

**Rule:** Never >1 link per platform per week. Be a community member, not a spammer.

---

## Version History

### v1.4.x (shipped)

| Package | From | To |
|---------|------|----|
| `@squaredr/fieldcraft-core` | 1.3.14 | 1.4.1 |
| `@squaredr/fieldcraft-react` | 1.2.12 | 1.3.0 |

### v1.7.0 (shipping — repeater aggregates)

| Package | From | To | Change |
|---------|------|----|--------|
| `@squaredr/fieldcraft-core` | 1.6.0 | 1.7.0 | Repeater aggregate functions (SUM/AVG/COUNT/MIN/MAX), dot-notation sub-field refs, dynamic version banner |

### v1.6.0 (shipped — includes display modes + all v1.4.x–v1.5.x features)

| Package | From | To | Change |
|---------|------|----|--------|
| `@squaredr/fieldcraft-core` | 1.4.1 | 1.6.0 | Question-level navigation, displayMode enum, validators, utilities |
| `@squaredr/fieldcraft-react` | 1.3.0 | 1.7.0 | Classic/stepped/conversational renderer, aria utilities, hooks, auto-advance, reduced-motion |

### Remaining Patches (can ship in any 1.6.x)

| Item | Status | Description |
|------|--------|-------------|
| B5.B05 | ✅ | `prefers-reduced-motion` media query — shipped in react 1.7.0 |
| B5.B06 | ✅ | Auto-advance on selection fields — shipped in react 1.7.0 |
| H4.08 | ✅ | Fix console banner: core v1.5.1→1.6.0, react v1.3.0→1.6.0 — shipped |
