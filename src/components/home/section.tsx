"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Section({
  title,
  description,
  href,
  hrefLabel = "View all",
  children,
  className,
  id,
}: {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <h2 className="font-serif text-3xl sm:text-2xl tracking-tight">{title}</h2>
            {description && (
              <p className="text-muted-foreground text-lg mt-3 max-w-xl leading-relaxed">{description}</p>
            )}
          </div>
          {href && (
            <Link
              href={href}
              className="inline-flex items-center gap-1.5 text-base font-medium text-primary hover:opacity-80 transition-opacity shrink-0"
            >
              {hrefLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
