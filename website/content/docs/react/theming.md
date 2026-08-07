---
title: Theming
description: Customise colours, typography, spacing, and shape with theme objects, 6 built-in presets, and CSS custom properties.
---

## Using a preset

Pass a built-in preset to `FormRenderer`:

```tsx
import { FormRenderer, cleanPreset } from '@squaredr/fieldcraft-react'

<FormRenderer schema={schema} theme={cleanPreset} onSubmit={handleSubmit} />
```

## Available presets

| Preset | Description |
|--------|-------------|
| `cleanPreset` | Minimal, light. Neutral colours, comfortable spacing. |
| `modernPreset` | Contemporary styling with rounded corners. |
| `darkPreset` | Dark background with light text. |
| `highContrastPreset` | Accessibility-focused. Strong borders, large text. |
| `clinicalPreset` | Professional/medical. Clean lines, clinical feel. |
| `playfulPreset` | Friendly and colourful. Larger radii, warmer tones. |

## Custom theme object

Build a `FormEngineTheme` to control every visual aspect. All properties are optional — undefined values use the preset defaults.

```ts
import type { FormEngineTheme } from '@squaredr/fieldcraft-react'

const myTheme: FormEngineTheme = {
  colors: {
    primary: '#0066cc',
    primaryForeground: '#ffffff',
    secondary: '#f0f0f0',
    secondaryForeground: '#333333',
    error: '#dc2626',
    errorForeground: '#ffffff',
    warning: '#f59e0b',
    success: '#22c55e',
    surface: '#ffffff',
    background: '#fafafa',
    text: '#111111',
    textMuted: '#666666',
    textDisabled: '#aaaaaa',
    border: '#e0e0e0',
    borderFocus: '#0066cc',
    inputBackground: '#ffffff',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    scale: 'comfortable',            // 'compact' | 'comfortable' | 'spacious'
    questionSize: '1rem',
    labelSize: '0.875rem',
    helpTextSize: '0.75rem',
    bodySize: '0.875rem',
  },
  shape: {
    radius: 'md',                    // 'none' | 'sm' | 'md' | 'lg' | 'full'
    inputRadius: '6px',
    buttonRadius: '6px',
    cardRadius: '8px',
  },
  spacing: {
    base: 16,
    sectionGap: '2rem',
    fieldGap: '1.5rem',
    inputPaddingX: '12px',
    inputPaddingY: '8px',
  },
  layout: {
    maxWidth: '640px',
    alignment: 'left',               // 'left' | 'center'
    progressPosition: 'top',         // 'top' | 'bottom' | 'none'
    sectionLayout: 'card',           // 'card' | 'flat' | 'bordered'
  },
}
```

## Extending a preset

Spread a preset and override specific properties:

```ts
import { cleanPreset } from '@squaredr/fieldcraft-react'

const branded = {
  ...cleanPreset,
  colors: {
    ...cleanPreset.colors,
    primary: '#8b5cf6',
    borderFocus: '#8b5cf6',
  },
  typography: {
    ...cleanPreset.typography,
    fontFamily: 'Satoshi, sans-serif',
  },
}
```

## CSS custom properties

The theme is converted to CSS custom properties (`--fc-*`) on the form root element. You can use these variables in your own CSS:

```css
.my-form-wrapper {
  border: 1px solid var(--fc-border);
  background: var(--fc-surface);
  font-family: var(--fc-font-family);
}
```

### How the CSS variable chain works

```
Your theme object (FormEngineTheme)
    → themeToCssVars() converts to --fc-* variables
    → Applied as inline styles on the form root
    → shadcn/Radix components read --fc-* variables
    → Your custom CSS can also read them
```

## ThemeProvider

For advanced use cases, wrap your app in `FormEngineThemeProvider`:

```tsx
import { FormEngineThemeProvider } from '@squaredr/fieldcraft-react'

function App() {
  return (
    <FormEngineThemeProvider theme={myTheme}>
      {/* All FormRenderer instances inside inherit this theme */}
      <FormRenderer schema={form1} onSubmit={handle1} />
      <FormRenderer schema={form2} onSubmit={handle2} />
    </FormEngineThemeProvider>
  )
}
```

The `useTheme()` hook accesses the current theme from context:

```tsx
import { useTheme } from '@squaredr/fieldcraft-react'

function CustomComponent() {
  const theme = useTheme()
  return <div style={{ color: theme.colors?.primary }}>Themed content</div>
}
```

## Next steps

- [Custom field types](/docs/react/custom-field-types) — register your own field components
- [FormRenderer](/docs/react/form-renderer) — all FormRenderer props
