"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { track } from "@/lib/analytics";
import type { AnalysisRow } from "@/lib/db/types";

export function IdeasTab({ analysis }: { analysis: AnalysisRow }) {
  useEffect(() => {
    track({
      name: "content_idea_generated",
      analysisId: analysis.id,
      count: analysis.content_ideas.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold">¿Qué podrías crear a partir de esto?</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {analysis.content_ideas.map((idea, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader className="pb-2">
              <Badge variant="secondary" className="mb-1.5 w-fit">
                {idea.format}
              </Badge>
              <h3 className="font-display text-lg leading-snug">{idea.title}</h3>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3 pt-0">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Hook
                </p>
                <p className="mt-0.5 text-sm italic leading-relaxed">&ldquo;{idea.hook}&rdquo;</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Ángulo
                </p>
                <p className="mt-0.5 text-sm leading-relaxed">{idea.angle}</p>
              </div>
              <p className="mt-auto border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
                {idea.explanation}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
