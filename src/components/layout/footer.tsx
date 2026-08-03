"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rss, Mail } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "pmbyven";
const copyrightHolder =
  process.env.NEXT_PUBLIC_COPYRIGHT_HOLDER || siteName;
const copyrightYear =
  process.env.NEXT_PUBLIC_COPYRIGHT_YEAR || String(new Date().getFullYear());
const licenseName = process.env.NEXT_PUBLIC_LICENSE_NAME || "All Rights Reserved";

const footerLinks = {
  Explore: [
    { href: "/blog", label: "All Articles" },
    { href: "/categories", label: "Categories" },
    { href: "/topics", label: "Topics" },
    { href: "/series", label: "Series" },
    { href: "/collections", label: "Collections" },
    { href: "/reading-list", label: "Reading list" },
    { href: "/archive", label: "Archive" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
  Legal: [
    { href: "/copyright", label: "Copyright" },
    { href: "/license", label: "License" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
  Resources: [
    { href: "/rss.xml", label: "RSS Feed" },
    { href: "/sitemap.xml", label: "Sitemap" },
    { href: "/search", label: "Search" },
    { href: "/robots.txt", label: "Robots" },
  ],
};

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-border/50 bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          <div className="lg:col-span-2 space-y-5">
            <Link href="/">
              <Logo wordmark={siteName} wordmarkClassName="text-2xl" />
            </Link>
            <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
              A premium publication platform — if Apple designed Medium. Deep research,
              beautiful reading, zero clutter.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: "#", label: "X", glyph: "𝕏" },
                { href: "#", label: "GitHub", glyph: "⌘" },
                { href: "#", label: "LinkedIn", glyph: "in" },
                { href: "/contact", label: "Email", icon: Mail },
                { href: "/rss.xml", label: "RSS", icon: Rss },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full glass text-muted-foreground hover:text-foreground hover:shadow-md transition-all text-sm font-medium"
                >
                  {"icon" in item && item.icon ? (
                    <item.icon className="h-4 w-4" />
                  ) : (
                    <span className="text-xs leading-none">{item.glyph}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={`${title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-10 border-t border-border/50">
          <div className="max-w-md">
            <h4 className="font-serif text-lg mb-2">Stay in the loop</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Weekly essays on product, design, and craft. No spam.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            © {copyrightYear} {copyrightHolder}. {licenseName}. All content is protected by
            copyright law. Unauthorized reproduction, scraping, or AI training use is prohibited.{" "}
            <Link href="/copyright" className="underline underline-offset-2 hover:text-foreground">
              Copyright notice
            </Link>
            {" · "}
            <Link href="/license" className="underline underline-offset-2 hover:text-foreground">
              License
            </Link>
            .
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>
              Platform software may be licensed separately under MIT — see{" "}
              <Link href="/license" className="underline underline-offset-2 hover:text-foreground">
                License
              </Link>
              .
            </p>
            <p className="flex items-center gap-1.5">
              Crafted with care · WCAG AA · Bots blocked by default
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
