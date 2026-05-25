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

// Get response
const response = engine.getResponse();
```

## Features

- **Schema-driven** — define forms with JSON/TypeScript schemas
- **35+ field types** — text, email, phone, date, file upload, rating, NPS, matrix, and more
- **Conditional logic** — show/hide fields based on previous answers with AND/OR combinators
- **Multi-section flows** — wizard-style forms with progress tracking
- **Validation** — required fields, regex, min/max, custom validators, async validators
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
| Structural | `consent`, `info_block` |

## API

### `createEngine(schema, options?)`

Creates a form engine instance.

- `engine.setValue(questionId, value)` — set a field value
- `engine.getValue(questionId)` — get a field value
- `engine.validate()` — validate all visible fields
- `engine.validateField(questionId)` — validate a single field
- `engine.getResponse()` — get the complete form response
- `engine.getState()` — get current form state (values, errors, visibility)
- `engine.nextSection()` / `engine.prevSection()` — navigate sections
- `engine.subscribe(listener)` — subscribe to state changes

### `validateSchema(schema)`

Validates a FormEngineSchema object and returns detailed errors.

## Pair with React

```bash
npm install @squaredr/fieldcraft-react
```

The React package provides a ready-to-use `FormEngineRenderer` component with 35+ field components built on shadcn/ui and Tailwind CSS.

## Community

[![Discord](https://img.shields.io/discord/YOUR_SERVER_ID?color=5865F2&label=Discord&logo=discord&logoColor=white)](https://discord.gg/YOUR_INVITE_LINK)

- [Discord](https://discord.gg/YOUR_INVITE_LINK) — Get help, share projects, request features
- [Docs](https://squaredr.tech/products/fieldcraft/docs) — Full documentation
- [GitHub](https://github.com/AkshayBandi027/formengine) — Source code and issues
- [Pro Tools](https://squaredr.tech/products/fieldcraft/admin-pro) — Visual FormBuilder, SchemaEditor, ResponseViewer, ThemeEditor

## License

MIT
