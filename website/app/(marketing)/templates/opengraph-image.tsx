import { generateOgImage, OG_SIZE } from '@/lib/og-image';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Form Templates — FieldCraft';

export default async function OgImage() {
  return generateOgImage({
    eyebrow: 'Templates',
    title: '16 production-ready form schemas.',
    description:
      'Contact forms, surveys, job applications, event registration, and more. Drop into any React project.',
  });
}
