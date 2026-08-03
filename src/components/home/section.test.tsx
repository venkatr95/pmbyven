import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { Section } from "./section";

describe("Section", () => {
  it("renders title and children", () => {
    render(
      <Section title="Latest Articles">
        <div>Article grid</div>
      </Section>
    );
    expect(screen.getByRole("heading", { name: "Latest Articles" })).toBeInTheDocument();
    expect(screen.getByText("Article grid")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <Section title="Trending" description="What readers love this week.">
        <span>content</span>
      </Section>
    );
    expect(screen.getByText("What readers love this week.")).toBeInTheDocument();
  });

  it("renders view-all link when href is set", () => {
    render(
      <Section title="Blog" href="/blog" hrefLabel="See all">
        <span>x</span>
      </Section>
    );
    const link = screen.getByRole("link", { name: /see all/i });
    expect(link).toHaveAttribute("href", "/blog");
  });

  it("sets section id for anchors", () => {
    const { container } = render(
      <Section id="newsletter" title="Newsletter">
        <span>form</span>
      </Section>
    );
    expect(container.querySelector("#newsletter")).toBeTruthy();
  });
});
