import { YoutubeError } from "./errors";
import { buildYoutubeThumbnailUrl } from "./url";

export interface VideoMetadata {
  videoId: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  durationSeconds: number | null;
  url: string;
}

interface OEmbedResponse {
  title: string;
  author_name: string;
  thumbnail_url: string;
}

/**
 * Fetches public video metadata via YouTube's oEmbed endpoint, which
 * requires no API key and works for any public, embeddable video.
 * Enriches with exact duration from the YouTube Data API when a key
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
  };

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey) {
    try {
      const duration = await fetchDurationFromDataApi(videoId, apiKey);
      metadata.durationSeconds = duration;
    } catch {
      // Duration enrichment is best-effort; oEmbed data is still usable.
    }
  }

  return metadata;
}

function parseIso8601Duration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const seconds = parseInt(match[3] ?? "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

async function fetchDurationFromDataApi(videoId: string, apiKey: string): Promise<number | null> {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  const iso = data?.items?.[0]?.contentDetails?.duration;
  return iso ? parseIso8601Duration(iso) : null;
}
