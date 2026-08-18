# FieldCraft OSS — Roadmap

> All shippable items for the OSS packages. Updated as tasks complete.
> Start: June 13, 2026 · Daily effort: 2-4 hours
> This plan covers: core, react, adapters, templates-free, website, docs, blog, community.

---

## Status Legend

- ✅ Done
- 🔄 In Progress
- ⬚ Pending
- 🚫 Deferred (not in v1.4.0 release)

---

## v1.4.0 Release Plan

All items below marked ✅ have shipped in core 1.4.0, react 1.3.0.
Items marked 🚫 are deferred to future releases (post-Pro).

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
| A2.09 | 🚫 | Debounced validation support | patch |
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
| B1.04 | ⬚ | Verify aria-label on all 44 field components | patch |
| B1.05 | ⬚ | Verify aria-describedby for help text | patch |
| B1.06 | ⬚ | Verify aria-invalid + aria-errormessage for errors | patch |
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

### B5. Display Modes & Layout (🔄 Unblocks Pro)

> **Priority: HIGH.** Pro FormBuilder preview depends on the renderer supporting all 3 display modes.
> Must publish core 1.5.0 + react 1.4.0 before Pro can use these.

#### B5-A. Core Engine — Question-Level Navigation (core 1.5.0)

| # | Status | Item |
|---|--------|------|
| B5.A01 | ⬚ | Add `currentQuestionId`, `currentQuestionIndex`, `totalVisibleQuestions` to `NavigationState` |
| B5.A02 | ⬚ | Add `resolveNextQuestionId()` and `resolvePrevQuestionId()` to navigation module |
| B5.A03 | ⬚ | Add `nextQuestion()` and `prevQuestion()` methods to state-manager / engine |
| B5.A04 | ⬚ | Add question-level progress: `questionProgressPercent` to FormState |
| B5.A05 | ⬚ | Validate single question on `nextQuestion()` (not entire section) |
| B5.A06 | ⬚ | Update `displayMode` Zod enum in schema-validator to accept `conversational` |
| B5.A07 | ⬚ | Export question-level nav types from core index |
| B5.A08 | ⬚ | Tests for question-level navigation (next/prev/boundary/showIf skip) |
| B5.A09 | ⬚ | Bump core to 1.5.0, update CHANGELOG |

#### B5-B. React Renderer — Display Mode Branching (react 1.4.0)

| # | Status | Item |
|---|--------|------|
| B5.B01 | ⬚ | Refactor `FormEngineRenderer` — read `schema.settings?.displayMode` and branch |
| B5.B02 | ⬚ | `classic` mode — render ALL visible sections at once, no navigation buttons, validate on submit |
| B5.B03 | ⬚ | `stepped` mode — current behavior (one section at a time), extract into clean component |
| B5.B04 | ⬚ | `conversational` mode — one question at a time, centered layout, animated transitions |
| B5.B05 | ⬚ | Conversational: CSS transitions for question enter/exit (slide + fade, respect `prefers-reduced-motion`) |
| B5.B06 | ⬚ | Conversational: auto-advance on selection fields (yes/no, radio, dropdown) |
| B5.B07 | ⬚ | Conversational: keyboard Enter to advance on text/number fields |
| B5.B08 | ⬚ | Respect `settings.showProgress` — hide progress bar when false |
| B5.B09 | ⬚ | Respect `settings.progressStyle` — bar (current), steps (step indicators), percentage (text) |
| B5.B10 | ⬚ | Respect `settings.navigation` — showBack, showSectionList, custom labels, allowSkip |
| B5.B11 | ⬚ | CSS: `.fc-mode-classic`, `.fc-mode-stepped`, `.fc-mode-conversational` on form root |
| B5.B12 | ⬚ | Bump react to 1.4.0, update CHANGELOG |

#### B5-C. Publish & Pro Integration

| # | Status | Item |
|---|--------|------|
| B5.C01 | ⬚ | Build + test core (all existing tests must pass + new navigation tests) |
| B5.C02 | ⬚ | Build + test react |
| B5.C03 | ⬚ | Publish core 1.5.0 to npm |
| B5.C04 | ⬚ | Publish react 1.4.0 to npm |
| B5.C05 | ⬚ | Update Pro peer deps to core ^1.5.0, react ^1.4.0 |
| B5.C06 | ⬚ | Add display mode selector to Pro FormBuilder settings panel |
| B5.C07 | ⬚ | Verify FormPreviewPanel renders correctly in all 3 modes |
| B5.C08 | ⬚ | Bump Pro version, update Pro CHANGELOG |

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

### H3. Blog Posts

| # | Status | Item |
|---|--------|------|
| H3.01-H3.07 | ✅ | Multi-step survey, schema vs code, validation pipeline, conversational forms, cost of building, self-hosted vs cloud, accessible forms |
| H3.08-H3.25 | 🚫 | Remaining blog posts — deferred to post-launch |

---

## Category I: Infrastructure & Community

| # | Status | Item |
|---|--------|------|
| I1.06 | ✅ | FUNDING.yml |
| I1.01-I1.05, I1.07-I1.08 | 🚫 | CI/CD, npm badges, deprecations — deferred |
| I2.01-I2.12 | 🚫 | Community marketing — deferred to post-launch |

---

## Execution Order for v1.4.0

Work sequentially through these groups:

| Group | Items | Area |
|-------|-------|------|
| 1 | A1.12-A1.15, A1.06 | New validators |
| 2 | A1.05 | Repeater circular import fix |
| 3 | A3.04-A3.06, A3.08, A3.12, A3.16, A3.20 | Engine methods |
| 4 | A7.11 | Readonly field state |
| 5 | A3.17 | beforeSubmit hook |
| 6 | A3.18 | onEvent analytics |
| 7 | A3.13, A3.14, A3.19 | Draft improvements |
| 8 | A3.15 | Data export |
| 9 | A4.01-A4.05 | New condition operators |
| 10 | A4.07-A4.09 | Expression functions |
| 11 | A2.01-A2.02, A2.05-A2.08, A2.11 | Validator enhancements |
| 12 | A6.03-A6.08 | HTTP adapter enhancements |
| 13 | A7.01-A7.02, A7.04, A7.10, A7.12 | Schema metadata |
| 14 | A7.05-A7.07, A8.01-A8.05, A8.07-A8.09, A8.11-A8.13 | Utilities |
| 15 | A5.08-A5.10 | Type exports |
| 16 | B1.16 | React onFocus |
| 17 | B1.02, B1.04-B1.15 | React field fixes |
| 18 | B3.05-B3.10 | React hooks |
| 19 | H1.08-H1.16, H1.12, I1.06 | Community & docs |
| 20 | — | Build + test + version bump |
| 21 | — | Roadmap updates |

---

## Version Target

### v1.4.x (shipped)

| Package | From | To |
|---------|------|----|
| `@squaredr/fieldcraft-core` | 1.3.14 | 1.4.1 |
| `@squaredr/fieldcraft-react` | 1.2.12 | 1.3.0 |

### v1.5.0 (display modes — next)

| Package | From | To | Change |
|---------|------|----|--------|
| `@squaredr/fieldcraft-core` | 1.4.1 | 1.5.0 | Question-level navigation, displayMode enum fix |
| `@squaredr/fieldcraft-react` | 1.3.0 | 1.4.0 | Classic/stepped/conversational renderer branching |

### Execution Order for v1.5.0

| Step | Items | Area |
|------|-------|------|
| 1 | B5.A01–A05 | Core: question-level navigation state + methods |
| 2 | B5.A06–A07 | Core: schema validator fix + exports |
| 3 | B5.A08 | Core: tests for question navigation |
| 4 | B5.A09 | Core: version bump 1.5.0 + changelog |
| 5 | B5.B01–B03 | React: renderer refactor, classic mode, stepped mode extraction |
| 6 | B5.B04–B07 | React: conversational mode (one-at-a-time, transitions, auto-advance, keyboard) |
| 7 | B5.B08–B10 | React: settings support (progress, navigation config) |
| 8 | B5.B11–B12 | React: CSS mode classes + version bump 1.4.0 + changelog |
| 9 | B5.C01–C04 | Build, test, publish both packages |
| 10 | B5.C05–C08 | Pro: update peer deps, add mode selector, verify preview, bump Pro |
