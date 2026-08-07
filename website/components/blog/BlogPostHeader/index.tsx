import Link from 'next/link';
import type { Author } from '@/lib/authors';
import { AuthorAvatar } from '../AuthorAvatar';
import { ShareButtons } from '../ShareButtons';
import './styles.css';

interface ArticleHeaderProps {
  title: string;
  description: string;
  author: Author;
  category: string;
  date: string;
  formattedDate: string;
  readingTime: string;
  slug: string;
}

export function ArticleHeader({
  title,
  description,
  author,
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

      <div className="fc-blog-post__author-strip">
        <AuthorAvatar name={author.name} size={38} className="fc-blog-post__avatar" />
        <div className="fc-blog-post__author-info">
          <div className="fc-blog-post__author-name">{author.name}</div>
          <div className="fc-blog-post__author-meta">
            {author.role} &middot;{' '}
            <time dateTime={date}>{formattedDate}</time> &middot; {readingTime}
          </div>
        </div>
        <ShareButtons url={`https://fieldcraft.squaredr.tech/blog/${slug}`} />
      </div>
    </header>
  );
}
