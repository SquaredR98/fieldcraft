---
title: Licence & activation
description: FieldCraft Pro licensing, activation, and what's included.
---

## What's included

FieldCraft Pro is a commercial package that adds a visual form builder on top of the open-source engine. It includes:

- Drag-and-drop form builder component
- Visual schema editor
- Theme editor with live preview
- Response viewer with filtering and export
- All future Pro features included in your licence tier

## Licence tiers

| Tier | What you get |
|------|-------------|
| **Indie** | 1 developer, 1 project. For solo developers and freelancers. |
| **Team** | Up to 5 developers, unlimited projects. For small teams. |
| **Enterprise** | Unlimited developers, unlimited projects. Priority support. |

All tiers include the same features. The difference is the number of developers and projects covered.

## Installation

```bash
pnpm add @squaredr/fieldcraft-pro
```

## Activation

Set your licence key as an environment variable:

```bash title=".env.local"
FIELDCRAFT_PRO_KEY=your-licence-key-here
```

The builder checks the licence key at runtime. Without a valid key, the builder renders in demo mode with a watermark.

## Self-hosted

FieldCraft Pro is fully self-hosted. Your data never leaves your infrastructure:

- The builder runs entirely in the browser
- Schemas are stored wherever you choose (database, file system, CMS)
- No telemetry or phone-home calls
- No dependency on SquaredR servers

## Open source + Pro

The open-source packages (`core`, `react`, `adapters`, `templates-free`) are MIT-licensed and free forever. Pro is a commercial add-on — you don't need it to use FieldCraft.

| | Open source | Pro |
|---|---|---|
| Form rendering | Included | Included |
| 44 field types | Included | Included |
| Validation, conditions, computed fields | Included | Included |
| Theming, hooks, adapters | Included | Included |
| Visual form builder | — | Included |
| Schema editor | — | Included |
| Theme editor | — | Included |
| Response viewer | — | Included |

## Next steps

- [Visual builder](/docs/pro/visual-builder) — what the builder can do
- [Templates](/docs/pro/templates) — pre-built form schemas
