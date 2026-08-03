import { describe, it, expect } from "vitest";
import { extractiveSummary, isAiEnabled } from "./ai";

describe("extractiveSummary", () => {
  it("returns short content as-is-ish", () => {
    const s = extractiveSummary("Short piece.");
    expect(s.length).toBeGreaterThan(0);
  });

  it("picks multiple sentences from longer content", () => {
    const content = [
      "Great products come from obsessive craft and clear thinking.",
      "Teams that write well ship better systems for users.",
      "Design is a product decision, not decoration alone.",
      "Reading experiences should feel luxurious and calm.",
      "Motion should support hierarchy without noise.",
    ].join(" ");
    const summary = extractiveSummary(content, 3);
    expect(summary.split(/(?<=[.!?])\s+/).length).toBeLessThanOrEqual(4);
    expect(summary.length).toBeGreaterThan(40);
  });

  it("strips markdown noise", () => {
    const s = extractiveSummary("## Hello **world**. This is a longer sentence about product craft systems.");
    expect(s).not.toContain("**");
    expect(s).not.toContain("##");
  });
});

describe("isAiEnabled", () => {
  it("returns boolean based on env", () => {
    expect(typeof isAiEnabled()).toBe("boolean");
  });
});
