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
      {/* The backdrop belongs to the PAGE, not to the heading band —
          scoped to a section it would end on a hard horizontal edge
          where that section stops. It spans the full height and the
          mask fades it out, so there is no seam to see. */}
      <div className="fc-tpl-list__backdrop" aria-hidden="true">
        <div className="fc-v2-grid fc-v2-grid--center" />
        <div className="fc-tpl-list__glows">
          <i />
          <i />
        </div>
      </div>
      <header className="fc-tpl-list__masthead">
        <div className="fc-tpl-list__masthead-inner">
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
      </header>
      <div className="fc-tpl-list__inner">
        {categories.map((cat) => {
          const templates = templatesByCategory[cat];
          if (!templates || templates.length === 0) return null;
          return (
            <section key={cat} className="fc-tpl-list__category">
              <h2 className="fc-tpl-list__category-title">
                {categoryLabels[cat]}
              </h2>
              {/* One shared-border block per category, only as wide as
                  its cells: six templates make a 3x2 block that fills
                  the row, one makes a single-cell block that stops
                  after one column. The width shows the size of the
                  category before you read a count. */}
              <div className="fc-tpl-list__grid">
                {templates.map((t) => (
                  <TemplateCard key={t.meta.id} meta={t.meta} variant="cell" />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
