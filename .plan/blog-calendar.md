# FieldCraft Blog Calendar — 26 Weeks (6 Months)

> **Created:** 2026-08-30
> **Owner:** Ravi
> **Cadence:** 1 post per week (some weeks may be skipped)
> **Generator:** Use any LLM to write each post using the brief below
> **Status tracking:** Mark each row `DONE` after publishing

---

## Rules for LLM Blog Generation

1. **No competitor names.** Never mention specific products (Formik, React Hook Form, SurveyJS, Typeform, etc.) by name. Use generic terms: "popular form libraries", "hosted form services", "code-driven approaches".
2. **All 26 posts use already-shipped features.** No dependency on unshipped features (Telehealth, i18n, SaaS).
3. **Audience alternates** between React developers (tutorials with code) and technical decision-makers (architecture, strategy).
4. **Optimized for SEO + social.** Each post has a primary search keyword AND a social hook for Reddit/HN/Twitter/Dev.to.
5. **Pillar rotation:** Build (tutorial) -> Solve (use case) -> Think (opinion/architecture) -> repeat.
6. **Author:** `ravi`
7. **No time estimates** in blog content (e.g., "takes 5 minutes" is fine in titles for SEO, but don't promise delivery timelines).

---

## Frontmatter Template

Every post must use this exact frontmatter format. Save as `website/content/blog/{slug}.mdx`.

```yaml
---
title: "{title}"
slug: "{slug}"
date: "{YYYY-MM-DD}"
description: "{150-160 char meta description with primary keyword}"
author: "ravi"
category: "{Guide|Engineering|Patterns|Release}"
tags: ["{tag1}", "{tag2}", "{tag3}", "{tag4}"]
---
```

---

## Existing Published Posts (DO NOT duplicate)

These 12 posts are already live. New posts must not cover the same ground.

| # | Slug | Title | Category | Date |
|---|------|-------|----------|------|
| 1 | `introducing-fieldcraft` | Introducing FieldCraft: A Schema-Driven Form Engine for React | Release | 2026-05-10 |
| 2 | `fieldcraft-adapters-now-open-source` | FieldCraft Storage Adapters Are Now Open Source | Release | 2026-05-10 |
| 3 | `form-ux-lessons` | 6 Hard-Won UX Lessons from Building a Form Engine | Patterns | 2026-05-17 |
| 4 | `why-schema-driven` | Why Schema-Driven? The Architecture Behind FieldCraft | Engineering | 2026-05-22 |
| 5 | `build-forms-without-code` | Build Forms Without Code: Introducing FieldCraft FormBuilder | Release | 2026-05-22 |
| 6 | `build-multi-step-survey` | Build a Multi-Step Survey in 5 Minutes with FieldCraft | Guide | 2026-06-18 |
| 7 | `schema-vs-code-driven-forms` | Schema-Driven vs Code-Driven Forms: Which Approach Fits? | Engineering | 2026-06-20 |
| 8 | `fieldcraft-validation-pipeline` | How FieldCraft's Validation Pipeline Works Under the Hood | Engineering | 2026-06-26 |
| 9 | `conversational-forms` | Conversational Forms: One Question at a Time | Patterns | 2026-07-05 |
| 10 | `real-cost-building-forms` | The Real Cost of Building Forms From Scratch | Engineering | 2026-07-05 |
| 11 | `self-hosted-vs-cloud-forms` | Self-Hosted Forms vs Cloud Forms: A Developer's Guide | Guide | 2026-07-12 |
| 12 | `accessible-forms-guide` | Building Accessible Forms: What Most Developers Get Wrong | Guide | 2026-07-13 |

---

## Product Facts (source of truth for every post)

Use these exact numbers. Do not invent stats.

| Metric | Value | Source file |
|--------|-------|-------------|
| Field types | 44 | `packages/react/src/registry/default-registry.ts` |
| Tests passing | 1,267 | `pnpm test` output |
| Built-in validators | 19 | `packages/core/src/engine/validation-runner.ts` |
| Condition operators | 16 | `packages/core/src/engine/condition-evaluator.ts` |
| Core bundle (minified) | <15 KB | measured |
| Runtime dependencies | 1 (zod) | `packages/core/package.json` |
| Templates shipped | 16 | `packages/templates/src/` |
| Template categories | 7 | `packages/templates/src/` |
| Storage adapters | 4 (HTTP, Supabase, Postgres, Webhook) | `packages/adapters/src/` |
| Display modes | 3 (classic, stepped, conversational) | `packages/core/src/types/` |
| Theme presets (Pro) | 5 families, light/dark | `fieldcraft-pro` |
| Pro price | $199 one-time (launch) | website |
| Pro components | 3 (FormBuilder, ResponseViewer, ThemeEditor) | `fieldcraft-pro` |
| License model | MIT (OSS), Commercial (Pro) | root LICENSE |
| Pro localhost | Free, no time limit, no key needed | Pro licensing |
| React support | 18.2+ and 19.x | `packages/react/package.json` |

---

## Key URLs to Link

- Docs: `/docs`
- Installation: `/docs/getting-started/installation`
- First form tutorial: `/docs/getting-started/your-first-form`
- Schema anatomy: `/docs/core-concepts/schema-anatomy`
- Field types: `/docs/core-concepts/field-types`
- Validation: `/docs/core-concepts/validation`
- Conditional logic: `/docs/core-concepts/conditional-logic`
- Multi-step forms: `/docs/core-concepts/multi-step-forms`
- Computed fields: `/docs/core-concepts/computed-fields`
- Display modes: `/docs/core-concepts/display-modes`
- Theming: `/docs/react/theming`
- Hooks: `/docs/react/hooks`
- Adapters: `/docs/submission/adapters-overview`
- Drafts: `/docs/submission/drafts-and-prefill`
- Templates: `/templates`
- Pro page: `/pro`
- GitHub: `https://github.com/SquaredR98/fieldcraft`
- npm core: `https://www.npmjs.com/package/@squaredr/fieldcraft-core`
- npm react: `https://www.npmjs.com/package/@squaredr/fieldcraft-react`

---

## 26-Week Calendar

### Week 1

| Field | Value |
|-------|-------|
| **Status** | `PUBLISHED` |
| **Slug** | `react-contact-form-json-schema` |
| **Title** | How to Build a React Contact Form with JSON Schema |
| **Category** | Guide |
| **Pillar** | Build |
| **Tags** | `fieldcraft`, `react`, `forms`, `tutorial`, `contact-form` |
| **Primary keyword** | "react contact form" |
| **Social hook** | "You're still writing 200 lines of JSX for a contact form?" |
| **Description** | Build a production-ready React contact form from a single JSON schema. Validation, error handling, and submission in under 50 lines of code. |
| **Target length** | 1,200-1,500 words |
| **Outline** | 1. The problem: a typical React contact form is 200+ lines of boilerplate. 2. Define the schema (name, email, message, phone with conditional required). 3. Render with FormEngineRenderer. 4. Add validation rules (email format, minLength, required). 5. Handle submission with callback. 6. Show the complete code. 7. Link to `/templates/contact-form` template and `/docs/getting-started/your-first-form`. |
| **Code samples** | Full JSON schema for a 4-field contact form. FormEngineRenderer usage. Validation rules. |
| **Internal links** | `/docs/getting-started/your-first-form`, `/templates/contact-form`, `/docs/core-concepts/validation` |
| **Cross-post to** | Dev.to (with canonical URL) |

---

### Week 2

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `form-validation-patterns-react` |
| **Title** | 7 Form Validation Patterns Every React App Needs |
| **Category** | Patterns |
| **Pillar** | Think |
| **Tags** | `react`, `forms`, `validation`, `patterns`, `ux` |
| **Primary keyword** | "react form validation" |
| **Social hook** | "Most form validation is either too aggressive or too lazy. Here are the patterns that actually work." |
| **Description** | Seven battle-tested validation patterns for React forms: validate on blur, async username checks, conditional required fields, cross-field validation, and more. |
| **Target length** | 1,500-1,800 words |
| **Outline** | 1. Validate on blur, not on change (why keystroke validation is hostile). 2. Show all errors at once, not one at a time. 3. Async validation with debounce (username availability). 4. Cross-field validation (confirm password, date ranges). 5. Conditional required (phone required only if contact method = phone). 6. Section-level validation for multi-step forms. 7. Never disable the submit button. Each pattern: problem, solution, code snippet using FieldCraft schema. |
| **Code samples** | Validation rule arrays for each pattern. Async validator registration. Conditional `required` with ConditionExpression. |
| **Internal links** | `/docs/core-concepts/validation`, `/blog/fieldcraft-validation-pipeline`, `/blog/form-ux-lessons` |
| **Cross-post to** | Dev.to, Reddit r/reactjs |

---

### Week 3

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `employee-onboarding-form-react` |
| **Title** | Build an Employee Onboarding Form with Conditional Sections |
| **Category** | Guide |
| **Pillar** | Solve |
| **Tags** | `fieldcraft`, `react`, `forms`, `hr`, `onboarding` |
| **Primary keyword** | "employee onboarding form react" |
| **Social hook** | "HR asked for an onboarding form with 6 conditional sections. Here's how I built it in one JSON file." |
| **Description** | Step-by-step guide to building a multi-section employee onboarding form with conditional fields, department-specific questions, and draft persistence. |
| **Target length** | 1,400-1,700 words |
| **Outline** | 1. Requirements: personal info, employment details, department-specific questions, IT setup, emergency contact, acknowledgments. 2. Schema with 6 sections. 3. showIf for department-specific sections (engineering gets GitHub/IDE questions, sales gets CRM/territory questions). 4. Conditional required (visa details only if not a citizen). 5. Draft persistence so HR can save and resume. 6. Jump rules for routing based on employment type (full-time vs contractor skips benefits section). 7. Complete schema + renderer code. |
| **Code samples** | Full multi-section schema with showIf, conditional required, jump rules. |
| **Internal links** | `/docs/core-concepts/conditional-logic`, `/docs/core-concepts/multi-step-forms`, `/docs/submission/drafts-and-prefill` |
| **Cross-post to** | Dev.to |

---

### Week 4

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `forms-are-infrastructure` |
| **Title** | Forms Are Infrastructure, Not Features |
| **Category** | Engineering |
| **Pillar** | Think |
| **Tags** | `forms`, `architecture`, `engineering`, `opinion` |
| **Primary keyword** | "form infrastructure react" |
| **Social hook** | "We treat forms like throwaway UI. They're actually one of the most complex systems in any web app." |
| **Description** | Why forms deserve the same architectural attention as auth, payments, and state management. The 8 systems hiding inside every production form. |
| **Target length** | 1,200-1,500 words |
| **Outline** | 1. The illusion: "it's just a form". 2. The 8 systems: rendering, validation, state management, conditional logic, multi-step navigation, draft persistence, submission, error handling. 3. Each system done properly is non-trivial. 4. Why forms break when you scale (10 forms, 50 forms, non-developers creating forms). 5. The infrastructure approach: separate the definition (schema) from the implementation (engine). 6. What this means practically: one engine, many forms. 7. Link to FieldCraft as one implementation of this idea. |
| **Code samples** | Minimal. Side-by-side: imperative form (150 lines) vs schema-driven form (30 lines). |
| **Internal links** | `/blog/real-cost-building-forms`, `/blog/why-schema-driven`, `/docs` |
| **Cross-post to** | Hacker News, Reddit r/programming, Twitter thread |

---

### Week 5

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `react-form-draft-persistence` |
| **Title** | How to Save Form Progress and Resume Later in React |
| **Category** | Guide |
| **Pillar** | Build |
| **Tags** | `react`, `forms`, `draft`, `persistence`, `tutorial` |
| **Primary keyword** | "save form progress react" |
| **Social hook** | "Your users are filling out a 10-field form, closing the tab, and losing everything. Fix that." |
| **Description** | Add auto-save and draft resume to React forms. localStorage drafts, server-side persistence, expiration, and the resume prompt UX. |
| **Target length** | 1,300-1,600 words |
| **Outline** | 1. The problem: long forms + accidental tab close = rage. 2. Client-side drafts with localStorage (schema config: allowDraftSave, draftStorage, draftTtlHours). 3. The resume prompt UX ("Resume where you left off?"). 4. What gets saved (values, current section, visited sections, timestamp). 5. Draft expiration and why 72 hours is the default. 6. Server-side drafts with DraftAdapter (Supabase example). 7. Building a custom draft adapter (Redis example). 8. Edge case: schema changed since draft was saved. |
| **Code samples** | Schema settings for drafts. DraftAdapter interface. Supabase draft adapter config. Custom Redis adapter. |
| **Internal links** | `/docs/submission/drafts-and-prefill`, `/docs/submission/adapters-overview`, `/blog/form-ux-lessons` |
| **Cross-post to** | Dev.to |

---

### Week 6

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `10-things-every-form-needs` |
| **Title** | The 10 Things Every Web Form Needs (and Most Get Wrong) |
| **Category** | Patterns |
| **Pillar** | Think |
| **Tags** | `forms`, `ux`, `frontend`, `checklist`, `best-practices` |
| **Primary keyword** | "web form best practices" |
| **Social hook** | "I've reviewed 200+ production forms. Here's what separates good forms from form abandonment machines." |
| **Description** | A checklist of 10 non-negotiable features every web form should have: validation timing, error messages, progress indication, accessibility, and more. |
| **Target length** | 1,500-1,800 words |
| **Outline** | 1. Inline validation on blur. 2. Clear, specific error messages (not "Invalid input"). 3. Progress indicator for multi-step. 4. Keyboard navigation (Tab, Enter, Escape). 5. Accessible labels and ARIA attributes. 6. Auto-save / draft persistence. 7. Conditional fields (hide, don't disable). 8. Mobile-optimized input types (inputMode, autocomplete). 9. Loading state on submit (prevent double-submit). 10. Success confirmation (not just a blank page). For each: the mistake, the fix, one code snippet. |
| **Code samples** | Schema snippets for each pattern. |
| **Internal links** | `/blog/form-ux-lessons`, `/blog/accessible-forms-guide`, `/docs/core-concepts/validation` |
| **Cross-post to** | Dev.to, Reddit r/webdev, Twitter thread, LinkedIn |

---

### Week 7

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `dynamic-forms-json-react` |
| **Title** | Dynamic Forms from JSON in React: A Complete Guide |
| **Category** | Guide |
| **Pillar** | Build |
| **Tags** | `react`, `json`, `forms`, `dynamic`, `schema` |
| **Primary keyword** | "dynamic forms json react" |
| **Social hook** | "What if your forms were data, not code?" |
| **Description** | Build dynamic React forms driven by JSON configuration. Load schemas from an API, render them with a single component, and handle validation and submission. |
| **Target length** | 1,400-1,700 words |
| **Outline** | 1. What "dynamic forms" means: the shape is defined at runtime, not compile time. 2. The JSON schema approach: one renderer, infinite forms. 3. Loading a schema from an API endpoint. 4. Rendering with FormEngineRenderer. 5. Type safety with FormEngineSchema type. 6. Handling different field types (the registry). 7. Dynamic validation (rules are in the schema). 8. Storing and versioning schemas (SchemaAdapter). 9. Use cases: admin panels, CMS forms, multi-tenant apps. |
| **Code samples** | Fetch schema from API -> render. FormEngineSchema type. Schema with various field types. |
| **Internal links** | `/docs/core-concepts/schema-anatomy`, `/docs/core-concepts/field-types`, `/blog/why-schema-driven` |
| **Cross-post to** | Dev.to, Reddit r/reactjs |

---

### Week 8

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `hipaa-compliant-forms-react` |
| **Title** | Building HIPAA-Compliant Forms in React: A Developer's Checklist |
| **Category** | Guide |
| **Pillar** | Solve |
| **Tags** | `fieldcraft`, `forms`, `hipaa`, `healthcare`, `security` |
| **Primary keyword** | "hipaa compliant forms react" |
| **Social hook** | "Building forms for healthcare? Here's the compliance checklist your team is probably missing." |
| **Description** | How to build HIPAA-compliant forms in React. Field-level encryption, PII-free logging, self-hosted data, audit trails, and the noPiiInLogs setting. |
| **Target length** | 1,500-1,800 words |
| **Outline** | 1. What HIPAA requires for electronic forms (PHI, minimum necessary, encryption at rest + in transit). 2. Why hosted form services are problematic (BAA complexity, data residency). 3. Self-hosted approach: your database, your encryption. 4. Field-level encryption with FieldCraft adapters (encryptFields config). 5. PII-free logging (noPiiInLogs: true). 6. Audit trail with submission metadata (completionTimeMs, sessionToken). 7. Server-side schema validation. 8. Checklist: encryption, logging, storage, access control, BAA. |
| **Code samples** | Supabase adapter with encryptFields. Schema with noPiiInLogs. Encrypt/decrypt utility usage. |
| **Internal links** | `/docs/submission/adapters-overview`, `/blog/self-hosted-vs-cloud-forms`, `/docs/submission/server-validation` |
| **Cross-post to** | Dev.to |

---

### Week 9

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `css-variables-form-theming` |
| **Title** | Theme-Aware Forms with CSS Custom Properties |
| **Category** | Engineering |
| **Pillar** | Build |
| **Tags** | `react`, `css`, `theming`, `forms`, `design-system` |
| **Primary keyword** | "css custom properties forms react" |
| **Social hook** | "Your form library shouldn't fight your design system. Here's how CSS variables make theming zero-config." |
| **Description** | How to theme React forms using CSS custom properties. Auto-inherit from shadcn/ui, build custom themes, and support dark mode with zero JavaScript. |
| **Target length** | 1,300-1,600 words |
| **Outline** | 1. The problem: form libraries ship their own CSS that clashes with your design system. 2. CSS custom properties as the theming layer (--background, --foreground, --primary). 3. Auto-inheritance: if your app uses shadcn/ui, FieldCraft picks up your theme automatically. 4. Custom theme object: colors, typography, spacing, border-radius. 5. Dark mode support via prefers-color-scheme and CSS variable switching. 6. Theme presets in FieldCraft Pro. 7. Building your own theme from scratch. |
| **Code samples** | FormEngineTheme object. CSS custom properties. Dark mode media query. Theme preset usage. |
| **Internal links** | `/docs/react/theming`, `/pro` |
| **Cross-post to** | Dev.to |

---

### Week 10

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `form-submission-patterns` |
| **Title** | 4 Form Submission Patterns: HTTP, Webhooks, Database, and Callback |
| **Category** | Engineering |
| **Pillar** | Think |
| **Tags** | `fieldcraft`, `forms`, `architecture`, `api`, `webhooks` |
| **Primary keyword** | "form submission backend architecture" |
| **Social hook** | "Where do your form submissions actually go? The architecture decision you're probably not thinking about." |
| **Description** | Four patterns for handling form submissions: direct HTTP, webhook relay, database adapter, and client callback. When to use each, with code examples. |
| **Target length** | 1,400-1,700 words |
| **Outline** | 1. The question nobody asks: where does the data go after submit? 2. Pattern 1: HTTP POST to your API (simplest, most common). 3. Pattern 2: Webhook with HMAC signing (for third-party integrations, Zapier-style). 4. Pattern 3: Direct database write with adapter (Postgres/Supabase, includes encryption). 5. Pattern 4: Client callback (for SPAs that manage their own state). 6. Combining patterns: multiple adapters in parallel. 7. Error handling and retries. 8. Decision matrix: which pattern for which use case. |
| **Code samples** | HTTP adapter config. Webhook adapter with HMAC. Supabase adapter with encryption. Multiple adapters array. |
| **Internal links** | `/docs/submission/adapters-overview`, `/blog/fieldcraft-adapters-now-open-source` |
| **Cross-post to** | Dev.to |

---

### Week 11

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `nps-survey-react-tutorial` |
| **Title** | Build an NPS Survey in React (with Scoring) |
| **Category** | Guide |
| **Pillar** | Build |
| **Tags** | `fieldcraft`, `react`, `nps`, `survey`, `tutorial` |
| **Primary keyword** | "nps survey react" |
| **Social hook** | "An NPS survey is 3 fields. The scoring, conditional follow-ups, and analytics are the hard part." |
| **Description** | Build a Net Promoter Score survey in React with automatic scoring, conditional follow-up questions, and submission to your database. Complete schema included. |
| **Target length** | 1,200-1,500 words |
| **Outline** | 1. What NPS is (0-10 rating, categorize into Detractors/Passives/Promoters). 2. The schema: rating field (0-10 slider or scale), conditional follow-up (showIf: rating <= 6 -> "What could we improve?", rating >= 9 -> "What do you love?"). 3. Scoring configuration. 4. Calculated field for NPS category. 5. Submission with adapter. 6. Complete working schema. 7. Link to `/templates/nps-survey`. |
| **Code samples** | Full NPS schema with scoring, showIf, calculated field. |
| **Internal links** | `/templates/nps-survey`, `/docs/core-concepts/computed-fields`, `/docs/core-concepts/conditional-logic` |
| **Cross-post to** | Dev.to |

---

### Week 12

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `form-abandonment-causes-fixes` |
| **Title** | Why Users Abandon Your Forms (and How to Fix It) |
| **Category** | Patterns |
| **Pillar** | Think |
| **Tags** | `forms`, `ux`, `conversion`, `analytics`, `patterns` |
| **Primary keyword** | "form abandonment rate" |
| **Social hook** | "The average form abandonment rate is 68%. Here's exactly where users drop off and why." |
| **Description** | The five main causes of form abandonment and concrete fixes: too many fields, no progress indication, validation timing, missing auto-save, and poor mobile UX. |
| **Target length** | 1,500-1,800 words |
| **Outline** | 1. The stat: 68% average abandonment. 2. Cause 1: Too many visible fields (fix: multi-step with sections). 3. Cause 2: No progress indicator (fix: progress bar/steps/percentage). 4. Cause 3: Aggressive validation (fix: validate on blur, not on change). 5. Cause 4: No save progress (fix: auto-draft persistence). 6. Cause 5: Poor mobile experience (fix: input modes, autocomplete, touch targets). 7. Measuring abandonment: completionTimeMs and analytics adapter. 8. Each fix maps to a FieldCraft feature. |
| **Code samples** | Schema settings for each fix. Analytics adapter example. |
| **Internal links** | `/blog/form-ux-lessons`, `/docs/core-concepts/multi-step-forms`, `/docs/submission/drafts-and-prefill` |
| **Cross-post to** | LinkedIn, Twitter thread, Reddit r/webdev |

---

### Week 13

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `nextjs-forms-guide` |
| **Title** | Forms in Next.js: Server Components, Client Components, and Submission |
| **Category** | Guide |
| **Pillar** | Build |
| **Tags** | `nextjs`, `react`, `forms`, `server-components`, `tutorial` |
| **Primary keyword** | "nextjs forms" |
| **Social hook** | "Next.js App Router changed how forms work. Here's how to get it right." |
| **Description** | How to build forms in Next.js with App Router. Client-side rendering with 'use client', server-side validation, schema loading from API routes, and submission handling. |
| **Target length** | 1,400-1,700 words |
| **Outline** | 1. Forms in Next.js App Router: client components are required for interactivity. 2. Setting up: install, 'use client' wrapper. 3. Loading schemas from server (RSC fetches schema, passes to client component). 4. FormEngineRenderer in a client component. 5. Submission via API route (POST handler). 6. Server-side schema validation with validateFormValues(). 7. Draft persistence with localStorage. 8. Full working example: page.tsx (server) + FormClient.tsx (client) + api/submit/route.ts. |
| **Code samples** | Server component loading schema. Client component rendering form. API route for submission. Server validation. |
| **Internal links** | `/docs/getting-started/installation`, `/docs/submission/server-validation`, `/docs/submission/adapters-overview` |
| **Cross-post to** | Dev.to, Reddit r/nextjs |

---

### Week 14

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `condition-evaluator-deep-dive` |
| **Title** | Building a Condition Evaluator with 16 Operators |
| **Category** | Engineering |
| **Pillar** | Think |
| **Tags** | `fieldcraft`, `typescript`, `architecture`, `deep-dive`, `engineering` |
| **Primary keyword** | "condition evaluator typescript" |
| **Social hook** | "We needed conditional logic that non-developers could read. Here's how we built a 16-operator evaluator in pure TypeScript." |
| **Description** | How FieldCraft's condition evaluator works: 16 operators (eq, neq, gt, contains, between, matches, etc.), compound AND/OR nesting, and zero-dependency evaluation. |
| **Target length** | 1,500-1,800 words |
| **Outline** | 1. The requirement: conditional logic that's readable in JSON. 2. ConditionExpression type (simple + compound). 3. The 16 operators and their semantics. 4. Compound conditions with recursive nesting (AND inside OR inside AND). 5. Performance: pure function, no side effects, synchronous. 6. Where conditions are used: showIf, conditional required, conditional disabled, jump rules. 7. Edge cases: null/undefined values, type coercion, array contains. 8. How evaluation cascades through the engine on every setValue(). |
| **Code samples** | ConditionExpression type. Compound condition example. Operator implementation snippets. |
| **Internal links** | `/docs/core-concepts/conditional-logic`, `/blog/fieldcraft-validation-pipeline` |
| **Cross-post to** | Dev.to, Hacker News |

---

### Week 15

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `event-registration-form-react` |
| **Title** | Build an Event Registration Form with Conditional Pricing |
| **Category** | Guide |
| **Pillar** | Solve |
| **Tags** | `fieldcraft`, `react`, `forms`, `events`, `calculated-fields` |
| **Primary keyword** | "event registration form react" |
| **Social hook** | "Early bird pricing, workshop add-ons, group discounts — all calculated live in the form." |
| **Description** | Build an event registration form with calculated pricing, conditional workshop selection, and dietary preference fields. Uses computed fields and IF() expressions. |
| **Target length** | 1,300-1,600 words |
| **Outline** | 1. Requirements: attendee info, ticket type (single/group), workshop selection (conditional on ticket type), dietary preferences, calculated total price. 2. Schema with sections: attendee, ticket, workshops (showIf: not free tier), dietary, summary. 3. Calculated fields: base price from ticket type, workshop add-ons, group discount, total. 4. IF() expressions for tiered pricing. 5. Conditional sections (workshops only for paid tickets). 6. Complete schema. |
| **Code samples** | Full schema with calculated fields using IF() and math expressions. showIf for conditional sections. |
| **Internal links** | `/docs/core-concepts/computed-fields`, `/docs/core-concepts/conditional-logic`, `/templates` |
| **Cross-post to** | Dev.to |

---

### Week 16

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `display-modes-classic-stepped-conversational` |
| **Title** | Classic, Stepped, or Conversational: Choosing the Right Form Layout |
| **Category** | Patterns |
| **Pillar** | Think |
| **Tags** | `forms`, `ux`, `display-modes`, `design`, `patterns` |
| **Primary keyword** | "form layout patterns" |
| **Social hook** | "The same form with 3 different layouts. Completion rates varied by 40%." |
| **Description** | When to use single-page (classic), wizard (stepped), or one-question-at-a-time (conversational) form layouts. UX trade-offs, completion rates, and implementation. |
| **Target length** | 1,400-1,700 words |
| **Outline** | 1. Three modes, one schema: the same JSON renders differently based on displayMode setting. 2. Classic (all fields on one page): best for short forms (<7 fields), power users, data entry. 3. Stepped (wizard with progress): best for complex forms (7-30 fields), onboarding, applications. 4. Conversational (one question at a time): best for surveys, lead capture, mobile. 5. Decision matrix (field count, audience, device, urgency). 6. Switching modes is one line of config. 7. Combining with conditional sections for adaptive forms. |
| **Code samples** | Schema settings.displayMode for each mode. Same schema rendered in 3 modes. |
| **Internal links** | `/docs/core-concepts/display-modes`, `/docs/core-concepts/multi-step-forms`, `/blog/conversational-forms` |
| **Cross-post to** | LinkedIn, Twitter thread |

---

### Week 17

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `react-form-custom-field-types` |
| **Title** | Creating Custom Field Types in a Schema-Driven Form Engine |
| **Category** | Guide |
| **Pillar** | Build |
| **Tags** | `fieldcraft`, `react`, `custom-fields`, `tutorial`, `typescript` |
| **Primary keyword** | "custom form field react" |
| **Social hook** | "44 built-in field types weren't enough. Here's how to add your own." |
| **Description** | How to register custom field types in FieldCraft. Build a color picker, a star rating, or any field you need and plug it into the schema-driven pipeline. |
| **Target length** | 1,300-1,600 words |
| **Outline** | 1. When you need a custom field (signature pad, color picker, address autocomplete). 2. The field registry pattern. 3. Building a custom color picker field component. 4. Registering it with the field registry. 5. Using it in a schema (type: "color_picker", config: { swatches: [...] }). 6. Validation still works (add custom validator for hex format). 7. Conditional logic still works (showIf, required). 8. TypeScript: extending QuestionConfig for type safety. |
| **Code samples** | Custom ColorPickerField component. Registry registration. Schema using custom field. Custom validator. |
| **Internal links** | `/docs/react/custom-field-types`, `/docs/core-concepts/field-types`, `/docs/core-concepts/validation` |
| **Cross-post to** | Dev.to |

---

### Week 18

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `form-field-encryption-at-rest` |
| **Title** | Field-Level Encryption for Form Data: When and How |
| **Category** | Engineering |
| **Pillar** | Solve |
| **Tags** | `fieldcraft`, `security`, `encryption`, `forms`, `architecture` |
| **Primary keyword** | "form data encryption" |
| **Social hook** | "Your database stores SSNs in plaintext. Let's fix that without encrypting everything." |
| **Description** | How to encrypt specific form fields at rest while keeping non-sensitive fields queryable. AES-256-GCM encryption with FieldCraft adapters. |
| **Target length** | 1,300-1,600 words |
| **Outline** | 1. The problem: you need to store SSNs, DOBs, medical IDs — but full-database encryption kills queryability. 2. Field-level encryption: encrypt only the fields that need it. 3. FieldCraft adapter config: encryptFields array. 4. How it works under the hood (AES-256-GCM, per-field IV). 5. Querying encrypted data (you can't — design around it). 6. Key management (environment variables, not hardcoded). 7. Manual encrypt/decrypt utilities for custom workflows. 8. When to use this vs full-disk encryption vs TLS-only. |
| **Code samples** | Supabase adapter with encryptFields. Postgres adapter with encryption. Manual encrypt/decrypt. |
| **Internal links** | `/docs/submission/adapters-overview`, `/blog/self-hosted-vs-cloud-forms` |
| **Cross-post to** | Dev.to |

---

### Week 19

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `feedback-widget-react` |
| **Title** | Build an In-App Feedback Widget That Saves to Your Database |
| **Category** | Guide |
| **Pillar** | Build |
| **Tags** | `fieldcraft`, `react`, `feedback`, `saas`, `tutorial` |
| **Primary keyword** | "feedback widget react" |
| **Social hook** | "Stop paying $50/month for a feedback widget. Build one that saves to your own database." |
| **Description** | Build a slide-out feedback widget for your React app using FieldCraft. Rating, category selector, free-text comment, and direct database submission. |
| **Target length** | 1,200-1,500 words |
| **Outline** | 1. The widget: a small floating button that opens a 3-field feedback form. 2. Schema: rating (1-5 stars), category (bug/feature/ux/other), comment (long_text). 3. Conditional field: if rating <= 2, show "What went wrong?" (required). 4. Styling: compact theme, minimal, matches your app. 5. Submission to your database via Supabase adapter. 6. Wrapper component: toggle button, slide-out panel, form renderer. 7. Complete code. |
| **Code samples** | Compact feedback schema. FeedbackWidget wrapper component. Supabase adapter config. |
| **Internal links** | `/docs/core-concepts/conditional-logic`, `/docs/submission/adapters-overview`, `/docs/react/theming` |
| **Cross-post to** | Dev.to, Reddit r/reactjs |

---

### Week 20

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `calculated-fields-spreadsheet-logic` |
| **Title** | Spreadsheet Logic in a Form Engine: Calculated Fields and IF() Expressions |
| **Category** | Engineering |
| **Pillar** | Think |
| **Tags** | `fieldcraft`, `calculated-fields`, `expressions`, `engineering`, `deep-dive` |
| **Primary keyword** | "calculated fields form" |
| **Social hook** | "We added IF(), UPPER(), CONCAT(), and DATEDIFF() to a form engine. Here's how the expression evaluator works." |
| **Description** | How FieldCraft's calculated field engine evaluates expressions with math, string functions, date functions, and conditional logic. Two evaluation paths, one pipeline. |
| **Target length** | 1,500-1,800 words |
| **Outline** | 1. What calculated fields do: auto-compute values from other fields. 2. Simple math: {quantity} * {price}. 3. Aggregates: SUM(), AVG(), COUNT(), MIN(), MAX(). 4. The new function pipeline: IF(), UPPER(), LOWER(), TRIM(), LEN(), CONCAT(), TODAY(), DATEDIFF(), DATEADD(). 5. Two evaluation paths: Shunting-yard for pure math, recursive-descent for function calls. 6. How containsFunctionCall() routes expressions. 7. Nested functions: CONCAT(UPPER({first}), " ", LOWER({last})). 8. IF with comparisons: IF({type} = "legal", 200, 100). 9. Transitive dependencies (calculated field referencing another calculated field). |
| **Code samples** | Various calculated field expressions. Schema with IF(), CONCAT(), DATEDIFF(). |
| **Internal links** | `/docs/core-concepts/computed-fields`, `/docs/core-concepts/schema-anatomy` |
| **Cross-post to** | Dev.to, Hacker News |

---

### Week 21

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `job-application-form-file-upload` |
| **Title** | Build a Job Application Form with File Upload and Conditional Sections |
| **Category** | Guide |
| **Pillar** | Solve |
| **Tags** | `fieldcraft`, `react`, `forms`, `file-upload`, `hr` |
| **Primary keyword** | "job application form react" |
| **Social hook** | "A job application form with resume upload, conditional experience sections, and schema-level file validation." |
| **Description** | Build a job application form with resume upload, file type/size validation, conditional experience sections based on role, and reference collection. |
| **Target length** | 1,300-1,600 words |
| **Outline** | 1. Requirements: personal info, role selection, resume upload, experience (conditional by role), references, cover letter (optional). 2. File upload field with validation (fileSize: 5MB, fileType: PDF/DOCX). 3. Conditional sections: engineering applicants get GitHub/portfolio questions, design applicants get Dribbble/Figma questions. 4. Repeatable field group for references (name, email, relationship). 5. Draft persistence for long applications. 6. Complete schema. 7. Link to /templates/job-application. |
| **Code samples** | Full job application schema with file upload, conditional sections, validation. |
| **Internal links** | `/templates/job-application`, `/docs/core-concepts/validation`, `/docs/core-concepts/conditional-logic` |
| **Cross-post to** | Dev.to |

---

### Week 22

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `form-scoring-quizzes-assessments` |
| **Title** | Building Scored Forms: Quizzes, Assessments, and Clinical Instruments |
| **Category** | Guide |
| **Pillar** | Build |
| **Tags** | `fieldcraft`, `forms`, `scoring`, `quiz`, `assessment` |
| **Primary keyword** | "scored form quiz react" |
| **Social hook** | "Scored forms aren't just for quizzes. They're used in clinical assessments, risk scoring, and qualification flows." |
| **Description** | How to build forms with automatic scoring in FieldCraft. Option-level scores, section scores, total scores, and score-based conditional logic. |
| **Target length** | 1,300-1,600 words |
| **Outline** | 1. Use cases for scored forms: quizzes, NPS, clinical assessments (PHQ-9 style), lead qualification. 2. Option-level scoring: each option has a numeric score. 3. Field scores: single_select picks the score, multi_select sums them. 4. Section scores: sum of field scores in a section. 5. Total score: sum across all sections. 6. Score-based conditional logic (showIf: totalScore >= threshold). 7. Score-based jump rules (high score -> detailed section, low score -> thank you). 8. Accessing scores in FormState. 9. Complete quiz schema example. |
| **Code samples** | Schema with scored options. Score-based showIf. Score-based jump rules. |
| **Internal links** | `/docs/core-concepts/schema-anatomy`, `/docs/core-concepts/conditional-logic`, `/docs/core-concepts/computed-fields` |
| **Cross-post to** | Dev.to |

---

### Week 23

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `react-form-hooks-explained` |
| **Title** | useFormEngine, useFieldValue, useSectionProgress: FieldCraft's React Hooks |
| **Category** | Engineering |
| **Pillar** | Build |
| **Tags** | `fieldcraft`, `react`, `hooks`, `tutorial`, `api` |
| **Primary keyword** | "react form hooks" |
| **Social hook** | "Three hooks. Full control over form state without managing any of it yourself." |
| **Description** | Deep-dive into FieldCraft's three React hooks. useFormEngine for the engine instance, useFieldValue for reactive field access, and useSectionProgress for navigation state. |
| **Target length** | 1,400-1,700 words |
| **Outline** | 1. Why hooks instead of render props: useSyncExternalStore, stable subscriptions, no re-render cascades. 2. useFormEngine: creating the engine, stable ref, subscription management. 3. useFieldValue: reactive access to a single field's value. Use case: building a live summary panel. 4. useSectionProgress: reactive navigation state. Use case: custom progress header. 5. Combining hooks for custom form UIs (headless usage). 6. Common patterns: conditional rendering based on field values, live previews, custom navigation. |
| **Code samples** | Each hook's usage. Custom summary panel. Custom progress header. Headless form example. |
| **Internal links** | `/docs/react/hooks`, `/docs/react/form-renderer`, `/docs/core-concepts/multi-step-forms` |
| **Cross-post to** | Dev.to |

---

### Week 24

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `multi-tenant-forms-saas` |
| **Title** | One Schema, Many Clients: Multi-Tenant Form Architecture |
| **Category** | Engineering |
| **Pillar** | Solve |
| **Tags** | `fieldcraft`, `saas`, `multi-tenant`, `architecture`, `forms` |
| **Primary keyword** | "multi-tenant forms react" |
| **Social hook** | "Your SaaS app serves 50 clients. Each wants a different intake form. Here's how to avoid building 50 forms." |
| **Description** | Architecture patterns for multi-tenant form systems. Schema storage, per-tenant customization, submission routing, and the FormBuilder for non-developer form creation. |
| **Target length** | 1,500-1,800 words |
| **Outline** | 1. The problem: SaaS apps need tenant-specific forms without per-tenant code. 2. Schema-per-tenant: store schemas in a database, load at runtime. 3. SchemaAdapter: CRUD for schema storage. 4. Template-based approach: start from a base template, allow tenant customizations. 5. Submission routing: each tenant's data goes to their database/webhook. 6. Theming per tenant: custom branding via CSS custom properties. 7. The FormBuilder (Pro): let non-developers create and edit forms visually. 8. Architecture diagram: schema DB -> renderer -> submission adapters. |
| **Code samples** | SchemaAdapter usage. Tenant-specific submission adapter. Dynamic schema loading. |
| **Internal links** | `/docs/core-concepts/schema-anatomy`, `/docs/submission/adapters-overview`, `/pro`, `/blog/dynamic-forms-json-react` |
| **Cross-post to** | Dev.to, LinkedIn |

---

### Week 25

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `form-engine-bundle-size` |
| **Title** | Shipping a Form Engine in Under 15 KB |
| **Category** | Engineering |
| **Pillar** | Think |
| **Tags** | `fieldcraft`, `performance`, `bundle-size`, `typescript`, `engineering` |
| **Primary keyword** | "react form bundle size" |
| **Social hook** | "44 field types, 19 validators, 16 condition operators, an expression parser, and a draft engine. Under 15 KB minified." |
| **Description** | How FieldCraft keeps its core bundle under 15 KB with one dependency (zod). Architecture decisions, tree-shaking, and what we chose NOT to include. |
| **Target length** | 1,300-1,600 words |
| **Outline** | 1. The constraint: a form engine shouldn't double your bundle. 2. One dependency: zod (for schema validation at creation time). 3. Pure TypeScript core: no DOM, no React, no CSS. 4. Tree-shakeable ESM: import only what you use. 5. What's NOT in the core (React components, adapters, templates — separate packages). 6. Architecture decisions that save bytes: pure functions over classes, no runtime type checking after schema validation, string-based condition operators. 7. Measuring: how to check your own bundle impact. |
| **Code samples** | Import analysis. Bundle size measurement commands. Tree-shaking example. |
| **Internal links** | `/docs/getting-started/installation`, `/blog/why-schema-driven` |
| **Cross-post to** | Hacker News, Reddit r/javascript |

---

### Week 26

| Field | Value |
|-------|-------|
| **Status** | `PENDING` |
| **Slug** | `form-templates-copy-paste-ship` |
| **Title** | 16 Free Form Templates: Copy the Schema, Ship the Form |
| **Category** | Guide |
| **Pillar** | Solve |
| **Tags** | `fieldcraft`, `templates`, `forms`, `react`, `free` |
| **Primary keyword** | "free form templates react" |
| **Social hook** | "16 production-ready form schemas. MIT licensed. Copy, paste, render." |
| **Description** | A tour of FieldCraft's 16 free form templates: contact forms, NPS surveys, job applications, event registrations, and more. Each schema is ready to drop into your React app. |
| **Target length** | 1,400-1,700 words |
| **Outline** | 1. Why templates: most forms are variations of the same 10 patterns. 2. How templates work: JSON schemas + metadata, import from @squaredr/fieldcraft-templates. 3. Tour each category with screenshots/descriptions: Contact (2), Feedback (2), Survey (2), HR (2), Healthcare (2), Events (2), Other (4). 4. Customizing a template: change fields, add sections, adjust validation. 5. Using templates as starting points for the FormBuilder (Pro). 6. Contributing your own template (MIT, open to PRs). |
| **Code samples** | Import and render a template. Customizing a template schema. Template metadata structure. |
| **Internal links** | `/templates`, `/docs/getting-started/your-first-form`, `/pro` |
| **Cross-post to** | Dev.to, Reddit r/reactjs, Product Hunt (if timing aligns) |

---

## Cross-Posting Checklist

For each post cross-posted to Dev.to:
1. Use the canonical URL: `https://fieldcraft.squaredr.tech/blog/{slug}`
2. Add Dev.to-specific tags (max 4): `react`, `typescript`, `webdev`, `tutorial`
3. Remove FieldCraft-specific internal links and replace with full URLs

For Reddit/HN submissions:
1. Use the blog URL directly, not a self-post
2. Title should be the social hook, not the SEO title
3. Don't mention FieldCraft in the Reddit/HN title — let the content speak

---

## Distribution Schedule

| Platform | Frequency | Day |
|----------|-----------|-----|
| Blog (primary) | Weekly | Monday |
| Dev.to (cross-post) | Every post | Tuesday (day after) |
| Twitter/X thread | 2x/month | Wednesday |
| Reddit r/reactjs | 2x/month | Thursday |
| LinkedIn article | 1x/month | Friday |
| Hacker News | 1x/month (only Think/Engineering posts) | Weekday morning |

---

## Tracking

Update the Status column as you publish:

- `PENDING` — not started
- `DRAFTED` — written, not published
- `PUBLISHED` — live on the blog
- `CROSS-POSTED` — also live on Dev.to / social
- `SKIPPED` — deliberately skipped (add reason)
