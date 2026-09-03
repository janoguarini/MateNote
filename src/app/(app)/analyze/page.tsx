import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { AnalyzeForm } from "@/components/analyze/analyze-form";

export const metadata: Metadata = { title: "Analyze" };

export default function AnalyzePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center pt-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-accent">
        <Sparkles className="size-5 text-accent-foreground" />
      </div>
      <h1 className="mt-5 font-display text-3xl tracking-tight sm:text-4xl">Analyze a video</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Paste any public YouTube URL — a full video, Short, or youtu.be link — and MateNote will
        transcribe, summarize and break it down for you.
      </p>
      <div className="mt-8 w-full">
        <AnalyzeForm size="hero" autoFocus />
      </div>
    </div>
  );
}
