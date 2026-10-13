import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { inlineMarkdownToHtml, FormattedText } from "../src/utils/inline-markdown";

/**
 * Formatting on the question itself, replacing the `rich-text` block.
 *
 * A block is unrelated content to a screen reader, vanishes in conversational
 * mode, and stays behind when the question is reordered. A formatted label
 * travels with its question and stays bound to the input.
 *
 * The subset is deliberately narrower than `RichTextField`'s converter, which
 * permits headings, images, tables and `style`.
 */

describe("inlineMarkdownToHtml — supported subset", () => {
  it("renders bold, italic and code", () => {
    expect(inlineMarkdownToHtml("**bold**")).toContain("<strong>bold</strong>");
    expect(inlineMarkdownToHtml("_italic_")).toContain("<em>italic</em>");
    expect(inlineMarkdownToHtml("`code`")).toContain("<code>code</code>");
  });

  it("does not read **bold** as two italic markers", () => {
    const html = inlineMarkdownToHtml("**bold**");
    expect(html).toContain("<strong>");
    expect(html).not.toContain("<em>");
  });

  it("renders links with safe rel attributes", () => {
    const html = inlineMarkdownToHtml("[docs](https://example.com)");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("groups adjacent markers into one list", () => {
    const html = inlineMarkdownToHtml("- one\n- two");
    expect(html).toContain("<ul>");
    expect((html.match(/<li>/g) ?? []).length).toBe(2);
    expect((html.match(/<ul>/g) ?? []).length).toBe(1);
  });
});

describe("inlineMarkdownToHtml — deliberately NOT supported", () => {
  it("does not render headings", () => {
    // An <h1> inside a question label breaks the document outline.
    const html = inlineMarkdownToHtml("# Heading");
    expect(html).not.toContain("<h1>");
  });

  it("does not render images", () => {
    const html = inlineMarkdownToHtml("![alt](https://example.com/x.png)");
    expect(html).not.toContain("<img");
  });
});

describe("inlineMarkdownToHtml — untrusted input", () => {
  // Schemas often come out of a database row, so label text is untrusted even
  // when the schema author is trusted.
  it("does not execute a script tag", () => {
    const html = inlineMarkdownToHtml('<script>alert("x")</script>');
    expect(html).not.toContain("<script");
  });

  it("neutralises an injected img with an event handler", () => {
    const html = inlineMarkdownToHtml('<img src=x onerror="alert(1)">');
    // The source is escaped before any parsing, so this becomes display text:
    // no element is created and no handler can fire. Asserting the absence of
    // the string "onerror" would be the wrong test — it survives as escaped
    // text, which is exactly the intended outcome.
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });

  it("drops javascript: hrefs", () => {
    const html = inlineMarkdownToHtml("[click](javascript:alert(1))");
    expect(html).not.toContain("javascript:");
  });

  it("shows literal markup as text rather than parsing it", () => {
    const html = inlineMarkdownToHtml("5 < 10 and 10 > 5");
    expect(html).toContain("&lt;");
    expect(html).toContain("&gt;");
  });
});

describe("FormattedText", () => {
  it("renders plain text without interpreting markdown", () => {
    // The default must stay literal: an existing label containing an asterisk
    // must not suddenly become italic after upgrading.
    render(<FormattedText text="**not bold**" />);
    expect(screen.getByText("**not bold**")).toBeInTheDocument();
  });

  it("interprets markdown when asked", () => {
    const { container } = render(
      <FormattedText text="Over the **last 2 weeks**" format="markdown" />,
    );
    expect(container.querySelector("strong")?.textContent).toBe("last 2 weeks");
  });
});
