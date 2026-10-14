# Changelog

All notable changes to `@squaredr/fieldcraft-react` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.13.0] - 2026-10-14

### Fixed
- **Fourteen field components had a label pointing at nothing.** `FieldWrapper` emits `<Label htmlFor={field.id}>`, but those components never set a matching `id` on anything — so clicking the label focused nothing and the field had no accessible name. A WCAG 1.3.1 and 4.1.2 failure, and harsher than a missing attribute: `AppointmentField`, `CalculatedField`, `FileUploadField`, `ImageCaptureField`, `LikertField`, `MatrixField`, `NpsField`, `OpinionScaleField`, `PaymentField`, `RankingField`, `RatingField`, `RepeaterField`, `ScoringField`, `SignatureField`. Also `AddressField`, `MultiSelectField` and `SingleSelectField`, which set per-option ids (`-street`, `-other`) that the field-level label could never match.
- Composite fields now carry `aria-invalid`, `aria-required` and `aria-describedby`, so their errors and help text are announced. Previously `FieldWrapper`'s own `id="{field.id}-error"` block was announced to nobody.

### Added
- `groupAria(field, hasError)` — aria attributes for a composite field's group container. Pairs with `FieldWrapper`'s new `composite` prop.
- `FieldWrapper` takes `composite` for fields rendered as a group of controls rather than one focusable input. `<label for>` is only valid pointing at a single labelable element; for a group the label is rendered as text with id `{field.id}-label` and the group names itself with `aria-labelledby`.

### Changed
- `MatrixField`'s container moved from `role="region"` to `role="group"`, and `RankingField`'s ad-hoc `aria-label` is replaced by `groupAria`. Both had named themselves but carried no error or help association.

## [1.12.0] - 2026-10-13

### Added
- **A real `<form>` element**, in all three display modes. There had been none — the root was a `div` and submit was `type="button"`, so Enter did not submit, password managers never offered to save, and screen readers got no form landmark. One rule covers every mode: a submit event means the respondent is done with what is in front of them, and the engine decides whether that means advance or finish.
- `onSubmitError` — called when a submission fails for a reason the respondent cannot fix. Return `false` to suppress the built-in notice and present your own, mirroring the `beforeSubmit` convention. Return nothing and you get the detail *and* the default message.
- `submitErrorLabel` — overrides the built-in delivery-failure message, for translation.
- `SubmitErrorNotice` — the fallback notice. Shows a fixed, calm string; never `state.submitError`, which carries hostnames and ports.
- `FormActionsContext` / `useFormActions` — navigation actions for the few *screen* field types that are chrome rather than inputs and legitimately need to move the form on.
- `FormattedText` and `inlineMarkdownToHtml` — the narrow markdown subset for `labelFormat` / `helpTextFormat` / `contentFormat`. Bold, italic, code, links, lists, line breaks; deliberately not headings, images or tables. Exported so a custom field component formats labels the way the built-ins do.
- `insideForm` on `NavigationButtons` and `ConversationalRenderer` — set when rendered inside a form whose submit handler already advances, so Enter and a click take one path.
- `DEPRECATED_FIELD_TYPES`, `REPLACED_FIELD_TYPES`, `DEPRECATION_REMOVAL_DATE` — check a schema in a lint rule or CI script rather than waiting for a console warning.

### Changed
- **Submit failures are visible.** Every `!result.success` was treated as a validation failure, so a network error or a 500 produced an empty `onValidationError` and the respondent saw nothing at all. Validation failures and delivery failures are now distinguished.
- `Button` defaults to `type="button"` unless `asChild`. HTML defaults a bare button to submit, so inside a form every unmarked button — a date-picker trigger, a calendar day cell, a dropdown toggle — would have submitted the form. Fixes the class rather than the instances.
- Removed `ConversationalRenderer`'s hand-rolled `keydown` listener. The browser does all of it natively once a real form exists, including leaving Enter alone inside a textarea.

### Deprecated
- Nineteen field types scheduled for removal on **2027-07-01**, with a one-off development warning: `signature`, `payment`, `matrix`, `image_capture`, `appointment`, `file_upload`, `address`, `repeater`, `ranking`, `scoring`, `phone_international`, `legal_name`, `country_select`, `date_range`, `time`, `slider`, `welcome-screen`, `image`, `video`. Nothing breaks before that date, and self-registering the component keeps any of them working afterwards. See `/docs/deprecations`.
- `rich-text` — replaced rather than relocated. Use `labelFormat` on a question or `contentFormat` on an `info_block`: a separate block is unrelated content to a screen reader, vanishes in conversational mode, and is left behind when the question is reordered.

### Fixed
- **The welcome screen's Start button did nothing.** It queried `[data-question-index="1"]`, an attribute that existed nowhere in the package, so the lookup always returned null. It now advances through the engine.
- `DateField`, `DateRangeField` and `DropdownField` had popover triggers with no explicit `type`.

## [1.11.1] - 2026-09-03

### Changed
- Version bump accompanying the documentation pass.

## [1.11.0] - 2026-09-03

### Fixed
- A broken renderer import in the docs, and several inaccurate counts.

## [1.10.0] - 2026-08-30

### Changed
- Version alignment release across the workspace.

## [1.9.2] - 2026-08-30

### Changed
- Base fields standardised and aligned with shadcn/ui primitives.

## [1.9.1] - 2026-08-29

### Fixed
- Followed core's `evaluateFunction()` wiring in the calculated-field pipeline.

## [1.9.0] - 2026-08-28

### Changed
- Audit fixes: config-driven validation and six field fixes.

## [1.8.0] - 2026-08-28

### Fixed
- Required core 1.7.1, since the published 1.7.0 was missing `timezoneField`.

## [1.7.0] - 2026-08-26

### Added
- Auto-advance in conversational mode, with reduced-motion support.

### Changed
- `templates-free` renamed to `templates`.

## [1.6.0] - 2026-08-22

### Removed
- Preset exports. The renderer now auto-inherits the host page's CSS variables.

## [1.4.0] - 2026-08-18

### Added
- **Display modes** — `classic`, `stepped` and `conversational`, selected by one field in the schema.

## [1.3.0] - 2026-08-16

### Changed
- OSS hardening release.

## [1.2.12] - 2026-07-14

### Fixed
- Corrected the version banner.

## [1.2.11] - 2026-07-14

### Fixed
- `README.md` added to the npm `files` list, and GitHub URLs corrected in READMEs and banners.

## [1.2.10] - 2026-06-09

### Fixed
- Pass `undefined` instead of empty string to Radix RadioGroup `value` prop — empty string is treated as a valid controlled value but no `SelectItem` matches it, causing silent failures

## [1.2.9] - 2026-06-05

### Changed
- Consolidated release with Core 1.3.4

## [1.2.8] - 2026-06-03

### Fixed
- Internal patch for publish alignment

## [1.2.7] - 2026-06-03

### Fixed
- Internal patch for publish alignment

## [1.2.6] - 2026-06-03

### Fixed
- Internal patch for publish alignment

## [1.2.5] - 2026-06-03

### Fixed
- Internal patch for publish alignment

## [1.2.4] - 2026-06-03

### Fixed
- Internal patch for publish alignment

## [1.2.3] - 2026-06-02

### Added
- `updateFieldCustomProps` support in React renderer

## [1.2.2] - 2026-05-25

### Changed
- Updated Discord invite links across console banners

### Fixed
- TS2580 `process` type error in console banners
- Corrected Admin Pro URLs in Discord banners

## [1.2.1] - 2026-05-23

### Fixed
- Prevent "FormEngine has been destroyed" error in React Strict Mode — engine now lives in `useRef` and is never destroyed in `useEffect` cleanup

## [1.2.0] - 2026-05-22

### Added
- Exported UI primitives (`Button`, `Input`, `Select`, `Card`, etc.) from public API for consumer reuse

## [1.1.1] - 2026-05-19

### Fixed
- Internal fix after peerDependencies migration

## [1.1.0] - 2026-05-19

### Added
- 10 content/visual field components for FormBuilder support: `InfoBlockField`, `DividerField`, `SpacerField`, `SectionHeaderField`, `PageBreakField`, `WelcomeScreenField`, `ThankYouScreenField`, `RichTextField`, `ImageField`, `VideoField`

### Changed
- Moved `@squaredr/fieldcraft-core` from dependencies to peerDependencies

## [1.0.4] - 2026-05-16

### Added
- `SectionHeaderField` and `PageBreakField` structural components

### Fixed
- Workspace dependency resolution for npm publish

## [1.0.3] - 2026-05-14

### Fixed
- React Strict Mode double-mount causing stale engine subscriptions in `useFormEngine` — `subscribe` and `getSnapshot` now wrapped in `useMemo` for stable references

## [1.0.2] - 2026-05-08

### Changed
- Bumped alongside adapters v1.0.0 publish

## [1.0.1] - 2026-04-08

### Fixed
- Workspace dependency resolution issue

## [1.0.0] - 2026-04-08

### Added
- Initial release as `@squaredr/fieldcraft-react` (renamed from FormEngine)
- `FormEngineRenderer` component for rendering form schemas
- `FormErrorBoundary` component for graceful field-level error handling
- `useFormEngine` hook with `useSyncExternalStore` for reactive state
- `useFieldValue` hook for subscribing to individual field values
- `useFieldError` hook for subscribing to field validation errors
- `useSectionProgress` hook for multi-step form progress tracking
- 34 input field components: `ShortTextField`, `LongTextField`, `EmailField`, `NumberField`, `PhoneField`, `UrlField`, `DateField`, `TimeField`, `DropdownField`, `SingleSelectField`, `MultiSelectField`, `BooleanField`, `RatingField`, `SliderField`, `FileUploadField`, `SignatureField`, `CountrySelectField`, `PhoneInternationalField`, `CheckboxGroupField`, `RadioGroupField`, `RepeaterField`, and more
- Default field registry with all field types mapped
- Built on shadcn/ui + Tailwind CSS with `fc-` prefixed CSS classes
- CSS custom property theming: `--sr-*` → `--fc-*` → shadcn `--*` variables

[1.2.10]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.2.10
[1.2.9]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.2.9
[1.2.8]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.2.8
[1.2.7]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.2.7
[1.2.6]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.2.6
[1.2.5]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.2.5
[1.2.4]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.2.4
[1.2.3]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.2.3
[1.2.2]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.2.2
[1.2.1]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.2.1
[1.2.0]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.2.0
[1.1.1]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.1.1
[1.1.0]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.1.0
[1.0.4]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.0.4
[1.0.3]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.0.3
[1.0.2]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.0.2
[1.0.1]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.0.1
[1.0.0]: https://www.npmjs.com/package/@squaredr/fieldcraft-react/v/1.0.0
