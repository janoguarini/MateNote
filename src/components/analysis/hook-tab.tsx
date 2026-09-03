import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalysisRow } from "@/lib/db/types";

export function HookTab({ analysis }: { analysis: AnalysisRow }) {
  const { hook } = analysis;

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Hook</CardTitle>
            <Badge variant="accent">{hook.type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <blockquote className="border-l-2 border-primary/40 pl-4 font-display text-xl italic leading-snug text-foreground/90">
            &ldquo;{hook.text}&rdquo;
          </blockquote>

          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Hook strength</p>
            <div className="flex items-center gap-2">
              <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${hook.strength * 10}%` }}
                />
              </div>
              <span className="text-sm font-semibold tabular-nums">{hook.strength}/10</span>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-muted-foreground">Why it works</p>
            <p className="text-sm leading-relaxed">{hook.whyItWorks}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hook formula</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="rounded-lg bg-secondary px-4 py-3 font-mono text-sm">{hook.formula}</p>
        </CardContent>
      </Card>
    </div>
  );
}
