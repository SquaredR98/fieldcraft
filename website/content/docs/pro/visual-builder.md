---
title: Visual builder
description: Drag-and-drop form builder that outputs valid FieldCraft schemas. Part of the Pro commercial package.
---

## What it does

The visual builder is a React component that lets non-developers create and edit forms through a drag-and-drop interface. It outputs a standard `FormEngineSchema` — the same JSON format used by `FormRenderer`.

The builder is part of `@squaredr/fieldcraft-pro`, which requires a commercial licence.

## Features

| Feature | Description |
|---------|-------------|
| **Drag-and-drop** | Add fields by dragging from a palette. Reorder by dragging within the form. |
| **Schema editor** | Edit the raw JSON schema alongside the visual builder. Changes sync in both directions. |
| **Theme editor** | Adjust colours, typography, spacing, and shape visually. See changes in real-time. |
| **Live preview** | The form renders live as you build it — exactly as users will see it. |
| **Response viewer** | Browse submitted responses with filtering and export. |
| **All 44 field types** | Every built-in field type is available in the palette. |
| **Conditional logic UI** | Configure `showIf` conditions, jump rules, and conditional required through a visual interface. |
| **Validation UI** | Add validation rules from a dropdown — no JSON editing required. |

## Installation

```bash
pnpm add @squaredr/fieldcraft-pro
```

## Usage

```tsx
import { FormBuilder } from '@squaredr/fieldcraft-pro'

export default function BuilderPage() {
  return (
    <FormBuilder
      onSave={async (schema) => {
        // schema is a valid FormEngineSchema
        await fetch('/api/schemas', {
          method: 'POST',
          body: JSON.stringify(schema),
        })
      }}
    />
  )
}
```

## Loading an existing schema

```tsx
<FormBuilder
  initialSchema={existingSchema}
  onSave={handleSave}
/>
```

## Schema output

The builder produces a standard `FormEngineSchema`. Schemas created in the builder are identical to hand-written schemas — there's no vendor lock-in. You can:

- Edit the schema by hand after creating it in the builder
- Use the builder to edit schemas originally written in code
- Store schemas in any database and load them into `FormRenderer`

## Next steps

- [Templates](/docs/pro/templates) — pre-built form schemas
- [Licence & activation](/docs/pro/licence-and-activation) — pricing and activation
