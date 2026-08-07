import { Suspense } from 'react';
import type { BlogPostMeta } from '@/lib/blog';
import type { Author } from '@/lib/authors';
import { getAuthor } from '@/lib/authors';
import { BlogMasthead } from '../BlogHeader';
import { FilterRail } from '../TagFilter';
import { FeaturedPost } from '../FeaturedPost';
import { PostGrid } from '../PostGrid';
import './styles.css';

interface BlogListViewProps {
  posts: BlogPostMeta[];
  allPosts: BlogPostMeta[];
  categories: string[];
  activeCategory: string | null;
  authors: Record<string, Author>;
  jsonLd: Record<string, unknown>;
}

export function BlogListView({
  posts,
  allPosts,
  categories,
  activeCategory,
  authors,
  jsonLd,
}: BlogListViewProps) {
  const [featured, ...rest] = posts;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BlogMasthead postCount={allPosts.length} />

      {categories.length > 0 && (
        <Suspense>
          <FilterRail
            categories={categories}
            activeCategory={activeCategory}
            postCount={posts.length}
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
          {featured && (
            <FeaturedPost
              post={featured}
              author={authors[featured.author || ''] || getAuthor()}
            />
          )}
          {rest.length > 0 && <PostGrid posts={rest} authors={authors} />}
        </>
      )}
    </>
  );
}
