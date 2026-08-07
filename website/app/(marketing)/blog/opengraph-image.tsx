import { generateOgImage, OG_SIZE } from '@/lib/og-image';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Engineering Blog — FieldCraft';

export default async function OgImage() {
  return generateOgImage({
    eyebrow: 'Blog',
    title: 'Engineering notes from the FieldCraft team.',
    description:
      'Form architecture, validation patterns, accessibility, and shipping decisions.',
  });
}
