import Link from 'next/link';
import type { BlogPostMeta } from '@/lib/blog';
import { formatDateShort } from '@/lib/blog';
import type { Author } from '@/lib/authors';
import { CoverIllustration } from '../CoverIllustration';
import './styles.css';

interface BlogCardProps {
  post: BlogPostMeta;
  author: Author;
}

export function BlogCard({ post, author }: BlogCardProps) {
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
        <div className="fc-blog-card__author">{author.name}</div>
      </div>
    </Link>
  );
}
