# Optional features

## AI summaries (SpaceXAI / xAI)

Articles show an **AI summary** panel. Click **Generate**.

| Mode | When |
|------|------|
| **SpaceXAI (Grok)** | `XAI_API_KEY` is set |
| **Extractive offline** | No key — local sentence ranking |

```env
XAI_API_KEY=xai-...
XAI_MODEL=grok-4-1-fast-non-reasoning   # optional
XAI_BASE_URL=https://api.x.ai/v1       # optional
```

Summaries are cached on the post (`aiSummary`, `aiSummaryAt`). Admin can force regenerate.

Keys: https://console.x.ai · Docs: https://docs.x.ai

---

## Share image generation

On each article:

1. **Share image** button → 1200×630 canvas card → download PNG  
2. Server OG: `/api/og?title=...&subtitle=...` (used in metadata)

---

## Pinned notes

Admin → **Pinned notes**:

- Global notes appear on the homepage  
- Notes can be colored (amber/blue/green/purple/rose)  
- Post-specific notes show under the article header  

---

## Pinned articles & popular this week

- Toggle **Pinned article** in the post editor  
- Homepage sections **Pinned** and **Popular this week** (Homepage builder)  
- Popular scoring: views + likes + shares + analytics events × recency decay  

---

## Newsletter integrations

On subscribe, email is always stored in the DB, then fanned out:

| Provider | Env |
|----------|-----|
| Generic webhook | `NEWSLETTER_WEBHOOK_URL` |
| ConvertKit | `CONVERTKIT_API_KEY`, `CONVERTKIT_FORM_ID` |
| Buttondown | `BUTTONDOWN_API_KEY` |
| Mailchimp | `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID`, `MAILCHIMP_SERVER_PREFIX` |

Status UI: **Admin → Integrations**.
