---
title: Theme editor
description: Visual theme customizer for FieldCraft forms. Edit colours, typography, spacing, and shape with live preview. Part of the Pro commercial package.
---

## What it does

ThemeEditor is a standalone React component for visually customizing FieldCraft form themes. It outputs a `FormEngineTheme` object — the same format used by `FormRenderer`'s `theme` prop.

The ThemeEditor is part of `@squaredr/fieldcraft-pro`, which requires a commercial licence.

## Auto-inherit from host page

When rendered without an `initialTheme` prop, the ThemeEditor reads the current CSS custom properties from your host page (the standard shadcn/ui variables like `--background`, `--primary`, `--foreground`, etc.) and uses them as the starting theme. This means the editor opens with your app's actual theme, not a generic default.

The component also watches for dark/light mode changes on `<html>` (via `data-theme` attribute or `dark` class) and re-resolves the theme automatically.

```tsx
import { ThemeEditor } from '@squaredr/fieldcraft-pro'

// No initialTheme needed — starts from your page's CSS variables
export default function ThemeDesignerPage() {
  return (
    <ThemeEditor
      onSave={async (theme) => {
        await fetch('/api/themes', {
          method: 'POST',
          body: JSON.stringify(theme),
        })
      }}
    />
  )
}
```

## Features

| Feature | Description |
|---------|-------------|
| **Live preview** | A form renders in real-time as you adjust colours, typography, spacing, and shape. |
| **Preset families** | Five families (Clean, Modern, Clinical, Playful, High Contrast) with light and dark variants (10 total). |
| **Palette generator** | Generate harmonious colour palettes from a single primary colour. |
| **CSS export** | Copy the theme as CSS custom properties for use outside FieldCraft. |
| **JSON export** | Export the `FormEngineTheme` object for storage or import. |
| **Comparison view** | Compare two themes side-by-side. |
| **Dark mode awareness** | Watches for `dark` class or `data-theme` changes on `<html>` and re-resolves automatically. |

## Props

### Core

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialTheme` | `FormEngineTheme` | Auto-resolved from host CSS | Initial theme to load in the editor. |
| `onChange` | `(theme: FormEngineTheme) => void` | — | Called on every theme change. |
| `onSave` | `(theme: FormEngineTheme) => void` | — | Called when user clicks Save or presses Ctrl+S. |
| `showPreview` | `boolean` | `true` | Show the live form preview panel. |

### Layout

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | `string \| number` | — | Container height. |
| `width` | `string \| number` | — | Container width. |
| `className` | `string` | — | Additional CSS class on root element. |
| `toolbarExtra` | `ReactNode` | — | Extra content rendered in the toolbar. |

### Editor chrome theme

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `ThemeEditorTheme` | — | Controls the editor UI appearance (toolbar, panels, controls) — **not** the form preview. See below. |

## Editor chrome vs form theme

The ThemeEditor has two separate theme concepts:

- **Form theme** (`FormEngineTheme`) — the theme being *edited*. This is what `initialTheme`, `onChange`, and `onSave` work with. It controls the form preview.
- **Editor chrome theme** (`ThemeEditorTheme`) — the `theme` prop. This controls the appearance of the editor's own UI: toolbar, panels, controls, inputs.

```ts
import type { ThemeEditorTheme } from '@squaredr/fieldcraft-pro'

// ThemeEditorTheme controls the editor chrome
type ThemeEditorTheme = {
  background?: string;
  surface?: string;
  surfaceHover?: string;
  text?: string;
  textMuted?: string;
  textDim?: string;
  border?: string;
  borderStrong?: string;
  inputBackground?: string;
  accent?: string;
  accentForeground?: string;
}
```

Two built-in editor chrome presets are available:

```tsx
import { ThemeEditor, themeEditorDarkPreset } from '@squaredr/fieldcraft-pro'

<ThemeEditor theme={themeEditorDarkPreset} onSave={handleSave} />
```

## Using presets programmatically

Five preset families are available for use as starting themes:

```tsx
import { ThemeEditor, PRESET_FAMILIES } from '@squaredr/fieldcraft-pro'

<ThemeEditor
  initialTheme={PRESET_FAMILIES.clinical.light}
  onSave={handleSave}
/>
```

| Family | Key | Description |
|--------|-----|-------------|
| Clean | `clean` | Minimal, neutral colours, comfortable spacing. |
| Modern | `modern` | Contemporary styling with rounded corners. |
| Clinical | `clinical` | Professional/medical. Clean lines, clinical feel. |
| Playful | `playful` | Friendly and colourful. Larger radii, warmer tones. |
| High Contrast | `high-contrast` | Accessibility-focused. Strong borders, large text. |

Each family has `.light` and `.dark` variants:

```ts
PRESET_FAMILIES.modern.light  // FormEngineTheme
PRESET_FAMILIES.modern.dark   // FormEngineTheme
PRESET_FAMILIES.modern.label  // "Modern"
```

## Next steps

- [Visual builder](/docs/pro/visual-builder) — drag-and-drop form designer
- [Response viewer](/docs/pro/response-viewer) — browse and export form responses
- [Theming (OSS)](/docs/react/theming) — theme objects and CSS custom properties
- [Licence & activation](/docs/pro/licence-and-activation) — pricing and activation
