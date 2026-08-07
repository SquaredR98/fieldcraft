import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export const BLOG_CATEGORIES = [
  'Engineering',
  'Release',
  'Patterns',
  'Guide',
  'Case study',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  readingTime: string;
  author?: string;
  coverImage?: string;
  content: string;
};

export type BlogPostMeta = Omit<BlogPost, 'content'>;

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  const posts = files.map((filename) => {
    const filePath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const stats = readingTime(content);

    return {
      slug: data.slug || filename.replace(/\.mdx$/, ''),
      title: data.title || 'Untitled',
      date: data.date || '',
      description: data.description || '',
      category: data.category || '',
      tags: data.tags || [],
      readingTime: stats.text,
      author: data.author || undefined,
      coverImage: data.coverImage || undefined,
    };
  });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(BLOG_DIR)) return null;

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  for (const filename of files) {
    const filePath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const fileSlug = data.slug || filename.replace(/\.mdx$/, '');

    if (fileSlug === slug) {
      const stats = readingTime(content);
      return {
        slug: fileSlug,
        title: data.title || 'Untitled',
        date: data.date || '',
        description: data.description || '',
        category: data.category || '',
        tags: data.tags || [],
        readingTime: stats.text,
        author: data.author || undefined,
        coverImage: data.coverImage || undefined,
        content,
      };
    }
  }

  return null;
}

export function getCategories(): string[] {
  const posts = getAllPosts();
  const used = new Set(posts.map((p) => p.category).filter(Boolean));
  return BLOG_CATEGORIES.filter((c) => used.has(c));
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      return data.slug || filename.replace(/\.mdx$/, '');
    });
}

export function getAdjacentPosts(
  slug: string,
): { prev: BlogPostMeta | null; next: BlogPostMeta | null } {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };

  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

export function extractHeadings(
  content: string,
): { id: string; text: string }[] {
  const headingRegex = /^## (.+)$/gm;
  const headings: { id: string; text: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ id, text });
  }

  return headings;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
