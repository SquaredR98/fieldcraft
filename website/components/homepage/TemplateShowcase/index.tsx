import Link from 'next/link';
import { TemplateCard } from '@/components/templates/TemplateCard';
import type { Template } from '@/lib/templates';
import './styles.css';

/*
 * Three hand-picked templates, with the CTA in the header row rather than
 * stranded under the grid — the v2 spec puts it beside the heading, and
 * there it reads as part of the section rather than an afterthought.
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
    <section id="templates" className="fc-showcase fc-ground-surface">
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

        <div className="fc-showcase__grid">
          {templates.map((t) => (
            <TemplateCard key={t.meta.id} meta={t.meta} />
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
