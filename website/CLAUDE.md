# FieldCraft Website — Architecture Rules

These rules extend the workspace rules in `../../CLAUDE.md`. Both apply. If there is a conflict, the workspace rules win.

---

## Rule W1: Component Architecture (Components → Views → Pages)

This website follows a strict three-layer architecture. Every page must conform.

### Layer 1 — Components

Small, focused UI pieces. A card, a header, a tag list, a filter bar.

```
components/blog/BlogCard.tsx          ← renders one blog card
components/blog/BlogHeader.tsx        ← eyebrow + heading + subtitle
components/blog/BlogPostHeader.tsx    ← meta + title + tags for a post
components/blog/TagFilter.tsx         ← tag pill filter (client component)
components/homepage/Hero/index.tsx    ← hero section
components/homepage/LiveDemos/index.tsx
```

Rules:
- Single responsibility
- Receives **all data via props** — no data fetching inside components
- No direct imports of `lib/` data loaders — data comes from props
- Server components by default; only `'use client'` when hooks/state/events are needed

### Layer 2 — Views

Assembles multiple components into a complete page. One view per route.

```
components/blog/BlogListView.tsx      ← assembles BlogHeader + TagFilter + BlogCard grid
components/blog/BlogPostView.tsx      ← assembles back link + BlogPostHeader + BlogPostBody
components/homepage/HomepageView.tsx   ← assembles Hero + ProblemSection + ... + FinalCta
```

Rules:
- One view component per page route
- Receives all data via props from `page.tsx`
- Orchestrates components in the correct order
- May contain minimal layout wrappers (`<section>`, `<article>`, `<div>` for grid)
- No data fetching — all data flows in through props

### Layer 3 — page.tsx

The Next.js route file. Thin. Calls exactly one view component.

```tsx
// app/(marketing)/blog/page.tsx
export default async function BlogPage({ searchParams }) {
  const { tag } = await searchParams;
  const posts = getAllPosts();
  const tags = getAllTags();
  return <BlogListView posts={posts} tags={tags} activeTag={tag} />;
}
```

Rules:
- Handles: data fetching, `searchParams` / `params`, `export const metadata`
- Returns: a single `<SomeView />` call with data passed as props
- No inline JSX beyond the view component call
- `generateStaticParams` and `generateMetadata` belong here
- JSON-LD structured data generation belongs here or in the view (not in small components)

---

## Rule W2: Shared Layouts via Route Groups

Routes that share the same shell (Nav + Footer) must use a **Next.js route group** with a single layout. Never duplicate Nav/Footer in multiple files.

```
app/
├── (marketing)/              ← route group
│   ├── layout.tsx            ← Nav + <main>{children}</main> + Footer (ONCE)
│   ├── page.tsx              ← homepage
│   └── blog/
│       ├── page.tsx          ← blog listing
│       └── [slug]/
│           └── page.tsx      ← blog post
├── docs/                     ← separate layout (DocsTopBar + sidebar)
│   ├── layout.tsx
│   └── [[...slug]]/page.tsx
├── api/                      ← API routes (no layout)
└── layout.tsx                ← root layout (fonts, providers, metadata)
```

**Anti-pattern:** Importing Nav and Footer in both homepage `page.tsx` AND blog `layout.tsx`. If they share the shell, they share the layout.

---

## Rule W3: CSS Organisation

- All CSS classes use the `fc-` prefix (inherited from workspace Rule 4)
- Blog CSS: `components/blog/styles.css` (one file, not split across route directories)
- Homepage CSS: each section component owns its own `styles.css` in its directory
- Docs CSS: `components/docs/docs.css`
- Global CSS: `app/globals.css`
- No CSS file in `app/` route directories — CSS belongs with its component in `components/`

---

## Rule W4: Data Flow

```
page.tsx (fetches data)
  → View (receives data via props, assembles components)
    → Component (receives slice of data via props, renders UI)
```

- Data fetching only in `page.tsx` (or `layout.tsx` for shared data like nav items)
- Prop drilling limit: **3 levels max**. If deeper, use React Context
- Never import `lib/blog.ts` or `lib/source.ts` from a component — only from `page.tsx`

---

## Rule W5: Blog-Specific Rules

- Blog posts live in `content/blog/` as `.mdx` files
- Frontmatter: `title` (required), `slug` (required), `date` (required), `description` (required), `tags` (array)
- All blog post numbers (field counts, test counts, theme counts) must be verified from source per workspace Rule 1
- All code examples must be runnable — no imports from unpublished packages (workspace Rule 9)
- Internal links use relative paths (`/docs`, `/blog/slug`) not full URLs
- External links use full URLs

---

## File Ownership

| File | Responsible for |
|------|----------------|
| `app/(marketing)/layout.tsx` | Nav + Footer shell for landing page and blog |
| `app/(marketing)/page.tsx` | Homepage data → `<HomepageView />` |
| `app/(marketing)/blog/page.tsx` | Blog listing data → `<BlogListView />` |
| `app/(marketing)/blog/[slug]/page.tsx` | Blog post data → `<BlogPostView />` |
| `app/docs/layout.tsx` | Docs shell (DocsTopBar + sidebar) |
| `app/docs/[[...slug]]/page.tsx` | Docs page rendering |
| `app/layout.tsx` | Root layout (fonts, providers, metadata) |
| `components/blog/` | All blog UI components + views + CSS |
| `components/homepage/` | All homepage section components + HomepageView |
| `components/docs/` | All docs UI components + CSS |
| `components/layout/` | Nav, Footer, ThemeToggle |
| `lib/blog.ts` | Blog post loader (getAllPosts, getPostBySlug, etc.) |
| `lib/source.ts` | Fumadocs docs loader |
