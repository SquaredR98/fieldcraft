// source.config.ts
import { defineDocs, defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";
var docs = defineDocs({
  dir: "content/docs"
});
var blogPosts = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string(),
    date: z.string().date().or(z.date())
  })
});
var source_config_default = defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "vitesse-light",
        dark: "vitesse-dark"
      }
    }
  }
});
export {
  blogPosts,
  source_config_default as default,
  docs
};
