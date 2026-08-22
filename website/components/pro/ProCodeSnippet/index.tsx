import '../shared.css';
import './styles.css';

function M({ children }: { children: React.ReactNode }) {
  return <span className="fc-pro-code__muted">{children}</span>;
}
function S({ children }: { children: React.ReactNode }) {
  return <span className="fc-pro-code__string">{children}</span>;
}
function T({ children }: { children: React.ReactNode }) {
  return <span className="fc-pro-code__tag">{children}</span>;
}

export function ProCodeSnippet() {
  return (
    <section className="fc-pro-section fc-pro-section--surface">
      <div className="fc-pro-section__inner">
        <div className="fc-pro-code__grid fc-pro-2col">
          <div>
            <div className="fc-pro-eyebrow">
              <div className="fc-pro-eyebrow__dot" />
              Integration
            </div>
            <h2 className="fc-pro-h2">
              One provider, then the components
            </h2>
            <p className="fc-pro-sub">
              Wrap your admin route in the provider with your licence key. Every
              Pro component reads it from context — no per-component config, no
              build step.
            </p>
            <div className="fc-pro-code__compat">
              Works with Next.js, Vite, Remix, and any React 18+ setup
            </div>
          </div>

          <div className="fc-pro-code__block">
            <div className="fc-pro-code__chrome">
              <span className="fc-pro-code__chrome-file">app/admin/forms/page.tsx</span>
              <span className="fc-pro-code__chrome-copy">Copy</span>
            </div>
            <pre className="fc-pro-code__pre"><M>{`'use client'`}</M>{'\n'}<M>import</M>{' { FieldCraftProProvider, FormBuilder } '}<M>from</M>{' '}<S>{`'@squaredr/fieldcraft-pro'`}</S>{'\n\n'}<M>export default function</M>{' '}<T>FormsAdmin</T>{'() {\n  '}<M>return</M>{' (\n    <'}<T>FieldCraftProProvider</T>{' licenseKey={process.env.NEXT_PUBLIC_FC_KEY}>\n      <'}<T>FormBuilder</T>{'\n        schema={schema}\n        onSave={(next) => saveSchema(next)}\n        modules={['}<S>{`'telehealth'`}</S>{']}\n      />\n    </'}<T>FieldCraftProProvider</T>{'>\n  )\n}'}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
