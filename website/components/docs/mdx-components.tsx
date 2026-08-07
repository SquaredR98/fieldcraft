import type { MDXComponents } from 'mdx/types';
import { DocsCodeBlock } from './DocsCodeBlock';
import { DocsCallout } from './DocsCallout';

/** Recursively extract plain text from React children */
function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && 'props' in node) {
    return extractText(
      (node as React.ReactElement<{ children?: React.ReactNode }>).props
        .children,
    );
  }
  return '';
}

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 {...props} />,
  h3: (props) => <h3 {...props} />,
  p: (props) => <p {...props} />,
  a: (props) => <a {...props} />,
  ul: (props) => <ul {...props} />,
  ol: (props) => <ol {...props} />,
  li: (props) => <li {...props} />,
  strong: (props) => <strong {...props} />,
  hr: (props) => <hr {...props} />,
  table: (props) => <table className="fc-docs__table" {...props} />,
  thead: (props) => <thead className="fc-docs__table-head" {...props} />,
  tbody: (props) => <tbody className="fc-docs__table-body" {...props} />,
  code: (props) => {
    // Inline code — not inside a pre
    return <code {...props} />;
  },
  pre: (props) => {
    // With rehypeCode enabled, fenced code blocks arrive as
    // <pre class="shiki ..." style="..."><code>...highlighted spans...</code></pre>
    //
    // The <code> child may have className="language-xxx" or the pre itself
    // may have data attributes set by rehypeCode.
    const preProps = props as Record<string, unknown>;
    const codeChild = props.children as React.ReactElement<{
      className?: string;
      children?: React.ReactNode;
    }>;

    // Extract language from <code className="language-xxx"> or from pre className
    const codeClassName = codeChild?.props?.className ?? '';
    const langMatch = codeClassName.match(/language-(\w+)/);
    const lang = langMatch?.[1] || undefined;

    // Extract title from meta string if present
    const title = preProps['data-title'] as string | undefined;

    // Extract plain text for the copy button
    const code = extractText(codeChild?.props?.children);

    // Pass the entire <pre> element through — it already contains
    // Shiki-highlighted spans with inline colour styles
    return (
      <DocsCodeBlock title={title} lang={lang} code={code}>
        <pre {...props} />
      </DocsCodeBlock>
    );
  },
  // Custom components available in MDX
  Callout: DocsCallout,
};
