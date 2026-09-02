import { generateOgImage, OG_SIZE } from '@/lib/og-image';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Changelog — FieldCraft';

export default async function OgImage() {
  return generateOgImage({
    eyebrow: 'Changelog',
    title: "What we've shipped.",
    description:
      'Version history across FieldCraft core, react, and pro packages.',
  });
}
