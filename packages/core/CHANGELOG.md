# Changelog

All notable changes to `@squaredr/fieldcraft-core` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.11] - 2026-06-26

### Added
- 42 test cases for `expression-parser.ts` in `__tests__/expression-parser.test.ts`
- Tests cover: basic arithmetic (+, -, *, /, ^), operator precedence, right-associative power, parentheses (nested, mismatched), unary minus, decimal numbers, whitespace handling, division by zero, all 6 math functions (floor, ceil, round, abs, min, max), Math.* prefix variants, function composition with arithmetic, complex formulas (BMI, compound interest), error cases (unknown function, unexpected char, invalid expression)

## [1.3.10] - 2026-06-26

### Added
- 18 test cases for `draft-manager.ts` in `__tests__/draft-manager.test.ts`
- Tests cover: save/load/clear lifecycle, TTL expiry, localStorage and server adapter modes, `"both"` storage mode, `hasDraft()`, multi-form isolation (different schemaIds and sessionTokens), SSR safety (no localStorage), data integrity through save/load cycles

## [1.3.9] - 2026-06-26

### Added
- JSDoc documentation on all 12 built-in validators in `validators/built-in.ts`
- `@description`, `@param`, `@since`, and schema usage examples on: `required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `email`, `phone`, `url`, `date`, `fileSize`, `fileType`
- JSDoc on the `runBuiltInRule` dispatcher with `@example` block
- JSDoc on the `isEmpty` helper and regex constants (`EMAIL_REGEX`, `PHONE_REGEX`)

## [1.3.8] - 2026-06-22

### Added
- JSDoc documentation on all public engine API methods in `engine/create-engine.ts`
- `@description`, `@example`, `@param`, `@returns`, `@throws`, and `@since` tags on `FormEngine`, `EngineOptions`, `ValidationResult` types
- Inline JSDoc on all 24 `FormEngine` methods (navigation, values, visibility, drafts, validation, submission, schema lookups, lifecycle)
- JSDoc on the `createEngine` factory function

## [1.3.7] - 2026-06-20

### Added
- JSDoc documentation on all 78 exported types across 9 type files (`types/schema.ts`, `types/validation.ts`, `types/conditions.ts`, `types/settings.ts`, `types/state.ts`, `types/response.ts`, `types/adapters.ts`, `types/theme.ts`, `types/question-types.ts`)
- `@description`, `@example`, `@since`, and `@param` tags on all major interfaces and type aliases
- Inline property-level JSDoc on all type members (FormEngineSchema, Question, FormState, FormSettings, etc.)

## [1.3.6] - 2026-06-16

### Fixed
- H3: Email regex now requires minimum 2 characters after last dot (TLD check) — rejects `user@example.c` while accepting `user@example.co`
- H8: Custom validator execution wrapped in try/catch — a throwing custom validator no longer crashes the form, instead produces error `"Custom validator '${name}' threw: ${message}"`

### Added
- 19 email validator test cases covering valid emails, invalid TLDs, edge cases
- 5 custom validator error-handling test cases (throws Error, string, undefined, multi-validator resilience)

## [1.3.4] - 2026-06-05

### Added
- `updateFieldCustomProps` method on FormEngine API for updating custom field properties at runtime

### Changed
- Consolidated release with React 1.2.9

## [1.3.3] - 2026-06-03

### Fixed
- Internal patch for publish alignment

## [1.3.2] - 2026-06-03

### Fixed
- Internal patch for publish alignment

## [1.3.1] - 2026-06-02

### Added
- `updateFieldCustomProps` engine method for programmatic custom property updates

## [1.3.0] - 2026-05-27

### Fixed
- M1: NaN guard in calculated fields — `isNaN()`/`!isFinite()` checks in `calculated-resolver.ts`
- M2: Silent validator skip now logs warning instead of silently ignoring unknown validators
- C4: HTTP schema adapter caching — TTL-based cache in `http-schema-adapter.ts`
- C6: HTTP submit adapter retry — exponential backoff in `http-adapter.ts`

## [1.2.1] - 2026-05-25

### Changed
- Updated Discord invite links across console banners

### Fixed
- TS2580 `process` type error in console banners
- Corrected Admin Pro URLs in Discord banners

## [1.2.0] - 2026-05-19

### Added
- 10 content/visual field types for FormBuilder support: `info_block`, `divider`, `spacer`, `section_header`, `page_break`, `welcome-screen`, `thank-you-screen`, `rich-text`, `image`, `video`

## [1.1.0] - 2026-05-16

### Added
- `SchemaAdapter` interface for loading/saving form schemas from external sources
- `HttpSchemaAdapter` — HTTP-based schema adapter with TTL caching

## [1.0.3] - 2026-05-16

### Fixed
- Internal publish alignment with workspace dependencies

## [1.0.2] - 2026-05-08

### Changed
- Bumped alongside adapters v1.0.0 publish

## [1.0.1] - 2026-04-08

### Fixed
- Workspace dependency resolution issue

## [1.0.0] - 2026-04-08

### Added
- Initial release as `@squaredr/fieldcraft-core` (renamed from FormEngine)
- Form engine with multi-section support and section navigation
- Condition evaluator with 16 operators (equals, notEquals, greaterThan, lessThan, contains, etc.)
- Expression parser with shunting-yard algorithm for calculated fields
- Validation runner with sync validation pipeline
- Built-in validators: `required`, `minLength`, `maxLength`, `min`, `max`, `pattern`, `email`
- Draft manager with localStorage persistence and TTL support
- Prefill resolver for URL params and programmatic prefill
- HTTP adapter for form submission with retry logic
- Schema validator for runtime schema structure checks
- Full TypeScript type definitions for `FormSchema`, `FieldConfig`, `SectionConfig`, `ConditionGroup`, `ValidationRule`

[1.3.11]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.3.11
[1.3.10]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.3.10
[1.3.9]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.3.9
[1.3.8]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.3.8
[1.3.7]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.3.7
[1.3.6]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.3.6
[1.3.4]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.3.4
[1.3.3]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.3.3
[1.3.2]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.3.2
[1.3.1]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.3.1
[1.3.0]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.3.0
[1.2.1]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.2.1
[1.2.0]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.2.0
[1.1.0]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.1.0
[1.0.3]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.0.3
[1.0.2]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.0.2
[1.0.1]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.0.1
[1.0.0]: https://www.npmjs.com/package/@squaredr/fieldcraft-core/v/1.0.0
