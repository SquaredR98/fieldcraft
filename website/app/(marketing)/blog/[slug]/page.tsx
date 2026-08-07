import { notFound } from 'next/navigation';
import { type Metadata } from 'next';
import {
  getPostBySlug,
  getAllSlugs,
  formatDate,
  extractHeadings,
  getAdjacentPosts,
} from '@/lib/blog';
import { getAuthor } from '@/lib/authors';
import { BlogPostView } from '@/components/blog/BlogPostView';

type Params = { slug: string };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const author = getAuthor(post.author);

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: author.name, url: 'https://fieldcraft.squaredr.tech' }],
    alternates: {
      canonical: `https://fieldcraft.squaredr.tech/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://fieldcraft.squaredr.tech/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      siteName: 'FieldCraft',
      authors: [author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const author = getAuthor(post.author);
  const headings = extractHeadings(post.content);
  const { prev, next } = getAdjacentPosts(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SquaredR',
      url: 'https://fieldcraft.squaredr.tech',
    },
    url: `https://fieldcraft.squaredr.tech/blog/${post.slug}`,
    keywords: post.tags,
    wordCount: post.content.split(/\s+/).length,
  };

  return (
    <BlogPostView
      post={post}
      author={author}
      headings={headings}
      formattedDate={formatDate(post.date)}
      prevPost={prev}
      nextPost={next}
      jsonLd={jsonLd}
    />
  );
}
