import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import { FormEngineRenderer } from "../src/components/FormEngineRenderer";
import {
  DEPRECATED_FIELD_TYPES,
  DEPRECATION_REMOVAL_DATE,
  __resetDeprecationWarnings,
} from "../src/utils/deprecations";

/**
 * Deprecation notices for the 19 field types leaving the OSS package, plus
 * `rich-text`, which is replaced rather than relocated.
 *
 * This is the first change in the stability pass that existing users SEE —
 * everything before it was a fix they would only notice working. So the tests
 * cover the contract of the message, not just that something was logged.
 */

function schemaWith(type: string): FormEngineSchema {
  return {
    id: "dep",
    version: "1.0.0",
    submitAction: { type: "callback" },
    title: "Deprecation",
    settings: { displayMode: "classic", showProgress: false },
    sections: [
      {
        id: "s1",
        title: "S",
        questions: [{ id: "f1", type, label: "Field" }],
      },
    ],
  };
}

let warn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  __resetDeprecationWarnings();
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  warn.mockRestore();
});

const messages = () => warn.mock.calls.map((c) => String(c[0])).join("\n");

describe("deprecation warnings — when they fire", () => {
  it("warns for a deprecated field type", () => {
    render(<FormEngineRenderer schema={schemaWith("signature")} onSubmit={vi.fn()} />);
    expect(messages()).toContain('"signature" field type is deprecated');
  });

  it("does not warn for a field that is staying", () => {
    render(<FormEngineRenderer schema={schemaWith("short_text")} onSubmit={vi.fn()} />);
    expect(messages()).not.toContain("deprecated");
  });

  it("warns once per type, not once per render", () => {
    // A warning that repeats on every render is noise a developer learns to
    // ignore, which defeats the purpose.
    const { rerender } = render(
      <FormEngineRenderer schema={schemaWith("signature")} onSubmit={vi.fn()} />,
    );
    rerender(<FormEngineRenderer schema={schemaWith("signature")} onSubmit={vi.fn()} />);

    const hits = warn.mock.calls.filter((c) =>
      String(c[0]).includes('"signature"'),
    );
    expect(hits).toHaveLength(1);
  });
});

describe("deprecation warnings — what they say", () => {
  it("states the removal date", () => {
    render(<FormEngineRenderer schema={schemaWith("signature")} onSubmit={vi.fn()} />);
    expect(messages()).toContain(DEPRECATION_REMOVAL_DATE);
  });

  it("reassures that nothing breaks yet", () => {
    // The most useful sentence for someone who has just seen a scary warning.
    render(<FormEngineRenderer schema={schemaWith("signature")} onSubmit={vi.fn()} />);
    expect(messages()).toContain("Nothing breaks before then");
  });

  it("gives the reason, and gives it checkably", () => {
    render(<FormEngineRenderer schema={schemaWith("signature")} onSubmit={vi.fn()} />);
    const m = messages();
    // Both claims are verifiable by the reader: grep the templates, and check
    // which components call fieldAria().
    expect(m).toContain("unused across all 16 shipped templates");
    expect(m).toContain("broken label association");
  });

  it("gives the free escape hatch", () => {
    render(<FormEngineRenderer schema={schemaWith("signature")} onSubmit={vi.fn()} />);
    const m = messages();
    expect(m).toContain("createFieldRegistry");
    expect(m).toContain("keeps working after removal");
  });

  it("never mentions the paid product, for any of the 19", () => {
    // A deprecation notice that points at a paid product reads as a sales
    // tactic even when it is not. Deliberate, and asserted so it stays true.
    //
    // Checks every type rather than a sample, because the risk is one message
    // drifting later rather than the shape being wrong today.
    for (const type of DEPRECATED_FIELD_TYPES) {
      __resetDeprecationWarnings();
      warn.mockClear();

      const schema = schemaWith(type);
      // Some types will not pass schema validation without their config —
      // `ranking` requires options, for instance. The warning fires from
      // FieldRenderer, so the schema has to be valid enough to render.
      if (type === "ranking") {
        schema.sections[0].questions[0].options = [
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ];
      }

      render(<FormEngineRenderer schema={schema} onSubmit={vi.fn()} />);
      const m = messages();
      // Matching the bare word "Pro" would hit "FieldProps", so test the
      // things that would actually constitute an upsell.
      expect(m).not.toContain("fieldcraft-pro");
      expect(m).not.toContain("PRO_FIELD_OVERRIDES");
      expect(m).not.toContain("licence");
      expect(m).not.toMatch(/\bPro\b/);
    }
  });
});

describe("rich-text is replaced, not relocated", () => {
  it("points at the replacement instead of the escape hatch", () => {
    render(<FormEngineRenderer schema={schemaWith("rich-text")} onSubmit={vi.fn()} />);
    const m = messages();
    expect(m).toContain("labelFormat");
    expect(m).toContain("contentFormat");
  });

  it("explains why formatting belongs on the question", () => {
    render(<FormEngineRenderer schema={schemaWith("rich-text")} onSubmit={vi.fn()} />);
    expect(messages()).toContain("unrelated content to a screen reader");
  });
});

describe("the deprecation list itself", () => {
  it("covers all 19 moving types", () => {
    expect(DEPRECATED_FIELD_TYPES.size).toBe(19);
  });

  it("does not list anything OSS is keeping", () => {
    // A type in both lists would be a contradiction the plan cannot survive.
    const keeping = [
      "short_text", "long_text", "email", "phone", "url", "number",
      "single_select", "multi_select", "dropdown", "boolean",
      "date", "rating", "nps", "likert", "opinion_scale", "consent",
      "hidden", "calculated",
      "section_header", "page_break", "divider", "spacer", "info_block",
      "thank-you-screen",
    ];
    for (const type of keeping) {
      expect(DEPRECATED_FIELD_TYPES.has(type)).toBe(false);
    }
  });
});
