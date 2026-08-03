import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Subscribe</Button>);
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-primary");
  });

  it("supports outline and cta variants", () => {
    const { rerender } = render(<Button variant="outline">Out</Button>);
    expect(screen.getByRole("button")).toHaveClass("border");

    rerender(<Button variant="cta">CTA</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gradient-to-r");
  });

  it("supports sizes", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-12");
  });

  it("is disabled when disabled prop is set", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("fires onClick when enabled", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders as child when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/blog">Blog link</a>
      </Button>
    );
    expect(screen.getByRole("link", { name: "Blog link" })).toHaveAttribute(
      "href",
      "/blog"
    );
  });
});
