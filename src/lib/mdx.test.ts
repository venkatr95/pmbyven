import { describe, it, expect } from "vitest";
import { extractHeadings } from "./mdx";

describe("extractHeadings", () => {
  it("extracts markdown headings with ids", () => {
    const content = `# Title

## Why this matters

Some text.

### Nested detail

## Closing
`;
    const headings = extractHeadings(content);
    expect(headings).toEqual([
      { level: 1, text: "Title", id: "title" },
      { level: 2, text: "Why this matters", id: "why-this-matters" },
      { level: 3, text: "Nested detail", id: "nested-detail" },
      { level: 2, text: "Closing", id: "closing" },
    ]);
  });

  it("strips inline markdown from heading text", () => {
    const headings = extractHeadings("## **Bold** and `code`");
    expect(headings[0].text).toBe("Bold and code");
  });

  it("returns empty array for content without headings", () => {
    expect(extractHeadings("Just a paragraph.")).toEqual([]);
  });
});
