# FieldCraft Website — Rebuild Plan

## Context

The marketing website at `formengine/website/` was built in a rush with several structural and quality issues:

1. **Flat component layout** — all 11 homepage sections sit at the same level as Nav, Footer, Logo
2. **Multi-component files** — `HeroTabs.tsx` has 3 components; `ProductionSchemas/index.tsx` has 6+
3. **No real interactivity** — live demos are fake (manual `useState` simulations, not real `FormEngineRenderer`); Pro section is a static HTML mockup; theme toggle is unstyled text
4. **No syntax highlighting** — code previews are hand-coded `<span>` trees
5. **No scroll animations** — sections appear statically with no entrance transitions
6. **Poor visual polish** — theme toggle is plain text, code wraps randomly

This rebuild restructures the codebase, adds real interactivity, and brings the site to production quality.

## User Requirements (Confirmed)

- **Pro section**: Use the real `@squaredr/fieldcraft-pro` `FormBuilder` component with `FieldCraftProProvider` and a license key from `.env`
- **Live demos**: Real `FormEngineRenderer` with real schemas, all 4 demos, inline JSON result on submit
- **Code highlighting**: Shiki (available via fumadocs)
- **Theme toggle**: Slide switch with lightbulb icons (bulb-on = light, filled/off = dark), no text
- **Scroll animations**: IO-based fade-up (16px translate, opacity 0→1) on each section
- **Motion**: 120ms hover, 200ms enter, 160ms theme — plus polished scroll-triggered section reveals
- **Thin client layers**: Server components for content/structure (crawlable), small `"use client"` children for interactivity only
- **One component per file** — no exceptions
- **Directory structure**: Hybrid (page-based + shared), logical grouping

---

## Target Directory Structure

```
components/
├── layout/                          # Site-wide layout
│   ├── Nav/
│   │   ├── index.tsx                # Server shell
│   │   └── styles.css
│   ├── Footer/
│   │   ├── index.tsx
│   │   └── styles.css
│   └── ThemeToggle/
│       ├── index.tsx                # "use client" — slide switch + lightbulb icons
│       └── styles.css
├── shared/                          # Reusable across pages
│   ├── Logo/
│   │   ├── index.tsx
│   │   └── styles.css
│   ├── CopyInstall/
│   │   ├── index.tsx                # "use client" — click-to-copy
│   │   └── styles.css
│   ├── ScrollReveal/
│   │   ├── index.tsx                # "use client" — IO fade-up wrapper (NEW)
│   │   └── styles.css
│   ├── CodeBlock/
│   │   ├── index.tsx                # Server component — Shiki highlighting (NEW)
│   │   ├── CodeBlockClient.tsx      # "use client" — Shiki for tabbed contexts (NEW)
│   │   └── styles.css
│   └── SubmissionResult/
│       ├── index.tsx                # Moved from loose file, restyled for Drafting Teal
│       └── styles.css
├── homepage/                        # All 11 homepage sections
│   ├── Hero/
│   │   ├── index.tsx                # Server component
│   │   ├── HeroTabs.tsx             # "use client" — tab switcher only
│   │   ├── SchemaPanel.tsx          # Schema JSON display (uses CodeBlockClient)
│   │   ├── RenderedPanel.tsx        # Rendered form mockup
│   │   ├── SpecStrip.tsx            # 5-column stats
│   │   └── styles.css
│   ├── ProblemSection/
│   │   ├── index.tsx                # Server component
│   │   └── styles.css
│   ├── HowItWorks/
│   │   ├── index.tsx                # Server component
│   │   └── styles.css
│   ├── Architecture/
│   │   ├── index.tsx                # Server component
│   │   └── styles.css
│   ├── LiveDemos/
│   │   ├── index.tsx                # Server component (eyebrow, h2)
│   │   ├── LiveDemosTabs.tsx        # "use client" — tab switching + demo rendering
│   │   ├── styles.css
│   │   └── demos/
│   │       ├── MultiStepDemo.tsx    # "use client" — real FormEngineRenderer
│   │       ├── ConditionalDemo.tsx  # "use client" — real FormEngineRenderer
│   │       ├── ValidationDemo.tsx   # "use client" — real FormEngineRenderer
│   │       └── ComputedDemo.tsx     # "use client" — real FormEngineRenderer
│   ├── BatteriesIncluded/
│   │   ├── index.tsx                # Server component
│   │   └── styles.css
│   ├── SubmissionPipeline/
│   │   ├── index.tsx                # Server component
│   │   └── styles.css
│   ├── ComparisonTable/
│   │   ├── index.tsx                # Server component
│   │   └── styles.css
│   ├── ProductionSchemas/
│   │   ├── index.tsx                # Server component (eyebrow, h2, sidebar)
│   │   ├── SchemaTabs.tsx           # "use client" — tab switching + CodeBlockClient
│   │   └── styles.css
│   ├── ProSection/
│   │   ├── index.tsx                # Server component (eyebrow, h2, description, footer)
│   │   ├── ProBuilder.tsx           # "use client" — real FormBuilder + FieldCraftProProvider
│   │   └── styles.css
│   ├── Pricing/
│   │   ├── index.tsx                # Server component
│   │   └── styles.css
│   └── FinalCta/
│       ├── index.tsx                # Server component
│       └── styles.css
```

---

## Pre-Step: Save Plan to CWD

Copy this plan to `formengine/.plan/website-rebuild-plan.md` so it's always accessible during implementation.

---

## Implementation Phases

### Phase 1: Restructure Directories & Fix Imports

**Goal**: Move all components into the new structure. Build must pass at the end.

**Steps**:

1. Create directories: `components/layout/`, `components/shared/`, `components/homepage/`

2. Move files:

| Source | Destination |
|--------|-------------|
| `components/Nav/` | `components/layout/Nav/` |
| `components/Footer/index.tsx + styles.css` | `components/layout/Footer/` |
| `components/shared/ThemeToggle/` | `components/layout/ThemeToggle/` |
| `components/shared/Logo/` | stays `components/shared/Logo/` |
| `components/shared/CopyInstall/` | stays `components/shared/CopyInstall/` |
| `components/SubmissionResult.tsx` | `components/shared/SubmissionResult/index.tsx` + new `styles.css` |
| `components/Hero/` | `components/homepage/Hero/` |
| `components/ProblemSection/` | `components/homepage/ProblemSection/` |
| `components/HowItWorks/` | `components/homepage/HowItWorks/` |
| `components/Architecture/` | `components/homepage/Architecture/` |
| `components/LiveDemos/` | `components/homepage/LiveDemos/` |
| `components/BatteriesIncluded/` | `components/homepage/BatteriesIncluded/` |
| `components/SubmissionPipeline/` | `components/homepage/SubmissionPipeline/` |
| `components/ComparisonTable/` | `components/homepage/ComparisonTable/` |
| `components/ProductionSchemas/` | `components/homepage/ProductionSchemas/` |
| `components/ProSection/` | `components/homepage/ProSection/` |
| `components/Pricing/` | `components/homepage/Pricing/` |
| `components/FinalCta/` | `components/homepage/FinalCta/` |

3. Delete: `components/Footer.tsx` (old standalone, unused after move)

4. Update all import paths in:
   - `app/page.tsx` — all 13 section imports → `@/components/homepage/X` or `@/components/layout/X`
   - `app/demo/[id]/page.tsx` — Footer → `@/components/layout/Footer`, SubmissionResult → `@/components/shared/SubmissionResult`
   - `components/layout/Nav/index.tsx` — Logo → `@/components/shared/Logo`, ThemeToggle → `@/components/layout/ThemeToggle`
   - `components/layout/Footer/index.tsx` — Logo and ThemeToggle imports

5. Update CSS `@reference` paths in all `styles.css` files:
   - `components/layout/*/styles.css` → `@reference "../../../app/globals.css";`
   - `components/shared/*/styles.css` → `@reference "../../../app/globals.css";`
   - `components/homepage/*/styles.css` → `@reference "../../../app/globals.css";`

6. Verify: `pnpm build` passes

**Critical files**:
- `a:\products\questionnaire\formengine\website\app\page.tsx`
- `a:\products\questionnaire\formengine\website\app\demo\[id]\page.tsx`

---

### Phase 2: Fix Shared Components

#### 2a. ThemeToggle — Slide Switch with Lightbulb Icons

**File**: `components/layout/ThemeToggle/index.tsx`

Replace the current text-based LIGHT|DARK toggle with:
- A slide switch track (32×16px, pill-shaped, `--rule` bg)
- A knob (12×12px circle, `--ink` fill) that slides left↔right
- Lightbulb-on SVG icon on the left side (outlined, 14×14)
- Lightbulb-off SVG icon on the right side (filled, 14×14)
- Icons in `--muted` color
- `role="switch"`, `aria-checked`, `aria-label` for accessibility
- Knob position controlled by CSS class (`fc-theme-toggle__knob--dark` adds `translateX(16px)`)
- Transitions use `var(--motion-theme)` (160ms ease)

Logic stays the same: reads from `localStorage['fieldcraft-theme']`, falls back to `prefers-color-scheme`, sets `data-theme` on `<html>`.

#### 2b. ScrollReveal — IO-Based Fade-Up Wrapper

**New file**: `components/shared/ScrollReveal/index.tsx` + `styles.css`

- `"use client"` component
- Uses `IntersectionObserver` with `threshold: 0.15`
- Starts with `opacity: 0; transform: translateY(16px)`
- When intersecting: adds `fc-revealed` class → `opacity: 1; transform: translateY(0)`
- One-shot: `observer.unobserve(el)` after reveal
- Transitions use `var(--motion-enter)` (200ms ease-out)
- Accepts `delay` prop (ms) for stagger effects
- Accepts `className` prop for pass-through

#### 2c. CodeBlock — Shiki Syntax Highlighting

**New files**: `components/shared/CodeBlock/index.tsx`, `CodeBlockClient.tsx`, `styles.css`

**Server variant** (`index.tsx`):
- Async server component
- Uses Shiki via `createHighlighter` from `shiki` package (already a peer dep of fumadocs-core)
- Renders syntax-highlighted HTML with `hast-util-to-jsx-runtime`
- Themes: `vitesse-light` / `vitesse-dark` (close to Drafting Teal palette)
- CSS overrides token colors to match `--teal` (keys), `--amber-ink` (strings), `--muted` (punctuation)

**Client variant** (`CodeBlockClient.tsx`):
- `"use client"` for use inside tab-switched contexts (HeroTabs, SchemaTabs)
- Lazy-loads Shiki highlighter on mount, caches the instance
- Same visual output as server variant

**Dependencies to add**: `shiki`, `hast-util-to-jsx-runtime`

---

### Phase 3: Split Multi-Component Files

#### 3a. Hero — Split `HeroTabs.tsx` into 3 files

**Current**: `HeroTabs.tsx` contains `SchemaPanel`, `RenderedPanel`, `HeroTabs` (3 components)

**After**:
- `components/homepage/Hero/HeroTabs.tsx` — tab container + switching logic only (`"use client"`)
- `components/homepage/Hero/SchemaPanel.tsx` — JSON code display, uses `CodeBlockClient` from shared
- `components/homepage/Hero/RenderedPanel.tsx` — static rendered form mockup

`HeroTabs` imports and renders `SchemaPanel` / `RenderedPanel` based on active tab. Add a `key={tab}` on the panel wrapper to trigger CSS enter animation on tab switch.

#### 3b. ProductionSchemas — Split into 2 files

**Current**: `index.tsx` has `K`, `S`, `P` helper components + `EventRegistrationSchema` + `PatientIntakeSchema` + `ProductionSchemas` (6 components in one file)

**After**:
- `components/homepage/ProductionSchemas/index.tsx` — server component (eyebrow, h2, sidebar layout)
- `components/homepage/ProductionSchemas/SchemaTabs.tsx` — `"use client"` (tab switching + CodeBlockClient for both schemas)

The hand-coded JSON rendering helpers (`K`, `S`, `P`) and schema components are deleted entirely — replaced by `CodeBlockClient` with actual JSON strings and Shiki highlighting.

---

### Phase 4: Real Integrations

#### 4a. Live Demos — Real FormEngineRenderer

**New schemas** in `schemas/`:
- `homepage-multistep.ts` — 3-step form (name, email, team size, project, review)
- `homepage-conditional.ts` — conference registration with dinner/dietary/workshop conditionals
- `homepage-validation.ts` — email + licence key with pattern validation
- `homepage-computed.ts` — seat calculator with computed subtotal/discount/total

Each uses `FormEngineSchema` type, `sections` array, `submitAction: { type: "callback" }`.

**Rewrite demo components** in `components/homepage/LiveDemos/demos/`:

Each becomes a thin `"use client"` wrapper:
```tsx
'use client';
import { FormEngineRenderer } from '@squaredr/fieldcraft-react';
import { schema } from '@/schemas/homepage-multistep';
// ... useState for result, onSubmit callback, inline result display
```

On submit: show `JSON.stringify(result.values, null, 2)` in a styled `<pre>` block below the form. "Try again" button resets.

**Split LiveDemos section**:
- `index.tsx` — server component (eyebrow, h2, description text)
- `LiveDemosTabs.tsx` — `"use client"` (4-tab strip + renders active demo component)

#### 4b. Pro Section — Real FormBuilder with License

**Setup**:
1. Add to `website/package.json`: `"@squaredr/fieldcraft-pro": "file:../../fieldcraft-pro/packages/pro"`
2. Add to `next.config.mjs` `transpilePackages`: `'@squaredr/fieldcraft-pro'`
3. Ensure Pro is built first (`dist/` exists with `styles.css`, `index.mjs`, etc.)

**New file**: `components/homepage/ProSection/ProBuilder.tsx`
```tsx
'use client';
import { FormBuilder, FieldCraftProProvider } from '@squaredr/fieldcraft-pro';
import { squaredrDarkPreset } from '@squaredr/fieldcraft-pro';
import '@squaredr/fieldcraft-pro/styles.css';

const licenseKey = process.env.NEXT_PUBLIC_FC_PRO_LICENSE_KEY!;

export function ProBuilder() {
  return (
    <FieldCraftProProvider licenseKey={licenseKey}>
      <div className="fc-pro__builder-wrapper">
        <FormBuilder height="500px" theme={squaredrDarkPreset} />
      </div>
    </FieldCraftProProvider>
  );
}
```

**Update**: `components/homepage/ProSection/index.tsx`
- Server component with eyebrow, h2, description text, footer strip
- Renders `<ProBuilder />` as the client child
- Delete ALL old static mockup JSX (palette, canvas, inspector HTML)
- Delete all old mockup CSS classes from `styles.css`

**Env**: User will add `NEXT_PUBLIC_FC_PRO_LICENSE_KEY=FC-PRO-...` to `.env.local`

#### 4c. Shiki Code Highlighting in Hero + ProductionSchemas

**Hero SchemaPanel**: Replace hand-coded `<span>` tree with `CodeBlockClient` rendering a JSON string.

**ProductionSchemas SchemaTabs**: Replace `EventRegistrationSchema` and `PatientIntakeSchema` components with `CodeBlockClient` instances rendering actual JSON strings. Tab switching passes different `code` and `lang` props.

---

### Phase 5: Animation Layer

#### 5a. ScrollReveal on All Below-Fold Sections

In `app/page.tsx`, wrap each section except Hero with `<ScrollReveal>`:
```tsx
<Hero />  {/* Above fold — no reveal */}
<ScrollReveal><ProblemSection /></ScrollReveal>
<ScrollReveal><HowItWorks /></ScrollReveal>
{/* ... all remaining sections ... */}
```

#### 5b. Tab Transition Animations

For HeroTabs, LiveDemosTabs, SchemaTabs — add a CSS animation on panel switch:
```css
@keyframes fc-tab-enter {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
```
Use `key={activeTab}` on the panel wrapper to trigger re-mount and animation.

#### 5c. Hover & Focus Micro-Interactions

Verify every button, link, tab, and interactive element has:
- Hover: color/bg transition using `var(--motion-hover)` (120ms linear)
- Focus-visible: 1.5px `--teal` border + 3px teal ring
- Theme switch: bg/color transitions using `var(--motion-theme)` (160ms ease)

---

### Phase 6: Polish & Verify

#### 6a. SubmissionResult Restyle
- Move to `components/shared/SubmissionResult/`
- Remove lucide-react icons
- Restyle with `fc-` prefixed Drafting Teal classes
- Create `styles.css`

#### 6b. Demo Route Update
- Update import paths in `app/demo/[id]/page.tsx`
- Consider removing framer-motion (replace with CSS transitions)

#### 6c. Dependencies
- Add: `shiki`, `hast-util-to-jsx-runtime`, `@squaredr/fieldcraft-pro` (file: link)
- Evaluate removing: `framer-motion` (if demo route can use CSS), `lucide-react` (if SubmissionResult no longer needs it)

#### 6d. Dead CSS Audit
- Remove all old ProSection mockup CSS classes
- Remove ProductionSchemas helper component CSS (`.fc-schemas__key`, `.fc-schemas__str`, `.fc-schemas__pun`)
- Remove Hero hand-coded JSON CSS (`.fc-hero-code__key`, `.fc-hero-code__string`, `.fc-hero-code__punct`)
- Grep for any `fc-` classes defined in CSS but not used in JSX

#### 6e. Build & Visual Verification

Run `pnpm build` — fix any errors.

Visual checklist:
- [ ] Theme toggle slides and persists to localStorage
- [ ] All 4 demo tabs switch and render real forms
- [ ] Demos submit and show inline JSON result
- [ ] Hero schema/rendered tabs switch with animation
- [ ] ProductionSchemas tabs switch with animation
- [ ] Pro section shows real FormBuilder (drag works, inspector works)
- [ ] Code blocks have Shiki syntax highlighting
- [ ] Scroll reveal triggers on each section entering viewport
- [ ] Dark mode: all sections render correctly
- [ ] Light mode: all sections render correctly
- [ ] No console errors
- [ ] Focus rings visible on keyboard navigation

---

## Execution Order & Dependencies

```
Phase 1 (restructure)
  └─→ Phase 2 (shared: ThemeToggle, ScrollReveal, CodeBlock)
       └─→ Phase 3 (split multi-component files)
            └─→ Phase 4 (real integrations: demos, Pro, Shiki)
                 └─→ Phase 5 (animations)
                      └─→ Phase 6 (polish & verify)
```

Each phase depends on the previous. Build verification at the end of each phase.

---

## Key Files to Modify

| File | Change |
|------|--------|
| `app/page.tsx` | Update all imports, add ScrollReveal wrappers |
| `app/demo/[id]/page.tsx` | Update import paths |
| `package.json` | Add shiki, hast-util-to-jsx-runtime, @squaredr/fieldcraft-pro |
| `next.config.mjs` | Add @squaredr/fieldcraft-pro to transpilePackages |
| `components/layout/ThemeToggle/index.tsx` | Complete rewrite → slide switch |
| `components/homepage/Hero/HeroTabs.tsx` | Split into 3 files + use CodeBlockClient |
| `components/homepage/ProductionSchemas/index.tsx` | Split into 2 files + use CodeBlockClient |
| `components/homepage/LiveDemos/` | Split index + rewrite all 4 demos with FormEngineRenderer |
| `components/homepage/ProSection/` | Delete mockup, add ProBuilder with real FormBuilder |
| All 17 `styles.css` files | Update `@reference` paths |

## New Files to Create

| File | Purpose |
|------|---------|
| `components/shared/ScrollReveal/index.tsx` + `styles.css` | IO fade-up wrapper |
| `components/shared/CodeBlock/index.tsx` | Server Shiki component |
| `components/shared/CodeBlock/CodeBlockClient.tsx` | Client Shiki component |
| `components/shared/CodeBlock/styles.css` | Code block styling |
| `components/shared/SubmissionResult/styles.css` | SubmissionResult restyled |
| `components/homepage/Hero/SchemaPanel.tsx` | Extracted from HeroTabs |
| `components/homepage/Hero/RenderedPanel.tsx` | Extracted from HeroTabs |
| `components/homepage/ProductionSchemas/SchemaTabs.tsx` | Extracted client component |
| `components/homepage/ProSection/ProBuilder.tsx` | Real FormBuilder wrapper |
| `components/homepage/LiveDemos/LiveDemosTabs.tsx` | Tab switcher for demos |
| `schemas/homepage-multistep.ts` | Multi-step demo schema |
| `schemas/homepage-conditional.ts` | Conditional demo schema |
| `schemas/homepage-validation.ts` | Validation demo schema |
| `schemas/homepage-computed.ts` | Computed fields demo schema |
| `.env.local` | `NEXT_PUBLIC_FC_PRO_LICENSE_KEY=...` (user provides) |

## Verification

1. `pnpm build` in `formengine/website/` — passes clean
2. `pnpm dev` — open browser, verify all 11 sections render
3. Theme toggle: click → dark mode, reload → persists, click → light mode
4. Hero tabs: click schema.json → code with syntax highlighting; click rendered → form mockup
5. Live demos: switch all 4 tabs, fill out forms, submit → see inline JSON
6. Pro section: FormBuilder renders, can drag fields, inspector shows
7. ProductionSchemas: switch event-registration ↔ patient-intake tabs → syntax-highlighted JSON
8. Scroll: sections fade up as they enter viewport
9. Accessibility: tab through all interactive elements, focus rings visible
10. No console errors in dev tools
