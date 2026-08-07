import { TableOfContents } from '../TableOfContents';
import './styles.css';

interface Heading {
  id: string;
  text: string;
}

interface PostSidebarProps {
  headings: Heading[];
}

export function PostSidebar({ headings }: PostSidebarProps) {
  return (
    <aside className="fc-blog-sidebar">
      <TableOfContents headings={headings} />
    </aside>
  );
}
