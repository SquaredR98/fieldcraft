---
title: Your first form
description: Build a multi-step contact form with validation, conditional logic, and submission — from an empty file to a working form.
---

## What you'll build

A contact form with three sections:

1. **Contact details** — name, email, phone (conditionally required)
2. **Your message** — subject dropdown, message body, priority toggle
3. **Confirmation** — consent checkbox, submit

Along the way you'll use field types, validation, conditional required, `showIf`, and a submission callback.

## Step 1: Create the schema

Every form starts with a schema object. Create a file for it:

```ts title="schemas/contact-form.ts"
import type { FormEngineSchema } from '@squaredr/fieldcraft-react'

export const contactFormSchema: FormEngineSchema = {
  id: 'contact-form',
  version: '1.0.0',
  title: 'Contact Us',
  description: 'We usually respond within 24 hours.',
  settings: {
    displayMode: 'stepped',
    showProgress: true,
    progressStyle: 'bar',
  },
  sections: [],
  submitAction: { type: 'callback' },
  onComplete: {
    type: 'message',
    message: 'Thank you! We\'ll be in touch shortly.',
  },
}
```

The `id` and `version` are required — they're included in every submission so your backend knows which form and version generated the response. `displayMode: 'stepped'` means one section at a time with Next/Back navigation.

## Step 2: Add the first section

Add the contact details section to the `sections` array:

```ts title="schemas/contact-form.ts"
sections: [
  {
    id: 'contact',
    title: 'Contact Details',
    questions: [
      {
        id: 'full_name',
        type: 'short_text',
        label: 'Full name',
        required: true,
        placeholder: 'Jane Smith',
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email address',
        required: true,
        helpText: 'We\'ll send a confirmation to this address.',
      },
      {
        id: 'preferred_contact',
        type: 'single_select',
        label: 'Preferred contact method',
        required: true,
        options: [
          { label: 'Email', value: 'email' },
          { label: 'Phone', value: 'phone' },
        ],
      },
      {
        id: 'phone',
        type: 'phone',
        label: 'Phone number',
        // Only required when preferred contact is phone
        required: {
          field: 'preferred_contact',
          operator: 'eq',
          value: 'phone',
        },
        // Only visible when preferred contact is phone
        showIf: {
          field: 'preferred_contact',
          operator: 'eq',
          value: 'phone',
        },
      },
    ],
  },
],
```

Two things to notice:

- **Conditional required**: The phone field uses a `ConditionExpression` instead of `true`/`false`. It's only required when the user selects "Phone" as their preferred contact method.
- **`showIf`**: The phone field is hidden entirely until "Phone" is selected. Hidden fields are excluded from validation and submission — you can't fail validation on a field that isn't visible.

## Step 3: Add the message section

Add a second section after the first:

```ts title="schemas/contact-form.ts"
{
  id: 'message',
  title: 'Your Message',
  questions: [
    {
      id: 'subject',
      type: 'dropdown',
      label: 'Subject',
      required: true,
      options: [
        { label: 'General enquiry', value: 'general' },
        { label: 'Technical support', value: 'support' },
        { label: 'Billing', value: 'billing' },
        { label: 'Partnership', value: 'partnership' },
      ],
      config: { type: 'dropdown', searchable: false },
    },
    {
      id: 'message',
      type: 'long_text',
      label: 'Message',
      required: true,
      placeholder: 'Describe what you need help with...',
      config: {
        type: 'long_text',
        rows: 5,
        maxLength: 2000,
        showCharCount: true,
      },
    },
    {
      id: 'priority',
      type: 'boolean',
      label: 'This is urgent',
      config: {
        type: 'boolean',
        style: 'toggle',
        trueLabel: 'Yes',
        falseLabel: 'No',
      },
    },
  ],
},
```

The `config` object holds type-specific settings. A `long_text` field has `rows`, `maxLength`, and `showCharCount`. A `boolean` field can render as a toggle, radio, or checkbox. Each field type has its own config shape — see [Field types](/docs/core-concepts/field-types) for the full reference.

## Step 4: Add the confirmation section

```ts title="schemas/contact-form.ts"
{
  id: 'confirm',
  title: 'Confirm & Submit',
  questions: [
    {
      id: 'consent',
      type: 'consent',
      label: 'Data processing consent',
      required: true,
      config: {
        type: 'consent',
        text: 'I agree to the processing of my personal data in accordance with the privacy policy.',
        checkboxLabel: 'I agree',
      },
    },
  ],
},
```

## Step 5: Render the form

Create a page component that renders the form:

```tsx title="app/contact/page.tsx"
import { FormRenderer } from '@squaredr/fieldcraft-react'
import { contactFormSchema } from '@/schemas/contact-form'

export default function ContactPage() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem' }}>
      <FormRenderer
        schema={contactFormSchema}
        onSubmit={async (response) => {
          // response includes schemaId, schemaVersion, values, submittedAt, sessionToken
          await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          })
        }}
      />
    </div>
  )
}
```

The `onSubmit` callback receives a `FormResponse` object — not raw values. It includes metadata like `schemaId`, `schemaVersion`, `submittedAt` (ISO timestamp), `sessionToken` (UUID), and `completionTimeMs` (time from form load to submit).

## Step 6: Add validation

Go back to the email field and add validation rules:

```ts
{
  id: 'email',
  type: 'email',
  label: 'Email address',
  required: true,
  helpText: 'We\'ll send a confirmation to this address.',
  validation: [
    { type: 'email', message: 'Please enter a valid email address.' },
  ],
},
```

The `email` field type already has basic format checking built in. The explicit `validation` array lets you customise the error message or add additional rules. Available rule types: `required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `email`, `phone`, `url`, `date`, `fileSize`, `fileType`, `custom`, and `async`.

See [Validation](/docs/core-concepts/validation) for the complete reference.

## Step 7: Apply a theme

Pass a `FormEngineTheme` object to the `theme` prop to change the visual appearance:

```tsx
import { FormRenderer } from '@squaredr/fieldcraft-react'
import type { FormEngineTheme } from '@squaredr/fieldcraft-core'

const myTheme: FormEngineTheme = {
  colors: {
    primary: '#1F6B6E',
    background: '#F4F7F8',
    text: '#12222A',
    border: '#DCE4E8',
  },
}

<FormRenderer
  schema={contactFormSchema}
  theme={myTheme}
  onSubmit={handleSubmit}
/>
```

If your host page defines CSS custom properties (`--background`, `--foreground`, `--primary`, etc.), the renderer inherits them automatically — no `theme` prop needed. For full theming details, see [Theming](/docs/react/theming).

Five ready-made preset families (Clean, Modern, Clinical, Playful, High Contrast) with light/dark variants are available in [FieldCraft Pro](/pro) via `PRESET_FAMILIES`.

## The complete schema

Here's the full schema in one block:

```ts title="schemas/contact-form.ts"
import type { FormEngineSchema } from '@squaredr/fieldcraft-react'

export const contactFormSchema: FormEngineSchema = {
  id: 'contact-form',
  version: '1.0.0',
  title: 'Contact Us',
  description: 'We usually respond within 24 hours.',
  settings: {
    displayMode: 'stepped',
    showProgress: true,
    progressStyle: 'bar',
  },
  sections: [
    {
      id: 'contact',
      title: 'Contact Details',
      questions: [
        {
          id: 'full_name',
          type: 'short_text',
          label: 'Full name',
          required: true,
          placeholder: 'Jane Smith',
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email address',
          required: true,
          helpText: 'We\'ll send a confirmation to this address.',
          validation: [
            { type: 'email', message: 'Please enter a valid email address.' },
          ],
        },
        {
          id: 'preferred_contact',
          type: 'single_select',
          label: 'Preferred contact method',
          required: true,
          options: [
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' },
          ],
        },
        {
          id: 'phone',
          type: 'phone',
          label: 'Phone number',
          required: { field: 'preferred_contact', operator: 'eq', value: 'phone' },
          showIf: { field: 'preferred_contact', operator: 'eq', value: 'phone' },
        },
      ],
    },
    {
      id: 'message',
      title: 'Your Message',
      questions: [
        {
          id: 'subject',
          type: 'dropdown',
          label: 'Subject',
          required: true,
          options: [
            { label: 'General enquiry', value: 'general' },
            { label: 'Technical support', value: 'support' },
            { label: 'Billing', value: 'billing' },
            { label: 'Partnership', value: 'partnership' },
          ],
          config: { type: 'dropdown', searchable: false },
        },
        {
          id: 'message',
          type: 'long_text',
          label: 'Message',
          required: true,
          placeholder: 'Describe what you need help with...',
          config: { type: 'long_text', rows: 5, maxLength: 2000, showCharCount: true },
        },
        {
          id: 'priority',
          type: 'boolean',
          label: 'This is urgent',
          config: { type: 'boolean', style: 'toggle', trueLabel: 'Yes', falseLabel: 'No' },
        },
      ],
    },
    {
      id: 'confirm',
      title: 'Confirm & Submit',
      questions: [
        {
          id: 'consent',
          type: 'consent',
          label: 'Data processing consent',
          required: true,
          config: {
            type: 'consent',
            text: 'I agree to the processing of my personal data in accordance with the privacy policy.',
            checkboxLabel: 'I agree',
          },
        },
      ],
    },
  ],
  submitAction: { type: 'callback' },
  onComplete: {
    type: 'message',
    message: 'Thank you! We\'ll be in touch shortly.',
  },
}
```

## Next steps

- [Schema anatomy](/docs/core-concepts/schema-anatomy) — understand every property in the schema
- [Field types](/docs/core-concepts/field-types) — all 44 field types with their configs
- [Conditional logic](/docs/core-concepts/conditional-logic) — `showIf`, jump rules, and conditional required
- [Theming](/docs/react/theming) — customise colours, typography, spacing, and shape
