# @squaredr/fieldcraft-adapters

Storage and delivery adapters for [FieldCraft](https://squaredr.tech/products/fieldcraft). Postgres, Supabase, and Webhook in a single package with subpath imports.

## Install

```bash
npm install @squaredr/fieldcraft-adapters
```

Install only the peer dependencies you need:

```bash
# For Postgres
npm install drizzle-orm postgres @paralleldrive/cuid2

# For Supabase
npm install @supabase/supabase-js

# For Webhook — no additional deps needed
```

## Usage

```typescript
// Postgres
import { createPostgresAdapter } from '@squaredr/fieldcraft-adapters/postgres'

const postgres = createPostgresAdapter({
  connectionString: process.env.DATABASE_URL,
})

// Supabase
import { createSupabaseAdapter } from '@squaredr/fieldcraft-adapters/supabase'
import { createClient } from '@supabase/supabase-js'

const supabase = createSupabaseAdapter({
  client: createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY),
})

// Webhook
import { createWebhookAdapter } from '@squaredr/fieldcraft-adapters/webhook'

const webhook = createWebhookAdapter({
  url: 'https://api.example.com/submissions',
  secret: process.env.WEBHOOK_SECRET,
})
```

Pass any adapter to your form engine:

```tsx
<FormEngineRenderer
  schema={schema}
  onSubmit={(response) => adapter.submit(response)}
/>
```

## Postgres Adapter

| Option | Type | Required | Description |
|---|---|---|---|
| `connectionString` | `string` | Yes | PostgreSQL connection URL |
| `ssl` | `boolean` | No | Enable SSL (defaults to `true` in production) |
| `encryptionKey` | `string` | No | 32-byte hex key for AES-256-GCM encryption |
| `onSuccess` | `(response) => void` | No | Callback after successful insert |
| `onError` | `(error) => void` | No | Callback on insert failure |

**Encryption:** Pass `encryptionKey` to encrypt the entire response payload with AES-256-GCM.

**Drafts:** Use `createPostgresDraftAdapter` for save/resume of in-progress forms.

## Supabase Adapter

| Option | Type | Required | Description |
|---|---|---|---|
| `client` | `SupabaseClient` | Yes | Supabase client instance |
| `table` | `string` | No | Table name (default: `formengine_responses`) |
| `encryptionKey` | `string` | No | 32-byte hex key for AES-256-GCM |
| `encryptFields` | `string[]` | No | Field names to encrypt individually |
| `onSuccess` | `(response, values) => void` | No | Callback after successful insert |
| `onError` | `(error) => void` | No | Callback on insert failure |

**Field-level encryption:** Encrypt specific fields while leaving others searchable.

**Schema CRUD:** Use `createSupabaseSchemaAdapter` to load/save/list/delete form schemas from Supabase.

**Drafts:** Use `createSupabaseDraftAdapter` for save/resume of in-progress forms.

## Webhook Adapter

| Option | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | Yes | Webhook endpoint URL |
| `secret` | `string` | Yes | HMAC-SHA256 signing secret |
| `retries` | `number` | No | Max retry attempts (default: 3) |
| `retryDelayMs` | `number` | No | Base delay in ms (default: 1000) |
| `retryBackoff` | `'linear' \| 'exponential'` | No | Backoff strategy (default: `'exponential'`) |
| `timeoutMs` | `number` | No | Request timeout in ms (default: 30000) |
| `headers` | `Record<string, string>` | No | Custom HTTP headers |
| `transform` | `(response) => any` | No | Payload transform function |
| `onSuccess` | `(response, status) => void` | No | Callback after successful delivery |
| `onError` | `(error, attempt) => void` | No | Callback on delivery failure |
| `onRetry` | `(attempt, delay) => void` | No | Callback before each retry |

**HMAC signing:** Every request includes an `X-FormEngine-Signature` header. Use `signPayload` to verify on your server.

**Retries:** Configurable exponential backoff with jitter.

## Migration from old packages

This package replaces the individual adapter packages:

```diff
- import { createPostgresAdapter } from '@squaredr/fieldcraft-postgres'
+ import { createPostgresAdapter } from '@squaredr/fieldcraft-adapters/postgres'

- import { createSupabaseAdapter } from '@squaredr/fieldcraft-supabase'
+ import { createSupabaseAdapter } from '@squaredr/fieldcraft-adapters/supabase'

- import { createWebhookAdapter } from '@squaredr/fieldcraft-webhook'
+ import { createWebhookAdapter } from '@squaredr/fieldcraft-adapters/webhook'
```

## Community

- [Discord](https://discord.gg/zMxdu5UVW) — Get help, share projects, request features
- [Docs](https://squaredr.tech/products/fieldcraft/docs/adapters) — Adapter documentation
- [Pro Tools](https://squaredr.tech/products/fieldcraft/admin-pro) — Visual FormBuilder, ResponseViewer

## License

MIT
