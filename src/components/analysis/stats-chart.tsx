import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/utils";
import type { AnalysisRow } from "@/lib/db/types";

export function StatsChart({ analysis }: { analysis: AnalysisRow }) {
  const bars = [
    { label: "Vistas", value: analysis.view_count },
    { label: "Likes", value: analysis.like_count },
    { label: "Comentarios", value: analysis.comment_count },
  ].filter((b): b is { label: string; value: number } => b.value !== null);

  if (bars.length === 0) return null;

  const max = Math.max(...bars.map((b) => b.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Vistas, likes y comentarios</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3.5">
        {bars.map((bar) => {
          const widthPct = max > 0 ? (bar.value / max) * 100 : 0;
          return (
            <div key={bar.label} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">{bar.label}</span>
                <span className="font-semibold tabular-nums">
                  {formatCompactNumber(bar.value)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.max(widthPct, 1.5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
