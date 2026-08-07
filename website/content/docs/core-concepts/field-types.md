---
title: Field types
description: All 44 built-in field types organised into 8 categories, with their type-specific config options.
---

## Overview

FieldCraft ships with 44 field types in 8 categories. Each field type has a `type` string used in the schema and an optional `config` object with type-specific settings.

The `QuestionType` union also accepts custom strings — you can register your own field types via the [field registry](/docs/react/custom-field-types) without modifying the core types.

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
| `date` | Date picker | `minDate`, `maxDate`, `disablePast`, `disableFuture`, `format` |
| `date_range` | Start + end date | `minDate`, `maxDate`, `maxRangeDays` |
| `time` | Time picker | `format` ("12h" \| "24h"), `minuteStep` |
| `appointment` | Date + time slot picker | `slotsUrl` (API), `slots` (static), `timezone`, `duration` |

```ts
{
  id: 'dob',
  type: 'date',
  label: 'Date of birth',
  required: true,
  config: {
    type: 'date',
    disableFuture: true,
    format: 'MM/DD/YYYY',
  },
}
```

## Media fields (3)

| Type | Description | Key config |
|------|-------------|-----------|
| `file_upload` | File input | `accept` (MIME types), `maxSizeMb`, `maxFiles`, `uploadUrl` |
| `signature` | Canvas signature pad | `penColor`, `backgroundColor`, `width`, `height` |
| `image_capture` | Camera/gallery photo | `maxSizeMb`, `camera` ("front" \| "back" \| "any"), `allowGallery` |

```ts
{
  id: 'document',
  type: 'file_upload',
  label: 'Upload your ID',
  required: true,
  config: {
    type: 'file_upload',
    accept: ['image/png', 'image/jpeg', 'application/pdf'],
    maxSizeMb: 10,
    maxFiles: 1,
  },
}
```

## Advanced fields (7)

| Type | Description | Key config |
|------|-------------|-----------|
| `address` | Structured address input | `provider` ("google" \| "mapbox" \| "none"), `apiKey`, `fields`, `defaultCountry` |
| `payment` | Stripe/PayPal payment | `provider` (required), `publicKey` (required), `amount` \| `amountField`, `currency` |
| `matrix` | Grid of rows × columns | `rows` (required), `columns` (required), `inputType` ("radio" \| "checkbox" \| "text" \| "number") |
| `repeater` | Dynamic list of sub-fields | `fields` (required), `minEntries`, `maxEntries`, `addLabel`, `removeLabel` |
| `calculated` | Auto-computed value | `expression` (required), `format` ("number" \| "currency" \| "percentage"), `decimalPlaces`, `prefix`, `suffix`, `visible` |
| `hidden` | Invisible metadata field | `defaultValue`, `source` ("url_param" \| "cookie" \| "referrer" \| "static"), `paramName` |
| `scoring` | Options with numeric scores | `options` with `score` values, `showScore`, `scoreRanges` (min/max/label/color) |

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
- [Validation](/docs/core-concepts/validation) — 12 built-in rule types plus custom and async validators
- [Computed fields](/docs/core-concepts/computed-fields) — auto-calculate values from expressions
