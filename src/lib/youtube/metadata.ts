import { YoutubeError } from "./errors";
import { buildYoutubeThumbnailUrl } from "./url";
import { parseIso8601Duration } from "./duration";
import { getCategoryName } from "./categories";

export interface VideoMetadata {
  videoId: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  durationSeconds: number | null;
  url: string;
  publishedAt: string | null;
  viewCount: number | null;
  likeCount: number | null;
  commentCount: number | null;
  tags: string[] | null;
  category: string | null;
  channelId: string | null;
  subscriberCount: number | null;
}

interface OEmbedResponse {
  title: string;
  author_name: string;
  thumbnail_url: string;
}

interface DataApiVideoItem {
  snippet?: {
    publishedAt?: string;
    tags?: string[];
    categoryId?: string;
    channelId?: string;
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
  contentDetails?: {
    duration?: string;
  };
}

/**
 * Fetches public video metadata via YouTube's oEmbed endpoint, which
 * requires no API key and works for any public, embeddable video.
 * Enriches with duration, view/like/comment counts, tags, category and
 * the channel's subscriber count from the YouTube Data API when a key
 * is configured.
 */
export async function getYoutubeVideo(videoId: string): Promise<VideoMetadata> {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;

  let res: Response;
  try {
    res = await fetch(oembedUrl, { cache: "no-store" });
  } catch {
    throw new YoutubeError("network_error", "Could not reach YouTube.");
  }

  if (res.status === 404 || res.status === 401) {
    throw new YoutubeError(
      "video_not_found",
      "This video doesn't exist, is private, or is age-restricted."
    );
  }
  if (!res.ok) {
    throw new YoutubeError("network_error", "YouTube returned an unexpected response.");
  }

  const data = (await res.json()) as OEmbedResponse;

  const metadata: VideoMetadata = {
    videoId,
    title: data.title,
    channel: data.author_name,
    thumbnailUrl: data.thumbnail_url || buildYoutubeThumbnailUrl(videoId),
    durationSeconds: null,
    url: watchUrl,
    publishedAt: null,
    viewCount: null,
    likeCount: null,
    commentCount: null,
    tags: null,
    category: null,
    channelId: null,
    subscriberCount: null,
  };

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey) {
    try {
      const enrichment = await fetchEnrichmentFromDataApi(videoId, apiKey);
      Object.assign(metadata, enrichment);

      if (metadata.channelId) {
        metadata.subscriberCount = await fetchSubscriberCount(metadata.channelId, apiKey);
      }
    } catch {
      // Enrichment is best-effort; oEmbed data is still usable on its own.
    }
  }

  return metadata;
}

async function fetchEnrichmentFromDataApi(
  videoId: string,
  apiKey: string
): Promise<Partial<VideoMetadata>> {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return {};

  const data = await res.json();
  const item: DataApiVideoItem | undefined = data?.items?.[0];
  if (!item) return {};

  const iso = item.contentDetails?.duration;

  return {
    durationSeconds: iso ? parseIso8601Duration(iso) : null,
    publishedAt: item.snippet?.publishedAt ?? null,
    viewCount: item.statistics?.viewCount ? parseInt(item.statistics.viewCount, 10) : null,
    likeCount: item.statistics?.likeCount ? parseInt(item.statistics.likeCount, 10) : null,
    commentCount: item.statistics?.commentCount
      ? parseInt(item.statistics.commentCount, 10)
      : null,
    tags: item.snippet?.tags ?? null,
    category: getCategoryName(item.snippet?.categoryId),
    channelId: item.snippet?.channelId ?? null,
  };
}

async function fetchSubscriberCount(channelId: string, apiKey: string): Promise<number | null> {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  const stats = data?.items?.[0]?.statistics;
  if (!stats || stats.hiddenSubscriberCount) return null;
  return stats.subscriberCount ? parseInt(stats.subscriberCount, 10) : null;
}
