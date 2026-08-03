/**
 * Optional newsletter provider integrations.
 * Configure via env — all are no-ops when unset.
 *
 * NEWSLETTER_WEBHOOK_URL     — generic POST { email, name?, source }
 * CONVERTKIT_API_KEY + CONVERTKIT_FORM_ID
 * BUTTONDOWN_API_KEY
 * MAILCHIMP_API_KEY + MAILCHIMP_AUDIENCE_ID + MAILCHIMP_SERVER_PREFIX (e.g. us21)
 */

export type IntegrationResult = {
  provider: string;
  ok: boolean;
  detail?: string;
};

export async function fanOutNewsletterIntegrations(payload: {
  email: string;
  name?: string | null;
  source?: string;
}): Promise<IntegrationResult[]> {
  const results: IntegrationResult[] = [];
  const email = payload.email.toLowerCase();

  // Generic webhook
  if (process.env.NEWSLETTER_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.NEWSLETTER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: payload.name || null,
          source: payload.source || "website",
          timestamp: new Date().toISOString(),
        }),
      });
      results.push({
        provider: "webhook",
        ok: res.ok,
        detail: res.ok ? undefined : `HTTP ${res.status}`,
      });
    } catch (e) {
      results.push({
        provider: "webhook",
        ok: false,
        detail: e instanceof Error ? e.message : "failed",
      });
    }
  }

  // ConvertKit
  if (process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID) {
    try {
      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.CONVERTKIT_API_KEY,
            email,
            first_name: payload.name || undefined,
          }),
        }
      );
      results.push({ provider: "convertkit", ok: res.ok, detail: res.ok ? undefined : `HTTP ${res.status}` });
    } catch (e) {
      results.push({
        provider: "convertkit",
        ok: false,
        detail: e instanceof Error ? e.message : "failed",
      });
    }
  }

  // Buttondown
  if (process.env.BUTTONDOWN_API_KEY) {
    try {
      const res = await fetch("https://api.buttondown.email/v1/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
        },
        body: JSON.stringify({
          email_address: email,
          metadata: { source: payload.source || "website" },
          tags: ["editorial"],
        }),
      });
      results.push({
        provider: "buttondown",
        ok: res.ok || res.status === 201,
        detail: res.ok || res.status === 201 ? undefined : `HTTP ${res.status}`,
      });
    } catch (e) {
      results.push({
        provider: "buttondown",
        ok: false,
        detail: e instanceof Error ? e.message : "failed",
      });
    }
  }

  // Mailchimp
  if (
    process.env.MAILCHIMP_API_KEY &&
    process.env.MAILCHIMP_AUDIENCE_ID &&
    process.env.MAILCHIMP_SERVER_PREFIX
  ) {
    try {
      const dc = process.env.MAILCHIMP_SERVER_PREFIX;
      const listId = process.env.MAILCHIMP_AUDIENCE_ID;
      const res = await fetch(
        `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
          },
          body: JSON.stringify({
            email_address: email,
            status: "subscribed",
            merge_fields: payload.name ? { FNAME: payload.name } : undefined,
            tags: ["editorial"],
          }),
        }
      );
      // 400 member exists is ok-ish
      results.push({
        provider: "mailchimp",
        ok: res.ok || res.status === 400,
        detail: res.ok || res.status === 400 ? undefined : `HTTP ${res.status}`,
      });
    } catch (e) {
      results.push({
        provider: "mailchimp",
        ok: false,
        detail: e instanceof Error ? e.message : "failed",
      });
    }
  }

  return results;
}

export function listConfiguredIntegrations(): string[] {
  const names: string[] = [];
  if (process.env.NEWSLETTER_WEBHOOK_URL) names.push("webhook");
  if (process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID) names.push("convertkit");
  if (process.env.BUTTONDOWN_API_KEY) names.push("buttondown");
  if (
    process.env.MAILCHIMP_API_KEY &&
    process.env.MAILCHIMP_AUDIENCE_ID &&
    process.env.MAILCHIMP_SERVER_PREFIX
  ) {
    names.push("mailchimp");
  }
  return names;
}
