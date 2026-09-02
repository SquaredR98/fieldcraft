---
title: Project structure
description: How FieldCraft is organised, what each package does, and how to structure schemas, components and adapters in your own project.
---

## Package architecture

FieldCraft is a monorepo with strict dependency boundaries. Each package depends only on the one beneath it.

```
@squaredr/fieldcraft-core         Zero UI dependencies. Pure TypeScript.
        ↑
@squaredr/fieldcraft-react        Depends on core. React + shadcn + Tailwind.
        ↑
@squaredr/fieldcraft-pro          Depends on core + react. Commercial licence.

@squaredr/fieldcraft-adapters     Depends on core types only. No React.
@squaredr/fieldcraft-templates   Depends on core types only. No React.
```

| Package | What it contains | Size |
|---------|-----------------|------|
| `fieldcraft-core` | Schema types, engine factory (`createEngine`), state manager, condition evaluator, validation runner, expression parser, draft manager, prefill resolver, schema validator | ~27 KB gzip |
| `fieldcraft-react` | `<FormEngineRenderer />`, 41 field components, 10 hooks, CSS variable theming with auto-inherit, field registry, UI primitives (shadcn/Radix) | ~96 KB gzip |
| `fieldcraft-adapters` | HTTP adapter, Supabase adapter, Postgres adapter, webhook adapter. Each with encryption, retry logic | ~1 KB gzip |
| `fieldcraft-templates` | 16 production-ready form schemas across 7 categories | ~13 KB gzip |
| `fieldcraft-pro` | FormBuilder, ResponseViewer, ThemeEditor, 5 theme preset families | Commercial |

## Recommended project structure

```
your-app/
├── schemas/                     # Form schemas (JSON or TypeScript)
│   ├── contact-form.ts
│   ├── patient-intake.ts
│   └── employee-survey.json
├── components/
│   └── forms/
│       ├── custom-fields/       # Custom field type components
│       │   ├── PainScaleField.tsx
│       │   └── ColorPickerField.tsx
│       └── FormPage.tsx         # Wrapper component
├── lib/
│   ├── adapters.ts              # Adapter configuration
│   ├── validators.ts            # Custom validators
│   └── form-registry.ts         # Custom field registry
└── app/
    └── forms/
        └── [id]/
            └── page.tsx         # Dynamic form route
```

## Schema files

Schemas can be TypeScript files (with type checking) or JSON files (for schemas stored in a database or CMS).

**TypeScript** — recommended for static schemas:

```ts title="schemas/contact-form.ts"
import type { FormEngineSchema } from '@squaredr/fieldcraft-react'

export const contactFormSchema: FormEngineSchema = {
  id: 'contact-form',
  version: '1.0.0',
  // ... full schema
}
```

**JSON** — for dynamic schemas loaded from an API:

```json title="schemas/contact-form.json"
{
  "id": "contact-form",
  "version": "1.0.0",
  "title": "Contact Us",
  "sections": []
}
```

The engine accepts both formats. TypeScript gives you autocomplete and compile-time validation. JSON is useful when schemas are managed through the Pro visual builder or stored in a database.

## Adapter setup

Keep adapter configuration in a dedicated file:

```ts title="lib/adapters.ts"
import { createHttpAdapter } from '@squaredr/fieldcraft-core'
import { createSupabaseAdapter } from '@squaredr/fieldcraft-adapters'
import { supabase } from './supabase'

export const httpAdapter = createHttpAdapter({
  url: '/api/submissions',
  method: 'POST',
  headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY! },
})

export const supabaseAdapter = createSupabaseAdapter({
  client: supabase,
  table: 'form_submissions',
})
```

Then pass adapters to the renderer:

```tsx
<FormEngineRenderer
  schema={schema}
  adapters={[httpAdapter, supabaseAdapter]}
/>
```

Multiple adapters run in parallel — if one fails, the others still execute. Each adapter reports its own success/failure in the `SubmitResult`.

## Custom field registry

If you have custom field types, create a registry file:

```ts title="lib/form-registry.ts"
import { defaultRegistry } from '@squaredr/fieldcraft-react'
import { PainScaleField } from '@/components/forms/custom-fields/PainScaleField'
import { ColorPickerField } from '@/components/forms/custom-fields/ColorPickerField'

export const registry = {
  ...defaultRegistry,
  pain_scale: PainScaleField,
  color_picker: ColorPickerField,
}
```

Then pass it to the renderer:

```tsx
<FormEngineRenderer
  schema={schema}
  components={registry}
/>
```

## Next steps

- [Schema anatomy](/docs/core-concepts/schema-anatomy) — understand every property in the schema
- [Custom field types](/docs/react/custom-field-types) — build your own field components
- [Adapters overview](/docs/submission/adapters-overview) — configure submission targets
