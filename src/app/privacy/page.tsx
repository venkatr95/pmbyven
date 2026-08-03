import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig, getRobotsMetadata } from "@/lib/seo";

const site = getSiteConfig();

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.siteName} collects, uses, and protects your information.`,
  robots: getRobotsMetadata(),
  alternates: { canonical: `${site.siteUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="font-serif text-4xl tracking-tight mb-3">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: August 2026</p>

        <div className="prose-editorial space-y-5 text-muted-foreground">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Who we are</h2>
            <p>
              {site.siteName} is operated by {site.copyrightHolder}. Contact:{" "}
              <a href={`mailto:${site.contactEmail}`} className="text-primary underline underline-offset-2">
                {site.contactEmail}
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Information we collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Email</strong> when you subscribe to the
                newsletter
              </li>
              <li>
                <strong className="text-foreground">Usage analytics</strong> such as page views
                (article slugs, timestamps) to improve content
              </li>
              <li>
                <strong className="text-foreground">Local preferences</strong> (theme, reading
                width, bookmarks) stored in your browser via localStorage — not sent to our
                servers by default
              </li>
              <li>
                <strong className="text-foreground">Contact form</strong> details if you message
                us
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">How we use information</h2>
            <p>
              To deliver the newsletter, operate the site, prevent abuse, and improve the product.
              We do <strong className="text-foreground">not sell</strong> personal data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Third parties</h2>
            <p>
              If optional newsletter integrations (e.g. ConvertKit, Buttondown, Mailchimp) are
              configured, your email may be shared with those providers solely for list
              management under their privacy policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Bots & crawling</h2>
            <p>
              We use robots.txt, meta robots, and HTTP headers to control automated access. AI
              scrapers and bulk crawlers may be disallowed. See{" "}
              <Link href="/robots.txt" className="text-primary underline underline-offset-2">
                robots.txt
              </Link>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Your rights</h2>
            <p>
              You may request access, correction, or deletion of your subscriber data by emailing{" "}
              {site.contactEmail}. You may unsubscribe from the newsletter at any time via
              instructions in our emails (when email delivery is configured).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Copyright of this policy</h2>
            <p>
              © {site.copyrightYear} {site.copyrightHolder}. See also{" "}
              <Link href="/copyright" className="text-primary underline underline-offset-2">
                Copyright
              </Link>{" "}
              and{" "}
              <Link href="/license" className="text-primary underline underline-offset-2">
                License
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
