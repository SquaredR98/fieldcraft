---
title: Adapters overview
description: Four adapter types — Submit, Draft, Schema, Analytics — plus built-in implementations for HTTP, Supabase, Postgres, and webhooks.
---

## Adapter types

| Adapter | Purpose | Interface |
|---------|---------|-----------|
| **SubmitAdapter** | Send form responses to a backend | `submit(response)`, `onError?(error)` |
| **DraftAdapter** | Save/load/delete draft state | `save(draft)`, `load(schemaId, token)`, `delete(schemaId, token)` |
| **SchemaAdapter** | CRUD for schema storage | `save(schema)`, `load(id)`, `delete(id)`, `list(params)` |
| **AnalyticsAdapter** | Track form interactions | `trackView()`, `trackStart()`, `trackFieldInteraction()`, `trackSubmit()`, `trackAbandon()` |

## Submit adapters

### HTTP adapter

Built into `@squaredr/fieldcraft-core`:

```ts
import { createHttpAdapter } from '@squaredr/fieldcraft-core'

const adapter = createHttpAdapter({
  url: 'https://api.example.com/submissions',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json',
  },
  timeout: 30000,       // 30 seconds (default)
  retries: 3,           // Retries on 5xx or network errors (default)
  transform: (response) => ({
    // Optional: reshape the payload before sending
    form_id: response.schemaId,
    data: response.values,
  }),
})
```

### Supabase adapter

From `@squaredr/fieldcraft-adapters`:

```ts
import { createSupabaseAdapter } from '@squaredr/fieldcraft-adapters'
import { supabase } from './supabase'

const adapter = createSupabaseAdapter({
  client: supabase,
  table: 'form_submissions',              // Default: 'form_submissions'
  encryptFields: ['ssn', 'date_of_birth'], // Fields to encrypt at rest
  encryptionKey: process.env.ENCRYPTION_KEY!,
})
```

### Postgres adapter

```ts
import { createPostgresAdapter } from '@squaredr/fieldcraft-adapters'

const adapter = createPostgresAdapter({
  connectionString: process.env.DATABASE_URL!,
  table: 'submissions',
  encryptFields: ['ssn'],
  encryptionKey: process.env.ENCRYPTION_KEY!,
  ssl: true,
})
```

### Webhook adapter

```ts
import { createWebhookAdapter } from '@squaredr/fieldcraft-adapters'

const adapter = createWebhookAdapter({
  url: 'https://hooks.example.com/form-submit',
  secret: process.env.WEBHOOK_SECRET!,    // HMAC-SHA256 signing
  retries: 3,
  retryDelayMs: 1000,
  retryBackoff: 'exponential',            // 'linear' | 'exponential'
  timeoutMs: 10000,
  headers: { 'X-Source': 'fieldcraft' },
  onRetry: (attempt, error) => {
    console.log(`Webhook retry ${attempt}: ${error.message}`)
  },
})
```

The webhook adapter signs the payload with HMAC-SHA256. Verify the signature on your server:

```ts
import { signPayload } from '@squaredr/fieldcraft-adapters'

// On your webhook endpoint
const signature = req.headers['x-fieldcraft-signature']
const expected = signPayload(JSON.stringify(req.body), process.env.WEBHOOK_SECRET!)
const valid = signature === expected
```

## Multiple adapters

Pass an array to run multiple adapters in parallel:

```tsx
<FormRenderer
  schema={schema}
  adapters={[httpAdapter, supabaseAdapter, webhookAdapter]}
  onSubmit={handleSubmit}
/>
```

Each adapter runs independently. If one fails, the others still execute. The `SubmitResult` reports per-adapter success:

```ts
type SubmitResult = {
  success: boolean
  adapterResults: Array<{
    adapterName: string
    success: boolean
    error?: string
  }>
}
```

## Building a custom adapter

Implement the `SubmitAdapter` interface:

```ts
import type { SubmitAdapter, FormResponse } from '@squaredr/fieldcraft-core'

const slackAdapter: SubmitAdapter = {
  name: 'slack',
  async submit(response: FormResponse) {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      body: JSON.stringify({
        text: `New submission: ${response.schemaId} (${Object.keys(response.values).length} fields)`,
      }),
    })
  },
  onError(error) {
    console.error('Slack notification failed:', error)
  },
}
```

## Schema adapter

For storing and loading schemas from a database:

```ts
import { createHttpSchemaAdapter } from '@squaredr/fieldcraft-core'

const schemaAdapter = createHttpSchemaAdapter({
  baseUrl: 'https://api.example.com/schemas',
  headers: { 'Authorization': 'Bearer token' },
  timeout: 30000,
  cacheTtl: 60000,        // Cache schemas for 60 seconds
})

// CRUD operations
await schemaAdapter.save(schema)
const loaded = await schemaAdapter.load('contact-form')
await schemaAdapter.delete('old-form')
const { items, total } = await schemaAdapter.list({ page: 1, pageSize: 20, search: 'intake' })
```

Supabase also has a schema adapter:

```ts
import { createSupabaseSchemaAdapter } from '@squaredr/fieldcraft-adapters'

const schemaAdapter = createSupabaseSchemaAdapter({
  client: supabase,
  table: 'form_schemas',
})
```

## Field-level encryption

Both Supabase and Postgres adapters support encrypting specific fields before storage:

```ts
const adapter = createSupabaseAdapter({
  client: supabase,
  table: 'submissions',
  encryptFields: ['ssn', 'date_of_birth', 'medical_id'],
  encryptionKey: process.env.ENCRYPTION_KEY!,
})
```

Encryption utilities are also exported for manual use:

```ts
import { encrypt, decrypt } from '@squaredr/fieldcraft-adapters'

const encrypted = encrypt('sensitive-value', key)
const decrypted = decrypt(encrypted, key)
```

## Next steps

- [Drafts & prefill](/docs/submission/drafts-and-prefill) — save and restore form progress
- [Server validation](/docs/submission/server-validation) — validate schemas server-side

## Related reading

- [FieldCraft Storage Adapters Are Now Open Source](/blog/fieldcraft-adapters-now-open-source) — why adapters are MIT licensed
- [Self-Hosted Forms vs Cloud Forms](/blog/self-hosted-vs-cloud-forms) — the case for owning your form data
