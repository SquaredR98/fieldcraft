---
title: Installation
description: One package gets you the engine and the renderer. zod is the only peer dependency — if your project already has it, nothing is duplicated.
---

## Add the package

The React package includes the core engine as a dependency. One install gives you everything.

```bash
pnpm add @squaredr/fieldcraft-react
```

```bash
npm install @squaredr/fieldcraft-react
```

```bash
yarn add @squaredr/fieldcraft-react
```

## Requirements

| Requirement | Supported |
|-------------|-----------|
| React | 18.2 · 19.x |
| Node (build only) | ≥ 18.17 |
| zod (peer) | ^3.22 |
| Rendering | SSR · RSC · SPA |

If your project doesn't already have zod installed, add it:

```bash
pnpm add zod
```

## Optional packages

| Package | What it adds | Licence |
|---------|-------------|---------|
| `@squaredr/fieldcraft-core` | Engine only — no React. Use this if you're building a custom renderer or running validation server-side. | MIT |
| `@squaredr/fieldcraft-adapters` | Submission targets: HTTP, Supabase, Postgres, webhooks. Includes field-level encryption and retry logic. | MIT |
| `@squaredr/fieldcraft-templates-free` | 16 production-ready form schemas across 7 categories — contact, feedback, NPS, job application, event registration, and more. Copy and edit. | MIT |
| `@squaredr/fieldcraft-pro` | Drag-and-drop visual builder, schema editor, theme editor, response viewer. Coming soon. | Commercial |

Install any combination:

```bash
pnpm add @squaredr/fieldcraft-adapters @squaredr/fieldcraft-templates-free
```

## Verify the install

The engine validates schemas at creation time. The fastest way to verify the install is to render a minimal form:

```tsx title="app/test/page.tsx"
import { FormRenderer } from '@squaredr/fieldcraft-react'

const schema = {
  id: 'install-test',
  version: '1.0.0',
  title: 'Install test',
  sections: [
    {
      id: 'main',
      title: 'Quick check',
      questions: [
        {
          id: 'name',
          type: 'short_text',
          label: 'Your name',
          required: true,
        },
      ],
    },
  ],
  submitAction: { type: 'callback' },
}

export default function TestPage() {
  return (
    <FormRenderer
      schema={schema}
      onSubmit={(response) => {
        console.log('Submitted:', response)
      }}
    />
  )
}
```

If the form renders with a text input and a submit button, the install is working. If the schema is invalid, the engine throws `FormEngineSchemaError` with a descriptive message at render time — you won't get a silent failure.

## TypeScript

All packages ship with TypeScript declarations. The core schema type is exported from both packages:

```ts
import type { FormEngineSchema } from '@squaredr/fieldcraft-core'
// or
import type { FormEngineSchema } from '@squaredr/fieldcraft-react'
```

## Next steps

Build your first real form in [Your first form](/docs/getting-started/your-first-form), or jump to [Schema anatomy](/docs/core-concepts/schema-anatomy) to understand the full schema structure.
