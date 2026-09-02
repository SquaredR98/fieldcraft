---
title: Custom field types
description: Register your own field components alongside the 41 built-ins using the field registry.
---

## The field registry

Every field type maps to a React component via the registry. The default registry contains all 41 built-in field components. You can add your own types or override existing ones.

```ts
import { defaultRegistry } from '@squaredr/fieldcraft-react'

const registry = {
  ...defaultRegistry,
  color_picker: ColorPickerField,
  pain_scale: PainScaleField,
}
```

Pass it to `FormEngineRenderer`:

```tsx
<FormEngineRenderer schema={schema} components={registry} onSubmit={handleSubmit} />
```

## FieldProps

Every field component receives the same props interface:

```ts
type FieldProps = {
  field: Question               // The field definition from the schema
  value: unknown                // Current value
  error?: string[]              // Validation errors (if any)
  touched: boolean              // Whether the user has interacted with this field
  disabled: boolean             // Whether the field is disabled
  readonly: boolean             // Whether the field is read-only
  onChange: (value: unknown) => void    // Call this when the value changes
  onBlur: () => void            // Call this when the field loses focus
  onFocus: () => void           // Call this when the field gains focus
  theme: FormEngineTheme        // Current theme
  customProps?: Record<string, unknown>  // Custom props from schema
  fieldValues?: Record<string, unknown>  // All current form field values (cross-field access)
}
```

## Building a custom field

Here's a complete example — a pain scale field for a medical intake form:

```tsx title="components/fields/PainScaleField.tsx"
import type { FieldProps } from '@squaredr/fieldcraft-react'

export function PainScaleField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const current = typeof value === 'number' ? value : null

  return (
    <div>
      <label>{field.label}</label>
      {field.helpText && <p className="fc-help-text">{field.helpText}</p>}

      <div style={{ display: 'flex', gap: 8 }}>
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => { onChange(i); onBlur() }}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: current === i ? '2px solid #0066cc' : '1px solid #ddd',
              background: current === i ? '#0066cc' : getScaleColor(i),
              color: current === i ? '#fff' : '#333',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            {i}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999' }}>
        <span>No pain</span>
        <span>Worst pain</span>
      </div>

      {touched && error?.map((e) => (
        <p key={e} style={{ color: 'red', fontSize: 13 }}>{e}</p>
      ))}
    </div>
  )
}

function getScaleColor(n: number): string {
  if (n <= 3) return '#dcfce7'
  if (n <= 6) return '#fef9c3'
  return '#fee2e2'
}
```

## Using it in a schema

Reference your custom type by its registry key:

```ts
{
  id: 'pain_level',
  type: 'pain_scale',          // Matches the registry key
  label: 'Rate your current pain level',
  required: true,
  helpText: '0 = no pain, 10 = worst imaginable pain',
}
```

The `QuestionType` union includes `(string & {})`, so any string is a valid type — no need to modify core types.

## Using customProps

For type-specific configuration that doesn't fit the built-in `config` system, use `customProps`:

```ts
{
  id: 'brand_color',
  type: 'color_picker',
  label: 'Choose your brand colour',
  customProps: {
    swatches: ['#0066cc', '#8b5cf6', '#dc2626', '#22c55e'],
    allowCustom: true,
  },
}
```

Access them in your component:

```tsx
function ColorPickerField({ field, value, onChange, onBlur }: FieldProps) {
  const swatches = (field.customProps?.swatches as string[]) || []
  const allowCustom = field.customProps?.allowCustom as boolean

  return (
    <div>
      {swatches.map((color) => (
        <button
          key={color}
          onClick={() => { onChange(color); onBlur() }}
          style={{ background: color, width: 32, height: 32 }}
        />
      ))}
      {allowCustom && (
        <input
          type="color"
          value={(value as string) || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      )}
    </div>
  )
}
```

## Overriding built-in fields

You can replace any built-in field type (or pass Pro extension fields):

```ts
import { defaultRegistry, mergeRegistries } from '@squaredr/fieldcraft-react'

// Replace built-in rating or file upload with customized or Pro providers
const registry = mergeRegistries(
  defaultRegistry,
  {
    rating: MyCustomRatingField,
    file_upload: ProS3FileUploadField,       // S3/R2 direct uploader
    appointment: ProCalComAppointmentField,  // Cal.com / Calendly iframe bridge
    payment: ProStripePaymentField,          // Live Stripe Elements checkout
  }
)
```

Your replacement receives the same `FieldProps` — it's a 100% backward-compatible, drop-in swap.

## Registry utilities

```ts
import { createFieldRegistry, mergeRegistries } from '@squaredr/fieldcraft-react'

// Create a new registry
const medical = createFieldRegistry({ pain_scale: PainScaleField })

// Merge registries — later ones override earlier ones
const combined = mergeRegistries(defaultRegistry, medical)
```

## Next steps

- [Theming](/docs/react/theming) — style your custom fields with theme tokens
- [FormEngineRenderer](/docs/react/form-renderer) — pass the registry to the renderer
- [Field types](/docs/core-concepts/field-types) — the 41 built-in types for reference
