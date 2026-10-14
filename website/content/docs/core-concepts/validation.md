---
title: Validation
description: 14 built-in validation rule types, custom sync and async validators, and how validation triggers work.
---

## Validation rules

Each field can have a `validation` array with one or more rules. Rules are evaluated in order — the first failure produces the error message.

```ts
{
  id: 'email',
  type: 'email',
  label: 'Email',
  required: true,
  validation: [
    { type: 'email', message: 'Enter a valid email address.' },
  ],
}
```

## Built-in rule types

| Type | Parameters | Description |
|------|-----------|-------------|
| `required` | `message?` | Field must have a value. Usually set via `required: true` on the field instead. |
| `min` | `value: number`, `message?` | Numeric minimum |
| `max` | `value: number`, `message?` | Numeric maximum |
| `minLength` | `value: number`, `message?` | String minimum length |
| `maxLength` | `value: number`, `message?` | String maximum length |
| `pattern` | `regex: string`, `flags?: string`, `message?` | Regular expression match |
| `email` | `message?` | Valid email format |
| `phone` | `message?` | Valid phone number format |
| `url` | `message?` | Valid URL format |
| `date` | `min?: string`, `max?: string`, `message?` | Date within range |
| `fileSize` | `maxMb: number`, `message?` | Maximum file size in MB |
| `fileType` | `accept: string[]`, `message?` | Allowed MIME types |

## User-defined rule types

These are not built-in — they delegate to validator functions you provide.

| Type | Parameters | Description |
|------|-----------|-------------|
| `custom` | `name: string`, `params?`, `message?` | Custom sync validator |
| `async` | `endpoint: string`, `message?` | Async server-side validator. Runs on blur and again as the submit gate. |

## Examples

### String length

```ts
validation: [
  { type: 'minLength', value: 2, message: 'Name must be at least 2 characters.' },
  { type: 'maxLength', value: 100, message: 'Name must be under 100 characters.' },
]
```

### Regex pattern

```ts
validation: [
  {
    type: 'pattern',
    regex: '^[A-Z]{3}-\\d{4}$',
    message: 'Must match format: ABC-1234',
  },
]
```

### Numeric bounds

```ts
validation: [
  { type: 'min', value: 0, message: 'Amount cannot be negative.' },
  { type: 'max', value: 10000, message: 'Maximum amount is 10,000.' },
]
```

### File validation

```ts
validation: [
  { type: 'fileSize', maxMb: 5, message: 'File must be under 5 MB.' },
  { type: 'fileType', accept: ['image/png', 'image/jpeg'], message: 'Only PNG and JPEG files are accepted.' },
]
```

## Custom validators

Register sync validators and reference them by name in the schema.

**Define the validator:**

```ts title="lib/validators.ts"
import type { CustomValidator } from '@squaredr/fieldcraft-core'

export const validators: Record<string, CustomValidator> = {
  noProfanity: (value, _values, _params) => {
    const blocked = ['spam', 'test']
    if (typeof value === 'string' && blocked.some((w) => value.toLowerCase().includes(w))) {
      return 'Please remove inappropriate content.'
    }
    return null // null = valid
  },
  matchesField: (value, values, params) => {
    const otherField = params?.field as string
    if (value !== values[otherField]) {
      return params?.message as string || 'Values must match.'
    }
    return null
  },
}
```

**Reference it in the schema:**

```ts
{
  id: 'confirm_email',
  type: 'email',
  label: 'Confirm email',
  validation: [
    { type: 'custom', name: 'matchesField', params: { field: 'email', message: 'Emails must match.' } },
  ],
}
```

**Pass validators to the renderer:**

```tsx
<FormEngineRenderer
  schema={schema}
  validators={validators}
  onSubmit={handleSubmit}
/>
```

The validator function signature is `(value, allValues, params?) => string | null`. Return a string to indicate an error, or `null` to pass.

## Async validators

For server-side validation (e.g., checking if a username is taken):

```ts
{
  id: 'username',
  type: 'short_text',
  label: 'Username',
  validation: [
    { type: 'async', endpoint: 'uniqueUsername' },
  ],
}
```

The `endpoint` is a **key**, not a URL. Register a function under that exact
key — the name in the schema and the name in the registry must match:

```ts
const asyncValidators: Record<string, AsyncValidator> = {
  uniqueUsername: async (value) => {
    const res = await fetch(`/api/check-username?u=${value}`)
    const data = await res.json()
    return data.available ? null : 'Username is already taken.'
  },
}
```

```tsx
<FormEngineRenderer
  schema={schema}
  asyncValidators={asyncValidators}
  onSubmit={handleSubmit}
/>
```

Keeping the function out of the schema is deliberate. The schema stays JSON —
serialisable, storable in a database row, diffable in a pull request. The
moment a function can live in it, it stops being data.

### When async rules run

Twice, and the two differ on purpose.

| | When | If the validator throws |
|---|---|---|
| **On blur** | After the synchronous rules pass | **Fails open** — the field is left as the sync rules found it |
| **On submit** | Every visible field, including ones never blurred | **Fails closed** — the submission is blocked |

Blur is a convenience: an unreachable endpoint should not nag a respondent
about something they cannot fix. Submit is the gate: an unverified claim must
not pass silently.

Async rules are skipped when the synchronous rules already failed — there is no
point asking a server about a value `minLength` has rejected.

A blur result is reused by the submit gate when the value has not changed, so
the same question is not asked twice. Change the value after blurring and it is
re-checked.

### The pending state

While a check is in flight the field is neither valid nor invalid — the answer
is not known yet. `FormState.validating` carries that:

```tsx
const { state } = useFormEngine(schema, { asyncValidators })

{state.validating.username && <Spinner />}
```

Navigation refuses while a check is open. Without that, a respondent could
leave a field, advance, and have the error land on a question they can no
longer see.

**`debounceMs` is deprecated** and scheduled for removal on 2027-07-01. It has
never had any effect: blur and submit are single events, so there is nothing to
debounce.

## When validation runs

| Trigger | What validates | Async rules too? |
|---------|---------------|---|
| Field blur | That single field | Yes, after the sync rules pass |
| `setValue()` | That single field (if `touched`) | No |
| Section navigation ("Next") | All visible fields in the current section | No — but navigation refuses while a check is open |
| Submit | All visible fields across all sections | Yes, including fields never blurred |

Errors are only displayed after a field has been `touched` (the user interacted with it) or after `submitAttempted` is `true`. This prevents showing errors on fields the user hasn't reached yet.

## Structural fields skip validation

Non-input field types (`info_block`, `divider`, `spacer`, `section_header`, `page_break`, `welcome-screen`, `thank-you-screen`, `rich-text`, `image`, `video`) are never validated. Adding `required` or `validation` to them will cause the schema validator to throw `FormEngineSchemaError`.

## ValidationResult

The `validate()` and `validateSection()` engine methods return:

```ts
type ValidationResult = {
  valid: boolean
  errors: Record<string, string[]>
  firstErrorFieldId?: string
  firstErrorSectionId?: string
}
```

## Next steps

- [Computed fields](/docs/core-concepts/computed-fields) — auto-calculate values from expressions
- [Multi-step forms](/docs/core-concepts/multi-step-forms) — section navigation and progress
- [Server validation](/docs/submission/server-validation) — validate schemas on the server

## Related reading

- [How FieldCraft's Validation Pipeline Works Under the Hood](/blog/fieldcraft-validation-pipeline) — deep-dive into the validation architecture
- [6 Hard-Won UX Lessons from Building a Form Engine](/blog/form-ux-lessons) — why validate on blur, not on change
