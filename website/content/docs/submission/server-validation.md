---
title: Server validation
description: Validate schemas at build time and submissions at runtime using the core engine — no React required.
---

## Schema validation

The `validateSchema` function checks a schema for structural errors at build time or on your server. It catches issues that would cause runtime failures.

```ts
import { validateSchema } from '@squaredr/fieldcraft-core'

try {
  const validSchema = validateSchema(rawSchema)
  // validSchema is typed as FormEngineSchema
} catch (error) {
  if (error instanceof FormEngineSchemaError) {
    console.error(error.message)
    // "Invalid FormEngine schema:
    //   - Duplicate question ID: "email"
    //   - Section "details" has no questions
    //   - Field "notes" is non-input type but has "required" property"
  }
}
```

### What it checks

| Check | Description |
|-------|-------------|
| Required properties | `id`, `version`, `title`, `sections`, `submitAction` must exist |
| Section structure | Each section needs `id`, `title`, and at least one question |
| Unique field IDs | No duplicate `id` values across the entire schema |
| Non-input validation | Structural/content fields (`info_block`, `divider`, etc.) must not have `required` or `validation` |
| Condition references | `showIf` field references must point to existing field IDs |
| Jump rule targets | `onExit.jumpTo` must reference existing section IDs |
| Option integrity | Choice-based fields must have at least one option |

### Use cases

**CI pipeline** — validate schemas in your test suite:

```ts
import { validateSchema } from '@squaredr/fieldcraft-core'
import schema from './schemas/contact-form.json'

test('contact form schema is valid', () => {
  expect(() => validateSchema(schema)).not.toThrow()
})
```

**API endpoint** — validate before saving to a database:

```ts
// app/api/schemas/route.ts
import { validateSchema, FormEngineSchemaError } from '@squaredr/fieldcraft-core'

export async function POST(req: Request) {
  const body = await req.json()

  try {
    const schema = validateSchema(body)
    await db.schemas.insert(schema)
    return Response.json({ success: true })
  } catch (error) {
    if (error instanceof FormEngineSchemaError) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    throw error
  }
}
```

## Submission validation

Use `createEngine` server-side to validate submitted data against the schema:

```ts
import { createEngine } from '@squaredr/fieldcraft-core'
import schema from './schemas/contact-form.json'

export async function POST(req: Request) {
  const { values } = await req.json()

  const engine = createEngine(schema)

  // Set submitted values
  engine.setValues(values)

  // Validate all fields
  const result = engine.validate()

  if (!result.valid) {
    return Response.json({
      error: 'Validation failed',
      errors: result.errors,
      firstErrorFieldId: result.firstErrorFieldId,
    }, { status: 422 })
  }

  // Values are valid — process the submission
  await processSubmission(values)
  return Response.json({ success: true })
}
```

This uses the same validation logic that runs in the browser — same rules, same error messages. You don't need to duplicate validation on the server.

## Core package — no React required

`@squaredr/fieldcraft-core` has zero UI dependencies. It works in any Node.js or edge runtime:

```ts
import { createEngine, validateSchema } from '@squaredr/fieldcraft-core'
```

Use it for:
- Server-side validation of submissions
- Schema validation in CI/CD pipelines
- Pre-processing schemas before storing in a database
- Building custom renderers for other frameworks

## Next steps

- [Adapters overview](/docs/submission/adapters-overview) — submit to HTTP, Supabase, Postgres, webhooks
- [Schema anatomy](/docs/core-concepts/schema-anatomy) — understand the full schema structure
