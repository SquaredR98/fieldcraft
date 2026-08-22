---
title: Theming
description: Customise colours, typography, spacing, and shape with theme objects, CSS custom properties, and auto-inherited host page styles.
---

## How theming works

FieldCraft's renderer uses **CSS custom properties** (`--background`, `--foreground`, `--primary`, etc.) to control visual appearance. There are three ways to theme a form, from simplest to most flexible:

1. **Auto-inherit** — if your host page defines shadcn-style CSS variables at `:root`, the renderer picks them up automatically. No code needed.
2. **Theme object** — pass a `FormEngineTheme` to the `theme` prop for explicit control.
3. **CSS overrides** — target `--fc-*` variables in your own stylesheets.

## Auto-inherit from host page

If your page already defines CSS custom properties like `--background`, `--foreground`, `--primary`, `--border`, etc. (the standard shadcn/ui pattern), `FormRenderer` inherits them automatically:

```tsx
import { FormRenderer } from '@squaredr/fieldcraft-react'

// No theme prop needed — inherits from your page's CSS variables
<FormRenderer schema={schema} onSubmit={handleSubmit} />
```

This also applies to [FieldCraft Pro](/pro) components (FormBuilder, ResponseViewer, ThemeEditor) — they all auto-inherit from the host page's CSS variables and follow dark/light mode changes.

## Custom theme object

Build a `FormEngineTheme` to control every visual aspect. All properties are optional — undefined values fall back to the host page's CSS variables or built-in defaults.

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

Pass it to the renderer:

```tsx
<FormRenderer schema={schema} theme={myTheme} onSubmit={handleSubmit} />
```

## Presets (Pro)

Five ready-made preset families with light and dark variants are available in [FieldCraft Pro](/pro):

| Preset family | Description |
|---------------|-------------|
| Clean | Minimal, neutral colours, comfortable spacing. |
| Modern | Contemporary styling with rounded corners. |
| High Contrast | Accessibility-focused. Strong borders, large text. |
| Clinical | Professional/medical. Clean lines, clinical feel. |
| Playful | Friendly and colourful. Larger radii, warmer tones. |

```tsx
import { PRESET_FAMILIES } from '@squaredr/fieldcraft-pro'

// Each family has .light and .dark variants
const theme = PRESET_FAMILIES.modern.light
const darkTheme = PRESET_FAMILIES.modern.dark
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
Host page :root CSS variables (--background, --primary, etc.)
    → Inherited by FormRenderer automatically
    → theme prop overrides specific values via inline styles
    → themeToCssVars() converts to --fc-* variables
    → shadcn/Radix components read these variables
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
