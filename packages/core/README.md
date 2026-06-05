# @squaredr/fieldcraft-core

Headless TypeScript form engine with zero UI dependencies. Define multi-section forms via JSON schemas with validation, conditional visibility, and computed fields.

## Install

```bash
npm install @squaredr/fieldcraft-core
```

## Quick Start

```typescript
import { createEngine, type FormEngineSchema } from "@squaredr/fieldcraft-core";

const schema: FormEngineSchema = {
  id: "contact",
  version: "1.0.0",
  title: "Contact Form",
  submitAction: { type: "callback" },
  sections: [
    {
      id: "info",
      title: "Your Info",
      questions: [
        { id: "name", type: "short_text", label: "Name", required: true },
        { id: "email", type: "email", label: "Email", required: true },
        { id: "message", type: "long_text", label: "Message" },
      ],
    },
  ],
};

const engine = createEngine(schema);

// Set values
engine.setValue("name", "Alice");
engine.setValue("email", "alice@example.com");

// Validate
const result = engine.validate();
console.log(result.valid); // true

// Submit
const submitResult = await engine.submit();
console.log(submitResult.success); // true

// Read state at any time
const state = engine.getState();
console.log(state.values); // { name: "Alice", email: "alice@example.com" }
```

## Features

- **Schema-driven** — define forms with JSON/TypeScript schemas
- **44 field types** — text, email, phone, date, file upload, rating, NPS, matrix, and more
- **Conditional logic** — show/hide fields based on previous answers with AND/OR combinators
- **Multi-section flows** — wizard-style forms with progress tracking
- **Validation** — required fields, regex, min/max, custom validators
- **Computed fields** — derive values automatically from other field responses
- **Draft persistence** — save and resume in-progress forms
- **Type-safe** — full TypeScript support with exported types for every config

## Field Types

| Category | Types |
|----------|-------|
| Text | `short_text`, `long_text`, `email`, `phone`, `phone_international`, `url`, `legal_name` |
| Numeric | `number`, `slider`, `rating`, `nps`, `likert`, `opinion_scale` |
| Selection | `single_select`, `multi_select`, `dropdown`, `boolean`, `country_select`, `ranking` |
| Date/Time | `date`, `date_range`, `time`, `appointment` |
| Media | `file_upload`, `signature`, `image_capture` |
| Advanced | `address`, `payment`, `matrix`, `repeater`, `calculated`, `hidden`, `scoring` |
| Structural | `consent`, `info_block`, `section_header`, `page_break` |
| Content | `welcome-screen`, `thank-you-screen`, `rich-text`, `image`, `video`, `divider`, `spacer` |

## API

### `createEngine(schema, options?)`

Creates a form engine instance. Options:

```typescript
const engine = createEngine(schema, {
  adapters: submitAdapter,       // SubmitAdapter or SubmitAdapter[]
  onSubmit: (response) => {},    // callback after successful submit
  validators: { myRule: fn },    // custom sync validators
  sessionToken: "abc123",        // for draft persistence
});
```

### Values & State

| Method | Description |
|--------|-------------|
| `engine.setValue(fieldId, value)` | Set a single field value |
| `engine.setValues(values)` | Set multiple field values at once |
| `engine.getState()` | Get full form state: `{ values, errors, touched, currentSectionId, isSubmitting, isSubmitted, ... }` |
| `engine.touchField(fieldId)` | Mark a field as touched (triggers error display) |
| `engine.clearField(fieldId)` | Clear a field value and its errors |

### Navigation

| Method | Description |
|--------|-------------|
| `engine.nextSection()` | Move to next visible section |
| `engine.prevSection()` | Move to previous section |
| `engine.jumpTo(sectionId)` | Jump to a specific section |

### Visibility & Field State

| Method | Description |
|--------|-------------|
| `engine.getVisibleSections()` | Get sections not hidden by `showIf` conditions |
| `engine.getVisibleFields(sectionId)` | Get visible fields within a section |
| `engine.isFieldRequired(fieldId)` | Check if field is currently required |
| `engine.isFieldVisible(fieldId)` | Check if field passes its `showIf` condition |
| `engine.isFieldDisabled(fieldId)` | Check if field is currently disabled |
| `engine.getFieldError(fieldId)` | Get validation errors for a field |

### Validation & Submission

| Method | Description |
|--------|-------------|
| `engine.validate()` | Validate all visible fields, returns `{ valid, errors }` |
| `engine.validateSection(sectionId)` | Validate fields in a specific section |
| `engine.submit()` | Validate + run submit adapters, returns `{ success, adapterResults }` |

### Draft Persistence

| Method | Description |
|--------|-------------|
| `engine.saveDraft()` | Save current form state to localStorage |
| `engine.loadDraft()` | Restore a previously saved draft |
| `engine.clearDraft()` | Delete the saved draft |

### Schema Introspection

| Method | Description |
|--------|-------------|
| `engine.getSchema()` | Get the original schema |
| `engine.getSectionById(sectionId)` | Lookup a section by ID |
| `engine.getQuestionById(questionId)` | Lookup a question by ID |
| `engine.updateFieldCustomProps(fieldId, props)` | Merge custom props into a field at runtime |

### Lifecycle

| Method | Description |
|--------|-------------|
| `engine.subscribe(listener)` | Subscribe to state changes, returns unsubscribe function |
| `engine.destroy()` | Clean up subscriptions and internal state |

### `validateSchema(schema)`

Validates a `FormEngineSchema` object at runtime. Returns the parsed schema on success, or throws `FormEngineSchemaError` with detailed structural errors. Use this to catch schema problems at build time.

```typescript
import { validateSchema, FormEngineSchemaError } from "@squaredr/fieldcraft-core";

try {
  const validatedSchema = validateSchema(mySchema);
  // validatedSchema is a validated FormEngineSchema
} catch (err) {
  if (err instanceof FormEngineSchemaError) {
    console.error(err.issues); // ZodIssue[]
  }
}
```

## Conditional Visibility

Use `showIf` on any question or section to control visibility based on other field values:

```typescript
{
  id: "insurance_details",
  type: "short_text",
  label: "Insurance Provider",
  showIf: {
    field: "has_insurance",
    operator: "eq",
    value: true,
  },
}
```

Supported operators: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, `exists`, `notExists`, `contains`, `notContains`, `startsWith`, `endsWith`, `between`, `matches`.

Combine conditions with `AND`/`OR`:

```typescript
showIf: {
  combinator: "AND",
  conditions: [
    { field: "age", operator: "gte", value: 18 },
    { field: "country", operator: "eq", value: "US" },
  ],
}
```

## Calculated Fields

Use expression syntax to derive values from other fields:

```typescript
{
  id: "total",
  type: "calculated",
  label: "Total",
  config: {
    type: "calculated",
    expression: "{subtotal} * (1 + {tax_rate} / 100)",
    format: "currency",
    decimalPlaces: 2,
  },
}
```

Supported: `+`, `-`, `*`, `/`, `^`, parentheses, `floor()`, `ceil()`, `round()`, `min()`, `max()`, `abs()`.

## Pair with React

```bash
npm install @squaredr/fieldcraft-react
```

The React package provides a ready-to-use `FormEngineRenderer` component with 44 field components built on shadcn/ui and Tailwind CSS.

## Community

- [Discord](https://discord.gg/zMxdu5UVW) — Get help, share projects, request features
- [Docs](https://squaredr.tech/products/fieldcraft/docs) — Full documentation
- [GitHub](https://github.com/AkshayBandi027/formengine) — Source code and issues
- [Pro Tools](https://squaredr.tech/products/fieldcraft/admin-pro) — Visual FormBuilder, ResponseViewer, ThemeEditor

## License

MIT
