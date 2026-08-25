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

export default function ProPage() {
  return <ProView />;
}
