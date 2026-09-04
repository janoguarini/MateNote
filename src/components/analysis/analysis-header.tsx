import Link from "next/link";
import { ArrowLeft, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { formatDuration } from "@/lib/utils";
import { SaveButton } from "./save-button";
import { ExportMenu } from "./export-menu";
import type { AnalysisRow } from "@/lib/db/types";

export function AnalysisHeader({
  analysis,
  isSaved,
  isAuthenticated,
}: {
  analysis: AnalysisRow;
  isSaved: boolean;
  isAuthenticated: boolean;
}) {
  return (
    <div>
      <div className="mb-6 flex h-16 items-center justify-between">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-4">
          <Logo iconOnly className="sm:hidden" />
          <Logo className="hidden sm:flex" />
        </Link>
        <Button variant="ghost" size="sm" asChild>
          <Link href={isAuthenticated ? "/dashboard" : "/"}>
            <ArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-64">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={analysis.thumbnail_url}
            alt={analysis.title}
            className="size-full object-cover"
          />
          {analysis.duration_seconds !== null && (
            <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
              <Clock className="size-3" />
              {formatDuration(analysis.duration_seconds)}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <h1 className="text-2xl font-semibold leading-snug sm:text-[1.65rem]">
              {analysis.title}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{analysis.channel}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" asChild>
              <a href={analysis.video_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                Abrir en YouTube
              </a>
            </Button>
            <SaveButton
              analysisId={analysis.id}
              initiallySaved={isSaved}
              isAuthenticated={isAuthenticated}
            />
            <ExportMenu analysis={analysis} />
          </div>
        </div>
      </div>
    </div>
  );
}
