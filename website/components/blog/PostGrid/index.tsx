import type { BlogPostMeta } from '@/lib/blog';
import { BlogCard } from '../BlogCard';
import './styles.css';

interface PostGridProps {
  posts: BlogPostMeta[];
}

export function PostGrid({ posts }: PostGridProps) {
  if (posts.length === 0) return null;

  /* `display: contents` — no wrapper box. The rows become direct grid
     items of the window, so the 1px gap between them is the same one
     that separates them from the chrome bar above. A nested container
     would draw its own divisions and break the continuous rule. */
  return (
    <div className="fc-blog-rows">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
