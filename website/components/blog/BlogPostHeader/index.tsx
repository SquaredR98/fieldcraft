import Link from 'next/link';
import { ShareButtons } from '../ShareButtons';
import './styles.css';

interface ArticleHeaderProps {
  title: string;
  description: string;
  category: string;
  date: string;
  formattedDate: string;
  readingTime: string;
  slug: string;
}

export function ArticleHeader({
  title,
  description,
  category,
  date,
  formattedDate,
  readingTime,
  slug,
}: ArticleHeaderProps) {
  return (
    <header className="fc-blog-post__header">
      <Link href="/blog" className="fc-blog-post__back">
        &larr; Field notes{category ? ` / ${category}` : ''}
      </Link>

      <h1 className="fc-blog-post__title">{title}</h1>
      <p className="fc-blog-post__desc">{description}</p>

      {/* Date and reading time only. The avatar, name and "Maintainer"
          role are gone: every post has the same author, so a byline
          that never varies carries no information — and "Maintainer"
          describes a relationship to the code, not to the article.
          The author is still in the page's JSON-LD, where structured
          data should name one. */}
      <div className="fc-blog-post__meta-strip">
        <div className="fc-blog-post__meta">
          <time dateTime={date}>{formattedDate}</time>
          <span aria-hidden="true">&middot;</span>
          <span>{readingTime}</span>
        </div>
        <ShareButtons url={`https://fieldcraft.squaredr.tech/blog/${slug}`} />
      </div>
    </header>
  );
}
