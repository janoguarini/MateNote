"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Loader2,
  Eye,
  ThumbsUp,
  MessageCircle,
  Clock,
  ArrowRight,
  SearchX,
  PlugZap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/empty-state";
import { useToast } from "@/components/ui/toast";
import { formatDuration, formatCompactNumber, formatRelativeDate } from "@/lib/utils";

interface SearchResult {
  videoId: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number | null;
  likeCount: number | null;
  commentCount: number | null;
  durationSeconds: number | null;
}

export function ResearchSearch() {
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [analyzingId, setAnalyzingId] = React.useState<string | null>(null);
  const [notConfigured, setNotConfigured] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    const res = await fetch(`/api/research?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setLoading(false);

    if (res.status === 503) {
      setNotConfigured(true);
      setResults(null);
      return;
    }

    if (!res.ok) {
      toast({ title: "Falló la búsqueda", description: data.message, variant: "error" });
      return;
    }

    setNotConfigured(false);
    setResults(data.results);
  }

  async function handleAnalyze(videoId: string) {
    setAnalyzingId(videoId);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}` }),
    });
    const data = await res.json();
    setAnalyzingId(null);

    if (!res.ok) {
      toast({ title: data.error || "Falló el análisis", description: data.message, variant: "error" });
      return;
    }
    router.push(`/analysis/${data.id}`);
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscá creadores, temas o ideas de video"
            className="h-12 pl-10 text-[15px]"
          />
        </div>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Buscar"}
        </Button>
      </form>

      {notConfigured && (
        <EmptyState
          icon={PlugZap}
          title="Investigación todavía no está conectada"
          description="Agregá una variable de entorno YOUTUBE_API_KEY para buscar videos, creadores y temas reales de YouTube. Mirá el README para instrucciones de configuración."
        />
      )}

      {!notConfigured && searched && !loading && results?.length === 0 && (
        <EmptyState
          icon={SearchX}
          title="No se encontraron resultados"
          description={`No apareció nada para "${query}". Probá con otro término de búsqueda.`}
        />
      )}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && results && results.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <Card key={result.videoId} className="overflow-hidden">
              <div className="relative aspect-video w-full bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.thumbnailUrl}
                  alt={result.title}
                  className="size-full object-cover"
                />
                {result.durationSeconds !== null && (
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
                    <Clock className="size-3" />
                    {formatDuration(result.durationSeconds)}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{result.title}</h3>
                <p className="mt-1.5 truncate text-xs text-muted-foreground">{result.channel}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {result.viewCount !== null && (
                    <span className="flex items-center gap-1">
                      <Eye className="size-3" />
                      {formatCompactNumber(result.viewCount)}
                    </span>
                  )}
                  {result.likeCount !== null && (
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="size-3" />
                      {formatCompactNumber(result.likeCount)}
                    </span>
                  )}
                  {result.commentCount !== null && (
                    <span className="flex items-center gap-1">
                      <MessageCircle className="size-3" />
                      {formatCompactNumber(result.commentCount)}
                    </span>
                  )}
                  <span>{formatRelativeDate(result.publishedAt)}</span>
                </div>
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  disabled={analyzingId === result.videoId}
                  onClick={() => handleAnalyze(result.videoId)}
                >
                  {analyzingId === result.videoId ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <>
                      Analizar
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
