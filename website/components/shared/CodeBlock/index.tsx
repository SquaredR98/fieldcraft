import { codeToHast } from 'shiki';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import './styles.css';

type CodeBlockProps = {
  code: string;
  lang: 'json' | 'tsx' | 'bash' | 'typescript';
  className?: string;
};

export async function CodeBlock({ code, lang, className = '' }: CodeBlockProps) {
  const hast = await codeToHast(code, {
    lang,
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  });

  const rendered = toJsxRuntime(hast, {
    Fragment,
    jsx: jsx as any,
    jsxs: jsxs as any,
  });

  return (
    <div className={`fc-code-block ${className}`}>
      <div className="fc-code-block__content">
        {rendered}
      </div>
    </div>
  );
}
