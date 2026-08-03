"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/lib/actions/newsletter";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    startTransition(async () => {
      const res = await subscribeNewsletter(email.trim());
      if (res.ok) {
        toast.success("You're subscribed. Welcome aboard.");
        setEmail("");
      } else {
        toast.error(res.error || "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          required
          placeholder="Type your email…"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-full h-11"
          aria-label="Email address"
        />
        <Button type="submit" variant="cta" disabled={pending} className="h-11 px-6 shrink-0">
          {pending ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
    </form>
  );
}
