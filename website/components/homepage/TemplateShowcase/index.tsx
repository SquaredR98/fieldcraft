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
        <div className="fc-showcase__eyebrow">07 &middot; Templates</div>
        <h2 className="fc-showcase__h2">
          Start from a template, ship faster.
        </h2>
        <p className="fc-showcase__sub">
          Free, production-ready schemas. Copy one, tweak the fields, render
          with FieldCraft.
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
