import type { Metadata } from 'next';
import { ProView } from '@/components/pro/ProView';

export const metadata: Metadata = {
  title: 'FieldCraft Pro — Form Builder, Response Viewer, Theme Editor',
  description:
    'Drop-in React components for form administration. Visual builder, response viewer, and theme editor.',
  // Unlinked and not indexed — Pro is shelved. See the "What's missing"
  // section on the homepage. Product/FAQ structured data was removed with it:
  // it advertised a price and InStock availability to search engines.
  robots: { index: false, follow: false },
};

export default function ProPage() {
  return <ProView />;
}
