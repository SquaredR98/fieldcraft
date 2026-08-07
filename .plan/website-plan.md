# FieldCraft Website — Implementation Plan

## Context

The existing `formengine/demo/` is a minimal Next.js gallery app (3 components, 10 demo schemas, 2 routes). It needs to be replaced with a full marketing website + documentation site at `fieldcraft.squaredr.tech`. A complete design handoff exists at `design_handoff_fieldcraft_brand/` with:
- HTML prototypes (pixel-accurate reference for 11 sections)
- Design tokens (`tokens.css` + `tokens.ts`) — drop-in files
- Brand identity doc with exact specs for typography, spacing, colors, motion
- A `CLAUDE.md` with design system rules

The design system is called **"Drafting Teal"** — technical-drafting aesthetic with hairline rules, sharp corners, a 24px drafting grid, mono annotation labels, no shadows. Two themes (light/dark) sharing the same hues with inverted lightness.

## Approach

Rename `demo/` to `website/`, keep it as a Next.js app in the monorepo, add Fumadocs for the `/docs` routes, and build the marketing homepage as a custom page following the design handoff pixel-accurately.

**Tailwind 4 + `@apply` in co-located CSS files.** Every component gets its own directory:
```
components/Hero/
├── index.tsx      # Clean JSX with semantic class names only
└── styles.css     # All styling via @apply + CSS custom properties
```

The design tokens (`--teal`, `--surface`, `--rule`, etc.) are CSS custom properties from `tokens.css`. Tailwind handles layout (`@apply flex grid gap-4`), and token vars handle colors/borders. No utility class bloat in JSX — classes are semantic (`fc-eyebrow`, `fc-hero-title`, `fc-nav-link`).

Fumadocs docs pages use Fumadocs' own Tailwind-based styling with our token variables overriding Fumadocs color variables for brand consistency.

## File Structure (After)

```
formengine/website/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, RootProvider, theme script
│   ├── page.tsx                      # Marketing homepage (composes section components)
│   ├── globals.css                   # tokens.css + Fumadocs imports + base reset
│   ├── (home)/
│   │   └── blog/
│   │       ├── page.tsx              # Blog index
│   │       └── [slug]/page.tsx       # Blog post
│   ├── docs/
│   │   ├── layout.tsx                # Fumadocs DocsLayout
│   │   └── [[...slug]]/page.tsx      # Fumadocs catch-all
│   ├── demo/
│   │   └── [id]/page.tsx             # Preserved: individual demo routes
│   └── api/
│       └── search/route.ts           # Fumadocs search API
├── components/
│   ├── shared/
│   │   ├── Logo/
│   │   │   ├── index.tsx
│   │   │   └── styles.css
│   │   ├── ThemeToggle/
│   │   │   ├── index.tsx
│   │   │   └── styles.css
│   │   └── CopyInstall/
│   │       ├── index.tsx
│   │       └── styles.css
│   ├── Nav/
│   │   ├── index.tsx
│   │   └── styles.css
│   ├── Hero/
│   │   ├── index.tsx                 # Hero section: eyebrow, h1, CTA, badges
│   │   ├── HeroTabs.tsx              # schema.json / rendered tab switcher
│   │   ├── SpecStrip.tsx             # 5-column stats strip below hero
│   │   └── styles.css
│   ├── ProblemSection/
│   │   ├── index.tsx
│   │   └── styles.css
│   ├── HowItWorks/
│   │   ├── index.tsx
│   │   └── styles.css
│   ├── Architecture/
│   │   ├── index.tsx
│   │   └── styles.css
│   ├── LiveDemos/
│   │   ├── index.tsx                 # Tab strip + layout
│   │   ├── styles.css
│   │   └── demos/
│   │       ├── MultiStepDemo.tsx
│   │       ├── ConditionalDemo.tsx
│   │       ├── ValidationDemo.tsx
│   │       └── ComputedDemo.tsx
│   ├── BatteriesIncluded/
│   │   ├── index.tsx
│   │   └── styles.css
│   ├── SubmissionPipeline/
│   │   ├── index.tsx
│   │   └── styles.css
│   ├── ComparisonTable/
│   │   ├── index.tsx
│   │   └── styles.css
│   ├── ProductionSchemas/
│   │   ├── index.tsx
│   │   └── styles.css
│   ├── ProSection/
│   │   ├── index.tsx
│   │   └── styles.css
│   ├── Pricing/
│   │   ├── index.tsx
│   │   └── styles.css
│   ├── FinalCta/
│   │   ├── index.tsx
│   │   └── styles.css
│   ├── Footer/
│   │   ├── index.tsx
│   │   └── styles.css
│   └── SubmissionResult.tsx          # Preserved from demo (used in /demo routes)
├── content/
│   ├── docs/                         # MDX documentation files (Fumadocs source)
│   │   ├── index.mdx                 # Getting started
│   │   ├── meta.json                 # Sidebar ordering
│   │   └── ...                       # Future docs
│   └── blog/                         # MDX blog posts
├── lib/
│   ├── source.ts                     # Fumadocs loader config
│   ├── tokens.ts                     # Design tokens (copied from handoff)
│   └── layout.shared.tsx             # Shared Fumadocs layout options
├── schemas/                          # Preserved: 10 demo schemas
├── public/
├── source.config.ts                  # Fumadocs MDX source config
├── next.config.mjs                   # Next.js + Fumadocs MDX plugin
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Implementation Steps

### Phase 1: Scaffold — Rename & Restructure

1. **Rename `demo/` to `website/`**
   - `git mv formengine/demo formengine/website`
   - Update `pnpm-workspace.yaml`: change `"demo"` to `"website"`
   - Update `package.json` name: `@squaredr/fieldcraft-demo` → `@squaredr/fieldcraft-website`
   - Update `turbo.json` if it references demo

2. **Install Fumadocs packages**
   - `pnpm add fumadocs-mdx fumadocs-core fumadocs-ui @types/mdx` in `website/`
   - `pnpm add zod` (for blog schema validation)

3. **Set up Fumadocs source config**
   - Create `website/source.config.ts` with `defineDocs` + `defineCollections` for blog
   - Update `next.config.mjs` to use `createMDX` from `fumadocs-mdx/next`
   - Create `website/lib/source.ts` with loaders

4. **Create content directories**
   - `website/content/docs/index.mdx` (placeholder getting started)
   - `website/content/docs/meta.json` (sidebar order)
   - `website/content/blog/` (empty for now)

5. **Set up docs routes**
   - `website/app/docs/layout.tsx` — Fumadocs DocsLayout
   - `website/app/docs/[[...slug]]/page.tsx` — catch-all MDX renderer
   - `website/app/api/search/route.ts` — search endpoint

6. **Verify build** — `pnpm build` in website, confirm no errors

### Phase 2: Design System — Tokens & Base Styles

7. **Drop in design tokens**
   - Copy `tokens.css` from handoff → `website/app/globals.css` (replace existing)
   - Copy `tokens.ts` from handoff → `website/lib/tokens.ts`
   - Add Google Fonts link (Space Grotesk, IBM Plex Sans, IBM Plex Mono) to layout

8. **Update root layout**
   - Remove old dark-mode-only class, use `data-theme` attribute
   - Add theme initialization script (check localStorage → prefers-color-scheme → default light)
   - Set up font CSS variables (`--font-display`, `--font-body`, `--font-mono`)
   - Wrap children in Fumadocs `RootProvider`

9. **Add Fumadocs CSS imports to globals.css**
   - Import `fumadocs-ui/css/neutral.css` and `fumadocs-ui/css/preset.css`
   - Override Fumadocs variables with our design tokens where needed

10. **Verify build** — confirm tokens load, theme switching works

### Phase 3: Shared Components

11. **Logo** (`components/shared/Logo/`)
    - Three stacked bars (18x5px nav scale): outlined ink, filled ink, outlined amber
    - Wordmark: "FieldCraft" Space Grotesk 600, -0.02em, 16px
    - Endorsement: "BY SQUAREDR" IBM Plex Mono, 0.2em, uppercase, 8.5px, --muted

12. **ThemeToggle** (`components/shared/ThemeToggle/`)
    - Two-cell bordered switch: LIGHT | DARK
    - Active cell: `--ink` bg, `--bg` text
    - Reads/writes `localStorage['fieldcraft-theme']` + `data-theme` on `<html>`

13. **Nav** (`components/Nav/`)
    - Sticky, 64px height, `--surface` bg, bottom hairline
    - Logo left; links (Layers, Demos, Features, Pro, Pricing) in `--muted` → `--ink` hover
    - ThemeToggle + primary teal CTA "Read the docs →"
    - Links are anchor hrefs to section IDs on the homepage

14. **Footer** (`components/Footer/`)
    - `--surface` bg, 4 columns (brand, Product, Open source, Legal)
    - Bottom bar: © + theme toggle
    - Replace old demo Footer

### Phase 4: Marketing Homepage — Section by Section

Each section is a component directory with `index.tsx` + `styles.css`.

15. **Hero** — Grid 1.02fr 1fr, gap 56px, padding 88/40/80. Left: teal eyebrow, h1, subtitle, CTA + CopyInstall, badges. Right: HeroTabs. Below: SpecStrip.

16. **ProblemSection** — 3-column hairline grid: Rented / Licensed / Rebuilt. Teal callout.

17. **HowItWorks** — 3 columns with numbered chips, code blocks.

18. **Architecture** — Grid 1.15fr 1fr: nested layer boxes + info panel.

19. **LiveDemos** — 4-tab strip + 2-column body. 4 interactive demo sub-components.

20. **BatteriesIncluded** — 2x2 hairline grid: 4 feature cards with teal badges.

21. **SubmissionPipeline** — 4-column hairline grid: http, supabase, postgres, webhook.

22. **ComparisonTable** — 4-column table with FieldCraft wash column. 6 rows.

23. **ProductionSchemas** — Tabbed JSON viewer + explainer panel.

24. **ProSection** — Builder mockup: 3-pane window frame + footer strip.

25. **Pricing** — 2 main cards ($0 / $99) + 2 secondary (Telehealth / Admin). Legal footnote.

26. **FinalCta** — Grid: heading + buttons left, 4-package list right.

### Phase 5: Demo Gallery Integration

27. **Preserve demo routes** — Keep `/demo/[id]` with FormEngineRenderer. Restyle with Drafting Teal tokens.

### Phase 6: Blog Setup

28. **Blog collection** — `defineCollections` with author + date schema.
29. **Blog routes** — Index grid page + individual post page with TOC.

### Phase 7: Polish & Responsive

30. **Breakpoints** — 2-col → 1-col @ 1024px; 3/4-col → 2-up @ 900px, 1-up @ 640px.
31. **Motion** — 120ms hover, 200ms enter, 160ms theme. No bounce, no scale.
32. **Accessibility** — Focus ring, keyboard nav, semantic HTML.

### Phase 8: Verify & Clean Up

33. **Build check** — `pnpm build` + all routes working.
34. **Clean up** — Remove framer-motion, AnimatedCards, old dark theme.

## Design System Rules (From Handoff)

- All color from CSS custom properties in tokens.css — never hard-code hex
- Structure via 1px `var(--rule)` hairlines — no drop shadows, no gradients
- Corners: 2-4px radius. Pills (999px) only for small badges
- `--teal` is the ONLY interactive color. `--amber` marks Pro/paid only
- Dark mode: `data-theme="dark"` on `<html>`, same hues inverted lightness
- Fonts: Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (labels/code)
- Uppercase mono labels replace icons — NO icon library
- Theme toggle is mono LIGHT | DARK text switch, never sun/moon
- Motion: 120ms linear hover, 200ms ease-out enter. No bounce, no scale
- Copy voice: dry, precise, engineer-to-engineer. No exclamation points, no "effortless"

## Verification

1. `pnpm build` in `formengine/` — all packages including website build
2. `pnpm dev` in `website/` — open browser, verify:
   - All 11 marketing sections render pixel-accurately vs HTML prototype
   - Theme toggle persists across refresh
   - Copy-to-clipboard works on install chip
   - All 4 interactive demos work (multi-step, conditional, validation, computed)
   - `/docs` route shows Fumadocs with placeholder content
   - `/demo/[id]` routes still render forms with FormEngineRenderer
3. Cross-check: open `FieldCraft Site.dc.html` in browser side-by-side with dev server

## Design Reference Files

All design source files are at `a:\products\questionnaire\design_handoff_fieldcraft_brand\`:
- `README.md` — Full design spec (typography tables, spacing, interactions, section descriptions)
- `tokens.css` — Drop-in CSS custom properties (light + dark themes)
- `tokens.ts` — TypeScript mirror of tokens
- `FieldCraft Site.dc.html` — Full homepage prototype (open in browser for pixel reference)
- `FieldCraft Brand Identity.dc.html` — Brand boards, component specs, state tables
- `CLAUDE.md` — Design system rules for LLM sessions
- `support.js` — Prototype runtime (not needed in production)
