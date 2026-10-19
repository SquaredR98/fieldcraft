import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import type { MDXComponents } from 'mdx/types';
import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { BlogCodeBlock } from '../BlogCodeBlock';
import './styles.css';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/* rehype-pretty-code wraps every fenced block in a <figure> carrying
   data-rehype-pretty-code-figure, and puts the language on the <pre>
   inside as data-language. Reading the language off the child here
   means the chrome can label the block without the MDX author
   repeating it. */
function figureLanguage(children: ReactNode): string | undefined {
  if (!isValidElement(children)) return undefined;
  const props = children.props as { 'data-language'?: string };
  return props['data-language'];
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

  figure: (props: ComponentPropsWithoutRef<'figure'>) => {
    /* Only code figures get the chrome — an image figure or any other
       use of <figure> in a post passes straight through. */
    const isCode =
      'data-rehype-pretty-code-figure' in props ||
      'data-rehype-pretty-code-fragment' in props;

    if (!isCode) return <figure {...props} />;

    return (
      <BlogCodeBlock language={figureLanguage(props.children)}>
        {props.children}
      </BlogCodeBlock>
    );
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
                  /* Wraps every line in <span class="line">, which is
                     what the CSS line-number counters hook onto. Not
                     emitted by default — the blog's blocks had no
                     line elements at all, so the counters would have
                     matched nothing. The docs pipeline already does
                     this, which is why its numbers work. */
                  onVisitLine(node: { children: unknown[]; properties?: Record<string, unknown> }) {
                    /* An empty line collapses to a zero-height span
                       and breaks the numbering, so it gets a space. */
                    if (node.children.length === 0) {
                      node.children = [{ type: 'text', value: ' ' }];
                    }
                  },
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
