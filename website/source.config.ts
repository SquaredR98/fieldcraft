import { defineDocs, defineCollections, defineConfig } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'content/docs',
});

export const blogPosts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string(),
    date: z.string().date().or(z.date()),
  }),
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    },
  },
});
