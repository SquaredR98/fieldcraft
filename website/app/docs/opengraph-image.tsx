import { generateOgImage, OG_SIZE } from '@/lib/og-image';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Documentation — FieldCraft';

export default async function OgImage() {
  return generateOgImage({
    eyebrow: 'Documentation',
    title: 'Guides, API reference, and examples.',
    description:
      'Everything you need to build forms with FieldCraft. Schema definition, engine API, React components, and adapters.',
  });
}
