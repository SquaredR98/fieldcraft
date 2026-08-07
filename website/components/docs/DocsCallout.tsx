interface DocsCalloutProps {
  label: string;
  variant?: 'teal' | 'amber';
  children: React.ReactNode;
}

export function DocsCallout({
  label,
  variant = 'teal',
  children,
}: DocsCalloutProps) {
  return (
    <div
      className={`fc-docs__callout${variant === 'amber' ? ' fc-docs__callout--amber' : ''}`}
    >
      <div className="fc-docs__callout-bar" />
      <div className="fc-docs__callout-content">
        <div className="fc-docs__callout-label">{label}</div>
        <div className="fc-docs__callout-text">{children}</div>
      </div>
    </div>
  );
}
