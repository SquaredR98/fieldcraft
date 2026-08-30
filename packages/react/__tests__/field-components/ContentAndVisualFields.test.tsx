import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WelcomeScreenField } from "../../src/components/fields/WelcomeScreenField";
import { ThankYouScreenField } from "../../src/components/fields/ThankYouScreenField";
import { RichTextField } from "../../src/components/fields/RichTextField";
import { ImageField } from "../../src/components/fields/ImageField";
import { VideoField } from "../../src/components/fields/VideoField";
import type { FieldProps } from "../../src/registry/field-registry";
import type { Question } from "@squaredr/fieldcraft-core";

function makeBaseProps(field: Partial<Question>): FieldProps {
  return {
    field: field as Question,
    value: undefined,
    error: undefined,
    touched: false,
    disabled: false,
    readonly: false,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    onFocus: vi.fn(),
    theme: {},
  };
}

describe("Content & Visual Fields", () => {
  it("WelcomeScreenField renders heading, description, and start button", () => {
    const props = makeBaseProps({
      id: "welcome",
      type: "welcome-screen",
      label: "Welcome",
      config: {
        type: "welcome-screen",
        heading: "Welcome to our Survey",
        description: "It only takes 2 minutes to complete.",
        buttonText: "Begin",
      },
    });
    render(<WelcomeScreenField {...props} />);
    expect(screen.getByText("Welcome to our Survey")).toBeInTheDocument();
    expect(screen.getByText("It only takes 2 minutes to complete.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Begin" })).toBeInTheDocument();
  });

  it("ThankYouScreenField renders completion message", () => {
    const props = makeBaseProps({
      id: "thankyou",
      type: "thank-you-screen",
      label: "Thank You",
      config: {
        type: "thank-you-screen",
        heading: "Thank you for your submission!",
        description: "We will contact you shortly.",
      },
    });
    render(<ThankYouScreenField {...props} />);
    expect(screen.getByText("Thank you for your submission!")).toBeInTheDocument();
    expect(screen.getByText("We will contact you shortly.")).toBeInTheDocument();
  });

  it("RichTextField sanitizes and renders markdown content safely", () => {
    const props = makeBaseProps({
      id: "rich",
      type: "rich-text",
      label: "Documentation",
      config: {
        type: "rich-text",
        format: "markdown",
        content: "### Important Notes\nPlease **read** carefully.",
      },
    });
    render(<RichTextField {...props} />);
    expect(screen.getByRole("heading", { level: 3, name: "Important Notes" })).toBeInTheDocument();
    expect(screen.getByText("read")).toBeInTheDocument();
  });

  it("ImageField renders img tag with src and alt text", () => {
    const props = makeBaseProps({
      id: "img",
      type: "image",
      label: "Hero Image",
      config: {
        type: "image",
        src: "https://example.com/hero.png",
        alt: "Hero Banner",
      },
    });
    render(<ImageField {...props} />);
    const img = screen.getByRole("img", { name: "Hero Banner" });
    expect(img).toHaveAttribute("src", "https://example.com/hero.png");
  });

  it("VideoField renders iframe video embed with title", () => {
    const props = makeBaseProps({
      id: "vid",
      type: "video",
      label: "Product Intro",
      config: {
        type: "video",
        src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        provider: "youtube",
      },
    });
    render(<VideoField {...props} />);
    const iframe = screen.getByTitle("Product Intro");
    expect(iframe).toBeInTheDocument();
  });
});
