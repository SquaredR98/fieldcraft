import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../src/components/ui/button";

describe("Button type default", () => {
  it("defaults to type=button so it cannot submit a surrounding form", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("respects an explicit type=submit", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("does not put type on an asChild element", () => {
    render(
      <Button asChild>
        <a href="/next">Continue</a>
      </Button>,
    );
    expect(screen.getByRole("link")).not.toHaveAttribute("type");
  });
});
