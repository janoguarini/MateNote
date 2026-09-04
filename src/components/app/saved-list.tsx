"use client";

import * as React from "react";
import { Search, Bookmark, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnalysisCard } from "@/components/app/analysis-card";
import { EmptyState } from "@/components/app/empty-state";
import { useToast } from "@/components/ui/toast";

export interface SavedItem {
  id: string;
  title: string;
  channel: string;
  thumbnail_url: string;
  duration_seconds: number | null;
  saved_at: string;
}

export function SavedList({ items }: { items: SavedItem[] }) {
  const [query, setQuery] = React.useState("");
  const [list, setList] = React.useState(items);
  const [pendingId, setPendingId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const filtered = list.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.channel.toLowerCase().includes(query.toLowerCase())
  );

  async function handleDelete(id: string) {
    setPendingId(id);
    const res = await fetch(`/api/saved/${id}`, { method: "DELETE" });
    setPendingId(null);
    if (res.ok) {
      setList((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Eliminado de guardados", variant: "default" });
    } else {
      toast({ title: "No se pudo eliminar", variant: "error" });
    }
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="Todavía no guardaste nada."
        description="Los análisis que guardes van a aparecer acá para que los encuentres de nuevo."
        ctaLabel="Analizar un video"
        ctaHref="/analyze"
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en análisis guardados…"
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Ningún análisis guardado coincide con &quot;{query}&quot;.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="group relative">
              <AnalysisCard
                id={item.id}
                title={item.title}
                channel={item.channel}
                thumbnailUrl={item.thumbnail_url}
                durationSeconds={item.duration_seconds}
                date={item.saved_at}
              />
              <Button
                size="icon"
                variant="secondary"
                disabled={pendingId === item.id}
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(item.id);
                }}
                className="absolute right-2 top-2 size-7 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                title="Eliminar de guardados"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
