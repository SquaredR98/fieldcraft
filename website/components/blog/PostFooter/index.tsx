import Link from 'next/link';
import type { BlogPostMeta } from '@/lib/blog';
import './styles.css';

interface PostFooterProps {
  tags: string[];
  prevPost: BlogPostMeta | null;
  nextPost: BlogPostMeta | null;
}

export function PostFooter({ tags, prevPost, nextPost }: PostFooterProps) {
  return (
    <footer className="fc-blog-post__footer">
      {/* Tags + edit link */}
      <div className="fc-blog-post__footer-tags">
        <div className="fc-blog-post__tag-list">
          {tags.map((tag) => (
            <span key={tag} className="fc-blog-post__tag">
              {tag}
            </span>
          ))}
        </div>
        <a
          href="https://github.com/SquaredR98/fieldcraft/discussions"
          className="fc-blog-post__discuss"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discuss on GitHub &rarr;
        </a>
      </div>

      {/* Docs handoff CTA */}
      <div className="fc-blog-post__cta">
        <div className="fc-blog-post__cta-text">
          <div className="fc-blog-post__cta-eyebrow">Reference</div>
          <div className="fc-blog-post__cta-heading">
            Explore the full documentation
          </div>
        </div>
        <Link href="/docs" className="fc-blog-post__cta-btn">
          Read the docs &rarr;
        </Link>
      </div>

      {/* Keep reading */}
      {(prevPost || nextPost) && (
        <div className="fc-blog-post__keep-reading">
          <div className="fc-blog-post__keep-reading-label">Keep reading</div>
          <div className="fc-blog-post__keep-reading-grid">
            {prevPost && (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="fc-blog-post__keep-reading-card"
              >
                <div className="fc-blog-post__keep-reading-meta">
                  {prevPost.category || 'Post'} &middot;{' '}
                  {prevPost.readingTime.replace(' read', '')}
                </div>
                <div className="fc-blog-post__keep-reading-title">
                  {prevPost.title}
                </div>
              </Link>
            )}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="fc-blog-post__keep-reading-card"
              >
                <div className="fc-blog-post__keep-reading-meta">
                  {nextPost.category || 'Post'} &middot;{' '}
                  {nextPost.readingTime.replace(' read', '')}
                </div>
                <div className="fc-blog-post__keep-reading-title">
                  {nextPost.title}
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
