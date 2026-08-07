import { generateOgImage, OG_SIZE } from '@/lib/og-image';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Roadmap — FieldCraft';

export default async function OgImage() {
  return generateOgImage({
    eyebrow: 'Roadmap',
    title: "What's shipped, what's next.",
    description:
      'Monthly shipping updates across the FieldCraft engine, adapters, and Pro tools.',
  });
}
