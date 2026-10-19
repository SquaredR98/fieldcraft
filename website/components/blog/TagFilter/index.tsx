'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import './styles.css';

interface FilterRailProps {
  categories: string[];
  activeCategory: string | null;
  postCount: number;
}

export function FilterRail({
  categories,
  activeCategory,
  postCount,
}: FilterRailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleCategory(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    /* Back to page 1. Changing the filter changes how many pages
       exist, so keeping ?page=3 could land on a page the new category
       does not have — the server clamps it, but the URL would still
       claim a page the user never asked for. */
    params.delete('page');
    const query = params.toString();
    router.push(query ? `/blog?${query}` : '/blog', { scroll: false });
  }

  return (
    <div className="fc-blog-filter-rail">
      <div className="fc-blog-filter-rail__inner">
        <div className="fc-blog-filter-rail__tabs">
          <button
            className={`fc-blog-filter-rail__tab${!activeCategory ? ' fc-blog-filter-rail__tab--active' : ''}`}
            onClick={() => handleCategory(null)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`fc-blog-filter-rail__tab${activeCategory === cat ? ' fc-blog-filter-rail__tab--active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="fc-blog-filter-rail__count">
          {postCount} {postCount === 1 ? 'post' : 'posts'}
        </span>
      </div>
    </div>
  );
}
