import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: "About",
  description: "About pmbyven — a premium publication platform at pmbyven.com.",
  path: "/about",
});

export const revalidate = 3600;

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="font-serif text-3xl sm:text-2xl tracking-tight mb-6">About pmbyven</h1>
        <div className="prose-editorial space-y-5 text-muted-foreground">
          <p className="text-lg text-foreground">Imagine if Apple designed Medium.</p>
          <p>
            pmbyven is a world-class publication platform built for writers and teams who care
            about craft. Large typography, floating glass cards, smooth motion, and a reading
            experience that gets out of the way.
          </p>
          <p>
            Inspired by premium newsletters and editorial platforms — with an Apple Vision Pro
            sensibility: backdrop blur, hairline borders, depth, and restraint. Live at{" "}
            <a
              href="https://pmbyven.com"
              className="text-primary underline underline-offset-2"
            >
              pmbyven.com
            </a>
            .
          </p>
          <h2 className="font-serif text-2xl text-foreground !mt-10">What we believe</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Reading should feel luxurious, not noisy</li>
            <li>Themes and type are product features</li>
            <li>Admin should be as beautiful as the front end</li>
            <li>Accessibility and performance are non-negotiable</li>
          </ul>
        </div>
        <div className="mt-10 flex gap-3">
          <Button asChild variant="cta">
            <Link href="/#newsletter" prefetch>
              Subscribe
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact" prefetch>
              Contact
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
