# FieldCraft Monorepo — Development Rules

This is the FieldCraft monorepo. These rules apply to all work done in this directory tree.

When working from the parent workspace (`a:\products\questionnaire\`), the rules in `../CLAUDE.md` also apply. Both sets of rules are enforced. If there is a conflict, the workspace rules (`../CLAUDE.md`) win.

---

## Monorepo Structure

```
formengine/
├── packages/
│   ├── core/              # @squaredr/fieldcraft-core — pure TypeScript, zero UI deps
│   ├── react/             # @squaredr/fieldcraft-react — React + shadcn + Tailwind
│   ├── adapters/          # @squaredr/fieldcraft-adapters — storage (Postgres, Supabase, Webhook)
│   └── templates-free/    # @squaredr/fieldcraft-templates-free — ready-made schemas
├── website/               # FieldCraft marketing site + docs + blog (has its own CLAUDE.md)
├── tooling/               # Shared ESLint config
├── turbo.json             # Turborepo config
└── pnpm-workspace.yaml    # Workspace definition
```

---

## Rule M1: Package Boundaries (extends workspace Rule 7)

```
core      → Zero UI dependencies. Pure TypeScript. No React, no DOM.
react     → Depends on core. React + shadcn + Tailwind.
adapters  → Depends on core types only. No React. No UI.
templates → Depends on core types only. Schema objects + metadata.
website   → Depends on core + react (workspace:*). Next.js app.
```

**Never:**
- Import React in core
- Import Pro in react
- Import adapters in react
- Import website code in any package

---

## Rule M2: Version Bumps (extends workspace Rule 2)

After modifying any package source code, bump the version in that package's `package.json` before ending the task.

| Change Type | Bump | Example |
|-------------|------|---------|
| Bug fix, CSS fix, typo | Patch | 1.2.8 → 1.2.9 |
| New field, new feature, new export | Minor | 1.2.8 → 1.3.0 |
| Breaking API change | Major | 1.2.8 → 2.0.0 |

After bumping, also update:
1. Console banner version in the package's `src/index.ts`
2. Root `../CLAUDE.md` version table
3. Any docs page that references the version

---

## Rule M3: Source of Truth for Numbers (extends workspace Rule 1)

Before writing any number in docs, blog, README, or marketing content, count it from source:

| Metric | Source | How |
|--------|--------|-----|
| Field type count | `packages/react/src/registry/default-registry.ts` | Count entries in `defaultRegistry` |
| Test count | `pnpm test` output | Use the number from vitest |
| Theme preset count | `packages/react/src/themes/` | Count exported presets |
| Adapter count | `packages/adapters/src/` | Count sub-directories |
| Validator count | `packages/core/src/engine/validation-runner.ts` | Count built-in validator cases |
| Condition operator count | `packages/core/src/engine/condition-evaluator.ts` | Count operator cases |

**Every surface must agree.** If one changes, all change.

---

## Rule M4: CSS Class Naming (extends workspace Rule 4)

All FieldCraft CSS classes use the `fc-` prefix.

```
Pattern: .fc-{component}-{element}  or  .fc-{component}__{element}

Examples:
  .fc-option-active
  .fc-screen__heading
  .fc-blog-card__title
  .fc-docs__article
```

Before defining a new CSS class, verify the component actually uses it. Before using a class in a component, verify the CSS file defines it. No dead CSS.

---

## Rule M5: Build Verification

After any change, verify:

```bash
# In formengine/ root
pnpm build          # builds all packages + website via turbo
pnpm test           # runs all tests via turbo

# Or target a specific package
cd packages/core && pnpm build && pnpm test
cd website && pnpm build
```

The build must pass before the task is marked complete.

---

## Rule M6: Website Architecture (see website/CLAUDE.md)

The website follows a strict Components → Views → Pages architecture. See `website/CLAUDE.md` for full details. Key points:

- `page.tsx` calls exactly one view component
- Views assemble components, receive all data via props
- Components are small, focused, prop-driven
- Shared Nav/Footer use a route group layout, never duplicated
- CSS lives with components in `components/`, not in `app/` route directories

---

## Rule M7: Schema Validation Awareness (extends workspace Rule 5)

Non-input field types (`info_block`, `divider`, `spacer`, `section_header`, `page_break`, `welcome-screen`, `thank-you-screen`, `rich-text`, `image`, `video`) must NEVER have:
- `required` property
- `validation` property

The schema validator throws `FormEngineSchemaError` for these. Only add `required`/`validation` to input field types in demo schemas, template schemas, and blog code examples.

---

## Rule M8: React Patterns (extends workspace Rule 6)

### useSyncExternalStore
- `subscribe` and `getSnapshot` must be stable references (wrap in `useMemo`)
- Never destroy the engine in a `useEffect` cleanup — React Strict Mode double-mounts cause stale subscriptions
- The engine lives in a `useRef` and is created once

### Radix UI Select
- Never pass `value=""` (empty string) — use `value={val || undefined}`

### shadcn/ui theming
- CSS custom properties flow: `--sr-*` → `--fc-*` → shadcn `--*` variables
- Always use `var(--*)` references, never hardcoded colors

---

## Checklist Before Marking Any Task Done

- [ ] Did I bump the version if I changed package source code? (M2)
- [ ] Are all numbers verified from source code? (M3)
- [ ] Does `pnpm build` pass? (M5)
- [ ] Does `pnpm test` pass? (M5)
- [ ] Does every `page.tsx` call exactly one view component? (M6)
- [ ] Are shared layouts using route groups? (M6)
- [ ] Did I grep for stale references across the workspace?
- [ ] Did I update `../CLAUDE.md` if version numbers or rule-relevant info changed?
