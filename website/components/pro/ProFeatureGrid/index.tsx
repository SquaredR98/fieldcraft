import '../shared.css';
import './styles.css';

type Group = { title: string; items: string[] };

const groups: Group[] = [
  { title: 'Form Builder', items: ['Drag-and-drop field placement', 'Section and step management', 'Conditional logic editor', 'Validation rule builder', 'Undo / redo history', 'Keyboard shortcuts', 'JSON import and export', 'Live schema preview', 'Duplicate and reorder fields'] },
  { title: 'Response Viewer', items: ['Table, card, detail and split views', 'Full-text search', 'Column filters and sorting', 'Bulk select and delete', 'CSV and JSON export', 'Per-response detail pane', 'Computed score columns', 'Pagination and page size', 'Column visibility control'] },
  { title: 'Theme Editor', items: ['Token-level colour editing', 'Typography scale control', 'Density and radius presets', 'Live form preview', 'Palette generator', 'CSS variable export', 'Theme object export', 'Six built-in presets'] },
  { title: 'Telehealth', items: ['PHQ-9 with severity bands', 'GAD-7 scoring', 'PSS-10 subscales', 'Pain scale field', 'Body region selector', 'Vitals with reference ranges', '14 clinical templates'] },
  { title: 'Developer Experience', items: ['Full TypeScript types', 'Tree-shakeable ESM build', 'SSR and RSC compatible', 'Headless hooks for custom UI', 'Documented component API', 'Zero required config'] },
  { title: 'Licensing', items: ['One-time $199 payment', 'One production domain', 'Unlimited dev and staging', 'Client project use permitted', '12 months of updates', 'Private issue tracker'] },
];

export function ProFeatureGrid() {
  return (
    <section className="fc-pro-section">
      <div className="fc-pro-section__inner">
        <div className="fc-pro-eyebrow">
          <div className="fc-pro-eyebrow__dot" />
          Everything in the box
        </div>
        <h2 className="fc-pro-h2" style={{ marginBottom: 36 }}>
          {groups.reduce((n, g) => n + g.items.length, 0)} features, one licence
        </h2>

        <div className="fc-pro-grid-1px fc-pro-grid-1px--3col" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          {groups.map((g) => (
            <div key={g.title}>
              <div className="fc-pro-features__header">
                <div className="fc-pro-features__cat-title">{g.title}</div>
                <div className="fc-pro-features__cat-count">{g.items.length} items</div>
              </div>
              <div className="fc-pro-features__items">
                {g.items.map((item) => (
                  <div key={item} className="fc-pro-features__item">
                    <span className="fc-pro-features__check">&#10003;</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
