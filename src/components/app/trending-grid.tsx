"use client";

import * as React from "react";
import { Eye, Clock, PlugZap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/empty-state";
import { formatDuration, formatCompactNumber } from "@/lib/utils";

interface TrendingVideo {
  videoId: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  viewCount: number | null;
  durationSeconds: number | null;
}

export function TrendingGrid() {
  const [videos, setVideos] = React.useState<TrendingVideo[] | null>(null);
  const [notConfigured, setNotConfigured] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/trends")
      .then(async (res) => {
        const data = await res.json();
        if (res.status === 503) {
          setNotConfigured(true);
          return;
        }
        if (res.ok) setVideos(data.results);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (notConfigured) {
    return (
      <EmptyState
        icon={PlugZap}
        title="Trends aren't connected yet"
        description="Add a YOUTUBE_API_KEY environment variable to see real trending topics, fast-growing videos and popular formats. See the README for setup instructions."
      />
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <EmptyState
        icon={PlugZap}
        title="No trending data available"
        description="YouTube didn't return trending data for your region right now."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {videos.map((video) => (
        <a
          key={video.videoId}
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="relative aspect-video w-full bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              {video.durationSeconds !== null && (
                <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
                  <Clock className="size-3" />
                  {formatDuration(video.durationSeconds)}
                </span>
              )}
            </div>
            <div className="p-3.5">
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{video.title}</h3>
              <p className="mt-1 truncate text-xs text-muted-foreground">{video.channel}</p>
              {video.viewCount !== null && (
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="size-3" />
                  {formatCompactNumber(video.viewCount)} views
                </p>
              )}
            </div>
          </Card>
        </a>
      ))}
    </div>
  );
}
