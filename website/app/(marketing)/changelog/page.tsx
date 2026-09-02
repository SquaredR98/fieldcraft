import type { Metadata } from 'next';
import { ChangelogView } from '@/components/roadmap/RoadmapView';
import { changelog } from '@/lib/changelog';

export const metadata: Metadata = {
  title: 'Changelog — FieldCraft',
  description:
    'Release history for the FieldCraft core, react, adapters and templates packages. New field types, engine improvements, and fixes.',
  openGraph: {
    title: 'Changelog — FieldCraft',
    description:
      'Release history for the FieldCraft core, react, adapters and templates packages. New field types, engine improvements, and fixes.',
    url: 'https://fieldcraft.squaredr.tech/changelog',
  },
};

export default function ChangelogPage() {
  return <ChangelogView entries={changelog} />;
}
