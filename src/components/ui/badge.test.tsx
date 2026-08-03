import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders text", () => {
    render(<Badge>Featured</Badge>);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    const { rerender } = render(<Badge variant="default">A</Badge>);
    expect(screen.getByText("A")).toHaveClass("bg-primary");

    rerender(<Badge variant="secondary">B</Badge>);
    expect(screen.getByText("B")).toHaveClass("bg-secondary");

    rerender(<Badge variant="outline">C</Badge>);
    expect(screen.getByText("C")).toHaveClass("border");
  });
});
