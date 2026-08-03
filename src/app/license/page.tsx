import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig, getRobotsMetadata } from "@/lib/seo";

const site = getSiteConfig();

export const metadata: Metadata = {
  title: "License",
  description: `Software and content licensing for ${site.siteName}.`,
  robots: getRobotsMetadata(),
  alternates: { canonical: `${site.siteUrl}/license` },
};

export default function LicensePage() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="font-serif text-4xl tracking-tight mb-3">License</h1>
        <p className="text-muted-foreground mb-10">
          Last updated: August 2026 · {site.licenseName}
        </p>

        <div className="prose-editorial space-y-8 text-muted-foreground">
          <section className="glass rounded-2xl p-6 space-y-3">
            <h2 className="font-serif text-xl text-foreground !mt-0">1. Publication content</h2>
            <p>
              <strong className="text-foreground">License:</strong> {site.licenseName}
            </p>
            <p>
              All essays, images, branding, and editorial materials on {site.siteName} are
              copyrighted by {site.copyrightHolder} (and respective authors).{" "}
              <strong className="text-foreground">No license is granted</strong> to copy,
              modify, distribute, sell, or train models on this content except as described on
              our{" "}
              <Link href="/copyright" className="text-primary underline underline-offset-2">
                Copyright
              </Link>{" "}
              page or in a separate written agreement.
            </p>
          </section>

          <section className="glass rounded-2xl p-6 space-y-3">
            <h2 className="font-serif text-xl text-foreground !mt-0">2. Platform software</h2>
            <p>
              The pmbyven application source code in this repository is provided under the
              terms of the <strong className="text-foreground">MIT License</strong> (see the{" "}
              <code className="bg-muted px-1 rounded text-xs">LICENSE</code> file in the project
              root), unless a different license file is present.
            </p>
            <div className="text-sm bg-muted/50 rounded-xl p-4 font-mono leading-relaxed whitespace-pre-wrap text-foreground/80">
{`MIT License

Copyright (c) ${site.copyrightYear} ${site.copyrightHolder}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.`}
            </div>
            <p className="text-sm">
              The MIT License applies to <em>software and documentation</em> only — not to
              published articles, media assets, or trademarks on the live site.
            </p>
          </section>

          <section className="glass rounded-2xl p-6 space-y-3">
            <h2 className="font-serif text-xl text-foreground !mt-0">3. Third-party assets</h2>
            <p>
              Demo images may come from Unsplash or other sources under their respective
              licenses. Open-source dependencies retain their own licenses (see{" "}
              <code className="bg-muted px-1 rounded text-xs">package.json</code> /{" "}
              <code className="bg-muted px-1 rounded text-xs">node_modules</code>).
            </p>
          </section>

          <section className="glass rounded-2xl p-6 space-y-3">
            <h2 className="font-serif text-xl text-foreground !mt-0">4. No warranty</h2>
            <p>
              Content and software are provided “as is” for informational purposes.{" "}
              {site.copyrightHolder} disclaims warranties to the fullest extent permitted by law.
            </p>
          </section>

          <section className="glass rounded-2xl p-6 space-y-3">
            <h2 className="font-serif text-xl text-foreground !mt-0">5. Contact</h2>
            <p>
              Licensing questions:{" "}
              <a
                href={`mailto:${site.contactEmail}?subject=License%20inquiry`}
                className="text-primary underline underline-offset-2"
              >
                {site.contactEmail}
              </a>
            </p>
            <p className="text-sm">
              Related:{" "}
              <Link href="/copyright" className="text-primary underline underline-offset-2">
                Copyright
              </Link>
              {" · "}
              <Link href="/terms" className="text-primary underline underline-offset-2">
                Terms
              </Link>
              {" · "}
              <Link href="/privacy" className="text-primary underline underline-offset-2">
                Privacy
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
