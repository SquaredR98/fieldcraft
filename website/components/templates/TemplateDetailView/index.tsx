import Link from 'next/link';
import type { Template } from '@/lib/templates';
import { categoryLabels } from '@/lib/templates';
import { TemplateDetailClient } from './TemplateDetailClient';
import './styles.css';

interface TemplateDetailViewProps {
  template: Template;
}

export function TemplateDetailView({ template }: TemplateDetailViewProps) {
  const { meta, schema } = template;
  const schemaJson = JSON.stringify(schema, null, 2);

  return (
    <div className="fc-tpl-detail">
      {/* Page-wide, not scoped to a band — scoped it would end on a
          hard horizontal edge where that band stops. */}
      <div className="fc-tpl-detail__backdrop" aria-hidden="true">
        <div className="fc-v2-grid fc-v2-grid--center" />
        <div className="fc-tpl-detail__glows">
          <i />
          <i />
        </div>
      </div>
      <div className="fc-tpl-detail__inner">
        {/* One card: a full-width header band across the top, the two
            panels splitting below it. The CARD owns the border, the
            radius and the shadow; the header and panels own none of
            the three and are divided by gap:1px over a rule ground —
            the same construction as the hero spec strip and the
            category blocks on /templates. Giving each part its own
            border would double the rules where they meet and turn two
            rounded corners into six. */}
        <div className="fc-tpl-detail__card">
          <header className="fc-tpl-detail__header">
            <div className="fc-tpl-detail__badge">
              {categoryLabels[meta.category]}
            </div>
            <h1 className="fc-tpl-detail__title">{meta.name}</h1>
            {/* Just the parent link: under a title that already shows
                the name, repeating it in the trail says it twice. */}
            <div className="fc-tpl-detail__breadcrumb">
              <Link href="/templates">&larr; All templates</Link>
            </div>
            <p className="fc-tpl-detail__desc">{meta.description}</p>
            <div className="fc-tpl-detail__stats">
              <span>{meta.fieldCount} fields</span>
              <span>&middot;</span>
              <span>
                {meta.sectionCount}{' '}
                {meta.sectionCount === 1 ? 'section' : 'sections'}
              </span>
            </div>
          </header>

          <TemplateDetailClient schema={schema} schemaJson={schemaJson} />
        </div>
      </div>
    </div>
  );
}
