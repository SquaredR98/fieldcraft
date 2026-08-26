# @squaredr/fieldcraft-templates

[![npm version](https://img.shields.io/npm/v/@squaredr/fieldcraft-templates.svg)](https://www.npmjs.com/package/@squaredr/fieldcraft-templates)
[![npm downloads](https://img.shields.io/npm/dm/@squaredr/fieldcraft-templates)](https://www.npmjs.com/package/@squaredr/fieldcraft-templates)
[![license](https://img.shields.io/npm/l/@squaredr/fieldcraft-templates.svg)](https://github.com/SquaredR98/fieldcraft/blob/main/packages/templates/LICENSE)

16 free, production-ready form schemas for [FieldCraft](https://fieldcraft.squaredr.tech). Drop them into your app, customize, and ship.

> **Website:** [fieldcraft.squaredr.tech](https://fieldcraft.squaredr.tech) · **Docs:** [fieldcraft.squaredr.tech/docs](https://fieldcraft.squaredr.tech/docs) · **GitHub:** [github.com/SquaredR98/fieldcraft](https://github.com/SquaredR98/fieldcraft)

## Install

```bash
npm install @squaredr/fieldcraft-templates @squaredr/fieldcraft-core
```

## Template Catalog

### General

| Template | ID | Sections | Fields | Features |
|----------|----|----------|--------|----------|
| Contact Form | `contact-form` | 2 | 5 | Email validation |
| Event Registration | `event-registration` | 3 | 15 | Multi-step, dropdowns |
| Lead Generation | `lead-generation` | 2 | 8 | B2B demo request |
| Feature Request | `feature-request` | 2 | 10 | Priority selection |
| Quick Poll | `poll` | 1 | 5 | Single-page, fast |
| Product Knowledge Quiz | `quiz` | 3 | 12 | Multi-step, scoring |

### Feedback

| Template | ID | Sections | Fields | Features |
|----------|----|----------|--------|----------|
| Feedback Survey | `feedback-survey` | 3 | 12 | Likert scales, NPS, rating |
| NPS Survey | `nps-survey` | 2 | 5 | Conditional follow-up by score |

### Marketing

| Template | ID | Sections | Fields | Features |
|----------|----|----------|--------|----------|
| Newsletter Signup | `newsletter-signup` | 1 | 3 | Email capture, interests |

### Support

| Template | ID | Sections | Fields | Features |
|----------|----|----------|--------|----------|
| Bug Report | `bug-report` | 2 | 8 | Steps to reproduce, severity |

### HR

| Template | ID | Sections | Fields | Features |
|----------|----|----------|--------|----------|
| Job Application | `job-application` | 3 | 18 | Multi-step, file upload |
| Onboarding Checklist | `onboarding-checklist` | 3 | 17 | Draft saving, checklists |
| Exit Interview | `exit-interview` | 3 | 14 | Likert scales, NPS |
| 360° Performance Review | `review-360` | 3 | 15 | Likert scales, multi-section |
| Time Off Request | `time-off-request` | 1 | 9 | Conditional fields by leave type |
| Expense Report | `expense-report` | 3 | 14 | Draft saving, receipts |

## Usage

### Single template

```typescript
import { contactFormSchema } from "@squaredr/fieldcraft-templates";

// Pass directly to FormEngineRenderer
<FormEngineRenderer schema={contactFormSchema} onSubmit={handleSubmit} />
```

### With metadata

```typescript
import { contactForm } from "@squaredr/fieldcraft-templates";

console.log(contactForm.meta);
// {
//   id: "contact-form",
//   name: "Contact Form",
//   description: "Simple contact form with name, email, and message",
//   category: "general",
//   fieldCount: 5,
//   sectionCount: 2,
//   tags: ["contact", "support", "general"]
// }

<FormEngineRenderer schema={contactForm.schema} onSubmit={handleSubmit} />
```

### Browse all templates

```typescript
import { allTemplates } from "@squaredr/fieldcraft-templates";

// List available templates
allTemplates.forEach((t) => {
  console.log(`${t.meta.name} (${t.meta.category}) — ${t.meta.fieldCount} fields`);
});

// Filter by category
const hrTemplates = allTemplates.filter((t) => t.meta.category === "hr");

// Filter by tag
const likertTemplates = allTemplates.filter((t) => t.meta.tags.includes("likert"));
```

### Customize a template

```typescript
import { contactFormSchema } from "@squaredr/fieldcraft-templates";

const customized = {
  ...contactFormSchema,
  title: "Get in Touch",
  settings: {
    ...contactFormSchema.settings,
    showProgressBar: true,
  },
};

<FormEngineRenderer schema={customized} onSubmit={handleSubmit} />
```

## Exports

Each template provides three exports:

| Export | Type | Description |
|--------|------|-------------|
| `{name}Schema` | `FormEngineSchema` | The raw schema object |
| `{name}Meta` | `TemplateMeta` | Metadata (id, name, category, tags) |
| `{name}` | `Template` | Combined `{ meta, schema }` object |

Plus:

| Export | Type | Description |
|--------|------|-------------|
| `allTemplates` | `Template[]` | Array of all 16 templates |
| `Template` | type | `{ meta: TemplateMeta; schema: FormEngineSchema }` |
| `TemplateMeta` | type | Template metadata interface |
| `TemplateCategory` | type | `"general" \| "feedback" \| "marketing" \| "support" \| "hr" \| "ecommerce" \| "healthcare"` |

## Requirements

- `@squaredr/fieldcraft-core` >= 1.0.0

## Community

- [Discord](https://discord.gg/FK8pszp5z) — Get help, share projects, request features
- [Docs](https://fieldcraft.squaredr.tech/docs) — Full documentation
- [GitHub](https://github.com/SquaredR98/fieldcraft) — Source code and issues

## License

MIT
