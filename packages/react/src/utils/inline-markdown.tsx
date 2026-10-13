import { useMemo } from "react";
import DOMPurify from "dompurify";

/**
 * Inline markdown for question labels, help text and info blocks.
 *
 * Deliberately narrower than `RichTextField`'s converter, which permits
 * headings, images, tables and `style`. Those make sense in a standalone
 * content block and are wrong inside a question label: an `<h1>` in a label
 * breaks the document outline, and an image there is almost always a layout
 * accident.
 *
 * Supported: **bold**, _italic_, [links](…), unordered and ordered lists, and
 * line breaks. That covers the case this exists for — clinical wording such as
 * "Over the **last 2 weeks**, how often have you been bothered by…" — without
 * opening the door to arbitrary document structure.
 *
 * Sanitised with DOMPurify against an explicit allow-list rather than a
 * hand-rolled escape. Schemas often come out of a database row, so the content
 * is untrusted input even when the author is trusted.
 *
 * @since 1.11.0
 */

const ALLOWED_TAGS = ["strong", "em", "a", "ul", "ol", "li", "br", "code"];
const ALLOWED_ATTR = ["href", "target", "rel"];

/** Escapes HTML so raw markup in the source is shown, not interpreted. */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Converts the supported inline subset to HTML.
 *
 * The source is escaped first, so a label containing literal `<script>` is
 * displayed as text rather than parsed. DOMPurify then runs as the second
 * layer — escaping alone would be enough for the markup this generates, but
 * defence in depth is cheap here and the cost of being wrong is XSS.
 */
export function inlineMarkdownToHtml(source: string): string {
  let html = escapeHtml(source);

  // Bold before italic: `**x**` must not be read as two italic markers.
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*([^*\n]+?)\*/g, "$1<em>$2</em>");
  html = html.replace(/(^|[^_])_([^_\n]+?)_/g, "$1<em>$2</em>");

  html = html.replace(/`([^`\n]+?)`/g, "<code>$1</code>");

  // Links. The href is attribute-escaped by escapeHtml above, and DOMPurify
  // drops javascript: and data: URLs regardless.
  html = html.replace(
    /\[([^\]]+?)\]\(([^)\s]+?)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // Lists: group runs of adjacent markers into one list element.
  html = html.replace(/(?:^|\n)((?:[-*] .+(?:\n|$))+)/g, (_m, block: string) => {
    const items = block
      .trim()
      .split("\n")
      .map((l) => `<li>${l.replace(/^[-*] /, "")}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  });
  html = html.replace(/(?:^|\n)((?:\d+\. .+(?:\n|$))+)/g, (_m, block: string) => {
    const items = block
      .trim()
      .split("\n")
      .map((l) => `<li>${l.replace(/^\d+\. /, "")}</li>`)
      .join("");
    return `<ol>${items}</ol>`;
  });

  // Remaining newlines become breaks. List markup already consumed its own.
  html = html.replace(/\n/g, "<br>");

  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}

/**
 * Renders `text` according to `format`.
 *
 * Returns a plain string for `"plain"` (the default) so the common case never
 * touches `dangerouslySetInnerHTML` and never pays for sanitising.
 */
export function FormattedText({
  text,
  format,
  className,
}: {
  text: string;
  format?: "plain" | "markdown";
  className?: string;
}) {
  const html = useMemo(
    () => (format === "markdown" ? inlineMarkdownToHtml(text) : null),
    [text, format],
  );

  if (html === null) {
    return className ? <span className={className}>{text}</span> : <>{text}</>;
  }

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
