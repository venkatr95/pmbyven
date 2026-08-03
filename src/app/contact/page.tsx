import { ContactForm } from "@/components/contact/contact-form";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: "Contact",
  description: "Get in touch with pmbyven — partnerships, tips, and feedback.",
  path: "/contact",
});

/** Static shell — form is a small client island */
export const revalidate = 3600;

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h1 className="font-serif text-3xl sm:text-2xl tracking-tight mb-3">Contact</h1>
        <p className="text-muted-foreground mb-10">
          Partnerships, tips, feedback — we read every message.
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
