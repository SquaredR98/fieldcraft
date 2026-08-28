---
title: Response viewer
description: Browse, search, filter, and export form responses with table, card, detail, and timeline views. Part of the Pro commercial package.
---

## What it does

ResponseViewer is a React component that displays form submissions in four view modes. Pass it a schema and an array of `FormResponse` objects, and it renders an interactive viewer with search, filter, export, and statistics.

The ResponseViewer is part of `@squaredr/fieldcraft-pro`, which requires a commercial licence.

## Auto-inherit from host page

The component inherits CSS custom properties from your host page automatically. No theme prop is needed for basic usage — it matches your app's look and feel out of the box.

```tsx
import { ResponseViewer } from '@squaredr/fieldcraft-pro'
import type { FormEngineSchema, FormResponse } from '@squaredr/fieldcraft-core'

type Props = {
  schema: FormEngineSchema
  responses: FormResponse[]
}

export default function ResponsesPage({ schema, responses }: Props) {
  return (
    <ResponseViewer
      schema={schema}
      responses={responses}
    />
  )
}
```

## View modes

Users toggle between modes using the view-mode switcher in the toolbar.

| Mode | Description |
|------|-------------|
| **Table** | Summary table with fixed metadata columns (Submitted, Completion Time, Fields Answered, Score), pagination, and search. Click a row to see full field values in Detail view. Default view. |
| **Card** | Card grid showing a summary of each response. Good for visual scanning. |
| **Detail** | Full single-response view with all field values displayed in order. |
| **Timeline** | Chronological timeline of responses with timestamps. |

### Table columns

The table view shows four fixed metadata columns for every form, regardless of which fields the form contains:

| Column | Description |
|--------|-------------|
| **Submitted** | Timestamp of when the response was submitted, formatted using `toLocaleString()`. |
| **Completion Time** | How long the user spent filling out the form (e.g. "2m 34s"). Derived from `completionTimeMs` on the response. |
| **Fields Answered** | Ratio of answered fields to total fields, e.g. "8/12". Display-only fields (welcome screens, dividers, etc.) are excluded from the count. |
| **Score** | Total score if the form uses scoring fields. Shows "—" when no score is present. |

To see all individual field values for a response, click the row to open Detail view.

## Features

| Feature | Description |
|---------|-------------|
| **Search** | Full-text search across all response values. |
| **Filter** | Filter by date range and field values. |
| **CSV/JSON export** | Export all or selected responses. |
| **Statistics dashboard** | Summary stats and charts for numeric and choice fields. |
| **Bulk operations** | Select multiple responses for delete or export. |
| **Custom field renderers** | Override how specific field types display in the detail and card views. |
| **Configurable page size** | 10, 25, 50, or 100 responses per page. |

## Props

### Required

| Prop | Type | Description |
|------|------|-------------|
| `schema` | `FormEngineSchema` | The form schema. Used to determine field types, labels, and structure. |
| `responses` | `FormResponse[]` | Array of form responses to display. |

### Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onResponseSelect` | `(response: FormResponse) => void` | Called when a response row or card is clicked. |
| `onExport` | `(format: "csv" \| "json", count: number) => void` | Called after CSV or JSON export completes. |
| `onDelete` | `(sessionToken: string) => void` | Called when a single response is deleted. Provide this to enable the delete UI. |
| `onBulkDelete` | `(sessionTokens: string[]) => void` | Called when multiple responses are bulk-deleted. |
| `onBulkExport` | `(responses: FormResponse[]) => void` | Called when selected responses are bulk-exported. |

### Display

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | `string \| number` | — | Container height. |
| `width` | `string \| number` | — | Container width. |
| `pageSize` | `10 \| 25 \| 50 \| 100` | `25` | Responses per page. |
| `selectable` | `boolean` | — | Enable checkbox selection for bulk operations. |

### Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fieldRenderers` | `Record<string, FieldRenderer>` | — | Custom per-type field renderers. Keys are field type strings. |
| `filename` | `string` | `"responses"` | Base filename for CSV/JSON downloads. |
| `dateFormat` | `"locale" \| "iso"` | `"locale"` | Date format for export. `"locale"` uses `toLocaleString()`, `"iso"` uses `toISOString()`. |

## Custom field renderers

Override how specific field types are rendered in the viewer by passing a `fieldRenderers` map. Each renderer receives the field data and the full response:

```tsx
import { ResponseViewer } from '@squaredr/fieldcraft-pro'

const customRenderers = {
  rating: (field) => (
    <span>{'★'.repeat(field.value as number)}</span>
  ),
  color: (field) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        width: 16, height: 16, borderRadius: 4,
        background: field.value as string,
      }} />
      {field.value as string}
    </span>
  ),
}

<ResponseViewer
  schema={schema}
  responses={responses}
  fieldRenderers={customRenderers}
/>
```

## Handling delete and export

Provide callback props to wire up delete and export to your API:

```tsx
<ResponseViewer
  schema={schema}
  responses={responses}
  selectable
  onDelete={async (sessionToken) => {
    await fetch(`/api/responses/${sessionToken}`, { method: 'DELETE' })
    // Re-fetch responses after deletion
  }}
  onBulkDelete={async (sessionTokens) => {
    await fetch('/api/responses/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ sessionTokens }),
    })
  }}
  onExport={(format, count) => {
    console.log(`Exported ${count} responses as ${format}`)
  }}
/>
```

The delete UI only appears when `onDelete` is provided. Bulk operations require both `selectable` and the relevant bulk callback (`onBulkDelete` or `onBulkExport`).

## Next steps

- [Visual builder](/docs/pro/visual-builder) — drag-and-drop form designer
- [Theme editor](/docs/pro/theme-editor) — visual theme customizer
- [Adapters overview](/docs/submission/adapters-overview) — send submissions to databases and webhooks
- [Licence & activation](/docs/pro/licence-and-activation) — pricing and activation
