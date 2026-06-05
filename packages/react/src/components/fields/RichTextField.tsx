import { useMemo } from "react";
import DOMPurify from "dompurify";
import type { RichTextConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";

/**
 * Simple markdown to HTML converter for basic formatting
 * Supports: bold, italic, links, headings, lists
 */
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Headings
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Line breaks
  html = html.replace(/\n/g, "<br>");

  return html;
}

export function RichTextField({ field, theme }: FieldProps) {
  const config = field.config as RichTextConfig | undefined;

  const sanitizedHtml = useMemo(() => {
    if (!config?.content) return "";

    let html = config.content;

    // Convert markdown to HTML if needed
    if (config.format === "markdown") {
      html = markdownToHtml(html);
    }

    // Sanitize HTML to prevent XSS attacks
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "a",
        "blockquote",
        "code",
        "pre",
        "img",
        "div",
        "span",
        "figure",
        "figcaption",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "hr",
        "sup",
        "sub",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "width", "height", "class", "style"],
    });
  }, [config?.content, config?.format]);

  if (!config) return null;

  return (
    <div
      className={config.containerClassName}
      style={{
        padding: "1rem 0",
        lineHeight: "1.6",
        fontFamily: theme.typography?.fontFamily ?? "inherit",
        color: theme.colors?.text ?? "inherit",
        ...((config.containerStyle as React.CSSProperties) ?? {}),
      }}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
