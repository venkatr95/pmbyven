"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteSubscriber } from "@/lib/actions/admin";

export function DeleteSubscriberButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive"
      onClick={async () => {
        await deleteSubscriber(id);
        router.refresh();
      }}
    >
      Remove
    </Button>
  );
}
