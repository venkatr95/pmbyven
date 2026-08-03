"use client";

import { motion } from "framer-motion";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";

export function NewsletterCta() {
  return (
    <section id="newsletter" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12 lg:p-16"
        >
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--gradient-from)), hsl(var(--gradient-to)))",
            }}
          />
          <div className="relative max-w-xl">
            <h2 className="font-serif text-3xl sm:text-2xl tracking-tight mb-4">
              Join 10,000+ thoughtful readers
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Deep research on product, design, and craft — delivered weekly. Free forever.
              Unsubscribe anytime.
            </p>
            <NewsletterForm />
            <p className="text-sm text-muted-foreground mt-4">
              No spam. Just signal. One email a week.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
