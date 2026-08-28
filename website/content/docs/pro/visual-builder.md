---
title: Visual builder
description: Drag-and-drop form builder that outputs valid FieldCraft schemas. Part of the Pro commercial package.
---

## What it does

The visual builder is a React component that lets non-developers create and edit forms through a drag-and-drop interface. It outputs a standard `FormEngineSchema` — the same JSON format used by `FormRenderer`.

The builder is part of `@squaredr/fieldcraft-pro`, which requires a commercial licence.

## Auto-inherit from host page

FormBuilder inherits CSS custom properties from your host page automatically. No theme prop is needed — it matches your app's look and feel out of the box, including dark/light mode.

## Features

| Feature | Description |
|---------|-------------|
| **Drag-and-drop** | Add fields by dragging from a palette. Reorder by dragging within the form. |
| **Schema editor** | Edit the raw JSON schema alongside the visual builder. Changes sync in both directions. |
| **Live preview** | The form renders live as you build it — exactly as users will see it. |
| **All 44 field types** | Every built-in field type is available in the palette. |
| **Conditional logic UI** | Configure `showIf` conditions, jump rules, and conditional required through a visual interface. |
| **Validation UI** | Add validation rules from a dropdown — no JSON editing required. |
| **Logic flow map** | Visual branching logic map showing conditional paths between fields. |
| **Import/Export** | Import and export schemas as JSON files. |
| **Template gallery** | Browse and apply pre-built form templates. |

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

## Loading a schema from URL

The builder can fetch a schema from a URL on mount:

```tsx
<FormBuilder
  schemaUrl="/api/schemas/abc123"
  onSave={handleSave}
/>
```

When `schemaUrl` is provided, it overrides `initialSchema` if the fetch succeeds. A loading indicator is shown while fetching, and an error banner appears if the fetch fails.

## Props

### Core

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialSchema` | `FormEngineSchema` | Empty schema | Initial schema to load. |
| `schemaUrl` | `string` | — | URL to fetch schema JSON from on mount. Overrides `initialSchema` when fetch succeeds. |
| `onChange` | `(schema: FormEngineSchema) => void` | — | Called when the schema changes. |
| `onSave` | `(schema: FormEngineSchema) => void` | — | Called when user clicks Save or presses Ctrl+S. |

### Layout

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | `string \| number` | — | Container height. |
| `className` | `string` | — | Additional CSS class on root element. |
| `toolbarExtra` | `ReactNode` | — | Extra content rendered in the toolbar, after the Save button. |

### Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `questionTypes` | `Record<string, QuestionTypeInfo>` | — | Additional question type metadata. Merged with built-in defaults. |
| `palette` | `PaletteCategory[]` | — | Additional palette categories. Appended to the built-in palette. |
| `templates` | `FormBuilderTemplate[]` | — | Templates to show in the template gallery. |
| `preview` | `FormBuilderPreviewProps` | — | Configuration for the built-in preview renderer (theme, custom components, callbacks). |

### Builder chrome theme

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `FormBuilderTheme` | — | Override CSS variables for the builder UI (panels, toolbar, canvas). |

## Config editor

Selecting a field in the builder opens the config editor panel on the right. Every field type has a tailored config form — for example, the `appointment` field shows mode switching (static slots, URL-based, or embed), and the `payment` field exposes `serverUrl`, `responseMapping`, and all Stripe/PayPal settings.

Key capabilities:

- **Batched updates** — changing multiple config fields in one action (e.g. switching appointment modes) applies all changes atomically, preventing data loss.
- **Phone international** — configure `defaultCountry` and `priorityCountries` (comma-separated country codes).
- **Payment** — configure `provider`, `publicKey`, `amount`, `currency`, `amountField`, `buttonLabel`, `serverUrl`, and `responseMapping.clientSecretPath`.
- **Allow Other cleanup** — toggling off "Allow Other" on select fields automatically clears the custom `otherLabel`.

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+S / Cmd+S | Save |
| Ctrl+Z / Cmd+Z | Undo |
| Ctrl+Shift+Z / Cmd+Shift+Z | Redo |
| Ctrl+D / Cmd+D | Duplicate selected field |
| Delete / Backspace | Remove selected field |
| Escape | Clear selection |

## Schema output

The builder produces a standard `FormEngineSchema`. Schemas created in the builder are identical to hand-written schemas — there's no vendor lock-in. You can:

- Edit the schema by hand after creating it in the builder
- Use the builder to edit schemas originally written in code
- Store schemas in any database and load them into `FormRenderer`

## Next steps

- [Theme editor](/docs/pro/theme-editor) — visual theme customizer
- [Response viewer](/docs/pro/response-viewer) — browse and export form responses
- [Templates](/docs/pro/templates) — pre-built form schemas
- [Licence & activation](/docs/pro/licence-and-activation) — pricing and activation
