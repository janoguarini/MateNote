"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { extractYoutubeVideoId, isValidYoutubeUrl } from "@/lib/youtube/url";
import { useToast } from "@/components/ui/toast";
import { track } from "@/lib/analytics";

const STAGES = [
  "Obteniendo el video",
  "Extrayendo la transcripción",
  "Entendiendo el contenido",
  "Generando insights",
  "Ya casi termina",
];

const STAGE_INTERVAL_MS = 3200;

export function AnalyzeForm({
  size = "default",
  autoFocus = false,
  className,
}: {
  size?: "default" | "hero";
  autoFocus?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [stageIndex, setStageIndex] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setStageIndex((prev) => Math.min(prev + 1, STAGES.length - 1));
    }, STAGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValidYoutubeUrl(url)) {
      setError("Pegá un link válido de YouTube, Shorts, o youtu.be.");
      return;
    }

    setStageIndex(0);
    setLoading(true);
    track({ name: "analyze_started", url });
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Algo salió mal. Intentá de nuevo.");
        toast({ title: data.error || "Falló el análisis", description: data.message, variant: "error" });
        setLoading(false);
        return;
      }

      track({
        name: "analyze_completed",
        videoId: extractYoutubeVideoId(url) ?? "",
        cached: Boolean(data.cached),
      });
      router.push(`/analysis/${data.id}`);
    } catch {
      setError("Error de red. Revisá tu conexión e intentá de nuevo.");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div
        className={cn(
          "w-full rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent">
            <Loader2 className="size-5 animate-spin text-accent-foreground" />
          </div>
          <div className="min-w-0">
            <p className="font-medium">{STAGES[stageIndex]}…</p>
            <p className="text-sm text-muted-foreground">Esto suele tardar 20–40 segundos.</p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          {STAGES.map((stage, i) => (
            <div key={stage} className="flex items-center gap-2.5">
              <div
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  i < stageIndex && "bg-primary",
                  i === stageIndex && "bg-primary animate-pulse",
                  i > stageIndex && "bg-border"
                )}
              />
              <span
                className={cn(
                  "text-sm transition-colors",
                  i <= stageIndex ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {stage}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div
        className={cn(
          "flex flex-col gap-2 sm:flex-row sm:items-center rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/30 transition-shadow",
          size === "hero" && "sm:p-2.5"
        )}
      >
        <div className="flex flex-1 items-center gap-2.5 px-2.5">
          <Sparkles className="size-4 shrink-0 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoFocus={autoFocus}
            placeholder="Pegá una URL de YouTube…"
            className={cn(
              "border-0 shadow-none px-0 h-9 focus-visible:ring-0 bg-transparent",
              size === "hero" && "h-11 text-[15px]"
            )}
          />
        </div>
        <Button
          type="submit"
          size={size === "hero" ? "lg" : "default"}
          className="shrink-0 gap-1.5"
        >
          Analizar
          <ArrowRight className="size-4" />
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-destructive px-1">{error}</p>}
    </form>
  );
}
