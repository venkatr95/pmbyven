import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { TableOfContents } from "./toc";

const headings = [
  { level: 2, text: "Why this matters", id: "why-this-matters" },
  { level: 2, text: "The craft stack", id: "the-craft-stack" },
  { level: 3, text: "Details", id: "details" },
];

describe("TableOfContents", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    headings.forEach((h) => {
      const el = document.createElement("h2");
      el.id = h.id;
      // Distinct body text so TOC labels are unique in queries
      el.textContent = `Heading: ${h.text}`;
      document.body.appendChild(el);
    });
  });

  it("renders nothing when headings are empty", () => {
    const { container } = render(<TableOfContents headings={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders contents label and heading links", () => {
    render(<TableOfContents headings={headings} />);
    expect(screen.getByText("Contents")).toBeInTheDocument();
    const nav = screen.getByRole("navigation");
    expect(within(nav).getByText("Why this matters")).toBeInTheDocument();
    expect(within(nav).getByText("The craft stack")).toBeInTheDocument();
    expect(within(nav).getByText("Details")).toBeInTheDocument();
  });

  it("collapses when contents button is clicked", async () => {
    const user = userEvent.setup();
    render(<TableOfContents headings={headings} />);
    const nav = screen.getByRole("navigation");
    expect(within(nav).getByText("Why this matters")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /contents/i }));
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("scrolls to heading on click", async () => {
    const user = userEvent.setup();
    const target = document.getElementById("why-this-matters")!;
    const spy = vi.spyOn(target, "scrollIntoView");

    render(<TableOfContents headings={headings} />);
    const nav = screen.getByRole("navigation");
    await user.click(within(nav).getByText("Why this matters"));
    expect(spy).toHaveBeenCalled();
  });
});
