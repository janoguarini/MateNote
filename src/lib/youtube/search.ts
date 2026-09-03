export class YoutubeApiNotConfiguredError extends Error {
  constructor() {
    super("YouTube Data API key is not configured.");
    this.name = "YoutubeApiNotConfiguredError";
  }
}

export interface YoutubeSearchResult {
  videoId: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number | null;
  durationSeconds: number | null;
}

function parseIso8601Duration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const seconds = parseInt(match[3] ?? "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function requireApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new YoutubeApiNotConfiguredError();
  return key;
}

/**
 * Searches public YouTube videos via the Data API, then enriches results
 * with view counts and durations in a second batched call.
 */
export async function searchYoutubeVideos(query: string): Promise<YoutubeSearchResult[]> {
  const apiKey = requireApiKey();

  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=18&q=${encodeURIComponent(
    query
  )}&key=${apiKey}`;
  const searchRes = await fetch(searchUrl, { cache: "no-store" });
  if (!searchRes.ok) throw new Error("YouTube search request failed.");
  const searchData = await searchRes.json();

  const ids: string[] = (searchData.items ?? [])
    .map((item: { id?: { videoId?: string } }) => item.id?.videoId)
    .filter(Boolean);

  if (ids.length === 0) return [];

  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${ids.join(
    ","
  )}&key=${apiKey}`;
  const detailsRes = await fetch(detailsUrl, { cache: "no-store" });
  if (!detailsRes.ok) throw new Error("YouTube video details request failed.");
  const detailsData = await detailsRes.json();

  interface VideoItem {
    id: string;
    snippet: {
      title: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
    };
    statistics?: { viewCount?: string };
    contentDetails?: { duration?: string };
  }

  return (detailsData.items ?? []).map((item: VideoItem) => ({
    videoId: item.id,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnailUrl:
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.medium?.url ??
      item.snippet.thumbnails.default?.url ??
      "",
    publishedAt: item.snippet.publishedAt,
    viewCount: item.statistics?.viewCount ? parseInt(item.statistics.viewCount, 10) : null,
    durationSeconds: item.contentDetails?.duration
      ? parseIso8601Duration(item.contentDetails.duration)
      : null,
  }));
}

export async function getTrendingVideos(regionCode = "US"): Promise<YoutubeSearchResult[]> {
  const apiKey = requireApiKey();

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=${regionCode}&maxResults=24&key=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("YouTube trending request failed.");
  const data = await res.json();

  interface VideoItem {
    id: string;
    snippet: {
      title: string;
      channelTitle: string;
      publishedAt: string;
      categoryId?: string;
      thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
    };
    statistics?: { viewCount?: string };
    contentDetails?: { duration?: string };
  }

  return (data.items ?? []).map((item: VideoItem) => ({
    videoId: item.id,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnailUrl:
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.medium?.url ??
      item.snippet.thumbnails.default?.url ??
      "",
    publishedAt: item.snippet.publishedAt,
    viewCount: item.statistics?.viewCount ? parseInt(item.statistics.viewCount, 10) : null,
    durationSeconds: item.contentDetails?.duration
      ? parseIso8601Duration(item.contentDetails.duration)
      : null,
  }));
}

export function isYoutubeDataApiConfigured(): boolean {
  return Boolean(process.env.YOUTUBE_API_KEY);
}
