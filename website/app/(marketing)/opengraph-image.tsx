import { generateOgImage, OG_SIZE } from '@/lib/og-image';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'FieldCraft — Schema-driven form engine for React';

export default async function OgImage() {
  return generateOgImage({
    eyebrow: 'Open Source',
    title: 'Schema-driven form engine for React.',
    description:
      '44 field types, validation, conditional logic, multi-step navigation, and draft persistence. One JSON schema.',
  });
}
