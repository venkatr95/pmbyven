import { listConfiguredIntegrations } from "@/lib/newsletter-integrations";
import { isAiEnabled } from "@/lib/ai";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const dynamic = "force-dynamic";

export default function AdminIntegrationsPage() {
  const newsletter = listConfiguredIntegrations();
  const ai = isAiEnabled();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Integrations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Optional providers for newsletter fan-out and AI summaries. Configure via environment variables.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-medium flex items-center gap-2">
          AI summaries (SpaceXAI / xAI)
          <Badge variant={ai ? "default" : "secondary"}>{ai ? "configured" : "offline extractive"}</Badge>
        </h2>
        <p className="text-sm text-muted-foreground">
          Set <code className="bg-muted px-1 rounded text-xs">XAI_API_KEY</code> for live Grok summaries.
          Optional: <code className="bg-muted px-1 rounded text-xs">XAI_MODEL</code>,{" "}
          <code className="bg-muted px-1 rounded text-xs">XAI_BASE_URL</code>.
        </p>
        {!ai && (
          <Alert variant="info">
            <AlertTitle>Running without API key</AlertTitle>
            <AlertDescription>
              Summaries use a local extractive algorithm until you add an xAI key.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-medium">Newsletter providers</h2>
        <p className="text-sm text-muted-foreground">
          On subscribe, pmbyven stores the email in SQLite/Postgres and fans out to any configured
          providers.
        </p>
        <ul className="space-y-2 text-sm">
          {[
            { id: "webhook", label: "Generic webhook", env: "NEWSLETTER_WEBHOOK_URL" },
            {
              id: "convertkit",
              label: "ConvertKit",
              env: "CONVERTKIT_API_KEY + CONVERTKIT_FORM_ID",
            },
            { id: "buttondown", label: "Buttondown", env: "BUTTONDOWN_API_KEY" },
            {
              id: "mailchimp",
              label: "Mailchimp",
              env: "MAILCHIMP_API_KEY + AUDIENCE_ID + SERVER_PREFIX",
            },
          ].map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 border-b border-border/40 pb-2">
              <span>
                {p.label}
                <span className="block text-[10px] text-muted-foreground font-mono">{p.env}</span>
              </span>
              <Badge variant={newsletter.includes(p.id) ? "default" : "outline"}>
                {newsletter.includes(p.id) ? "on" : "off"}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
