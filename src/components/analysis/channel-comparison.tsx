import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/utils";
import type { AnalysisRow } from "@/lib/db/types";

export function ChannelComparison({ analysis }: { analysis: AnalysisRow }) {
  const { view_count: viewCount, subscriber_count: subscriberCount } = analysis;

  if (viewCount === null || subscriberCount === null || subscriberCount === 0) return null;

  const max = Math.max(viewCount, subscriberCount);
  const ratio = viewCount / subscriberCount;

  const headline =
    ratio >= 1
      ? `Este video generó ${ratio.toFixed(1)}x la base de suscriptores del canal.`
      : `Este video alcanzó al ${Math.round(ratio * 100)}% de la base de suscriptores del canal.`;

  const bars = [
    { label: "Vistas del video", value: viewCount },
    { label: "Suscriptores del canal", value: subscriberCount },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comparación con el canal</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed">
          <span className="font-semibold text-primary">{headline}</span>
        </p>
        <div className="flex flex-col gap-3.5">
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
                    className="h-full rounded-full bg-accent-foreground/70 transition-all"
                    style={{ width: `${Math.max(widthPct, 1.5)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
