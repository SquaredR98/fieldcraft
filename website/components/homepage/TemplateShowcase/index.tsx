import Link from 'next/link';
import type { Template } from '@/lib/templates';
import './styles.css';

/*
 * Spec-strip treatment, same content.
 *
 * This used TemplateCard — three separate floating cards. The cells now
 * share borders the way the hero's spec strip does: one bordered
 * container with hairline dividers, so the three read as one object.
 *
 * Every element TemplateCard carried is still here: category, field and
 * section counts, name, description, two tags and the schema id. Only
 * the container treatment changed.
 *
 * TemplateCard itself is deliberately NOT touched — /templates renders
 * it too, and that page is a separate pass.
 *
 * `total` is counted from the templates package by the page, so the
 * footer figure cannot drift from reality (Rule 1).
 */

interface TemplateShowcaseProps {
  templates: Template[];
  total: number;
}

export function TemplateShowcase({ templates, total }: TemplateShowcaseProps) {
  const remaining = total - templates.length;

  return (
    <section id="templates" className="fc-showcase fc-ground-surface2">
      <div className="fc-showcase__inner">
        <div className="fc-showcase__head">
          <div>
            <div className="fc-showcase__eyebrow">Templates</div>
            <h2 className="fc-showcase__h2">Or start from one of these.</h2>
            <p className="fc-showcase__sub">
              Schemas written for real forms, cleaned up. Copy one, change
              the fields, render it.
            </p>
          </div>
          <Link href="/templates" className="fc-v2-link fc-showcase__cta">
            Explore all templates{' '}
            <span className="fc-v2-link__arrow">&rarr;</span>
          </Link>
        </div>

        <div className="fc-showcase__strip">
          {templates.map((t) => (
            <Link
              key={t.meta.id}
              href={`/templates/${t.meta.id}`}
              className="fc-showcase__cell"
            >
              <div className="fc-showcase__cell-head">
                <span className="fc-showcase__cell-cat">{t.meta.category}</span>
                <span className="fc-showcase__cell-stats">
                  {t.meta.fieldCount} fields &middot; {t.meta.sectionCount}{' '}
                  {t.meta.sectionCount === 1 ? 'section' : 'sections'}
                </span>
              </div>

              <h3 className="fc-showcase__cell-name">{t.meta.name}</h3>
              <p className="fc-showcase__cell-desc">{t.meta.description}</p>

              <div className="fc-showcase__cell-foot">
                <div className="fc-showcase__cell-tags">
                  {t.meta.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="fc-showcase__cell-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="fc-showcase__cell-id">
                  <span
                    className="fc-showcase__cell-id-pip"
                    aria-hidden="true"
                  />
                  <span className="fc-showcase__cell-id-text">
                    {t.meta.id}
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {remaining > 0 && (
          <div className="fc-showcase__foot">
            <span className="fc-showcase__foot-n">{remaining} more</span>
            in the templates package &mdash; all MIT, all editable
          </div>
        )}
      </div>
    </section>
  );
}
