"use client";

import { useEffect, useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { saveHomepageSections } from "@/lib/actions/cms";

const ALL_SECTIONS = [
  { id: "featured", label: "Featured Article" },
  { id: "editorsPicks", label: "Editor's Picks" },
  { id: "continue", label: "Continue Reading / Bookmarks" },
  { id: "latest", label: "Latest Articles" },
  { id: "trending", label: "Trending" },
  { id: "mostRead", label: "Most Read" },
  { id: "popularWeek", label: "Popular this week" },
  { id: "pinned", label: "Pinned articles" },
  { id: "categories", label: "Categories" },
  { id: "topics", label: "Topics / Popular Tags" },
  { id: "collections", label: "Featured Collections" },
  { id: "series", label: "Latest Series" },
  { id: "newsletter", label: "Newsletter CTA" },
  { id: "archive", label: "Archive Timeline" },
  { id: "readingLists", label: "Reading Lists" },
];

function SortableRow({
  id,
  label,
  enabled,
  onToggle,
}: {
  id: string;
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass rounded-xl px-4 py-3 flex items-center gap-3"
    >
      <button type="button" className="cursor-grab text-muted-foreground" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
}

export default function HomepageBuilderPage() {
  const [order, setOrder] = useState(ALL_SECTIONS.map((s) => s.id));
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(ALL_SECTIONS.map((s) => [s.id, true]))
  );
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.sections) && data.sections.length) {
          setOrder(data.sections);
          const en: Record<string, boolean> = {};
          ALL_SECTIONS.forEach((s) => {
            en[s.id] = data.sections.includes(s.id);
          });
          // keep disabled ones after enabled order
          setEnabled(en);
          const missing = ALL_SECTIONS.map((s) => s.id).filter((id) => !data.sections.includes(id));
          setOrder([...data.sections, ...missing]);
        }
      })
      .catch(() => null);
  }, []);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((items) => {
      const oldIndex = items.indexOf(String(active.id));
      const newIndex = items.indexOf(String(over.id));
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Homepage builder</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enable/disable sections and drag to reorder.
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {order.map((id) => {
              const section = ALL_SECTIONS.find((s) => s.id === id);
              if (!section) return null;
              return (
                <SortableRow
                  key={id}
                  id={id}
                  label={section.label}
                  enabled={enabled[id] !== false}
                  onToggle={() => setEnabled((e) => ({ ...e, [id]: !e[id] }))}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        variant="cta"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const sections = order.filter((id) => enabled[id] !== false);
            await saveHomepageSections(sections);
            toast.success("Homepage layout saved");
          })
        }
      >
        Save layout
      </Button>
    </div>
  );
}
