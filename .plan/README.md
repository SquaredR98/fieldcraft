# FieldCraft OSS — Shipping Plan

> This directory contains the roadmap for the FieldCraft open-source packages.

---

## What is FieldCraft?

A schema-driven headless form engine. You define forms as JSON, the engine handles state, validation, navigation, scoring, drafts, and submission. Pure TypeScript core with zero UI dependencies. React renderer with 44 field components, 3 display modes.

**Four packages, one monorepo:**

| Package | npm | Version | Description |
|---------|-----|---------|-------------|
| `@squaredr/fieldcraft-core` | [npm](https://www.npmjs.com/package/@squaredr/fieldcraft-core) | 1.9.0 | Pure TypeScript engine. Zero UI deps. Only depends on Zod. |
| `@squaredr/fieldcraft-react` | [npm](https://www.npmjs.com/package/@squaredr/fieldcraft-react) | 1.9.1 | React renderer. 44 field components. 3 display modes. shadcn/ui + Tailwind. |
| `@squaredr/fieldcraft-adapters` | [npm](https://www.npmjs.com/package/@squaredr/fieldcraft-adapters) | 1.0.1 | Submission adapters. HTTP, Postgres, Supabase, Webhook. |
| `@squaredr/fieldcraft-templates` | [npm](https://www.npmjs.com/package/@squaredr/fieldcraft-templates) | 1.1.1 | 16 free form templates. |

All published. All in sync.

---

## Files in This Directory

| File | Purpose |
|------|---------|
| `README.md` | This file — project overview, how to resume |
| `roadmap.md` | Full task list with status. Covers core, react, adapters, templates, website, docs, blog calendar (H6), SEO fixes (H4), new docs (H5), community seeding (I2). |

Cross-repo coordination (phase timeline, dependencies, revenue targets) lives in the workspace root: `.plan/seo-content-strategy.md`.

---

## How to Resume Work

1. Read `CLAUDE.md` at the workspace root — version table, pricing, package boundaries, coding standards
2. Read `roadmap.md` in this directory — full task list with statuses
3. Pick items from the roadmap or ask what to work on next
