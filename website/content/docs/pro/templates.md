---
title: Templates
description: 16 production-ready form schemas included with the free templates package, covering 7 categories.
---

## Free templates

`@squaredr/fieldcraft-templates` includes 16 production-ready schemas. These are MIT-licensed — use them in any project.

```bash
pnpm add @squaredr/fieldcraft-templates
```

## Available templates

### General

| Template | Description | Fields | Sections |
|----------|-------------|--------|----------|
| `contactForm` | Contact/inquiry form | Multi-section with name, email, message | 2 |
| `newsletterSignup` | Email list signup | Single-section with email and preferences | 1 |
| `eventRegistration` | Event signup | Attendee details, dietary requirements, sessions | 3 |
| `leadGeneration` | Lead capture | Company info, budget, timeline | 2 |
| `poll` | Quick opinion poll | Single question with options | 1 |
| `quiz` | Knowledge/personality quiz | Scored questions with result bands | 3+ |

### Feedback

| Template | Description | Fields | Sections |
|----------|-------------|--------|----------|
| `feedbackSurvey` | Customer feedback collection | Rating, NPS, open text | 2 |
| `npsSurvey` | Net Promoter Score survey | NPS scale with follow-up | 2 |
| `featureRequest` | Feature voting/requests | Description, priority, impact | 2 |

### Support

| Template | Description | Fields | Sections |
|----------|-------------|--------|----------|
| `bugReport` | Bug/issue reporting | Steps to reproduce, environment, severity | 3 |

### HR

| Template | Description | Fields | Sections |
|----------|-------------|--------|----------|
| `jobApplication` | Employment application | Personal info, experience, references | 4 |
| `onboardingChecklist` | New hire checklist | Tasks, document uploads, acknowledgements | 3 |
| `exitInterview` | Departure interview | Satisfaction ratings, reasons, feedback | 3 |
| `review360` | 360-degree feedback review | Competency ratings, open feedback | 4 |
| `timeOffRequest` | PTO/vacation request | Dates, type, coverage plan | 1 |
| `expenseReport` | Expense submission | Line items, receipts, approvals | 2 |

## Usage

Each template exports a schema, metadata, and a combined template object:

```ts
import { contactForm } from '@squaredr/fieldcraft-templates'

// The schema — pass directly to FormRenderer
contactForm.schema   // FormEngineSchema

// Metadata
contactForm.meta     // { id, name, description, category, fieldCount, sectionCount, tags }

// Or import individually
import { contactFormSchema, contactFormMeta } from '@squaredr/fieldcraft-templates'
```

### Render a template

```tsx
import { FormRenderer } from '@squaredr/fieldcraft-react'
import { contactForm } from '@squaredr/fieldcraft-templates'

export default function ContactPage() {
  return (
    <FormRenderer
      schema={contactForm.schema}
      onSubmit={async (response) => {
        await fetch('/api/submit', { method: 'POST', body: JSON.stringify(response) })
      }}
    />
  )
}
```

### List all templates

```ts
import { allTemplates } from '@squaredr/fieldcraft-templates'

// allTemplates is Template[] — all 16 templates
allTemplates.forEach((t) => {
  console.log(t.meta.name, t.meta.category, t.meta.fieldCount)
})
```

### Template categories

```ts
type TemplateCategory =
  | 'general'
  | 'feedback'
  | 'marketing'
  | 'support'
  | 'hr'
  | 'ecommerce'
  | 'healthcare'
```

## Customising templates

Templates are standard `FormEngineSchema` objects. Copy and modify them:

```ts
import { contactForm } from '@squaredr/fieldcraft-templates'

const myContactForm = {
  ...contactForm.schema,
  id: 'my-contact-form',
  title: 'Get in Touch',
  branding: {
    logoUrl: '/my-logo.png',
    poweredBy: false,
  },
}
```

## Next steps

- [Visual builder](/docs/pro/visual-builder) — create forms visually
- [Licence & activation](/docs/pro/licence-and-activation) — pricing details
