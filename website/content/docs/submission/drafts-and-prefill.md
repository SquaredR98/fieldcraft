---
title: Drafts & prefill
description: Persist answers across page refreshes, resume saved drafts, and pre-populate fields from URLs, props, or external data.
---

## Draft persistence

Enable draft saving in the schema settings:

```ts
settings: {
  allowDraftSave: true,
  draftStorage: 'local',        // 'local' | 'server' | 'both'
  draftTtlHours: 72,            // Draft expires after 72 hours (default)
}
```

With `draftStorage: 'local'`, drafts are saved to `localStorage` using the key pattern `fe_draft__{schemaId}__{sessionToken}`. Different forms and sessions never collide.

### What's saved in a draft

```ts
type DraftData = {
  schemaId: string
  sessionToken: string
  partialData: Record<string, unknown>    // Current field values
  currentSectionId?: string               // Which section the user was on
  visitedSectionIds?: string[]            // Which sections they've seen
  savedAt: string                         // ISO timestamp
  expiresAt: string                       // ISO timestamp (savedAt + ttlHours)
}
```

### Draft resume prompt

When a user returns to a form with a saved draft, `FormRenderer` shows a `DraftResumePrompt`:

```
"You have a saved draft from 2 hours ago. Would you like to resume or start over?"
[Resume]  [Start over]
```

### Engine methods

```ts
await engine.saveDraft()       // Save current state
const resumed = await engine.loadDraft()  // Load draft — returns true if found
engine.clearDraft()            // Delete the draft
```

### Server-side drafts

For drafts that persist across devices, use a `DraftAdapter`:

```ts
import { createSupabaseDraftAdapter } from '@squaredr/fieldcraft-adapters'

const draftAdapter = createSupabaseDraftAdapter({
  client: supabase,
  table: 'form_drafts',          // Default: 'form_drafts'
  ttlHours: 168,                 // 1 week
})
```

Pass it to the renderer:

```tsx
<FormRenderer
  schema={schema}
  draftAdapter={draftAdapter}
  onSubmit={handleSubmit}
/>
```

Or use the Postgres adapter:

```ts
import { createPostgresDraftAdapter } from '@squaredr/fieldcraft-adapters'

const draftAdapter = createPostgresDraftAdapter({
  connectionString: process.env.DATABASE_URL!,
  table: 'form_drafts',
  ttlHours: 168,
  ssl: true,
})
```

### Building a custom draft adapter

Implement the `DraftAdapter` interface:

```ts
import type { DraftAdapter, DraftData } from '@squaredr/fieldcraft-core'

const redisDraftAdapter: DraftAdapter = {
  async save(draft: DraftData) {
    const key = `draft:${draft.schemaId}:${draft.sessionToken}`
    await redis.set(key, JSON.stringify(draft), 'EX', draft.expiresAt)
  },
  async load(schemaId: string, sessionToken: string) {
    const key = `draft:${schemaId}:${sessionToken}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  },
  async delete(schemaId: string, sessionToken: string) {
    const key = `draft:${schemaId}:${sessionToken}`
    await redis.del(key)
  },
}
```

## Prefill

Pre-populate field values from external data. Three sources are supported.

### Props prefill

Pass values directly:

```tsx
<FormRenderer
  schema={schema}
  prefill={{
    email: 'user@example.com',
    company: 'Acme Inc',
    plan: 'enterprise',
  }}
  onSubmit={handleSubmit}
/>
```

### URL prefill

Configure URL-based prefill in the schema:

```ts
settings: {
  prefill: {
    source: 'url',              // 'props' | 'url' | 'both'
    paramPrefix: 'fc_',         // URL params prefixed with fc_
  },
}
```

Then link to the form with query parameters:

```
https://example.com/form?fc_email=user@example.com&fc_plan=enterprise
```

The `paramPrefix` prevents collisions with other query parameters.

### Combined prefill

With `source: 'both'`, props values take priority over URL values for the same field.

### Transform

Apply transformations to prefilled values:

```ts
settings: {
  prefill: {
    source: 'both',
    transform: {
      email: (value) => String(value).toLowerCase(),
      phone: (value) => String(value).replace(/\D/g, ''),
    },
  },
}
```

### prefillKey

Map external data keys to field IDs:

```ts
{
  id: 'user_email',
  type: 'email',
  label: 'Email',
  prefillKey: 'email',         // Maps external key 'email' → field 'user_email'
}
```

This lets your URL parameters or API data use different key names than your field IDs.

## Next steps

- [Adapters overview](/docs/submission/adapters-overview) — submission targets and encryption
- [Server validation](/docs/submission/server-validation) — validate schemas before rendering
