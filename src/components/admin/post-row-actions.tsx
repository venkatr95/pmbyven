"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deletePost, duplicatePost, restorePost } from "@/lib/actions/admin";
import { bulkUpdatePosts } from "@/lib/actions/cms";

export function PostRowActions({
  id,
  slug,
  status,
}: {
  id: string;
  slug: string;
  status: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/admin/posts/${id}`}>Edit</Link>
      </Button>
      {status === "published" && (
        <Button asChild variant="ghost" size="sm">
          <Link href={`/blog/${slug}`} target="_blank">
            View
          </Link>
        </Button>
      )}
      {status !== "published" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await bulkUpdatePosts([id], "publish");
            toast.success("Published");
            router.refresh();
          }}
        >
          Publish
        </Button>
      )}
      {status === "published" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await bulkUpdatePosts([id], "draft");
            toast.success("Unpublished");
            router.refresh();
          }}
        >
          Unpublish
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          await duplicatePost(id);
          toast.success("Duplicated");
          router.refresh();
        }}
      >
        Copy
      </Button>
      {status === "trash" ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await restorePost(id);
              toast.success("Restored");
              router.refresh();
            }}
          >
            Restore
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={async () => {
              if (!confirm("Permanently delete?")) return;
              await deletePost(id, true);
              toast.success("Deleted forever");
              router.refresh();
            }}
          >
            Delete
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={async () => {
            await deletePost(id);
            toast.success("Moved to trash");
            router.refresh();
          }}
        >
          Trash
        </Button>
      )}
    </div>
  );
}
