import { generateOgImage, OG_SIZE } from '@/lib/og-image';
import { getPostBySlug, getAllSlugs } from '@/lib/blog';

export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  return [
    {
      id: 'og',
      alt: post?.title ?? 'FieldCraft Blog',
      contentType: 'image/png',
      size: OG_SIZE,
    },
  ];
}

export default async function OgImage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return generateOgImage({
      eyebrow: 'Blog',
      title: 'FieldCraft Blog',
    });
  }

  return generateOgImage({
    eyebrow: post.category ?? 'Blog',
    title: post.title,
    description: post.description,
  });
}
