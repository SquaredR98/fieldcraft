import React from 'react';
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
  table: (props) => (
    <div className="fc-docs__table-wrap">
      <table className="fc-docs__table" {...props} />
    </div>
  ),
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
    const preProps = props as Record<string, unknown>;
    const codeChild = props.children as React.ReactElement<{
      className?: string;
      children?: React.ReactNode;
    }>;

    // Detect terminal / bash commands from Fumadocs pre icon or data attributes
    const iconStr = typeof preProps['icon'] === 'string' ? (preProps['icon'] as string) : '';
    const isTerminal =
      iconStr.includes('m 4,4') ||
      iconStr.includes('M8 18h8') ||
      iconStr.includes('terminal');

    // Extract language from <code className="language-xxx"> or from pre data-language
    const codeClassName = codeChild?.props?.className ?? '';
    const langMatch = codeClassName.match(/language-(\w+)/);
    const lang =
      langMatch?.[1] ||
      (typeof preProps['data-language'] === 'string'
        ? (preProps['data-language'] as string)
        : undefined);

    // Extract title from meta string or props if present
    const title =
      (preProps['data-title'] as string | undefined) ||
      (preProps.title as string | undefined) ||
      ((codeChild?.props as Record<string, unknown> | undefined)?.[
        'data-title'
      ] as string | undefined);

    // Extract plain text for the copy button
    const code = extractText(codeChild?.props?.children);

    // Filter out standalone newline text nodes between <span className="line"> elements.
    // In <pre> (white-space: pre), having both `display: block` on .line AND literal \n text nodes
    // causes the browser to render a block break PLUS a newline break, producing double-spaced lines.
    let sanitizedCodeChild: React.ReactNode = codeChild;
    if (
      codeChild &&
      React.isValidElement(codeChild) &&
      Array.isArray((codeChild.props as { children?: React.ReactNode })?.children)
    ) {
      const filtered = (
        (codeChild.props as { children: React.ReactNode[] }).children
      ).filter(
        (child) =>
          typeof child !== 'string' || (child !== '\n' && child !== '\r\n')
      );
      sanitizedCodeChild = React.cloneElement(codeChild, {}, filtered);
    }

    // Pass the pre element through with sanitized code children
    return (
      <DocsCodeBlock
        title={title}
        lang={lang}
        code={code}
        isTerminal={isTerminal}
      >
        <pre {...props}>{sanitizedCodeChild}</pre>
      </DocsCodeBlock>
    );
  },
  // Custom components available in MDX
  Callout: DocsCallout,
};
