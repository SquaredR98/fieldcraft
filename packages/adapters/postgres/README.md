# @squaredr/fieldcraft-postgres

PostgreSQL storage adapter for [FieldCraft](https://squaredr.tech/products/fieldcraft). Stores form responses directly in PostgreSQL using Drizzle ORM with optional AES-256-GCM encryption.

## Install

```bash
npm install @squaredr/fieldcraft-postgres
```

**Peer dependency:** Requires `@squaredr/fieldcraft-core` v1.0.0+.

## Quick Start

```typescript
import { createPostgresAdapter } from '@squaredr/fieldcraft-postgres'

const adapter = createPostgresAdapter({
  connectionString: process.env.DATABASE_URL,
})
```

Pass the adapter to your form engine's `onSubmit`:

```tsx
<FormEngineRenderer
  schema={schema}
  onSubmit={(response) => adapter.submit(response)}
/>
```

## Encryption

Enable AES-256-GCM encryption on the entire response payload:

```typescript
const adapter = createPostgresAdapter({
  connectionString: process.env.DATABASE_URL,
  encryptionKey: process.env.ENCRYPTION_KEY, // 32-byte hex string
})
```

You can also use the encryption utilities directly:

```typescript
import { encrypt, decrypt } from '@squaredr/fieldcraft-postgres'

const encrypted = encrypt(plaintext, key)
const decrypted = decrypt(encrypted, key)
```

## Draft Persistence

Save and resume in-progress forms:

```typescript
import { createPostgresDraftAdapter } from '@squaredr/fieldcraft-postgres'

const draftAdapter = createPostgresDraftAdapter({
  connectionString: process.env.DATABASE_URL,
})
```

## Configuration

| Option | Type | Required | Description |
|---|---|---|---|
| `connectionString` | `string` | Yes | PostgreSQL connection URL |
| `ssl` | `boolean` | No | Enable SSL (defaults to `true` in production) |
| `encryptionKey` | `string` | No | 32-byte hex key for AES-256-GCM encryption |
| `onSuccess` | `(response) => void` | No | Callback after successful insert |
| `onError` | `(error) => void` | No | Callback on insert failure |

## Database Schema

The adapter uses Drizzle ORM and expects a `formengine_responses` table. A Drizzle schema definition is included — run migrations with your preferred Drizzle setup.

## Community

[![Discord](https://img.shields.io/discord/YOUR_SERVER_ID?color=5865F2&label=Discord&logo=discord&logoColor=white)](https://discord.gg/zMxdu5UVW)

- [Discord](https://discord.gg/zMxdu5UVW) — Get help, share projects, request features
- [Docs](https://squaredr.tech/products/fieldcraft/docs/adapters) — Adapter documentation
- [Pro Tools](https://squaredr.tech/products/fieldcraft/admin-pro) — Visual FormBuilder, SchemaEditor, ResponseViewer, ThemeEditor

## License

MIT
