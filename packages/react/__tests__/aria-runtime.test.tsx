import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import { FormEngineRenderer } from "../src/components/FormEngineRenderer";

/**
 * Proves the composite fix produces the right DOM, not just the right source.
 * `label-association.test.tsx` asserts every component picked a shape; this
 * asserts the shape actually works.
 */
function schema(type: string, extra: Record<string, unknown> = {}): FormEngineSchema {
  return {
    id: "aria", version: "1.0.0", submitAction: { type: "callback" },
    title: "Aria", settings: { displayMode: "classic", showProgress: false },
    sections: [{ id: "s1", title: "S", questions: [
      { id: "f1", type, label: "My question", helpText: "Some help", ...extra } as never,
    ]}],
  };
}

describe("composite fields are named by their group", () => {
  it("nps: the group carries the accessible name, and no label points nowhere", () => {
    const { container } = render(<FormEngineRenderer schema={schema("nps")} onSubmit={vi.fn()} />);

    // The label is text with a referencable id...
    const labelText = container.querySelector("#f1-label");
    expect(labelText?.textContent).toContain("My question");

    // ...and the group points at it, so the field has a name.
    const group = container.querySelector('[role="radiogroup"]');
    expect(group).toHaveAttribute("aria-labelledby", "f1-label");

    // No <label for> aimed at an element that does not exist.
    const orphan = container.querySelector('label[for="f1"]');
    expect(orphan).toBeNull();
  });

  it("links help text to the group via aria-describedby", () => {
    const { container } = render(<FormEngineRenderer schema={schema("nps")} onSubmit={vi.fn()} />);
    const group = container.querySelector('[role="radiogroup"]');
    expect(group?.getAttribute("aria-describedby")).toContain("f1-help");
    expect(container.querySelector("#f1-help")?.textContent).toBe("Some help");
  });

  it("marks a required composite with aria-required", () => {
    const { container } = render(
      <FormEngineRenderer schema={schema("nps", { required: true })} onSubmit={vi.fn()} />,
    );
    expect(container.querySelector('[role="radiogroup"]')).toHaveAttribute("aria-required", "true");
  });
});

describe("single-input fields keep label-for", () => {
  it("short_text still resolves htmlFor to the input", () => {
    const { container } = render(
      <FormEngineRenderer schema={schema("short_text")} onSubmit={vi.fn()} />,
    );
    expect(container.querySelector('label[for="f1"]')).not.toBeNull();
    expect(container.querySelector("#f1")?.tagName).toBe("INPUT");
  });
});

describe("ranking keeps its list semantics", () => {
  it("is both a named group and a list", () => {
    // Regression: role="group" was briefly put ON the <ol>, destroying the
    // list. The group wraps the list instead.
    const { container } = render(
      <FormEngineRenderer
        schema={schema("ranking", { options: [{ value: "a", label: "A" }, { value: "b", label: "B" }] })}
        onSubmit={vi.fn()}
      />,
    );
    expect(container.querySelector('[role="group"]')).toHaveAttribute("aria-labelledby", "f1-label");
    expect(container.querySelector("ol[role=list]")).not.toBeNull();
  });
});
