import type { BlogPost, BlogPostMeta } from '@/lib/blog';
import { ArticleHeader } from '../BlogPostHeader';
import { BlogPostBody } from '../BlogPostBody';
import { PostFooter } from '../PostFooter';
import { PostSidebar } from '../PostSidebar';
import { MobileToc } from '../MobileToc';
import './styles.css';

interface Heading {
  id: string;
  text: string;
}

/* No `author`: the post header shows date and reading time only now.
   The author is still resolved in page.tsx for the metadata and the
   JSON-LD, which should name one even when the page does not show
   it. */
interface BlogPostViewProps {
  post: BlogPost;
  headings: Heading[];
  formattedDate: string;
  prevPost: BlogPostMeta | null;
  nextPost: BlogPostMeta | null;
  jsonLd: Record<string, unknown>;
}

export function BlogPostView({
  post,
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

      {/* Reading progress moved into NavShell — it is site-wide now,
          and inside the header it rides the hide-on-scroll transform
          instead of leaving a stray line pinned over the page. */}
      <div className="fc-blog-post-page">
        {/* Page-wide backdrop, matching /blog and /templates. */}
        <div className="fc-blog-post-page__backdrop" aria-hidden="true">
          <div className="fc-v2-grid fc-v2-grid--center" />
          <div className="fc-blog-post-page__glows">
            <i />
            <i />
          </div>
        </div>

        <div className="fc-blog-post-layout">
          {/* The plate is on the ARTICLE, never on a wrapper holding
              both columns: it needs overflow:hidden so its children
              respect the radius, and overflow:hidden on a shared
              ancestor would kill the sidebar's position:sticky. */}
          <article className="fc-blog-post">
            <ArticleHeader
              title={post.title}
              description={post.description}
              category={post.category}
              date={post.date}
              formattedDate={formattedDate}
              readingTime={post.readingTime}
              slug={post.slug}
            />

            {/* Mobile only. Sits BELOW the header so the title is the
                first thing on the page — the old sidebar used
                `-order-1`, which opened every post on a phone with a
                list of headings before the title. */}
            <MobileToc headings={headings} />

            <BlogPostBody content={post.content} />

            <PostFooter
              tags={post.tags}
              prevPost={prevPost}
              nextPost={nextPost}
            />
          </article>

          <PostSidebar headings={headings} />
        </div>
      </div>
    </>
  );
}
