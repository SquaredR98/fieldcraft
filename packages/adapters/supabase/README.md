# @squaredr/fieldcraft-supabase

Supabase storage adapter for [FieldCraft](https://squaredr.tech/products/fieldcraft). Stores form responses in Supabase with optional field-level AES-256-GCM encryption and row-level security support.

## Install

```bash
npm install @squaredr/fieldcraft-supabase @supabase/supabase-js
```

**Peer dependencies:** Requires `@squaredr/fieldcraft-core` v1.0.0+ and `@supabase/supabase-js` v2.0+.

## Quick Start

```typescript
import { createClient } from '@supabase/supabase-js'
import { createSupabaseAdapter } from '@squaredr/fieldcraft-supabase'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
)

const adapter = createSupabaseAdapter({
  client: supabase,
  table: 'formengine_responses', // default
})
```

Pass the adapter to your form engine's `onSubmit`:

```tsx
<FormEngineRenderer
  schema={schema}
  onSubmit={(response) => adapter.submit(response)}
/>
```

## Field-Level Encryption

Encrypt specific fields while leaving others in plaintext (useful for searching non-sensitive columns):

```typescript
const adapter = createSupabaseAdapter({
  client: supabase,
  encryptionKey: process.env.ENCRYPTION_KEY, // 32-byte hex string
  encryptFields: ['ssn', 'date_of_birth', 'medical_record'],
})
```

You can also use the encryption utilities directly:

```typescript
import { encryptFields, decryptFields } from '@squaredr/fieldcraft-supabase'

const encrypted = encryptFields(values, ['ssn', 'dob'], key)
const decrypted = decryptFields(encrypted, ['ssn', 'dob'], key)
```

## Draft Persistence

Save and resume in-progress forms:

```typescript
import { createSupabaseDraftAdapter } from '@squaredr/fieldcraft-supabase'

const draftAdapter = createSupabaseDraftAdapter({
  client: supabase,
})
```

## Configuration

| Option | Type | Required | Description |
|---|---|---|---|
| `client` | `SupabaseClient` | Yes | Supabase client instance |
| `table` | `string` | No | Table name (default: `formengine_responses`) |
| `encryptionKey` | `string` | No | 32-byte hex key for AES-256-GCM |
| `encryptFields` | `string[]` | No | Field names to encrypt |
| `onSuccess` | `(response, values) => void` | No | Callback after successful insert |
| `onError` | `(error) => void` | No | Callback on insert failure |

## Row-Level Security

The adapter is compatible with Supabase RLS policies. Configure your table's RLS rules to control which users can read/write responses.

## Community

[![Discord](https://img.shields.io/discord/YOUR_SERVER_ID?color=5865F2&label=Discord&logo=discord&logoColor=white)](https://discord.gg/YOUR_INVITE_LINK)

- [Discord](https://discord.gg/YOUR_INVITE_LINK) — Get help, share projects, request features
- [Docs](https://squaredr.tech/products/fieldcraft/docs/adapters) — Adapter documentation
- [Pro Tools](https://squaredr.tech/products/fieldcraft/admin-pro) — Visual FormBuilder, SchemaEditor, ResponseViewer, ThemeEditor

## License

MIT
