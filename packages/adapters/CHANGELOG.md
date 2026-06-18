# Changelog

All notable changes to `@squaredr/fieldcraft-adapters` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-06-18

### Added
- CHANGELOG.md with retroactive entries for all published versions

## [1.0.0] - 2026-05-27

### Added
- Unified `@squaredr/fieldcraft-adapters` package consolidating all adapters
- **Postgres adapter** (`@squaredr/fieldcraft-adapters/postgres`)
  - Response submission and retrieval with Drizzle ORM
  - AES-256-GCM field-level encryption via `encryptionKey` option
  - Draft save/load support via `PostgresDraftAdapter`
  - Configurable callbacks (`onSubmitSuccess`, `onSubmitError`)
- **Supabase adapter** (`@squaredr/fieldcraft-adapters/supabase`)
  - Response submission and retrieval using Supabase client
  - Field-level encryption with AES-256-GCM
  - Schema CRUD operations via `SupabaseSchemaAdapter`
  - Draft save/load support via `SupabaseDraftAdapter`
- **Webhook adapter** (`@squaredr/fieldcraft-adapters/webhook`)
  - POST form submissions to configurable webhook URL
  - HMAC-SHA256 request signing for payload verification
  - Exponential backoff retry logic with configurable attempts
  - Request timeout configuration
  - Custom header and payload transform support
- Subpath exports for tree-shaking (`./postgres`, `./supabase`, `./webhook`)
- CJS + ESM dual-format builds with TypeScript declarations
- README with installation, usage examples, and migration guide

### Fixed
- Core hardening items (M1, M2, C4, C6) aligned with core 1.3.0

## [0.0.0] - 2026-05-22

### Added
- Initial publish placeholder for npm name reservation
