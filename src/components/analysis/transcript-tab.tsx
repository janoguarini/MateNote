"use client";

import * as React from "react";
import { Search, Copy, Download, ClipboardCopy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { buildYoutubeWatchUrl } from "@/lib/youtube/url";
import { downloadTextFile } from "@/lib/export";
import { track } from "@/lib/analytics";
import type { AnalysisRow } from "@/lib/db/types";

export function TranscriptTab({ analysis }: { analysis: AnalysisRow }) {
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [hasSelection, setHasSelection] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleSelectionChange() {
      const selection = window.getSelection();
      const text = selection?.toString() ?? "";
      const withinContainer =
        text.length > 0 &&
        containerRef.current &&
        selection &&
        containerRef.current.contains(selection.anchorNode);
      setHasSelection(Boolean(withinContainer));
    }
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const segments = analysis.transcript.segments;
  const filtered = query
    ? segments.filter((s) => s.text.toLowerCase().includes(query.toLowerCase()))
    : segments;

  function copySelection() {
    const text = window.getSelection()?.toString() ?? "";
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: "Selection copied", variant: "success" });
  }

  function copyAll() {
    navigator.clipboard.writeText(analysis.transcript.fullText);
    track({ name: "transcript_copied", analysisId: analysis.id });
    toast({ title: "Transcript copied", variant: "success" });
  }

  function downloadTxt() {
    downloadTextFile(`${slugify(analysis.title)}-transcript.txt`, analysis.transcript.fullText);
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">
          Transcript{" "}
          <span className="ml-1.5 font-normal text-muted-foreground">
            ({analysis.transcript.wordCount.toLocaleString()} words)
          </span>
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transcript…"
              className="h-8 w-44 pl-8 text-xs sm:w-56"
            />
          </div>
          {hasSelection && (
            <Button size="sm" variant="secondary" onClick={copySelection}>
              <ClipboardCopy className="size-3.5" />
              Copy selection
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={copyAll}>
            <Copy className="size-3.5" />
            Copy
          </Button>
          <Button size="sm" variant="outline" onClick={downloadTxt}>
            <Download className="size-3.5" />
            .txt
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="flex flex-col divide-y divide-border">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No matches for &quot;{query}&quot;.
            </p>
          ) : (
            filtered.map((segment, i) => (
              <div key={i} className="flex gap-4 py-3.5 first:pt-0">
                <a
                  href={buildYoutubeWatchUrl(analysis.video_id, segment.startSeconds)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs font-semibold tabular-nums text-primary hover:underline"
                >
                  {segment.timestamp}
                </a>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {highlightMatch(segment.text, query)}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="rounded bg-accent px-0.5 text-accent-foreground">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}
