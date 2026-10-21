import type { Metadata } from 'next';
import { ConditionalLogicView } from '@/components/conditionalLogic/ConditionalLogicView';

const URL =
  'https://fieldcraft.squaredr.tech/conditional-logic-forms';

const DESCRIPTION =
  'How to build conditional logic in React forms — show and hide fields, combine rules with AND/OR, and branch whole sections — as schema properties rather than component state.';

export const metadata: Metadata = {
  alternates: { canonical: URL },
  title: 'Conditional logic in React forms',
  description: DESCRIPTION,
  openGraph: {
    title: 'Conditional logic in React forms — FieldCraft',
    description: DESCRIPTION,
    url: URL,
    type: 'article',
  },
};

/* Counted from the ConditionOperator union, core/src/types/conditions.ts.
   Rule 1. */
const OPERATOR_COUNT = 25;

export default function ConditionalLogicPage() {
  /* TechArticle rather than FAQPage: this page teaches one technique
     end to end rather than answering discrete questions, and marking
     it up as an FAQ when it is not would be schema that does not
     match the content. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Conditional logic in React forms',
    description: DESCRIPTION,
    url: URL,
    proficiencyLevel: 'Beginner',
    author: {
      '@type': 'Organization',
      name: 'SquaredR',
      url: 'https://squaredr.tech',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SquaredR',
      url: 'https://squaredr.tech',
    },
    about: {
      '@type': 'SoftwareApplication',
      name: 'FieldCraft',
      applicationCategory: 'DeveloperApplication',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ConditionalLogicView operatorCount={OPERATOR_COUNT} />
    </>
  );
}
