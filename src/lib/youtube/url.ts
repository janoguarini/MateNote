const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
]);

/**
 * Extracts the 11-character YouTube video ID from any common URL shape
 * (watch, youtu.be, shorts, embed, live). Returns null if the string
 * isn't a recognizable YouTube video URL.
 */
export function extractYoutubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  if (!YOUTUBE_HOSTS.has(url.hostname)) return null;

  const idPattern = /^[a-zA-Z0-9_-]{11}$/;

  if (url.hostname === "youtu.be") {
    const id = url.pathname.replace("/", "").split("/")[0];
    return idPattern.test(id) ? id : null;
  }

  if (url.pathname === "/watch") {
    const id = url.searchParams.get("v");
    return id && idPattern.test(id) ? id : null;
  }

  const shortsMatch = url.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  const embedMatch = url.pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  const liveMatch = url.pathname.match(/^\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];

  return null;
}

export function isValidYoutubeUrl(input: string): boolean {
  return extractYoutubeVideoId(input) !== null;
}

export function buildYoutubeWatchUrl(videoId: string, seconds?: number): string {
  const base = `https://www.youtube.com/watch?v=${videoId}`;
  return typeof seconds === "number" && seconds > 0 ? `${base}&t=${Math.floor(seconds)}s` : base;
}

export function buildYoutubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}
