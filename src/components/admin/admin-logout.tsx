"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/lib/actions/admin";

export function AdminLogout() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full"
      onClick={async () => {
        await logoutAdmin();
        router.refresh();
      }}
    >
      Log out
    </Button>
  );
}
