import type { Metadata } from 'next';
import { AboutView } from '@/components/about/AboutView';

export const metadata: Metadata = {
  title: 'About — FieldCraft',
  description:
    'FieldCraft is built and maintained by one developer. What that means for the project, what was learned building it, and where the source lives.',
  openGraph: {
    title: 'About — FieldCraft',
    description:
      'FieldCraft is built and maintained by one developer. What that means for the project, and what was learned building it.',
  },
};

export default function AboutPage() {
  return <AboutView />;
}
