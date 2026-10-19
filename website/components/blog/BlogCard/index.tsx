import Link from 'next/link';
import type { BlogPostMeta } from '@/lib/blog';
import { formatDateShort } from '@/lib/blog';
import { CoverIllustration } from '../CoverIllustration';
import './styles.css';

/* No author: every post has the same one, so a byline repeated down
   the list carries no information. The author is still in the page's
   JSON-LD, where structured data should name one. */
interface BlogCardProps {
  post: BlogPostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="fc-blog-card">
      <div className="fc-blog-card__image">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="fc-blog-card__img"
          />
        ) : (
          <CoverIllustration slug={post.slug} className="fc-blog-card__illustration" />
        )}
      </div>
      <div className="fc-blog-card__body">
        <div className="fc-blog-card__meta-row">
          {post.category && (
            <span className="fc-blog-card__tag">{post.category}</span>
          )}
          <span className="fc-blog-card__date">
            {formatDateShort(post.date)} &middot;{' '}
            {post.readingTime.replace(' read', '')}
          </span>
        </div>
        <h3 className="fc-blog-card__title">{post.title}</h3>
        <p className="fc-blog-card__excerpt">{post.description}</p>
      </div>
    </Link>
  );
}
