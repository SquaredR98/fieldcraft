import type { Metadata } from 'next';
import { getAllPosts, getCategories } from '@/lib/blog';
import { authors } from '@/lib/authors';
import { BlogListView } from '@/components/blog/BlogListView';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Tutorials, guides, and deep-dives on building forms with React. Multi-step wizards, conditional logic, validation patterns, and self-hosted form architecture.',
  openGraph: {
    title: 'FieldCraft Blog — React form engineering',
    description:
      'Tutorials, guides, and deep-dives on building forms with React. Multi-step wizards, conditional logic, validation patterns, and self-hosted form architecture.',
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allPosts = getAllPosts();
  const categories = getCategories();
  const posts = category
    ? allPosts.filter((p) => p.category === category)
    : allPosts;

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
      authors={authors}
      jsonLd={jsonLd}
    />
  );
}
