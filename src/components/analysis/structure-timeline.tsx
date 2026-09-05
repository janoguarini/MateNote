import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration, timestampToSeconds } from "@/lib/utils";
import { buildYoutubeWatchUrl } from "@/lib/youtube/url";
import type { AnalysisRow } from "@/lib/db/types";

export function StructureTimeline({ analysis }: { analysis: AnalysisRow }) {
  const duration = analysis.duration_seconds;
  if (!duration || duration <= 0 || analysis.structure.length === 0) return null;

  const beats = [...analysis.structure]
    .map((beat) => ({ ...beat, startSeconds: timestampToSeconds(beat.timestamp) }))
    .sort((a, b) => a.startSeconds - b.startSeconds);

  const segments = beats.map((beat, i) => {
    const end = i < beats.length - 1 ? beats[i + 1].startSeconds : duration;
    const span = Math.max(end - beat.startSeconds, 0);
    return { ...beat, widthPct: (span / duration) * 100 };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Mapa del video</CardTitle>
        <p className="text-sm text-muted-foreground">
          Cada tramo representa un beat de la estructura — pasá el cursor para ver el detalle.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex h-8 w-full gap-0.5 overflow-hidden rounded-md">
          {segments.map((segment, i) => (
            <a
              key={i}
              href={buildYoutubeWatchUrl(analysis.video_id, segment.startSeconds)}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex items-center justify-center rounded-sm transition-opacity hover:opacity-80 ${
                i % 2 === 0 ? "bg-primary" : "bg-primary/60"
              }`}
              style={{ width: `${Math.max(segment.widthPct, 1)}%` }}
            >
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-2 text-left opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                <p className="text-xs font-semibold tabular-nums text-primary">
                  {segment.timestamp}
                </p>
                <p className="mt-0.5 text-xs font-medium">{segment.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{segment.description}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>0:00</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
