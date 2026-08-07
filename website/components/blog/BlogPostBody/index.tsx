import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';
import './styles.css';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const mdxComponents: MDXComponents = {
  h2: (props: ComponentPropsWithoutRef<'h2'>) => {
    const text =
      typeof props.children === 'string'
        ? props.children
        : String(props.children ?? '');
    const id = slugify(text);
    return <h2 id={id} {...props} />;
  },
};

interface BlogPostBodyProps {
  content: string;
}

export function BlogPostBody({ content }: BlogPostBodyProps) {
  return (
    <div className="fc-blog-post__content">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  theme: {
                    light: 'vitesse-light',
                    dark: 'vitesse-dark',
                  },
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
        components={mdxComponents}
      />
    </div>
  );
}
