# FieldCraft OSS — Shipping Plan

> This directory contains the roadmap, task tracking, and session prompts for the FieldCraft open-source packages.

---

## What is FieldCraft?

A schema-driven headless form engine. You define forms as JSON, the engine handles state, validation, navigation, scoring, drafts, and submission. Pure TypeScript core with zero UI dependencies. React renderer with 44 field components.

**Four packages, one monorepo:**

| Package | npm | Version | Description |
|---------|-----|---------|-------------|
| `@squaredr/fieldcraft-core` | [npm](https://www.npmjs.com/package/@squaredr/fieldcraft-core) | 1.3.13 | Pure TypeScript engine. Zero UI deps. Only depends on Zod. |
| `@squaredr/fieldcraft-react` | [npm](https://www.npmjs.com/package/@squaredr/fieldcraft-react) | 1.2.12 | React renderer. 44 field components. shadcn/ui + Tailwind. |
| `@squaredr/fieldcraft-adapters` | [npm](https://www.npmjs.com/package/@squaredr/fieldcraft-adapters) | 1.0.1 | Submission adapters. HTTP, Postgres, Supabase, Webhook. |
| `@squaredr/fieldcraft-templates-free` | [npm](https://www.npmjs.com/package/@squaredr/fieldcraft-templates-free) | 1.1.1 | 16 free form templates. |

All published. All in sync.

---

## Repo Structure

```
formengine/
├── packages/
│   ├── core/                  # @squaredr/fieldcraft-core
│   │   ├── src/
│   │   │   ├── engine/        # createEngine, state-manager, navigation, condition-evaluator,
│   │   │   │                  # validation-runner, calculated-resolver, expression-parser,
│   │   │   │                  # draft-manager, prefill-resolver, submission-pipeline
│   │   │   ├── types/         # schema, state, response, conditions, question-types, validation
│   │   │   ├── validators/    # registry, built-in validators
│   │   │   ├── schema/        # schema-validator (Zod)
│   │   │   └── utils/         # session-token
│   │   └── __tests__/
│   ├── react/                 # @squaredr/fieldcraft-react
│   │   ├── src/
│   │   │   ├── components/    # FormEngineRenderer, SectionRenderer, FieldRenderer, FieldWrapper
│   │   │   │   └── fields/    # 44 field components (ShortTextField, EmailField, etc.)
│   │   │   ├── hooks/         # useFormEngine, useFieldValue, useFieldError, useSectionProgress
│   │   │   ├── registry/      # default-registry (field type → component mapping)
│   │   │   └── themes/        # 6 theme presets
│   │   └── __tests__/
│   ├── adapters/              # @squaredr/fieldcraft-adapters
│   └── templates-free/        # @squaredr/fieldcraft-templates-free
├── website/                   # fieldcraft.squaredr.tech (Next.js + Fumadocs)
├── .plan/                     # THIS DIRECTORY — shipping plan
└── README.md
```

---

## Current Status (as of August 5, 2026)

**What's been done (Month 1 — June 13 to July 12):**
- Core: 1.3.4 → 1.3.13 (email regex fix, validator try/catch, JSDoc on types + engine + validators, 7 test files)
- React: 1.2.10 → 1.2.12 (250+ country list, JSDoc on 4 hooks, error boundary verification)
- 533 total tests passing (403 core + 74 react + 56 adapters)
- 4 CHANGELOGs created, Templates-Free README created
- README fixes across all packages (npm tarballs, GitHub URLs)

**What's been done (Month 2 — July 13 to August 5):**
- Website restructured: demo → website with custom Fumadocs shell (20 docs pages, syntax highlighting, line numbers)
- A1.04 code changes done (tests still pending)
- Full product plan created — OSS gaps identified for Pro/SaaS support

**What's pending — SaaS prerequisites (PRIORITY):**
- A3.16: `focusField()` engine method
- B1.16: `onFocus` in FieldProps
- A3.18: `onEvent` unified analytics callback (GTAG/GTM events)
- A7.11: `readonly` field state
- A3.19: Draft migration hook
- A3.17: `beforeSubmit` hook
- A8.11-A8.13: Response serialization utilities
- B7.01-B7.05: Embed IIFE build (self-contained bundle for SaaS embed)
- Target: core 1.4.0, react 1.3.0

**What's pending — carry-over from Month 2:**
- A1.04: Calculated field warning tests (4 tests)
- A5.04-A5.07: JSDoc on 4 core files
- A6.01-A6.02: JSDoc on HTTP adapters
- H1.06: CONTRIBUTING.md
- H1.07: CODE_OF_CONDUCT.md

---

## Coding Standards

### Version Bumps
| Change | Bump | Example |
|--------|------|---------|
| Bug fix, CSS fix, typo, JSDoc, tests | Patch | 1.2.8 → 1.2.9 |
| New field, new feature, new export | Minor | 1.2.8 → 1.3.0 |
| Breaking API change | Major | 1.2.8 → 2.0.0 |

### Package Boundaries
```
core     → Zero UI deps. Pure TypeScript. Only Zod.
react    → Depends on core. React + shadcn + Tailwind.
adapters → Depends on core types only. No React.
```
Never import React in core. Never import adapters in react.

### CSS Class Naming
All classes use `fc-` prefix: `.fc-{component}-{element}`. Never `fe-`, never unprefixed.

### Non-Input Field Types
These must NEVER have `required` or `validation` properties:
`info_block`, `divider`, `spacer`, `section_header`, `page_break`, `welcome-screen`, `thank-you-screen`, `rich-text`, `image`, `video`

### React Patterns
- Engine lives in `useRef` (never destroyed — React Strict Mode workaround)
- `subscribe` and `getSnapshot` must be stable references (wrap in `useMemo`)
- Radix UI Select: never pass `value=""` — use `value={val || undefined}`

### Immutability
Every state update uses spread: `state = { ...state, values: { ...state.values, [id]: value } }`. Never mutation. This is the contract with React's `useSyncExternalStore`.

---

## Known Issues (Don't Fix Unless Planned)

1. **`isStructuralField()` only checks 3 types** — `state-manager.ts:485-487` checks `section_header`, `info_block`, `page_break`. Missing: `welcome-screen`, `thank-you-screen`, `rich-text`, `image`, `video`, `divider`, `spacer`.

2. **No cascade depth limit** — Circular calculated field dependencies won't infinite-loop but won't converge either.

3. **`setValues()` doesn't mark fields as touched** — Programmatic bulk sets don't trigger error display until user interacts or submits.

---

## Files in This Directory

| File | Purpose |
|------|---------|
| `README.md` | This file — project overview, standards, how to resume |
| `roadmap.md` | Full task list with status (done/pending/in-progress). SaaS-prerequisite items added Aug 5 as A3.16-A3.20, A7.11, A8.11-A8.13, B1.16, B7.01-B7.05. |
| `website-plan.md` | Website restructure plan (Fumadocs docs site) |
| `website-rebuild-plan.md` | Custom shell implementation plan for docs site |

---

## How to Resume Work with an LLM

1. Point the LLM to this `README.md` and `roadmap.md`
2. The LLM gets full context — project structure, coding standards, what's done, what's next
3. Tell the LLM what you want to work on (or ask it to pick the next priority from the roadmap)
