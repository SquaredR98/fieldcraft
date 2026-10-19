import { Suspense } from 'react';
import type { BlogPostMeta } from '@/lib/blog';
import { BlogMasthead } from '../BlogHeader';
import { FilterRail } from '../TagFilter';
import { PostGrid } from '../PostGrid';
import { BlogPagination } from '../BlogPagination';
/* .fc-v2-grid lives here. Imported explicitly — without it the
   backdrop's grid renders unstyled on a direct visit to /blog, even
   though a build that also compiles the homepage looks fine. */
import '@/components/homepage/v2.css';
import './styles.css';

interface BlogListViewProps {
  posts: BlogPostMeta[];
  allPosts: BlogPostMeta[];
  categories: string[];
  activeCategory: string | null;
  jsonLd: Record<string, unknown>;
  currentPage: number;
  totalPages: number;
  filteredCount: number;
}

export function BlogListView({
  posts,
  allPosts,
  categories,
  activeCategory,
  jsonLd,
  currentPage,
  totalPages,
  filteredCount,
}: BlogListViewProps) {
  /* No featured row: every post gets the same treatment. A hero row
     made the list two kinds of thing, and on any page but the first
     the "latest" claim was not even true. */

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="fc-blog-page">
        {/* Page-wide backdrop, same as /templates: spans the full
            height and fades via a vh-based mask rather than ending on
            a hard edge where a section stops. */}
        <div className="fc-blog-page__backdrop" aria-hidden="true">
          <div className="fc-v2-grid fc-v2-grid--center" />
          <div className="fc-blog-page__glows">
            <i />
            <i />
          </div>
        </div>

        <div className="fc-blog-page__inner">
          <BlogMasthead postCount={allPosts.length} />

          {/* ONE window: chrome bar on top, then every post as a row
              divided by the 1px gap. The featured post is the first
              row rather than a separate object above the list \u2014 that
              is what makes this read as a publication rather than a
              hero stacked on a grid. */}
          <div className="fc-blog-window">
            {categories.length > 0 && (
              <Suspense>
                {/* filteredCount, not posts.length: the rail reports
                    how many posts the filter matched, which is not
                    the six on this page. */}
                <FilterRail
                  categories={categories}
                  activeCategory={activeCategory}
                  postCount={filteredCount}
                />
              </Suspense>
            )}

            {posts.length === 0 ? (
              <div className="fc-blog-empty">
                <p>
                  {activeCategory
                    ? `No posts in \u201c${activeCategory}\u201d yet.`
                    : 'First articles dropping soon.'}
                </p>
              </div>
            ) : (
              <>
                <PostGrid posts={posts} />
                <Suspense>
                  <BlogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                </Suspense>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
