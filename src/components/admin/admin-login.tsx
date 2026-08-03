"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/logo";
import { loginAdmin } from "@/lib/actions/admin";

export function AdminLogin() {
  const [secret, setSecret] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await loginAdmin(secret);
      if (res.ok) {
        toast.success("Welcome back");
        router.refresh();
      } else {
        toast.error(res.error || "Access denied");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-30 -top-20 -left-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--gradient-from)), hsl(var(--gradient-to)))",
        }}
      />
      <form
        onSubmit={onSubmit}
        className="relative glass-strong rounded-3xl p-8 sm:p-10 w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <Logo
            className="justify-center mb-4"
            showWordmark={false}
            markClassName="h-12 w-12"
          />
          <h1 className="font-serif text-2xl">Admin access</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the environment secret to continue. No public login.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="secret">Admin secret</Label>
          <Input
            id="secret"
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="ADMIN_SECRET"
            className="rounded-xl h-11"
            autoFocus
            required
          />
        </div>
        <Button type="submit" variant="cta" className="w-full h-11" disabled={pending}>
          {pending ? "Checking…" : "Enter dashboard"}
        </Button>
        <p className="text-[11px] text-center text-muted-foreground">
          Default for local dev: <code className="bg-muted px-1 rounded">pmbyven-admin-2026</code>
        </p>
      </form>
    </div>
  );
}
