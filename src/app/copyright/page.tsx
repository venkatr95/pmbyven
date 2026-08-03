import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig, getRobotsMetadata } from "@/lib/seo";

const site = getSiteConfig();

export const metadata: Metadata = {
  title: "Copyright",
  description: `Copyright notice for ${site.siteName} — ownership and use of content.`,
  robots: getRobotsMetadata(),
  alternates: { canonical: `${site.siteUrl}/copyright` },
};

export default function CopyrightPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="font-serif text-4xl tracking-tight mb-3">Copyright notice</h1>
        <p className="text-muted-foreground mb-10">
          Last updated: August 2026 · {site.copyrightNotice}
        </p>

        <div className="prose-editorial space-y-5 text-muted-foreground">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Ownership</h2>
            <p>
              Unless otherwise stated, all content published on {site.siteName} — including
              articles, essays, illustrations, graphics, logos, typography treatments, code
              samples embedded in posts, and site design elements — is the exclusive property
              of <strong className="text-foreground">{site.copyrightHolder}</strong> and/or its
              licensed contributors.
            </p>
            <p>
              Copyright © {site.copyrightYear} {site.copyrightHolder}. All rights reserved,
              except where a specific license states otherwise.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">What you may not do</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Reproduce, redistribute, or republish content without written permission</li>
              <li>Train machine-learning models on our content without an explicit license</li>
              <li>Scrape, bulk-download, or mirror the site for commercial reuse</li>
              <li>Remove copyright, attribution, or license notices</li>
              <li>Use our name, logo, or marks in a way that implies endorsement</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Fair use & limited quoting</h2>
            <p>
              Short quotations for criticism, commentary, education, or news reporting may be
              permitted under applicable fair-use / fair-dealing laws. Always credit{" "}
              {site.siteName} and link to the original URL when practical.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Contributor content</h2>
            <p>
              Guest authors retain copyright in their work unless otherwise agreed in writing.
              By publishing here, contributors grant {site.copyrightHolder} a non-exclusive
              license to display, distribute, and promote the work on this platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Software license</h2>
            <p>
              The platform software and documentation may be subject to a separate software
              license. See our{" "}
              <Link href="/license" className="text-primary underline underline-offset-2">
                License
              </Link>{" "}
              page for details.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">DMCA / takedown</h2>
            <p>
              If you believe content on this site infringes your copyright, contact{" "}
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-primary underline underline-offset-2"
              >
                {site.contactEmail}
              </a>{" "}
              with: (1) identification of the work, (2) the URL of the allegedly infringing
              material, (3) your contact information, and (4) a good-faith statement under
              penalty of perjury.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-foreground">Permissions</h2>
            <p>
              For syndication, reprint, translation, or commercial licensing, email{" "}
              <a
                href={`mailto:${site.contactEmail}?subject=Copyright%20permission`}
                className="text-primary underline underline-offset-2"
              >
                {site.contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
