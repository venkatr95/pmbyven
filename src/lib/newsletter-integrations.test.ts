import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  listConfiguredIntegrations,
  fanOutNewsletterIntegrations,
} from "./newsletter-integrations";

describe("listConfiguredIntegrations", () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
  });

  it("returns empty when nothing configured", () => {
    delete process.env.NEWSLETTER_WEBHOOK_URL;
    delete process.env.CONVERTKIT_API_KEY;
    delete process.env.CONVERTKIT_FORM_ID;
    delete process.env.BUTTONDOWN_API_KEY;
    delete process.env.MAILCHIMP_API_KEY;
    expect(listConfiguredIntegrations()).toEqual([]);
  });

  it("detects webhook", () => {
    process.env.NEWSLETTER_WEBHOOK_URL = "https://example.com/hook";
    expect(listConfiguredIntegrations()).toContain("webhook");
  });
});

describe("fanOutNewsletterIntegrations", () => {
  const env = { ...process.env };

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200 }));
  });

  afterEach(() => {
    process.env = { ...env };
    vi.unstubAllGlobals();
  });

  it("calls webhook when configured", async () => {
    process.env.NEWSLETTER_WEBHOOK_URL = "https://example.com/hook";
    const results = await fanOutNewsletterIntegrations({
      email: "a@b.com",
      source: "test",
    });
    expect(results.some((r) => r.provider === "webhook" && r.ok)).toBe(true);
    expect(fetch).toHaveBeenCalled();
  });

  it("returns empty when no integrations", async () => {
    delete process.env.NEWSLETTER_WEBHOOK_URL;
    delete process.env.CONVERTKIT_API_KEY;
    delete process.env.BUTTONDOWN_API_KEY;
    delete process.env.MAILCHIMP_API_KEY;
    const results = await fanOutNewsletterIntegrations({ email: "a@b.com" });
    expect(results).toEqual([]);
  });
});
