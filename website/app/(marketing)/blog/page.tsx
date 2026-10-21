import type { Metadata } from 'next';
import { getAllPosts, getCategories } from '@/lib/blog';
import { BlogListView } from '@/components/blog/BlogListView';

export const metadata: Metadata = {
  alternates: { canonical: 'https://fieldcraft.squaredr.tech/blog' },
  title: 'Blog',
  description:
    'Tutorials, guides, and deep-dives on building forms with React. Multi-step wizards, conditional logic, validation patterns, and self-hosted form architecture.',
  openGraph: {
    title: 'FieldCraft Blog — React form engineering',
    description:
      'Tutorials, guides, and deep-dives on building forms with React. Multi-step wizards, conditional logic, validation patterns, and self-hosted form architecture.',
  },
};

/* Six per page, the featured row included — so page 1 is the featured
   post plus five rows and every later page is six rows. Kept here
   rather than in the view because slicing is data work, and Rule 11
   puts data in page.tsx. */
const POSTS_PER_PAGE = 6;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page } = await searchParams;
  const allPosts = getAllPosts();
  const categories = getCategories();
  const filtered = category
    ? allPosts.filter((p) => p.category === category)
    : allPosts;

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  /* Clamped rather than trusted: ?page=0, ?page=99 and ?page=abc are
     all reachable by hand and would otherwise render an empty list. */
  const parsed = Number.parseInt(page ?? '1', 10);
  const currentPage = Number.isNaN(parsed)
    ? 1
    : Math.min(Math.max(parsed, 1), totalPages);

  const posts = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'FieldCraft Blog',
    description:
      'Technical deep-dives, build logs, and lessons from building FieldCraft.',
    url: 'https://fieldcraft.squaredr.tech/blog',
    publisher: {
      '@type': 'Organization',
      name: 'SquaredR',
      url: 'https://fieldcraft.squaredr.tech',
    },
    blogPost: allPosts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `https://fieldcraft.squaredr.tech/blog/${post.slug}`,
      keywords: post.tags,
    })),
  };

  return (
    <BlogListView
      posts={posts}
      allPosts={allPosts}
      categories={categories}
      activeCategory={category ?? null}
      jsonLd={jsonLd}
      currentPage={currentPage}
      totalPages={totalPages}
      filteredCount={filtered.length}
    />
  );
}
