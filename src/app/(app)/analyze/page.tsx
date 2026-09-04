import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { AnalyzeForm } from "@/components/analyze/analyze-form";

export const metadata: Metadata = { title: "Analizar" };

export default function AnalyzePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center pt-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-accent">
        <Sparkles className="size-5 text-accent-foreground" />
      </div>
      <h1 className="mt-5 font-display text-3xl tracking-tight sm:text-4xl">Analizar un video</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Pegá cualquier URL pública de YouTube — un video completo, un Short, o un link youtu.be —
        y MateNote lo va a transcribir, resumir y desglosar por vos.
      </p>
      <div className="mt-8 w-full">
        <AnalyzeForm size="hero" autoFocus />
      </div>
    </div>
  );
}
