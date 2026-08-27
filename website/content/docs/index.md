---
title: Introduction
description: FieldCraft is a schema-driven form engine for React. Define a form once in JSON — sections, fields, conditions, validation, scoring — and the renderer builds it.
---

## What FieldCraft does

You write a JSON schema that describes a form — its fields, sections, validation rules, conditional logic, and submission behaviour. FieldCraft reads that schema and renders a fully functional form with zero imperative code.

```tsx title="app/intake/page.tsx"
import { FormRenderer } from '@squaredr/fieldcraft-react'
import schema from './patient-intake.json'

export default function IntakePage() {
  return (
    <FormRenderer
      schema={schema}
      theme="clinical"
      onSubmit={async (response) => {
        await fetch('/api/intake', {
          method: 'POST',
          body: JSON.stringify(response),
        })
      }}
    />
  )
}
```

The schema drives everything: which fields appear, when they appear, how they validate, what happens when the user submits. You never write `onChange` handlers, manage form state, or wire up validation manually.

## Architecture

Two packages, each depending only on the one beneath it. Take the layer you need and nothing more.

| Layer | Package | What it does |
|-------|---------|-------------|
| Core | `@squaredr/fieldcraft-core` | Schema parsing, state management, condition evaluation, validation, expression engine, navigation. No UI, no React. |
| React | `@squaredr/fieldcraft-react` | `<FormRenderer />`, 44 field components, 10 hooks, CSS variable theming with auto-inherit, draft persistence, step navigation. |

Core is framework-agnostic. You could build a Vue or Svelte renderer on top of it — the engine API is the same. React is the official renderer that ships with the project.

## What the engine handles

| Concern | How it works |
|---------|-------------|
| **Conditional visibility** | Any field or section can declare `showIf` — a condition expression evaluated against current form values. Hidden fields are excluded from validation and submission. |
| **Validation** | 19 built-in rule types (required, min/max, minLength/maxLength, pattern, email, phone, URL, date, file size, file type, integer, positiveNumber, alphanumeric, noSpecialChars, minItems, maxItems, compareToField) plus custom sync and async validators. Conditional validation with `applyIf` and severity levels. Validation runs on blur, on section change, and on submit. |
| **Multi-step navigation** | Sections become steps. The engine tracks which sections are visible, which have been visited, and whether the current section is valid before allowing forward navigation. |
| **Computed fields** | Expressions like `{price} * {quantity}` are parsed and evaluated safely — no `eval()`. Aggregate functions (SUM, AVG, COUNT, MIN, MAX) work across repeater rows. Dependencies are tracked so computed fields update when their inputs change. |
| **Draft persistence** | Answers survive a page refresh with zero configuration. Drafts are keyed by schema ID + session token, stored in localStorage by default, or sent to a server via a draft adapter. |
| **Schema validation at boot** | A malformed schema throws `FormEngineSchemaError` at engine creation time — not on the user's first keystroke. Duplicate field IDs, invalid conditions, and missing required properties are caught before rendering. |
| **Scoring** | Fields can carry numeric scores. The engine aggregates them and maps totals to named ranges (e.g., "Low risk", "Medium risk", "High risk"). |
| **Submission pipeline** | Responses go through adapters — HTTP, Supabase, Postgres, webhooks — with retry logic, HMAC signing, and field-level encryption. |

## Packages at a glance

| Package | npm | Licence |
|---------|-----|---------|
| `@squaredr/fieldcraft-core` | v1.4.1 | MIT |
| `@squaredr/fieldcraft-react` | v1.3.0 | MIT |
| `@squaredr/fieldcraft-adapters` | v1.0.1 | MIT |
| `@squaredr/fieldcraft-templates` | v1.1.1 | MIT |

## Next steps

If you want to start building immediately, go to [Installation](/docs/getting-started/installation).

If you want to understand the schema format first, start with [Schema anatomy](/docs/core-concepts/schema-anatomy).

If you already have FieldCraft installed and want a guided walkthrough, try [Your first form](/docs/getting-started/your-first-form).
