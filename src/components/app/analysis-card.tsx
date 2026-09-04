import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDuration, formatRelativeDate } from "@/lib/utils";

export function AnalysisCard({
  id,
  title,
  channel,
  thumbnailUrl,
  durationSeconds,
  date,
}: {
  id: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  durationSeconds: number | null;
  date: string;
}) {
  return (
    <Link href={`/analysis/${id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {durationSeconds !== null && (
            <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
              <Clock className="size-3" />
              {formatDuration(durationSeconds)}
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <Badge variant="secondary" className="text-[10px]">
              Análisis de video
            </Badge>
            <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{title}</h3>
          <p className="mt-1.5 truncate text-xs text-muted-foreground">
            {channel} · {formatRelativeDate(date)}
          </p>
        </div>
      </Card>
    </Link>
  );
}
