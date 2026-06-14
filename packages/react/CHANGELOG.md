# Changelog

All notable changes to `@squaredr/fieldcraft-react` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
