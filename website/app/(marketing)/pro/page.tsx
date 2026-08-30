import type { Metadata } from 'next';
import { ProView } from '@/components/pro/ProView';

export const metadata: Metadata = {
  title: 'FieldCraft Pro — Form Builder, Response Viewer, Theme Editor',
  description:
    'Drop-in React components for form administration. Visual builder, response viewer, and theme editor. Self-hosted — your data stays in your database. $199 one-time purchase.',
  openGraph: {
    title: 'FieldCraft Pro — Your form admin panel, built in minutes',
    description:
      'A visual form builder, response viewer, and theme editor — all React components. One purchase, no vendor lock-in, your database.',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What\u2019s included in a FieldCraft Pro licence?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Everything: FormBuilder (drag-drop designer), ResponseViewer (table/card/detail/timeline views with export), and ThemeEditor (visual customiser with live preview). Plus twelve months of updates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use one FieldCraft Pro licence for multiple projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each licence key is valid for one production domain. You can use it on unlimited localhost and staging environments during development. Need multiple production domains? Contact us for volume pricing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does FieldCraft Pro require the open-source engine?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Pro components are built on top of @squaredr/fieldcraft-core and @squaredr/fieldcraft-react (both MIT-licensed and free). Install the OSS packages first, then add @squaredr/fieldcraft-pro.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I try FieldCraft Pro before purchasing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Install @squaredr/fieldcraft-pro and use every component on localhost with no time limit and no licence key. The purchase is for a production licence key only \u2014 you already have the software.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I get access to the FieldCraft Pro source code?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Pro package ships as source TypeScript. You can read, debug, and extend the code. The licence permits use in your applications but not redistribution of the Pro source code itself.',
      },
    },
  ],
};

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'FieldCraft Pro',
  description:
    'Drop-in React components for form administration. Visual form builder, response viewer, and theme editor. Self-hosted.',
  brand: { '@type': 'Organization', name: 'SquaredR' },
  offers: {
    '@type': 'Offer',
    price: '199',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://fieldcraft.squaredr.tech/pro',
  },
};

export default function ProPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProView />
    </>
  );
}
