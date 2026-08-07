import type { ReactNode } from 'react';
import { IntroducingFieldCraft } from './illustrations/IntroducingFieldCraft';
import { WhySchemaDriven } from './illustrations/WhySchemaDriven';
import { BuildMultiStepSurvey } from './illustrations/BuildMultiStepSurvey';
import { ValidationPipeline } from './illustrations/ValidationPipeline';
import { AccessibleFormsGuide } from './illustrations/AccessibleFormsGuide';
import { ConversationalForms } from './illustrations/ConversationalForms';
import { FormUxLessons } from './illustrations/FormUxLessons';
import { SchemaVsCode } from './illustrations/SchemaVsCode';
import { RealCostForms } from './illustrations/RealCostForms';
import { SelfHostedVsCloud } from './illustrations/SelfHostedVsCloud';
import { BuildWithoutCode } from './illustrations/BuildWithoutCode';
import { AdaptersOpenSource } from './illustrations/AdaptersOpenSource';
import './styles.css';

interface CoverIllustrationProps {
  slug: string;
  className?: string;
}

export function CoverIllustration({ slug, className }: CoverIllustrationProps) {
  return (
    <div
      className={`fc-illus ${className ?? ''}`}
      aria-hidden="true"
    >
      <div className="fc-illus__grid" />
      {renderIllustration(slug)}
    </div>
  );
}

function renderIllustration(slug: string): ReactNode {
  switch (slug) {
    case 'introducing-fieldcraft':
      return <IntroducingFieldCraft />;
    case 'why-schema-driven':
      return <WhySchemaDriven />;
    case 'build-multi-step-survey':
      return <BuildMultiStepSurvey />;
    case 'fieldcraft-validation-pipeline':
      return <ValidationPipeline />;
    case 'accessible-forms-guide':
      return <AccessibleFormsGuide />;
    case 'conversational-forms':
      return <ConversationalForms />;
    case 'form-ux-lessons':
      return <FormUxLessons />;
    case 'schema-vs-code-driven-forms':
      return <SchemaVsCode />;
    case 'real-cost-building-forms':
      return <RealCostForms />;
    case 'self-hosted-vs-cloud-forms':
      return <SelfHostedVsCloud />;
    case 'build-forms-without-code':
      return <BuildWithoutCode />;
    case 'fieldcraft-adapters-now-open-source':
      return <AdaptersOpenSource />;
    default:
      return <DefaultIllustration />;
  }
}

/* ─── Default Fallback ─── */
function DefaultIllustration() {
  return (
    <div className="fc-illus__default">
      <span className="fc-illus__default-text">FC</span>
    </div>
  );
}
