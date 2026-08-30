---
title: Field types
description: All 44 built-in field types organised into 8 categories, with their type-specific config options.
---

## Overview

FieldCraft ships with 44 field types in 8 categories. In `@squaredr/fieldcraft-react`, all field components are built on **shadcn/ui primitives** (Radix UI + Tailwind CSS) for full keyboard navigation, dark mode theming, and WAI-ARIA compliance.

The `QuestionType` union also accepts custom strings — you can register your own field types or override any default field via the [field registry](/docs/react/custom-field-types) without modifying core types.

## Text fields (7)

| Type | Description | Key config |
|------|-------------|-----------|
| `short_text` | Single-line text input | `maxLength`, `inputType` ("text" \| "password"), `prefix`, `suffix` |
| `long_text` | Multi-line textarea | `rows`, `maxLength`, `showCharCount` |
| `email` | Email input with built-in format validation | — |
| `phone` | Phone number input | — |
| `phone_international` | Phone with country code selector (249 countries) | `defaultCountry`, `priorityCountries` |
| `url` | URL input | — |
| `legal_name` | Structured first/middle/last name | `showMiddleName`, `showSuffix` |

```ts
{
  id: 'bio',
  type: 'long_text',
  label: 'Tell us about yourself',
  config: {
    type: 'long_text',
    rows: 4,
    maxLength: 500,
    showCharCount: true,
  },
}
```

## Numeric fields (6)

| Type | Description | Key config |
|------|-------------|-----------|
| `number` | Number input with optional bounds | `min`, `max`, `step`, `prefix`, `suffix`, `decimalPlaces` |
| `slider` | Draggable range slider | `min` (required), `max` (required), `step`, `showValue`, `minLabel`, `maxLabel` |
| `rating` | Star/heart/circle rating | `max` (required), `icon` ("star" \| "heart" \| "circle") |
| `nps` | Net Promoter Score (0–10) | `lowLabel`, `highLabel` |
| `likert` | Agreement scale | `labels` (required) — custom scale labels |
| `opinion_scale` | Numeric scale with endpoint labels | `min`, `max`, `minLabel`, `maxLabel` |

```ts
{
  id: 'satisfaction',
  type: 'rating',
  label: 'How satisfied are you?',
  required: true,
  config: {
    type: 'rating',
    max: 5,
    icon: 'star',
  },
}
```

## Selection fields (6)

| Type | Description | Key config |
|------|-------------|-----------|
| `single_select` | Radio buttons | `layout` ("vertical" \| "horizontal" \| "grid"), `allowOther`, `otherLabel` |
| `multi_select` | Checkboxes | `layout`, `minSelections`, `maxSelections`, `allowOther` |
| `dropdown` | Select menu | `searchable`, `multiple`, `allowOther` |
| `boolean` | Yes/No toggle | `style` ("toggle" \| "radio" \| "checkbox"), `trueLabel`, `falseLabel` |
| `country_select` | Country picker (249 countries) | `showFlags`, `priorityCountries`, `excludeCountries` |
| `ranking` | Drag-to-reorder list | `items` (required) — array of label/value pairs |

```ts
{
  id: 'department',
  type: 'dropdown',
  label: 'Department',
  required: true,
  options: [
    { label: 'Engineering', value: 'eng' },
    { label: 'Design', value: 'design' },
    { label: 'Sales', value: 'sales' },
  ],
  config: { type: 'dropdown', searchable: true },
}
```

## Date and time fields (4)

| Type | Description | Key config |
|------|-------------|-----------|
| `date` | Date picker (Popover + Calendar) | `minDate`, `maxDate`, `disablePast`, `disableFuture`, `format` |
| `date_range` | Start + end date | `minDate`, `maxDate`, `maxRangeDays` |
| `time` | Time picker | `format` ("12h" \| "24h"), `minuteStep` |
| `appointment` | Native slot picker | `slots` (static array), `duration`, `timezone`, `timezoneField`, `slotsUrl` |

```ts
{
  id: 'consultation',
  type: 'appointment',
  label: 'Book Consultation',
  required: true,
  config: {
    type: 'appointment',
    duration: 30,
    slots: [
      { date: '2026-09-01', times: ['09:00', '10:00', '11:00'] },
      { date: '2026-09-02', times: ['14:00', '15:00'] },
    ],
  },
}
```

FieldCraft OSS renders an accessible native slot picker button grid without requiring third-party iframe embeds. Advanced integrations (Calendly / Cal.com iframe bridges and live slot polling) are supported via Pro or custom field overrides.

## Media fields (3)

| Type | Description | Key config |
|------|-------------|-----------|
| `file_upload` | Native drag-and-drop file input | `accept` (MIME types), `maxSizeMb`, `maxFiles`, `storageProvider` |
| `signature` | Canvas signature pad | `penColor`, `backgroundColor`, `width`, `height` |
| `image_capture` | Camera/gallery photo | `maxSizeMb`, `camera` ("front" \| "back" \| "any"), `allowGallery` |

```ts
{
  id: 'document',
  type: 'file_upload',
  label: 'Upload your document',
  required: true,
  config: {
    type: 'file_upload',
    accept: ['image/png', 'image/jpeg', 'application/pdf'],
    maxSizeMb: 10,
    maxFiles: 1,
  },
}
```

FieldCraft OSS handles local client-side size and MIME validation cleanly. Cloud storage presigning (AWS S3, Cloudflare R2, Supabase) and client-side encryption can be seamlessly plugged in via Pro or `customFields`.

## Advanced fields (7)

| Type | Description | Key config |
|------|-------------|-----------|
| `address` | Structured address input | `provider` ("google" \| "mapbox" \| "radar" \| "none"), `apiKey`, `fields`, `defaultCountry` |
| `payment` | Payment metadata preview | `provider`, `publicKey`, `amount` \| `amountField`, `currency`, `serverUrl` |
| `matrix` | Grid of rows × columns | `rows` (required), `columns` (required), `inputType` ("radio" \| "checkbox" \| "text" \| "number") |
| `repeater` | Dynamic list of sub-fields | `fields` (required), `minEntries`, `maxEntries`, `addLabel`, `removeLabel` |
| `calculated` | Auto-computed value | `expression` (required), `format` ("number" \| "currency" \| "percentage"), `decimalPlaces`, `prefix`, `suffix`, `visible` |
| `hidden` | Invisible metadata field | `defaultValue`, `source` ("url_param" \| "cookie" \| "referrer" \| "static"), `paramName` |
| `scoring` | Options with numeric scores | `options` with `score` values, `showScore`, `scoreRanges` (min/max/label/color) |

```ts
// Payment field configuration
{
  id: 'payment',
  type: 'payment',
  label: 'Order Total',
  required: true,
  config: {
    type: 'payment',
    provider: 'stripe',
    amount: 49.00,
    currency: 'USD',
    description: 'Pro Subscription',
  },
}
```

FieldCraft OSS renders a clear payment summary card with provider badges. Live interactive checkouts (Stripe Elements, PayPal Smart Buttons) are handled by `@squaredr/fieldcraft-pro` or your own custom field component.

The `serverUrl` is the endpoint your server exposes to create a PaymentIntent (or equivalent). The payment field POSTs `{ amount, currency, description }` to this URL and expects a JSON response containing the `clientSecret`. Use `responseMapping.clientSecretPath` to specify where in the response JSON the client secret lives (e.g. `"data.client_secret"` for nested responses).

```ts
// Calculated field example — auto-compute BMI
{
  id: 'bmi',
  type: 'calculated',
  label: 'BMI',
  config: {
    type: 'calculated',
    expression: '{weight} / ({height} * {height})',
    format: 'number',
    decimalPlaces: 1,
    visible: true,
  },
}
```

```ts
// Matrix field example — satisfaction survey
{
  id: 'satisfaction_matrix',
  type: 'matrix',
  label: 'Rate each area',
  config: {
    type: 'matrix',
    rows: [
      { label: 'Communication', value: 'comm' },
      { label: 'Work-life balance', value: 'balance' },
      { label: 'Career growth', value: 'growth' },
    ],
    columns: [
      { label: 'Poor', value: '1' },
      { label: 'Fair', value: '2' },
      { label: 'Good', value: '3' },
      { label: 'Excellent', value: '4' },
    ],
    inputType: 'radio',
    required: 'all',
  },
}
```

## Structural fields (4)

These fields organise content within a section. They don't collect values — you cannot add `required` or `validation` to them.

| Type | Description | Key config |
|------|-------------|-----------|
| `section_header` | Visual heading within a section | `level` ("h2" \| "h3" \| "h4"), `showDivider` |
| `consent` | Checkbox with legal text | `text` (required), `expandableText`, `checkboxLabel` |
| `info_block` | Static informational message | `content` (required), `variant` ("info" \| "warning" \| "success" \| "error") |
| `page_break` | Visual break within a section | `label` |

## Content and visual fields (7)

Display-only fields. Like structural fields, they don't collect values and cannot have `required` or `validation`.

| Type | Description | Key config |
|------|-------------|-----------|
| `welcome-screen` | Intro screen before questions | `heading` (required), `description`, `imageUrl`, `buttonText`, `alignment` |
| `thank-you-screen` | Completion screen after submit | `heading` (required), `description`, `redirectUrl`, `redirectDelay` |
| `rich-text` | Rendered markdown or HTML block | `content` (required), `format` ("markdown" \| "html") |
| `image` | Static image display | `src` (required), `alt` (required), `alignment`, `caption`, `link` |
| `video` | Embedded video | `src` (required), `provider` ("youtube" \| "vimeo" \| "url"), `autoplay` |
| `divider` | Horizontal rule | `style` ("solid" \| "dashed" \| "dotted"), `color`, `thickness`, `spacing` |
| `spacer` | Empty vertical space | `height` (required, in pixels) |

## Custom field types

You can register any string as a field type via the [field registry](/docs/react/custom-field-types). The `QuestionType` union includes `(string & {})` — any custom type string is valid in a schema without modifying core types.

## Next steps

- [Conditional logic](/docs/core-concepts/conditional-logic) — show, hide, and require fields based on answers
- [Validation](/docs/core-concepts/validation) — 19 built-in rule types plus custom and async validators
- [Computed fields](/docs/core-concepts/computed-fields) — auto-calculate values from expressions
