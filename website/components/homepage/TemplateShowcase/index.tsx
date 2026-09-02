import Link from 'next/link';
import { TemplateCard } from '@/components/templates/TemplateCard';
import type { Template } from '@/lib/templates';
import './styles.css';

interface TemplateShowcaseProps {
  templates: Template[];
}

export function TemplateShowcase({ templates }: TemplateShowcaseProps) {
  return (
    <section id="templates" className="fc-showcase">
      <div className="fc-showcase__inner">
        <div className="fc-showcase__eyebrow">Templates</div>
        <h2 className="fc-showcase__h2">
          Or start from one of these.
        </h2>
        <p className="fc-showcase__sub">
          Schemas I wrote for real forms, cleaned up. Copy one, change the
          fields, render it.
        </p>
        <div className="fc-showcase__grid">
          {templates.map((t) => (
            <TemplateCard key={t.meta.id} meta={t.meta} />
          ))}
        </div>
        <Link href="/templates" className="fc-showcase__cta">
          Explore all templates &rarr;
        </Link>
      </div>
    </section>
  );
}
