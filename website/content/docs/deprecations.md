---
title: Deprecations
description: Field types scheduled for removal on 2027-07-01, why, and the three ways to keep working.
---

## What is changing

Twenty field types are scheduled for removal from `@squaredr/fieldcraft-react`
on **2027-07-01**. Nineteen move to the Pro package; one is replaced by
something better.

**Nothing breaks before that date.** They still render, still validate, still
submit. From version 1.12.0 they log a one-off warning in development so the
change is not a surprise later.

If you are reading this because of that warning, the short version: pick one of
the [three options](#your-options) below, or do nothing until closer to the
date.

## Why

Two reasons, both of which you can verify rather than take on trust.

**They are unused.** None of the twenty types appears in any of the 16 schemas
shipped in `@squaredr/fieldcraft-templates`. Clone the repo and grep
`packages/templates/src` if you want to check.

**Thirteen of them have broken accessibility.** `FieldWrapper` emits
`<Label htmlFor={field.id}>`, but those components never set a matching `id` —
so the label points at an element that does not exist. Clicking it focuses
nothing, and a screen reader announces no accessible name. Check which
components call `fieldAria()` to see the split.

Fixing thirteen components and then maintaining them indefinitely, for field
types nobody uses, costs more than it returns. A smaller set where every field
works is worth more than a larger set where some do not.

That is the whole argument. It is not about pushing anyone toward a paid tier —
option 1 below keeps every one of these fields, free, forever.

## The full list

### Moving to Pro (19)

| Type | Accessibility today |
|---|---|
| `signature` | broken label |
| `payment` | broken label |
| `matrix` | broken label |
| `image_capture` | broken label |
| `appointment` | broken label |
| `file_upload` | broken label |
| `address` | broken label |
| `repeater` | broken label |
| `ranking` | broken label |
| `scoring` | broken label |
| `welcome-screen` | broken label |
| `image` | broken label |
| `video` | broken label |
| `phone_international` | correct |
| `legal_name` | correct |
| `country_select` | correct |
| `date_range` | correct |
| `time` | correct |
| `slider` | correct |

### Replaced (1)

| Type | Replacement |
|---|---|
| `rich-text` | `labelFormat` / `helpTextFormat` on a question, or `contentFormat` on an `info_block` |

## Your options

### 1. Keep the field yourself — free, forever

Register your own component for the type. This is not a fallback; it is the
supported extension path, and it is how vertical packs have always worked.

```tsx
import { createFieldRegistry, FormEngineRenderer } from '@squaredr/fieldcraft-react';
import type { FieldProps } from '@squaredr/fieldcraft-react';

function MySignature({ field, value, onChange, onBlur }: FieldProps) {
  // your implementation
}

const components = createFieldRegistry({ signature: MySignature });

<FormEngineRenderer schema={schema} components={components} />;
```

`FieldProps` and `FieldComponent` are public API, and `QuestionType` accepts
any string — so **your schemas do not change at all** and this keeps working
after the type leaves the built-in registry.

If you only need the field to keep rendering as it does now, copy the current
implementation out of the repo before 2.0.0 and register that. It is MIT
licensed; that is a legitimate use.

### 2. Use the maintained version in Pro

`@squaredr/fieldcraft-pro` carries maintained implementations with the
accessibility problems fixed. Pass its overrides to the same `components` prop:

```tsx
import { PRO_FIELD_OVERRIDES } from '@squaredr/fieldcraft-pro';

<FormEngineRenderer schema={schema} components={PRO_FIELD_OVERRIDES} />;
```

Coverage is being filled in ahead of the removal date — `payment`,
`file_upload` and `appointment` are there today.

### 3. Pin and move later

```json
{ "dependencies": { "@squaredr/fieldcraft-react": "^1" } }
```

Version 1.x keeps every field. You get bug fixes within 1.x and move when it
suits you. This is a reasonable choice, not a bad one.

## Migrating off `rich-text`

`rich-text` is the one type with no replacement in Pro, because the block model
was the mistake rather than the implementation.

Formatting belongs on the text it formats. A separate content block is
unrelated content to a screen reader, **disappears entirely in conversational
mode**, and is left behind when the question is reordered in a builder. A
formatted label travels with its question and stays bound to its input.

Before:

```ts
{ id: 'intro', type: 'rich-text',
  config: { type: 'rich-text', format: 'markdown',
            content: 'Over the **last 2 weeks**, how often…' } },
{ id: 'q1', type: 'likert', label: 'Little interest or pleasure' }
```

After:

```ts
{ id: 'q1', type: 'likert',
  label: 'Over the **last 2 weeks**, how often have you been bothered by:\n\nLittle interest or pleasure in doing things',
  labelFormat: 'markdown' }
```

For standalone explanatory text, `info_block` now takes `contentFormat`:

```ts
{ id: 'why', type: 'info_block',
  config: { type: 'info_block', contentFormat: 'markdown',
            content: 'We ask for this because **your insurer requires it**.' } }
```

### What the formatting supports

Bold, italic, `code`, links, lists and line breaks. Deliberately **not**
headings, images or tables — an `<h1>` inside a question label breaks the
document outline, and an image there is almost always a layout accident.

Content is sanitised with DOMPurify against an explicit allow-list. Schemas
often come out of a database row, so label text is treated as untrusted input
even when you wrote it yourself.

## Checking a schema in CI

The list is exported, so you can fail a build rather than wait for a console
warning:

```ts
import { DEPRECATED_FIELD_TYPES, DEPRECATION_REMOVAL_DATE } from '@squaredr/fieldcraft-react';

const hits = schema.sections
  .flatMap((s) => s.questions)
  .filter((q) => DEPRECATED_FIELD_TYPES.has(q.type));

if (hits.length > 0) {
  throw new Error(
    `${hits.length} field(s) removed on ${DEPRECATION_REMOVAL_DATE}: ` +
      hits.map((q) => `${q.id} (${q.type})`).join(', '),
  );
}
```

## Timeline

| When | What |
|---|---|
| **1.12.0** | Development warnings begin. Everything still works. |
| **1.x** | No removals. Bug fixes continue for every field. |
| **2027-07-01** | Earliest date the types may be removed, in **2.0.0**. |

The date is fixed rather than tied to a version, so it holds even if 2.0.0
slips. If 2.0.0 ships earlier for unrelated reasons, these types travel with it
until the date has passed.
