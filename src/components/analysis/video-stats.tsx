import { Eye, ThumbsUp, MessageCircle, Users, Zap, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCompactNumber, formatRelativeDate } from "@/lib/utils";
import { calculateEngagementRate, calculateViewVelocity } from "@/lib/youtube/stats";
import type { AnalysisRow } from "@/lib/db/types";

export function VideoStats({ analysis }: { analysis: AnalysisRow }) {
  const {
    view_count: viewCount,
    like_count: likeCount,
    comment_count: commentCount,
    subscriber_count: subscriberCount,
    published_at: publishedAt,
    category,
    tags,
  } = analysis;

  const hasAnyStat =
    viewCount !== null ||
    likeCount !== null ||
    commentCount !== null ||
    subscriberCount !== null ||
    publishedAt !== null;

  if (!hasAnyStat) return null;

  const engagementRate = calculateEngagementRate(likeCount, commentCount, viewCount);
  const viewVelocity = calculateViewVelocity(viewCount, publishedAt);

  const stats: { icon: typeof Eye; label: string; value: string }[] = [];

  if (viewCount !== null) {
    stats.push({ icon: Eye, label: "Vistas", value: formatCompactNumber(viewCount) });
  }
  if (likeCount !== null) {
    stats.push({ icon: ThumbsUp, label: "Likes", value: formatCompactNumber(likeCount) });
  }
  if (commentCount !== null) {
    stats.push({
      icon: MessageCircle,
      label: "Comentarios",
      value: formatCompactNumber(commentCount),
    });
  }
  if (engagementRate !== null) {
    stats.push({
      icon: Zap,
      label: "Engagement",
      value: `${engagementRate < 1 ? engagementRate.toFixed(2) : engagementRate.toFixed(1)}%`,
    });
  }
  if (subscriberCount !== null) {
    stats.push({
      icon: Users,
      label: "Suscriptores",
      value: formatCompactNumber(subscriberCount),
    });
  }
  if (viewVelocity !== null) {
    stats.push({
      icon: Zap,
      label: "Vistas/día",
      value: formatCompactNumber(Math.round(viewVelocity)),
    });
  }
  if (publishedAt !== null) {
    stats.push({ icon: Calendar, label: "Publicado", value: formatRelativeDate(publishedAt) });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs"
          >
            <stat.icon className="size-3.5 text-muted-foreground" />
            <span className="font-semibold tabular-nums">{stat.value}</span>
            <span className="text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      {(category || (tags && tags.length > 0)) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {category && <Badge variant="accent">{category}</Badge>}
          {tags?.slice(0, 8).map((tag) => (
            <Badge key={tag} variant="outline" className="text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
