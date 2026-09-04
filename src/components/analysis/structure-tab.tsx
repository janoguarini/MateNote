import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildYoutubeWatchUrl } from "@/lib/youtube/url";
import { timestampToSeconds } from "@/lib/utils";
import type { AnalysisRow } from "@/lib/db/types";

export function StructureTab({ analysis }: { analysis: AnalysisRow }) {
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estructura del video</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative flex flex-col gap-6 border-l border-border pl-6">
            {analysis.structure.map((beat, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[1.65rem] top-1 size-2.5 rounded-full border-2 border-primary bg-card" />
                <a
                  href={buildYoutubeWatchUrl(analysis.video_id, timestampToSeconds(beat.timestamp))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold tabular-nums text-primary hover:underline"
                >
                  {beat.timestamp}
                </a>
                <h4 className="mt-0.5 text-sm font-semibold">{beat.title}</h4>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {beat.description}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Momentos clave</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {analysis.key_moments.map((moment, i) => (
              <a
                key={i}
                href={buildYoutubeWatchUrl(analysis.video_id, timestampToSeconds(moment.timestamp))}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-border p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <span className="text-xs font-semibold tabular-nums text-primary">
                  {moment.timestamp}
                </span>
                <h4 className="mt-1 text-sm font-semibold group-hover:text-primary">
                  {moment.title}
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {moment.description}
                </p>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
