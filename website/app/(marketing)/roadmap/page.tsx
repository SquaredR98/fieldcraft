import type { Metadata } from 'next';
import { RoadmapView } from '@/components/roadmap/RoadmapView';
import { roadmap } from '@/lib/roadmap';

export const metadata: Metadata = {
  title: 'Roadmap \u2014 FieldCraft',
  description:
    "See what's shipped, what's in progress, and what's coming next for FieldCraft.",
  openGraph: {
    title: 'Roadmap \u2014 FieldCraft',
    description:
      "See what's shipped, what's in progress, and what's coming next for FieldCraft.",
    url: 'https://fieldcraft.squaredr.tech/roadmap',
  },
};

export default function RoadmapPage() {
  return <RoadmapView groups={roadmap} />;
}
