"use client";

import { Button } from "@/components/ui/button";
import { exportSubscribersCsv } from "@/lib/actions/newsletter";
import { toast } from "sonner";

export function ExportSubscribersButton() {
  return (
    <Button
      variant="outline"
      onClick={async () => {
        const csv = await exportSubscribersCsv();
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("CSV exported");
      }}
    >
      Export CSV
    </Button>
  );
}
