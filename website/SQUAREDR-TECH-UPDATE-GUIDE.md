# squaredr.tech Migration Guide

FieldCraft is moving from squaredr.tech pages to its own subdomain at
**fieldcraft.squaredr.tech**. This document covers everything you need to
change on squaredr.tech so existing visitors and search engine links land
on the new site without broken pages.

---

## Step 1: Add Redirects in next.config.mjs

Replace the existing FieldCraft redirects in `next.config.mjs` with
permanent (301) redirects to the subdomain.

**File:** `squaredr.tech/next.config.mjs`

```js
async redirects() {
  return [
    // ── FieldCraft product page → subdomain homepage ──
    {
      source: '/products/fieldcraft',
      destination: 'https://fieldcraft.squaredr.tech',
      permanent: true,
    },

    // ── Roadmap ──
    {
      source: '/products/fieldcraft/roadmap',
      destination: 'https://fieldcraft.squaredr.tech/roadmap',
      permanent: true,
    },

    // ── Docs catch-all ──
    // squaredr.tech docs use:       /products/fieldcraft/docs/{section}/{slug}
    // fieldcraft.squaredr.tech uses: /docs/{section}/{slug}
    {
      source: '/products/fieldcraft/docs',
      destination: 'https://fieldcraft.squaredr.tech/docs',
      permanent: true,
    },
    {
      source: '/products/fieldcraft/docs/:path*',
      destination: 'https://fieldcraft.squaredr.tech/docs/:path*',
      permanent: true,
    },

    // ── Old template routes (already redirected internally before) ──
    {
      source: '/templates',
      destination: 'https://fieldcraft.squaredr.tech/templates',
      permanent: true,
    },
    {
      source: '/templates/:slug',
      destination: 'https://fieldcraft.squaredr.tech/templates/:slug',
      permanent: true,
    },

    // ── Old pack/addon pages → subdomain homepage ──
    {
      source: '/products/fieldcraft/admin-pro',
      destination: 'https://fieldcraft.squaredr.tech',
      permanent: true,
    },
    {
      source: '/products/fieldcraft/templates',
      destination: 'https://fieldcraft.squaredr.tech/templates',
      permanent: true,
    },
    {
      source: '/products/fieldcraft/ecommerce-pack',
      destination: 'https://fieldcraft.squaredr.tech',
      permanent: true,
    },
    {
      source: '/products/fieldcraft/healthcare-pack',
      destination: 'https://fieldcraft.squaredr.tech',
      permanent: true,
    },
    {
      source: '/products/fieldcraft/hr-pack',
      destination: 'https://fieldcraft.squaredr.tech',
      permanent: true,
    },

    // ── Non-FieldCraft redirects (keep as-is) ──
    { source: '/products/framecraft', destination: '/', permanent: true },
    { source: '/products/shopcraft', destination: '/', permanent: true },
    { source: '/demos/:path*', destination: '/', permanent: true },
  ]
},
```

### Doc Path Mapping Reference

The `:path*` catch-all handles these automatically, but here is the full
mapping for reference. squaredr.tech strips `/products/fieldcraft` and the
subdomain docs don't always have the same slug names.

| squaredr.tech path | fieldcraft.squaredr.tech path |
|--------------------|-------------------------------|
| `/products/fieldcraft/docs` | `/docs` |
| `.../docs/getting-started/installation` | `/docs/getting-started/installation` |
| `.../docs/getting-started/quick-start` | `/docs/getting-started/your-first-form` |
| `.../docs/getting-started/project-structure` | `/docs/getting-started/project-structure` |
| `.../docs/core-concepts/schemas` | `/docs/core-concepts/schema-anatomy` |
| `.../docs/core-concepts/field-types` | `/docs/core-concepts/field-types` |
| `.../docs/core-concepts/validation` | `/docs/core-concepts/validation` |
| `.../docs/core-concepts/conditional-visibility` | `/docs/core-concepts/conditional-logic` |
| `.../docs/core-concepts/computed-fields` | `/docs/core-concepts/computed-fields` |
| `.../docs/core-concepts/draft-persistence` | `/docs/submission/drafts-and-prefill` |
| `.../docs/core-concepts/sections-multi-step` | `/docs/core-concepts/multi-step-forms` |
| `.../docs/react-integration/form-engine-renderer` | `/docs/react/form-renderer` |
| `.../docs/react-integration/field-registry` | `/docs/react/custom-field-types` |
| `.../docs/react-integration/custom-fields` | `/docs/react/custom-field-types` |
| `.../docs/react-integration/hooks` | `/docs/react/hooks` |
| `.../docs/react-integration/theming` | `/docs/react/theming` |
| `.../docs/adapters/overview` | `/docs/submission/adapters-overview` |
| `.../docs/adapters/postgres` | `/docs/submission/adapters-overview` |
| `.../docs/adapters/supabase` | `/docs/submission/adapters-overview` |
| `.../docs/adapters/webhook` | `/docs/submission/adapters-overview` |
| `.../docs/api-reference/core-api` | `/docs` |
| `.../docs/api-reference/react-components` | `/docs` |
| `.../docs/api-reference/schema-types` | `/docs` |
| `.../docs/pro/license` | `/docs/pro/licence-and-activation` |
| `.../docs/pro/form-builder` | `/docs/pro/visual-builder` |
| `.../docs/pro/schema-editor` | `/docs/pro/visual-builder` |
| `.../docs/pro/theme-editor` | `/docs/pro/visual-builder` |
| `.../docs/pro/response-viewer` | `/docs/pro/visual-builder` |

Some doc slugs changed between the two sites. The `:path*` catch-all will
handle most of them (Fumadocs shows a 404 for unmatched slugs), but if you
want exact 1:1 redirects for SEO, add individual redirect entries for the
renamed ones above.

---

## Step 2: Update Navigation Links

### Header — nav config

**File:** `src/config/v2/nav.ts`

```ts
// mainNav — change Docs link
{ label: 'Docs', href: 'https://fieldcraft.squaredr.tech/docs' },

// productNav — point FieldCraft links to subdomain
{ label: 'FieldCraft', href: 'https://fieldcraft.squaredr.tech' },
{ label: 'FieldCraft Pro', href: 'https://fieldcraft.squaredr.tech/#builder' },

// footerNav — Products group
{ label: 'FieldCraft', href: 'https://fieldcraft.squaredr.tech' },
{ label: 'FieldCraft Pro', href: 'https://fieldcraft.squaredr.tech/#builder' },

// footerNav — Resources group
{ label: 'FieldCraft Docs', href: 'https://fieldcraft.squaredr.tech/docs' },
{ label: 'Roadmap', href: 'https://fieldcraft.squaredr.tech/roadmap' },
```

Mark FieldCraft links as external so they open correctly:

```ts
{ label: 'FieldCraft', href: 'https://fieldcraft.squaredr.tech', external: true },
```

### Legacy Header & Footer

If the legacy (non-v2) layout is still live:

**File:** `src/components/layout/Header.tsx`
- Update `productItems` array — change `/products/fieldcraft` href and
  `/products/fieldcraft/docs` docsHref to the subdomain URLs.

**File:** `src/components/layout/Footer.tsx`
- Update `productLinks` array — same changes.

---

## Step 3: Update Homepage References

### Product Showcase

**File:** `src/components/sections/home/ProductShowcase.tsx`

The FieldCraft card's "Learn more" link currently points to
`/products/fieldcraft`. Change it to `https://fieldcraft.squaredr.tech`.

The npm link (`https://www.npmjs.com/package/@squaredr/fieldcraft`) stays
the same — it's an external link to npm, not to the product page.

### JSON-LD Structured Data

**File:** `src/app/(main)/page.tsx`

Update the `SoftwareApplication` URL:

```json
"url": "https://fieldcraft.squaredr.tech"
```

Update any FAQ answers that link to `/products/fieldcraft/docs` to use the
subdomain URL instead.

### products.ts

**File:** `src/data/products.ts`

```ts
links: {
  product: 'https://fieldcraft.squaredr.tech',
  npm: 'https://www.npmjs.com/package/@squaredr/fieldcraft',
  github: 'https://github.com/SquaredR98/fieldcraft',
},
```

---

## Step 4: Remove FieldCraft Page Files (Optional)

Once redirects are live and confirmed working, you can optionally delete
the FieldCraft page files from squaredr.tech since they'll never be
rendered (redirects fire before the page loads). This keeps the codebase
clean.

**Files to remove:**

```
src/app/(main)/products/fieldcraft/page.tsx
src/app/(main)/products/fieldcraft/roadmap/page.tsx
src/app/(docs)/products/fieldcraft/docs/page.tsx
src/app/(docs)/products/fieldcraft/docs/layout.tsx
src/app/(docs)/products/fieldcraft/docs/[...slug]/page.tsx
```

**Components to remove (only used by FieldCraft product pages):**

```
src/components/sections/fieldcraft/          (entire directory)
src/components/sections/fieldcraft-pro/      (entire directory)
```

**Keep these** — they're used on the homepage and aren't
FieldCraft-page-specific:

```
src/components/sections/home/ProductShowcase.tsx   (keep — shows all products)
src/data/products.ts                               (keep — used by homepage)
```

Do NOT remove these until you've verified all redirects work in production.

---

## Step 5: Remove FieldCraft Docs Content (Optional)

If you delete the docs pages (Step 4), also remove the docs content files
since they'll no longer be rendered:

```
src/content/fieldcraft-docs/    (entire directory, if it exists)
```

The canonical docs now live in the FieldCraft website repo at
`formengine/website/content/docs/`.

---

## Step 6: Vercel DNS Setup

On your Vercel dashboard for the `formengine/website` project:

1. Go to **Settings > Domains**
2. Add `fieldcraft.squaredr.tech`
3. Vercel will give you a CNAME record to add
4. In your DNS provider, add:
   ```
   CNAME  fieldcraft  cname.vercel-dns.com
   ```
5. Wait for DNS propagation and SSL certificate provisioning

---

## Verification Checklist

After deploying both sites, test each of these:

| Test | URL | Expected |
|------|-----|----------|
| Product page redirect | `squaredr.tech/products/fieldcraft` | 301 → `fieldcraft.squaredr.tech` |
| Docs landing redirect | `squaredr.tech/products/fieldcraft/docs` | 301 → `fieldcraft.squaredr.tech/docs` |
| Docs deep link redirect | `squaredr.tech/products/fieldcraft/docs/core-concepts/field-types` | 301 → `fieldcraft.squaredr.tech/docs/core-concepts/field-types` |
| Pro docs redirect | `squaredr.tech/products/fieldcraft/docs/pro/form-builder` | 301 → `fieldcraft.squaredr.tech/docs/pro/form-builder` |
| Templates redirect | `squaredr.tech/templates` | 301 → `fieldcraft.squaredr.tech/templates` |
| Template detail redirect | `squaredr.tech/templates/contact-form` | 301 → `fieldcraft.squaredr.tech/templates/contact-form` |
| Old pack redirect | `squaredr.tech/products/fieldcraft/admin-pro` | 301 → `fieldcraft.squaredr.tech` |
| Nav link | Click "FieldCraft" in squaredr.tech nav | Opens `fieldcraft.squaredr.tech` |
| Footer link | Click "FieldCraft Docs" in footer | Opens `fieldcraft.squaredr.tech/docs` |
| Homepage showcase | Click "Learn more" on FieldCraft card | Opens `fieldcraft.squaredr.tech` |
| Subdomain homepage | `fieldcraft.squaredr.tech` | Loads FieldCraft homepage |
| Subdomain docs | `fieldcraft.squaredr.tech/docs` | Loads docs with sidebar |
| Subdomain blog | `fieldcraft.squaredr.tech/blog` | Loads blog listing |
| Subdomain templates | `fieldcraft.squaredr.tech/templates` | Loads template gallery |
| Theme toggle | Toggle on both sites | Both respect dark/light mode |

---

## Order of Operations

1. Deploy FieldCraft website to Vercel (new project)
2. Add `fieldcraft.squaredr.tech` domain to the Vercel project
3. Configure DNS CNAME record
4. Verify the subdomain loads correctly
5. Update squaredr.tech code (redirects + nav links)
6. Deploy squaredr.tech
7. Run through verification checklist
8. (Later) Remove unused FieldCraft page files from squaredr.tech
