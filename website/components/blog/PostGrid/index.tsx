import type { BlogPostMeta } from '@/lib/blog';
import type { Author } from '@/lib/authors';
import { getAuthor } from '@/lib/authors';
import { BlogCard } from '../BlogCard';
import './styles.css';

interface PostGridProps {
  posts: BlogPostMeta[];
  authors: Record<string, Author>;
}

export function PostGrid({ posts, authors }: PostGridProps) {
  if (posts.length === 0) return null;

  return (
    <div className="fc-blog-grid-wrap">
      <div className="fc-blog-grid">
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            post={post}
            author={authors[post.author || ''] || getAuthor()}
          />
        ))}
      </div>
    </div>
  );
}
