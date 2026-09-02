# Contributing to FieldCraft

Thanks for considering a contribution. This document covers the process and conventions.

Before you invest time in a large change: FieldCraft is maintained by one
person in their spare time, so reviews can be slow and I may not get to
everything. Bug reports with a schema that reproduces the problem are the most
useful thing you can send. For anything substantial, open an issue first so we
can agree on the approach before you write the code.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `pnpm install`
4. Build all packages: `pnpm build`
5. Run tests: `pnpm test`

## Development Setup

FieldCraft is a pnpm workspace monorepo managed by Turborepo.

```
packages/
  core/              # @squaredr/fieldcraft-core — pure TypeScript
  react/             # @squaredr/fieldcraft-react — React components
  adapters/          # @squaredr/fieldcraft-adapters — storage adapters
  templates/         # @squaredr/fieldcraft-templates — ready-made schemas
website/             # Marketing site + docs (not published to npm)
```

### Prerequisites

- Node.js 18+
- pnpm 9+

### Building

```bash
pnpm build          # builds all packages via turbo
pnpm build --filter=@squaredr/fieldcraft-core  # build a single package
```

### Testing

```bash
pnpm test           # runs all tests via turbo
cd packages/core && pnpm test    # test a single package
cd packages/core && pnpm test -- --watch  # watch mode
```

## Package Boundaries

These boundaries are enforced and must not be violated:

- **core** has zero UI dependencies. No React, no DOM.
- **react** depends on core. Never import Pro or adapters.
- **adapters** depends on core types only. No React.
- **templates** depends on core types only.

## Pull Request Process

1. Create a feature branch from `master`
2. Make your changes
3. Ensure `pnpm build` and `pnpm test` pass
4. Write a clear commit message (see below)
5. Open a pull request with a description of what changed and why

### Commit Messages

Use conventional commits:

```
feat: add url built-in validator
fix: email regex TLD check
test: add expression-parser edge cases
docs: update schema field-types page
```

### What Makes a Good PR

- Focused on one change (don't mix features with refactors)
- Tests for new functionality
- No unrelated formatting changes
- Build passes

## Code Style

- TypeScript strict mode
- All CSS classes use the `fc-` prefix
- No dead code or unused imports
- JSDoc on all exported functions and types

## Schema Rules

Non-input field types (`info_block`, `divider`, `spacer`, `section_header`, `page_break`, `welcome-screen`, `thank-you-screen`, `rich-text`, `image`, `video`) must never have `required` or `validation` properties.

## Reporting Bugs

Open an issue with:

- Steps to reproduce
- Expected behavior
- Actual behavior
- FieldCraft version (`@squaredr/fieldcraft-core` and `@squaredr/fieldcraft-react`)

## Feature Requests

Open an issue describing:

- The problem you're solving
- Your proposed solution
- Alternatives you've considered

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
