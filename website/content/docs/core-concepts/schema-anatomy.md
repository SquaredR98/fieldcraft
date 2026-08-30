---
title: Schema anatomy
description: The schema is a single JSON object that describes the entire form — fields, sections, validation, conditions, and submission. This page documents every property.
---

## The root object

```ts
type FormEngineSchema = {
  id: string                    // Unique form identifier
  version: string               // Schema version — sent with every submission
  title: string                 // Form title displayed at the top
  description?: string          // Optional subtitle
  branding?: BrandingConfig
  settings?: FormSettings
  sections: Section[]           // At least one required
  submitAction: SubmitAction
  onComplete?: CompleteAction
}
```

`id` and `version` are included in every `FormResponse` sent to your backend. They let you associate submissions with forms and handle schema evolution — when you add a field next month, `version` tells your backend which fields to expect.

The engine uses `id` + `sessionToken` to scope draft storage. Different forms never collide.

## Sections

```ts
type Section = {
  id: string                        // Unique within the schema
  title: string                     // Section heading
  description?: string              // Optional subheading
  showIf?: ConditionExpression      // Conditional visibility
  questions: Question[]             // At least one required
  onExit?: SectionExitAction        // Jump rules on leaving this section
}
```

A section is a "page" in a multi-step form. In `stepped` mode, one section is visible at a time. In `classic` mode, all visible sections render on a single scrollable page.

When `showIf` evaluates to `false`, the section disappears from navigation. Its fields are excluded from validation and submission.

### Jump rules

```ts
type SectionExitAction = {
  rules: JumpRule[]          // Ordered — first match wins
  default?: string           // Fallback section ID
}

type JumpRule = {
  condition: ConditionExpression
  jumpTo: string             // Target section ID
}
```

When the user clicks "Next", the engine checks `onExit.rules` in order. The first rule whose condition is `true` determines the next section. If no rule matches, `onExit.default` is used. If neither exists, the next section in array order is shown.

## Questions

```ts
type Question = {
  id: string                                  // Unique across the entire schema
  type: QuestionType                          // "short_text", "email", "rating", etc.
  label: string                               // The question text
  helpText?: string                           // Hint text below the field
  placeholder?: string                        // Input placeholder
  required?: boolean | ConditionExpression    // Static or conditional
  showIf?: ConditionExpression                // Conditional visibility
  disabled?: boolean | ConditionExpression    // Static or conditional
  validation?: ValidationRule[]               // Validation rules
  prefillKey?: string                         // Maps external data to this field
  config?: QuestionConfig                     // Type-specific configuration
  options?: Option[]                          // For select/dropdown/ranking types
  layout?: QuestionLayout                     // Width, columns, custom CSS
  customProps?: Record<string, unknown>       // Escape hatch for custom renderers
}
```

### Conditional properties

`required`, `showIf`, and `disabled` all accept `boolean | ConditionExpression`. This means a field can be:

```ts
// Always required
required: true

// Never required
required: false

// Conditionally required — only when another field has a specific value
required: { field: 'contact_method', operator: 'eq', value: 'email' }
```

### Field IDs must be globally unique

The engine uses `id` as the key in `state.values`, `state.errors`, and `state.touched`. If two fields in different sections share an ID, they overwrite each other. The schema validator catches this:

```
FormEngineSchemaError: Invalid FormEngine schema:
  - Duplicate question ID: "email"
```

### Type-specific config

Every field type can have a `config` object. Its shape depends on `type`. A slider needs `min`, `max`, `step`. An email field doesn't. This keeps the generic `Question` type clean while allowing type-specific options.

See [Field types](/docs/core-concepts/field-types) for every config shape.

## Options

For choice-based fields (`single_select`, `multi_select`, `dropdown`, `ranking`):

```ts
type Option = {
  label: string                          // Display text
  value: string | number | boolean       // Stored value
  helpText?: string                      // Tooltip
  icon?: string                          // Icon identifier
  exclusive?: boolean                    // "None of the above" behaviour
}
```

`exclusive: true` creates a mutually exclusive option. In a `multi_select`, checking an exclusive option unchecks everything else, and checking anything else unchecks the exclusive option.

```ts
options: [
  { label: 'Headache', value: 'headache' },
  { label: 'Fatigue', value: 'fatigue' },
  { label: 'Nausea', value: 'nausea' },
  { label: 'None of the above', value: 'none', exclusive: true },
]
```

## Settings

```ts
type FormSettings = {
  displayMode?: 'classic' | 'stepped' | 'conversational'
  allowDraftSave?: boolean
  draftStorage?: 'local' | 'server' | 'both'
  draftTtlHours?: number                    // Default: 72
  showProgress?: boolean
  progressStyle?: 'bar' | 'steps' | 'percentage'
  prefill?: PrefillConfig
  noPiiInLogs?: boolean
  locale?: string
  serverUrl?: string
  submitButton?: {
    label?: string
    loadingLabel?: string
    successLabel?: string
  }
  navigation?: {
    showBack?: boolean
    showSectionList?: boolean
    nextLabel?: string
    backLabel?: string
    allowSkip?: boolean
  }
}
```

| Mode | Behaviour |
|------|-----------|
| `classic` | All sections on one scrollable page. No navigation buttons. |
| `stepped` | One section at a time. Next/Back buttons. Progress indicator. |
| `conversational` | One question at a time. Typeform-style. |

`noPiiInLogs: true` prevents the engine from logging field values to the console, even in development. Required for HIPAA-compliant forms.

## Submit and complete actions

```ts
type SubmitAction = {
  type: 'http' | 'callback' | 'adapter'
  url?: string
  method?: 'POST' | 'PUT' | 'PATCH'
  headers?: Record<string, string>
}
```

| Type | What happens |
|------|-------------|
| `http` | Engine POSTs a `FormResponse` to `url` with optional headers |
| `callback` | Engine calls the `onSubmit` callback passed to the renderer |
| `adapter` | Engine routes through registered `SubmitAdapter` instances |

```ts
type CompleteAction = {
  type: 'redirect' | 'message' | 'callback'
  url?: string
  message?: string
  showSummary?: boolean
}
```

## Branding

```ts
type BrandingConfig = {
  logoUrl?: string
  logoAlt?: string
  faviconUrl?: string
  poweredBy?: boolean          // "Powered by FieldCraft" badge — default true
}
```

## Layout

```ts
type QuestionLayout = {
  width?: 'full' | 'half' | 'third'
  columns?: number                     // For option groups (2/3/4 columns)
  className?: string                   // Custom CSS class (use fc- prefix)
  style?: Record<string, string>       // Inline styles
}
```

`width: 'half'` puts two fields side by side. `width: 'third'` fits three across. The renderer maps these to CSS grid classes.

## FormState — the runtime snapshot

When the engine processes a schema, it creates a `FormState` — the live snapshot of everything happening in the form.

```ts
type FormState = {
  // Field data
  values: Record<string, unknown>
  errors: Record<string, string[]>
  touched: Record<string, boolean>
  isDirty: boolean

  // Submission
  isSubmitting: boolean
  isSubmitted: boolean
  submitError?: string
  submitAttempted: boolean

  // Navigation
  currentSectionId: string
  currentSectionIndex: number
  totalVisibleSections: number
  progressPercent: number                // 0–100
  visibleSectionIds: string[]
  visitedSectionIds: string[]
  canGoNext: boolean
  canGoPrev: boolean
  isCurrentSectionValid: boolean

  // Scoring
  scores: Record<string, number>
  totalScore?: number

  // Drafts
  hasDraft: boolean
  lastDraftSavedAt?: string
}
```

React components never write to `FormState` directly. They call engine methods (`setValue`, `nextSection`, etc.) and subscribe to state changes via hooks.

## FormResponse — what leaves the form

When the user submits, the engine builds a `FormResponse`:

```ts
type FormResponse = {
  schemaId: string
  schemaVersion: string
  submittedAt: string               // ISO timestamp
  sessionToken: string              // UUID generated at engine creation
  values: Record<string, unknown>
  scores?: Record<string, number>
  totalScore?: number
  metadata?: Record<string, unknown>
  completionTimeMs?: number         // Time from engine creation to submit
}
```

`completionTimeMs` is useful for bot detection (a form completed in 500ms wasn't filled out by a human) and analytics.

## Next steps

- [Field types](/docs/core-concepts/field-types) — all 44 types with their configs
- [Conditional logic](/docs/core-concepts/conditional-logic) — `showIf`, operators, and compound conditions
- [Validation](/docs/core-concepts/validation) — 19 built-in rule types plus custom and async validators

## Related reading

- [Why Schema-Driven? The Architecture Behind FieldCraft](/blog/why-schema-driven) — why the schema is the source of truth
- [Schema-Driven vs Code-Driven Forms](/blog/schema-vs-code-driven-forms) — when each approach fits
