import type { BlogPost, BlogPostMeta } from '@/lib/blog';
import type { Author } from '@/lib/authors';
import { ReadingProgressBar } from '../ReadingProgressBar';
import { ArticleHeader } from '../BlogPostHeader';
import { BlogPostBody } from '../BlogPostBody';
import { PostFooter } from '../PostFooter';
import { PostSidebar } from '../PostSidebar';
import './styles.css';

interface Heading {
  id: string;
  text: string;
}

interface BlogPostViewProps {
  post: BlogPost;
  author: Author;
  headings: Heading[];
  formattedDate: string;
  prevPost: BlogPostMeta | null;
  nextPost: BlogPostMeta | null;
  jsonLd: Record<string, unknown>;
}

export function BlogPostView({
  post,
  author,
  headings,
  formattedDate,
  prevPost,
  nextPost,
  jsonLd,
}: BlogPostViewProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReadingProgressBar />

      <div className="fc-blog-post-layout">
        <article className="fc-blog-post">
          <ArticleHeader
            title={post.title}
            description={post.description}
            author={author}
            category={post.category}
            date={post.date}
            formattedDate={formattedDate}
            readingTime={post.readingTime}
            slug={post.slug}
          />

          <BlogPostBody content={post.content} />

          <PostFooter
            tags={post.tags}
            prevPost={prevPost}
            nextPost={nextPost}
          />
        </article>

        <PostSidebar headings={headings} />
      </div>
    </>
  );
}
