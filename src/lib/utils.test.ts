import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  cn,
  formatDate,
  formatNumber,
  readingTimeLabel,
  absoluteUrl,
  estimateReadingTime,
  wordCount,
  slugify,
  excerptFrom,
} from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toContain("px-2");
    expect(cn("px-2", "py-1")).toContain("py-1");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toContain("base");
    expect(cn("base", false && "hidden", "visible")).toContain("visible");
    expect(cn("base", false && "hidden", "visible")).not.toContain("hidden");
  });
});

describe("formatDate", () => {
  it("returns empty string for nullish", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
  });

  it("formats Date objects", () => {
    const result = formatDate(new Date("2026-07-28T12:00:00Z"));
    expect(result).toMatch(/Jul/);
    expect(result).toMatch(/2026/);
  });

  it("formats ISO strings", () => {
    expect(formatDate("2026-01-15")).toMatch(/2026/);
  });
});

describe("formatNumber", () => {
  it("returns plain numbers under 1000", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(999)).toBe("999");
  });

  it("abbreviates thousands", () => {
    expect(formatNumber(1000)).toBe("1.0K");
    expect(formatNumber(48200)).toBe("48.2K");
  });

  it("abbreviates millions", () => {
    expect(formatNumber(1_500_000)).toBe("1.5M");
  });
});

describe("readingTimeLabel", () => {
  it("formats minutes", () => {
    expect(readingTimeLabel(5)).toBe("5 min read");
    expect(readingTimeLabel(1)).toBe("1 min read");
  });
});

describe("absoluteUrl", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://editorial.example.com";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = original;
  });

  it("joins base and path", () => {
    expect(absoluteUrl("/blog")).toBe("https://editorial.example.com/blog");
  });

  it("handles path without leading slash", () => {
    expect(absoluteUrl("about")).toBe("https://editorial.example.com/about");
  });

  it("strips trailing slash from base", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://editorial.example.com/";
    expect(absoluteUrl("/x")).toBe("https://editorial.example.com/x");
  });
});

describe("estimateReadingTime", () => {
  it("returns at least 1 minute", () => {
    expect(estimateReadingTime("hi")).toBe(1);
  });

  it("uses ~200 wpm", () => {
    const words = Array.from({ length: 400 }, () => "word").join(" ");
    expect(estimateReadingTime(words)).toBe(2);
  });
});

describe("wordCount", () => {
  it("counts words", () => {
    expect(wordCount("one two three")).toBe(3);
  });

  it("handles empty/whitespace", () => {
    expect(wordCount("")).toBe(0);
    expect(wordCount("   ")).toBe(0);
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips special characters", () => {
    expect(slugify("Product Pass — 11 tools!")).toBe("product-pass-11-tools");
  });

  it("collapses separators", () => {
    expect(slugify("a  --  b")).toBe("a-b");
  });
});

describe("excerptFrom", () => {
  it("returns short content as-is", () => {
    expect(excerptFrom("Short text")).toBe("Short text");
  });

  it("truncates long content with ellipsis", () => {
    const long = "a".repeat(200);
    const result = excerptFrom(long, 50);
    expect(result.length).toBeLessThanOrEqual(51);
    expect(result.endsWith("…")).toBe(true);
  });

  it("strips markdown-ish markers", () => {
    expect(excerptFrom("**bold** and # heading")).not.toContain("**");
    expect(excerptFrom("**bold** and # heading")).not.toContain("#");
  });
});
