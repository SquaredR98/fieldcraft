---
title: Telemetry
description: FieldCraft includes optional, anonymous telemetry to help improve the library. It is disabled by default and collects no personal information.
---

## Overview

FieldCraft includes an optional telemetry system that collects anonymous usage data to help the maintainers understand how the library is used. This data informs decisions about which features to prioritize, which field types are most popular, and what environments users run on.

Telemetry is **disabled by default**. It must be explicitly opted in to.

## What is collected

When telemetry is enabled, the following data is sent once per `createEngine()` call (rate-limited to one event per schema ID per 24 hours):

| Data | Example | Purpose |
|------|---------|---------|
| Schema ID (hashed) | `fc_a7x9k2` | Deduplicate events — the original ID is never sent |
| Field count | `12` | Understand form complexity |
| Section count | `3` | Understand form structure |
| Field type distribution | `{ short_text: 5, email: 2 }` | Prioritize field type development |
| Feature flags | `usesConditions: true` | Know which features are adopted |
| Core version | `1.3.14` | Track version adoption |
| Node version | `20.11.0` | Ensure compatibility |
| Runtime | `browser` | Understand deployment environments |
| Schema valid | `true` | Track schema validation success rates |
| Timestamp | `2026-08-05T10:30:00Z` | Understand usage patterns over time |

### Feature flags collected

| Flag | What it means |
|------|---------------|
| `usesConditions` | At least one field or section has a `showIf` condition |
| `usesComputed` | At least one `calculated` field type is present |
| `usesDrafts` | `settings.enableDraftSaving` is `true` |
| `usesScoring` | At least one `scoring` field or field with a `score` property |
| `usesAdapters` | Submission adapters are configured in engine options |
| `usesPrefill` | Prefill config or prefill values are present |

## What is NOT collected

- No field values or user responses
- No schema content (titles, labels, descriptions, option text)
- No personally identifiable information (PII)
- No file paths, environment variables, or API keys
- No IP addresses (the relay endpoint does not log IPs)
- No cookies or browser fingerprints

## How to enable

### Via environment variable

```bash
FIELDCRAFT_TELEMETRY_ENABLED=1
```

Set this in your `.env` file or CI/CD pipeline. The engine checks for the value `"true"` or `"1"`.

### Per-engine override

```typescript
const engine = createEngine(schema, {
  telemetry: true, // Enable for this engine instance
});
```

The `telemetry` option in `EngineOptions` takes precedence over the environment variable. This lets you enable or disable telemetry per form without changing global settings.

```typescript
// Disable even if env var is set
const engine = createEngine(schema, {
  telemetry: false,
});
```

## How to disable

Do nothing. Telemetry is off by default. If you previously enabled it, remove the environment variable or set `telemetry: false` in your engine options.

## Debug mode

To see what data would be sent without actually sending it, set the debug environment variable:

```bash
FIELDCRAFT_TELEMETRY_DEBUG=1
```

This prints the telemetry event to the console as JSON instead of sending it to the server. Useful for verifying what data is collected.

## Technical details

- Events are sent via a single `POST` request to `https://fieldcraft.squaredr.tech/api/telemetry`
- The request is fire-and-forget — it never blocks your application
- If the request fails, it fails silently — telemetry never throws errors
- Rate limited to one event per schema ID per 24 hours (prevents spam from hot-reloading)
- The relay endpoint forwards data to a Google Sheets webhook for analysis
- The source code for the telemetry module is fully open: [`packages/core/src/engine/telemetry.ts`](https://github.com/SquaredR98/fieldcraft/blob/main/packages/core/src/engine/telemetry.ts)

## Why telemetry

As an open-source project, FieldCraft has limited visibility into how the library is used in production. npm download counts don't tell us which field types people use, whether conditional logic is adopted, or what runtimes are popular. This data helps us:

- Prioritize development of the most-used field types
- Detect common schema validation failures
- Ensure compatibility with popular runtimes and Node.js versions
- Understand which features (conditions, computed fields, drafts) are worth investing in
