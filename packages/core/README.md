# @squaredr/fieldcraft-core

Headless TypeScript form engine with zero UI dependencies. Define multi-section forms via JSON schemas with validation, conditional visibility, and computed fields.

[![npm version](https://img.shields.io/npm/v/@squaredr/fieldcraft-core)](https://www.npmjs.com/package/@squaredr/fieldcraft-core)
[![npm downloads](https://img.shields.io/npm/dm/@squaredr/fieldcraft-core)](https://www.npmjs.com/package/@squaredr/fieldcraft-core)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)

> **Website:** [fieldcraft.squaredr.tech](https://fieldcraft.squaredr.tech) · **Docs:** [fieldcraft.squaredr.tech/docs](https://fieldcraft.squaredr.tech/docs) · **GitHub:** [github.com/SquaredR98/fieldcraft](https://github.com/SquaredR98/fieldcraft)

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
- **Display modes** — stepped (wizard), classic (all-at-once), or conversational (one question at a time)
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
| `engine.resetField(fieldId)` | Reset a field to its initial value, clear errors and touched |
| `engine.resetForm()` | Reset all fields to initial values |
| `engine.focusField(fieldId)` | Record focus timestamp for analytics timing |
| `engine.getFieldState(fieldId)` | Get `{ value, error, touched, visible, disabled, required }` |
| `engine.getChangedFields()` | Get map of fields where value differs from initial |

### Navigation

| Method | Description |
|--------|-------------|
| `engine.nextSection()` | Move to next visible section |
| `engine.prevSection()` | Move to previous section |
| `engine.jumpTo(sectionId)` | Jump to a specific section |
| `engine.nextQuestion()` | Move to next visible input question (conversational mode) |
| `engine.prevQuestion()` | Move to previous input question (conversational mode) |
| `engine.getVisibleQuestions()` | Get all visible input questions across all sections |

### Visibility & Field State

| Method | Description |
|--------|-------------|
| `engine.getVisibleSections()` | Get sections not hidden by `showIf` conditions |
| `engine.getVisibleFields(sectionId)` | Get visible fields within a section |
| `engine.isFieldRequired(fieldId)` | Check if field is currently required |
| `engine.isFieldVisible(fieldId)` | Check if field passes its `showIf` condition |
| `engine.isFieldDisabled(fieldId)` | Check if field is currently disabled |
| `engine.isFieldReadonly(fieldId)` | Check if field is readonly (accepts value programmatically) |
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

Drafts support auto-save intervals, schema versioning, and migrations. See `EngineOptions` for `autoSaveIntervalMs` and `draftMigrations`.

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

Supported operators: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, `exists`, `notExists`, `contains`, `notContains`, `startsWith`, `endsWith`, `between`, `matches`, `isEmpty`, `isNotEmpty`, `matchesRegex`, `dateAfter`, `dateBefore`, `arrayContains`, `arrayNotContains`, `lengthGreaterThan`, `lengthLessThan`.

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

Supported math: `+`, `-`, `*`, `/`, `^`, parentheses, `FLOOR()`, `CEIL()`, `ROUND()`, `MIN()`, `MAX()`, `ABS()`.

### Repeater Aggregates

Aggregate functions operate on repeater sub-fields using dot-notation:

```typescript
// Sum all unit prices across repeater rows
{ expression: "SUM({order_items.unit_price})" }

// Sum the product of two sub-fields per row
{ expression: "SUM({order_items.unit_price} * {order_items.quantity})" }

// Average, count, min, max
{ expression: "AVG({line_items.price})" }
{ expression: "COUNT({line_items.price})" }
{ expression: "MIN({line_items.price})" }
{ expression: "MAX({line_items.quantity})" }

// Combine aggregates with simple field refs
{ expression: "SUM({order_items.unit_price} * {order_items.quantity}) * (1 + {tax_rate} / 100)" }
```

Supported aggregates: `SUM()`, `AVG()`, `COUNT()`, `MIN()`, `MAX()`. All references inside an aggregate must belong to the same repeater. Empty repeaters return `0`.

### Other Functions

String functions: `UPPER()`, `LOWER()`, `TRIM()`, `LEN()`, `CONCAT()`.

Date functions: `TODAY()`, `DATEDIFF()`, `DATEADD()`.

Conditional: `IF(condition, trueVal, falseVal)`.

## Validation

Built-in validators: `required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `email`, `phone`, `url`, `date`, `fileSize`, `fileType`, `integer`, `positiveNumber`, `alphanumeric`, `noSpecialChars`, `minItems`, `maxItems`, `compareToField`.

All rules support optional `message` overrides, conditional application via `applyIf`, and severity levels (`error`, `warning`, `info`).

```typescript
{
  id: "password_confirm",
  type: "short_text",
  label: "Confirm Password",
  validation: [
    { type: "required" },
    { type: "compareToField", fieldId: "password", operator: "eq", message: "Passwords must match" },
  ],
}
```

## Subpath Exports

```typescript
// Testing utilities
import { createTestSchema, createMockSubmitAdapter } from "@squaredr/fieldcraft-core/testing";

// Validator registry
import { createValidatorRegistry } from "@squaredr/fieldcraft-core/validators";
```

## Pair with React

```bash
npm install @squaredr/fieldcraft-react
```

The React package provides a ready-to-use `FormEngineRenderer` component with 44 field components built on shadcn/ui and Tailwind CSS.

## Community

- [Discord](https://discord.gg/FK8pszp5z) — Get help, share projects, request features
- [Docs](https://fieldcraft.squaredr.tech/docs) — Full documentation
- [GitHub](https://github.com/SquaredR98/fieldcraft) — Source code and issues

## License

MIT
