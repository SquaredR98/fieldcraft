---
title: Licence & activation
description: FieldCraft Pro licensing, activation, and what's included.
---

## What's included

FieldCraft Pro is a single commercial package (`@squaredr/fieldcraft-pro`) with three major components:

| Component | Description |
|-----------|-------------|
| **FormBuilder** | Drag-and-drop form designer with schema editor, live preview, and template gallery. |
| **ThemeEditor** | Visual theme customizer with presets, palette generator, CSS/JSON export, and comparison view. |
| **ResponseViewer** | Response browser with table/card/detail/timeline views, search, filter, export, and statistics. |

All three components auto-inherit your host page's CSS custom properties. No theme configuration required for basic usage.

## Licence

FieldCraft Pro is a one-time purchase at **$199** (per production domain). One licence key covers one production domain, with unlimited development and localhost use. Twelve months of updates included.

## Installation

```bash
pnpm add @squaredr/fieldcraft-pro
```

## Activation

Set your licence key as an environment variable:

```bash title=".env.local"
FIELDCRAFT_PRO_KEY=your-licence-key-here
```

Pro components check the licence key at runtime. Without a valid key, Pro components render in demo mode with a watermark.

## Self-hosted

FieldCraft Pro is fully self-hosted. Your data never leaves your infrastructure:

- All components run entirely in the browser
- Schemas are stored wherever you choose (database, file system, CMS)
- No telemetry or phone-home calls
- No dependency on SquaredR servers

## Open source + Pro

The open-source packages (`core`, `react`, `adapters`, `templates`) are MIT-licensed and free forever. Pro is a commercial add-on — you don't need it to use FieldCraft.

| | Open source | Pro |
|---|---|---|
| Form rendering | Included | Included |
| 41 field types | Included | Included |
| Validation, conditions, computed fields | Included | Included |
| Theming, hooks, adapters | Included | Included |
| Visual form builder | — | Included |
| Theme editor | — | Included |
| Response viewer | — | Included |

## Next steps

- [Visual builder](/docs/pro/visual-builder) — drag-and-drop form designer
- [Theme editor](/docs/pro/theme-editor) — visual theme customizer
- [Response viewer](/docs/pro/response-viewer) — browse and export form responses
- [Templates](/docs/pro/templates) — pre-built form schemas
