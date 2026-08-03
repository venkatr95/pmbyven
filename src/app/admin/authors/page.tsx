"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { saveAuthor, deleteAuthor } from "@/lib/actions/cms";

interface Author {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
  avatar?: string | null;
  role: string;
  _count?: { posts: number };
}

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [pending, startTransition] = useTransition();

  async function load() {
    const res = await fetch("/api/admin/authors");
    if (res.ok) setAuthors(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl tracking-tight">Authors</h1>
      <form
        className="glass rounded-2xl p-5 space-y-3 max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            await saveAuthor({ name, bio, avatar });
            toast.success("Author saved");
            setName("");
            setBio("");
            setAvatar("");
            load();
          });
        }}
      >
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Bio</Label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Avatar URL</Label>
          <Input value={avatar} onChange={(e) => setAvatar(e.target.value)} className="rounded-xl" />
        </div>
        <Button type="submit" variant="cta" disabled={pending}>
          Add author
        </Button>
      </form>
      <div className="grid sm:grid-cols-2 gap-4">
        {authors.map((a) => (
          <div key={a.id} className="glass rounded-2xl p-5 flex gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={a.avatar || undefined} />
              <AvatarFallback>{a.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{a.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{a.role}</p>
              {a.bio && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{a.bio}</p>}
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive mt-2 -ml-2"
                onClick={() =>
                  startTransition(async () => {
                    await deleteAuthor(a.id);
                    load();
                  })
                }
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
