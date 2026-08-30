import type { Metadata } from 'next';
import { ChangelogView } from '@/components/roadmap/RoadmapView';
import { changelog, planned } from '@/lib/changelog';

export const metadata: Metadata = {
  title: 'Changelog — FieldCraft',
  description:
    'Release history for FieldCraft core, react, and pro packages. New field types, engine improvements, and upcoming features.',
  openGraph: {
    title: 'Changelog — FieldCraft',
    description:
      'Release history for FieldCraft core, react, and pro packages. New field types, engine improvements, and upcoming features.',
    url: 'https://fieldcraft.squaredr.tech/roadmap',
  },
};

export default function ChangelogPage() {
  return <ChangelogView entries={changelog} planned={planned} />;
}
