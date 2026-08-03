import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig, getRobotsMetadata } from "@/lib/seo";

const site = getSiteConfig();

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms governing use of ${site.siteName}.`,
  robots: getRobotsMetadata(),
  alternates: { canonical: `${site.siteUrl}/terms` },
};

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="font-serif text-4xl tracking-tight mb-3">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: August 2026</p>

        <div className="prose-editorial space-y-5 text-muted-foreground">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Acceptance</h2>
            <p>
              By accessing {site.siteName} you agree to these Terms and our{" "}
              <Link href="/privacy" className="text-primary underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Content & copyright</h2>
            <p>
              All content is owned by {site.copyrightHolder} or its licensors and is protected by
              copyright. You may not copy, scrape, republish, or use content to train AI models
              without written permission. See our{" "}
              <Link href="/copyright" className="text-primary underline underline-offset-2">
                Copyright notice
              </Link>{" "}
              and{" "}
              <Link href="/license" className="text-primary underline underline-offset-2">
                License
              </Link>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Acceptable use</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Do not attempt to breach security or access admin areas without authorization</li>
              <li>Do not run abusive automated crawlers or scrapers</li>
              <li>Do not interfere with other users’ access to the service</li>
              <li>Do not use the service for unlawful purposes</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Newsletter</h2>
            <p>
              Subscription is optional. We may send editorial emails to the address you provide.
              You can unsubscribe as described in those emails.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Disclaimer</h2>
            <p>
              Content is for informational purposes only. The service is provided “as is” without
              warranties. {site.copyrightHolder} is not liable for damages arising from use of the
              site to the fullest extent permitted by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Changes</h2>
            <p>
              We may update these Terms. Continued use after changes constitutes acceptance of the
              revised Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Contact</h2>
            <p>
              Questions:{" "}
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-primary underline underline-offset-2"
              >
                {site.contactEmail}
              </a>
            </p>
            <p className="text-sm">
              © {site.copyrightYear} {site.copyrightHolder}. {site.licenseName}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
