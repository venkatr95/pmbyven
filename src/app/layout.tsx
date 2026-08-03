import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { KeyboardShortcuts } from "@/components/layout/keyboard-shortcuts";
import { AnnouncementBanner } from "@/components/layout/announcement-banner";
import { JsonLd } from "@/components/seo/json-ld";
import { db } from "@/lib/db";
import { getRobotsMetadata, getSiteConfig } from "@/lib/seo";
import "./globals.css";
import "katex/dist/katex.min.css";

/**
 * Plus Jakarta Sans — free commercial use (SIL OFL-1.1 via Google Fonts).
 * Close modern editorial sans feel to Degular, full glyph coverage, no license risk.
 * Self-hosted by next/font (no Google runtime requests).
 */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const site = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.siteName,
    template: `%s · ${site.siteName}`,
  },
  description: site.siteDesc,
  applicationName: site.siteName,
  authors: [{ name: site.copyrightHolder }],
  creator: site.copyrightHolder,
  publisher: site.copyrightHolder,
  category: "publishing",
  keywords: [
    "editorial",
    "publication",
    "newsletter",
    "essays",
    "product",
    "design",
    "craft",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.siteUrl,
    siteName: site.siteName,
    title: site.siteName,
    description: site.siteDesc,
  },
  twitter: {
    card: "summary_large_image",
    title: site.siteName,
    description: site.siteDesc,
  },
  robots: getRobotsMetadata(),
  alternates: {
    canonical: site.siteUrl,
    types: {
      "application/rss+xml": `${site.siteUrl}/rss.xml`,
    },
  },
  other: {
    copyright: site.copyrightNotice,
    "license": site.licenseName,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let announcement: { message: string; href: string | null } | null = null;
  try {
    announcement = await db.announcement.findFirst({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    announcement = null;
  }

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.siteName,
    url: site.siteUrl,
    description: site.siteDesc,
    email: site.contactEmail,
    foundingDate: site.copyrightYear,
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.siteName,
    url: site.siteUrl,
    description: site.siteDesc,
    publisher: {
      "@type": "Organization",
      name: site.copyrightHolder,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    copyrightHolder: {
      "@type": "Organization",
      name: site.copyrightHolder,
    },
    copyrightYear: site.copyrightYear,
    license: `${site.siteUrl}${site.licenseUrl.startsWith("/") ? site.licenseUrl : `/${site.licenseUrl}`}`,
  };

  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd data={[organizationLd, websiteLd]} />
        <Providers>
          {announcement && (
            <AnnouncementBanner
              message={announcement.message}
              href={announcement.href || undefined}
            />
          )}
          <Navbar />
          <main
            className="flex-1 transition-[margin-top] duration-300 ease-out"
            style={{ marginTop: "var(--mobile-nav-push, 0px)" }}
          >
            {children}
          </main>
          <Footer />
          <KeyboardShortcuts />
        </Providers>
      </body>
    </html>
  );
}
