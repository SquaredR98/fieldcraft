import type { Metadata } from 'next';
import { ChangelogView } from '@/components/roadmap/RoadmapView';
import { changelog, planned } from '@/lib/changelog';

export const metadata: Metadata = {
  title: 'Changelog — FieldCraft',
  description:
    'Version history and upcoming plans for FieldCraft core, react, and pro packages.',
  openGraph: {
    title: 'Changelog — FieldCraft',
    description:
      'Version history and upcoming plans for FieldCraft core, react, and pro packages.',
    url: 'https://fieldcraft.squaredr.tech/roadmap',
  },
};

export default function ChangelogPage() {
  return <ChangelogView entries={changelog} planned={planned} />;
}
