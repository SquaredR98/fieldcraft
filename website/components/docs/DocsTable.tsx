interface DocsTableProps {
  children?: React.ReactNode;
}

export function DocsTable({ children }: DocsTableProps) {
  return <table className="fc-docs__table">{children}</table>;
}

export function DocsTableHead({ children }: DocsTableProps) {
  return <thead className="fc-docs__table-head">{children}</thead>;
}

export function DocsTableBody({ children }: DocsTableProps) {
  return <tbody className="fc-docs__table-body">{children}</tbody>;
}
