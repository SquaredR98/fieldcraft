import Link from 'next/link';
import type { BlogPostMeta } from '@/lib/blog';
import { formatDateShort } from '@/lib/blog';
import type { Author } from '@/lib/authors';
import { CoverIllustration } from '../CoverIllustration';
import { AuthorAvatar } from '../AuthorAvatar';
import './styles.css';

interface FeaturedPostProps {
  post: BlogPostMeta;
  author: Author;
}

export function FeaturedPost({ post, author }: FeaturedPostProps) {
  return (
    <div className="fc-blog-featured-wrap">
      <Link href={`/blog/${post.slug}`} className="fc-blog-featured">
        <div className="fc-blog-featured__image">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="fc-blog-featured__img"
            />
          ) : (
            <CoverIllustration slug={post.slug} className="fc-blog-featured__illustration" />
          )}
        </div>
        <div className="fc-blog-featured__content">
          <div className="fc-blog-featured__meta-row">
            {post.category && (
              <span className="fc-blog-featured__tag">{post.category}</span>
            )}
            <span className="fc-blog-featured__date">
              {formatDateShort(post.date)} &middot;{' '}
              {post.readingTime.replace(' read', '')}
            </span>
          </div>
          <h2 className="fc-blog-featured__title">{post.title}</h2>
          <p className="fc-blog-featured__desc">{post.description}</p>
          <div className="fc-blog-featured__footer">
            <div className="fc-blog-featured__author">
              <AuthorAvatar name={author.name} size={30} />
              <div>
                <div className="fc-blog-featured__author-name">
                  {author.name}
                </div>
                <div className="fc-blog-featured__author-role">
                  {author.role}
                </div>
              </div>
            </div>
            <span className="fc-blog-featured__read">Read &rarr;</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
