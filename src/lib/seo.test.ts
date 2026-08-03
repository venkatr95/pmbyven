import { describe, it, expect, afterEach } from "vitest";
import {
  getSiteConfig,
  getRobotsMetadata,
  getXRobotsTag,
  BLOCKED_BOT_AGENTS,
} from "./seo";

describe("seo config", () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
  });

  it("blocks indexing by default", () => {
    delete process.env.ALLOW_SEARCH_INDEXING;
    const robots = getRobotsMetadata();
    expect(robots.index).toBe(false);
    expect(robots.follow).toBe(false);
    expect(getXRobotsTag()).toContain("noindex");
  });

  it("allows indexing when ALLOW_SEARCH_INDEXING=true", () => {
    process.env.ALLOW_SEARCH_INDEXING = "true";
    const robots = getRobotsMetadata();
    expect(robots.index).toBe(true);
    expect(robots.follow).toBe(true);
    expect(getXRobotsTag()).toContain("index");
    expect(getXRobotsTag()).not.toContain("noindex");
  });

  it("exposes copyright fields", () => {
    process.env.NEXT_PUBLIC_COPYRIGHT_HOLDER = "Acme Pub";
    process.env.NEXT_PUBLIC_COPYRIGHT_YEAR = "2026";
    process.env.NEXT_PUBLIC_LICENSE_NAME = "All Rights Reserved";
    const site = getSiteConfig();
    expect(site.copyrightHolder).toBe("Acme Pub");
    expect(site.copyrightNotice).toContain("Acme Pub");
    expect(site.copyrightNotice).toContain("2026");
    expect(site.licenseName).toBe("All Rights Reserved");
  });

  it("lists known AI / scraper bots to block", () => {
    expect(BLOCKED_BOT_AGENTS).toContain("GPTBot");
    expect(BLOCKED_BOT_AGENTS).toContain("ClaudeBot");
    expect(BLOCKED_BOT_AGENTS.length).toBeGreaterThan(10);
  });
});
