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
      <div className="fc-tpl-detail__inner">
        <div className="fc-tpl-detail__header">
          <div className="fc-tpl-detail__breadcrumb">
            <Link href="/templates">Templates</Link> / {meta.name}
          </div>
          <div className="fc-tpl-detail__badge">
            {categoryLabels[meta.category]}
          </div>
          <h1 className="fc-tpl-detail__title">{meta.name}</h1>
          <p className="fc-tpl-detail__desc">{meta.description}</p>
          <div className="fc-tpl-detail__stats">
            <span>{meta.fieldCount} fields</span>
            <span>&middot;</span>
            <span>
              {meta.sectionCount} {meta.sectionCount === 1 ? 'section' : 'sections'}
            </span>
          </div>
        </div>

        <TemplateDetailClient schema={schema} schemaJson={schemaJson} />
      </div>
    </div>
  );
}
