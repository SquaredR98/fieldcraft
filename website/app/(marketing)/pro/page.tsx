import type { Metadata } from 'next';
import { ProView } from '@/components/pro/ProView';

export const metadata: Metadata = {
  title: 'FieldCraft Pro — Form Builder, Response Viewer, Theme Editor',
  description:
    'Drop-in React components for form administration: a visual form builder, a response viewer, and a theme editor. One-time licence, unlimited developers.',
  openGraph: {
    title: 'FieldCraft Pro — Form Builder, Response Viewer, Theme Editor',
    description:
      'Visual builder, response viewer and theme editor as React components you embed in your own admin. One-time licence.',
  },
  // Indexed, and linked from the nav. Deliberately NO Product/Offer
  // structured data while the purchase CTA reads "Coming soon" — offering
  // a price and InStock availability to search engines for something that
  // cannot be bought yet would be false.
};

export default function ProPage() {
  return <ProView />;
}
