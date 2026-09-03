"use client";

import * as React from "react";
import { Loader2, Sparkles, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CrossVideoPattern {
  commonalities: { label: string; description: string }[];
  contentOpportunity: string;
}

export function PatternFinder({ savedCount }: { savedCount: number }) {
  const [loading, setLoading] = React.useState(false);
  const [patterns, setPatterns] = React.useState<CrossVideoPattern | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFind() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/trends/patterns", { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Something went wrong.");
      return;
    }
    setPatterns(data.patterns);
  }

  if (savedCount < 2) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <Lightbulb className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Analyze at least 2 videos to unlock cross-video pattern detection.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">What your research has in common</CardTitle>
        <Button size="sm" onClick={handleFind} disabled={loading}>
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
          Find patterns
        </Button>
      </CardHeader>
      {(patterns || error) && (
        <CardContent className="flex flex-col gap-5">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {patterns && (
            <>
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Commonalities across your analyzed videos
                </p>
                <ul className="flex flex-col gap-3">
                  {patterns.commonalities.map((c, i) => (
                    <li key={i} className="rounded-lg bg-secondary p-3.5">
                      <p className="text-sm font-semibold">{c.label}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{c.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-primary/30 bg-accent/50 p-4">
                <p className="text-sm font-medium text-accent-foreground">Content opportunity</p>
                <p className="mt-1 text-sm leading-relaxed">{patterns.contentOpportunity}</p>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
