# FieldCraft

A headless, pure TypeScript form engine with a React renderer. Define forms as JSON schemas, render them with 44 pre-built field components, and get multi-step flows, conditional visibility, validation, and computed fields out of the box.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)]()
[![React](https://img.shields.io/badge/React-18%20%7C%2019-blue)]()
[![npm version](https://img.shields.io/npm/v/@squaredr/fieldcraft-core)](https://www.npmjs.com/package/@squaredr/fieldcraft-core)
[![npm downloads](https://img.shields.io/npm/dm/@squaredr/fieldcraft-core)](https://www.npmjs.com/package/@squaredr/fieldcraft-core)

> **Website & docs:** [fieldcraft.squaredr.tech](https://fieldcraft.squaredr.tech) · **GitHub:** [github.com/SquaredR98/fieldcraft](https://github.com/SquaredR98/fieldcraft) · **Discord:** [Join](https://discord.gg/FK8pszp5z)

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`@squaredr/fieldcraft-core`](packages/core) | Headless TypeScript engine — schema, validation, conditional visibility, state management | [![npm](https://img.shields.io/npm/v/@squaredr/fieldcraft-core)](https://www.npmjs.com/package/@squaredr/fieldcraft-core) |
| [`@squaredr/fieldcraft-react`](packages/react) | React renderer — 44 field components, hooks, theming, pluggable field registry | [![npm](https://img.shields.io/npm/v/@squaredr/fieldcraft-react)](https://www.npmjs.com/package/@squaredr/fieldcraft-react) |
| [`@squaredr/fieldcraft-adapters`](packages/adapters) | Submission adapters — HTTP, Postgres, Supabase, Webhook | [![npm](https://img.shields.io/npm/v/@squaredr/fieldcraft-adapters)](https://www.npmjs.com/package/@squaredr/fieldcraft-adapters) |
| [`@squaredr/fieldcraft-templates-free`](packages/templates-free) | 16 free form templates — general, HR, and more | [![npm](https://img.shields.io/npm/v/@squaredr/fieldcraft-templates-free)](https://www.npmjs.com/package/@squaredr/fieldcraft-templates-free) |

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
- **44 field types** -- ratings, NPS, matrix grids, file uploads, signatures, address blocks, and all the standard inputs
- **JSON schemas** -- define entire forms as plain objects in TypeScript or JSON
- **Display modes** -- stepped (wizard), classic (all-at-once), or conversational (one question at a time, Typeform-style)
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
| Structural | `consent` `info_block` `section_header` `page_break` |
| Content | `welcome-screen` `thank-you-screen` `rich-text` `image` `video` `divider` `spacer` |

## Adapters

Persist form submissions, drafts, and schemas to any backend. All adapters ship in a single package with subpath imports:

```bash
npm install @squaredr/fieldcraft-adapters
```

```typescript
import { createPostgresAdapter } from '@squaredr/fieldcraft-adapters/postgres'
import { createSupabaseAdapter } from '@squaredr/fieldcraft-adapters/supabase'
import { createWebhookAdapter } from '@squaredr/fieldcraft-adapters/webhook'
```

| Adapter | Highlights |
|---------|-----------|
| **HTTP** | Built into core — POST to any endpoint with timeouts and custom headers |
| **Postgres** | Drizzle ORM, AES-256-GCM encryption, draft persistence |
| **Supabase** | Field-level encryption, RLS, schema CRUD |
| **Webhook** | HMAC-SHA256 signing, exponential backoff retries |

## Templates

16 production-ready form schemas included in [`@squaredr/fieldcraft-templates-free`](packages/templates-free):

```bash
npm install @squaredr/fieldcraft-templates-free
```

Contact form, feedback survey, NPS, job application, event registration, bug report, employee onboarding, leave request, and more.

## Project Structure

```
fieldcraft/
├── packages/
│   ├── core/                  # Form engine (pure TypeScript)
│   ├── react/                 # React renderer + 44 field components
│   ├── adapters/              # Submission adapters (HTTP, Postgres, Supabase, Webhook)
│   └── templates-free/        # 16 free form schemas
├── website/                   # Docs site (fieldcraft.squaredr.tech)
└── tooling/                   # Shared configs (TypeScript, Tailwind, ESLint)
```

## Community

- **Discord** — [Join the FieldCraft community](https://discord.gg/FK8pszp5z) for help, feature discussions, and showcasing your projects
- **Docs** — [fieldcraft.squaredr.tech/docs](https://fieldcraft.squaredr.tech/docs)
- **Feature requests** — Open an issue or post in our Discord #feature-requests channel

## Development

```bash
# Prerequisites: Node.js 18+, pnpm 9+

# Install
pnpm install

# Build all packages
pnpm build

# Run tests (463 core + 74 react + 56 adapters = 593 passing)
pnpm test

# Start docs site
pnpm --filter @squaredr/fieldcraft-website dev
```

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change. Join our [Discord](https://discord.gg/FK8pszp5z) to chat with the team.

## License

[MIT](LICENSE)
