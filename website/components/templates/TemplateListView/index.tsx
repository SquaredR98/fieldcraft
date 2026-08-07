import { TemplateCard } from '@/components/templates/TemplateCard';
import type { Template, TemplateCategory } from '@/lib/templates';
import { categoryLabels } from '@/lib/templates';
import './styles.css';

interface TemplateListViewProps {
  templatesByCategory: Partial<Record<TemplateCategory, Template[]>>;
  categories: TemplateCategory[];
  totalCount: number;
}

export function TemplateListView({
  templatesByCategory,
  categories,
  totalCount,
}: TemplateListViewProps) {
  return (
    <div className="fc-tpl-list">
      <div className="fc-tpl-list__inner">
        <div className="fc-tpl-list__header">
          <div className="fc-tpl-list__eyebrow">
            Templates &middot; {totalCount}
          </div>
          <h1 className="fc-tpl-list__h1">
            Production-ready form schemas
          </h1>
          <p className="fc-tpl-list__sub">
            MIT-licensed. Copy a schema, edit the fields, render with
            FieldCraft.
          </p>
        </div>
        {categories.map((cat) => {
          const templates = templatesByCategory[cat];
          if (!templates || templates.length === 0) return null;
          return (
            <section key={cat} className="fc-tpl-list__category">
              <h2 className="fc-tpl-list__category-title">
                {categoryLabels[cat]}
              </h2>
              <div className="fc-tpl-list__grid">
                {templates.map((t) => (
                  <TemplateCard key={t.meta.id} meta={t.meta} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
