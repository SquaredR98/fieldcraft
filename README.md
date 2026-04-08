# FieldCraft

A headless, pure TypeScript form engine with a React renderer. Define forms as JSON schemas, render them with 35+ pre-built field components, and get multi-step flows, conditional visibility, validation, and computed fields out of the box.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)]()
[![React](https://img.shields.io/badge/React-18%20%7C%2019-blue)]()

## Packages

| Package | Description |
|---------|-------------|
| [`@squaredr/fieldcraft-core`](packages/core) | Headless TypeScript engine — schema, validation, conditional visibility, state management |
| [`@squaredr/fieldcraft-react`](packages/react) | React renderer — 35+ field components, hooks, theming, pluggable field registry |

## Install

```bash
npm install @squaredr/fieldcraft-core @squaredr/fieldcraft-react
```

## Quick Start

```tsx
import { FormEngineRenderer } from "@squaredr/fieldcraft-react";
import "@squaredr/fieldcraft-react/styles.css";

const schema = {
  id: "contact",
  version: "1.0.0",
  title: "Contact Us",
  submitAction: { type: "callback" },
  sections: [
    {
      id: "main",
      title: "Contact Info",
      questions: [
        { id: "name", type: "short_text", label: "Full Name", required: true },
        { id: "email", type: "email", label: "Email", required: true },
        {
          id: "subject",
          type: "dropdown",
          label: "Subject",
          options: [
            { value: "general", label: "General Inquiry" },
            { value: "support", label: "Support" },
            { value: "feedback", label: "Feedback" },
          ],
        },
        { id: "message", type: "long_text", label: "Message" },
      ],
    },
  ],
};

function App() {
  return (
    <FormEngineRenderer
      schema={schema}
      onSubmit={async (response) => {
        console.log(response);
      }}
    />
  );
}
```

## Features

- **Headless core** -- pure TypeScript engine with zero UI dependencies; bring your own renderer or use the React package
- **35+ field types** -- ratings, NPS, matrix grids, file uploads, signatures, address blocks, and all the standard inputs
- **JSON schemas** -- define entire forms as plain objects in TypeScript or JSON
- **Multi-step flows** -- wizard-style sections with progress tracking and back/next navigation
- **Conditional visibility** -- show/hide fields based on answers, with AND/OR combinators
- **Validation** -- required, regex, min/max, custom sync/async validators
- **Computed fields** -- derive values automatically from other responses
- **Draft persistence** -- save and resume in-progress forms
- **Theme system** -- CSS custom properties + 6 built-in presets (clean, modern, dark, high-contrast, clinical, playful)
- **Pluggable fields** -- swap any field component via the field registry
- **Type-safe** -- full TypeScript types for schemas, configs, and responses

## Field Types

| Category | Types |
|----------|-------|
| Text | `short_text` `long_text` `email` `phone` `phone_international` `url` `legal_name` |
| Numeric | `number` `slider` `rating` `nps` `likert` `opinion_scale` |
| Selection | `single_select` `multi_select` `dropdown` `boolean` `country_select` `ranking` |
| Date/Time | `date` `date_range` `time` `appointment` |
| Media | `file_upload` `signature` `image_capture` |
| Advanced | `address` `payment` `matrix` `repeater` `calculated` `hidden` `scoring` |
| Structural | `consent` `info_block` |

## Project Structure

```
fieldcraft/
├── packages/
│   ├── core/           # Form engine (pure TypeScript)
│   └── react/          # React renderer + 35+ components
├── demo/               # Next.js demo app with 10 example forms
└── tooling/            # Shared configs (TypeScript, Tailwind, ESLint)
```

## Development

```bash
# Prerequisites: Node.js 18+, pnpm 9+

# Install
pnpm install

# Build all packages
pnpm build

# Run tests (212 core + 74 react = 286 passing)
pnpm test

# Start demo app
pnpm --filter @squaredr/fieldcraft-demo dev
```

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

## License

[MIT](LICENSE)
