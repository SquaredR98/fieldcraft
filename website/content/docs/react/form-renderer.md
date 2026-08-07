---
title: FormRenderer
description: The main component. It creates the engine, renders fields, handles navigation, validation, drafts and submission.
---

## Basic usage

```tsx
import { FormRenderer } from '@squaredr/fieldcraft-react'
import schema from './contact-form.json'

export default function ContactPage() {
  return (
    <FormRenderer
      schema={schema}
      onSubmit={async (response) => {
        await fetch('/api/submit', {
          method: 'POST',
          body: JSON.stringify(response),
        })
      }}
    />
  )
}
```

## Props

### Required

| Prop | Type | Description |
|------|------|-------------|
| `schema` | `FormEngineSchema` | The form schema. Validated at mount time — invalid schemas throw `FormEngineSchemaError`. |

### Submission

| Prop | Type | Description |
|------|------|-------------|
| `onSubmit` | `(response: FormResponse) => void \| Promise<void>` | Called when the form is submitted successfully. Receives the full `FormResponse` with values, metadata, scores. |
| `adapters` | `SubmitAdapter \| SubmitAdapter[]` | One or more submission adapters (HTTP, Supabase, Postgres, webhook). Run in parallel on submit. |

### Theming

| Prop | Type | Description |
|------|------|-------------|
| `theme` | `FormEngineTheme` | Theme object or preset. Controls colours, typography, spacing, and shape. |
| `className` | `string` | CSS class added to the root form element. |

### Field registry

| Prop | Type | Description |
|------|------|-------------|
| `components` | `FieldRegistry` | Custom field component map. Merged with the default registry — your components override built-in ones for matching types. |

### Data

| Prop | Type | Description |
|------|------|-------------|
| `prefill` | `Record<string, unknown>` | Initial values to prefill into the form. Keys are field IDs. |
| `initialValues` | `Record<string, unknown>` | Same as `prefill` — alternative prop name. |
| `sessionToken` | `string` | Custom session token. If not provided, a UUID is generated. Used to scope drafts. |

### Validators

| Prop | Type | Description |
|------|------|-------------|
| `validators` | `Record<string, CustomValidator>` | Custom sync validators keyed by name. Referenced in schema via `{ type: 'custom', name: '...' }`. |
| `asyncValidators` | `Record<string, AsyncValidator>` | Custom async validators keyed by name. Referenced in schema via `{ type: 'async', endpoint: '...' }`. |

### Labels

| Prop | Type | Description |
|------|------|-------------|
| `prevLabel` | `string` | Label for the "Back" button. Default: `"Back"`. |
| `nextLabel` | `string` | Label for the "Next" button. Default: `"Next"`. |
| `submitLabel` | `string` | Label for the "Submit" button. Default: `"Submit"`. |

### Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onSectionChange` | `(sectionId: string, index: number) => void` | Called when the active section changes. |
| `onFieldChange` | `(fieldId: string, value: unknown) => void` | Called when any field value changes. |
| `onReady` | `() => void` | Called after the engine is initialised and the form is ready. |
| `onValidationError` | `(errors: Record<string, string[]>) => void` | Called when validation fails (on section change or submit). |
| `onStateChange` | `(state: FormState) => void` | Called on every state change. Use sparingly — this fires frequently. |

## Full example

```tsx
import {
  FormRenderer,
  cleanPreset,
  defaultRegistry,
} from '@squaredr/fieldcraft-react'
import { createSupabaseAdapter } from '@squaredr/fieldcraft-adapters'
import { PainScaleField } from './custom-fields/PainScaleField'
import { validators } from '@/lib/validators'
import schema from './patient-intake.json'
import { supabase } from '@/lib/supabase'

const adapter = createSupabaseAdapter({
  client: supabase,
  table: 'intake_submissions',
})

export default function IntakePage() {
  return (
    <FormRenderer
      schema={schema}
      theme={cleanPreset}
      adapters={adapter}
      components={{ ...defaultRegistry, pain_scale: PainScaleField }}
      validators={validators}
      prefill={{ referral_source: 'website' }}
      onSubmit={async (response) => {
        console.log('Submitted:', response.schemaId, response.values)
      }}
      onSectionChange={(id, idx) => {
        console.log(`Section ${idx + 1}: ${id}`)
      }}
      submitLabel="Submit Intake Form"
    />
  )
}
```

## How it works internally

`FormRenderer` is a wrapper that:

1. Creates a `FormEngine` instance via `useFormEngine(schema, options)`
2. Subscribes to state changes via `useSyncExternalStore`
3. Renders the current section's visible fields using the field registry
4. Handles navigation buttons (Next/Back/Submit)
5. Shows the progress indicator based on `settings.progressStyle`
6. Manages draft persistence if `settings.allowDraftSave` is `true`

The engine lives in a `useRef` and is created once. React Strict Mode double-mounts don't create multiple engines.

## Using the engine directly

If `FormRenderer` doesn't fit your layout, use `useFormEngine` to get the engine and build your own UI:

```tsx
import { useFormEngine } from '@squaredr/fieldcraft-react'

function CustomForm({ schema }) {
  const engine = useFormEngine(schema, {
    onSubmit: async (response) => { /* ... */ },
  })

  return (
    <div>
      <h1>{engine.getSchema().title}</h1>
      <p>Progress: {engine.state.progressPercent}%</p>
      {/* Render fields manually */}
    </div>
  )
}
```

See [Hooks](/docs/react/hooks) for the full hook API.

## Next steps

- [Hooks](/docs/react/hooks) — useFormEngine, useFieldValue, useFieldError, useSectionProgress
- [Theming](/docs/react/theming) — customise the visual appearance
- [Custom field types](/docs/react/custom-field-types) — register your own field components
