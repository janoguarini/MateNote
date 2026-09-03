import { YoutubeTranscript } from "youtube-transcript";
import { YoutubeError } from "../youtube/errors";
import { formatDuration } from "../utils";

export interface TranscriptSegment {
  timestamp: string;
  startSeconds: number;
  text: string;
}

export interface Transcript {
  fullText: string;
  segments: TranscriptSegment[];
  wordCount: number;
}

const BLOCK_INTERVAL_SECONDS = 30;

/**
 * Fetches the raw caption track for a video and groups it into readable,
 * timestamped blocks (roughly every 30s) instead of the dense per-cue
 * chunks YouTube ships.
 */
export async function getTranscript(videoId: string): Promise<Transcript> {
  let raw: Awaited<ReturnType<typeof YoutubeTranscript.fetchTranscript>>;
  try {
    raw = await YoutubeTranscript.fetchTranscript(videoId);
  } catch {
    throw new YoutubeError(
      "transcript_unavailable",
      "This video doesn't appear to have an accessible transcript."
    );
  }

  if (!raw || raw.length === 0) {
    throw new YoutubeError(
      "transcript_unavailable",
      "This video doesn't appear to have an accessible transcript."
    );
  }

  const segments: TranscriptSegment[] = [];
  let currentBlockStart = 0;
  let currentText: string[] = [];
  let blockAnchor = 0;

  for (const cue of raw) {
    const text = decodeEntities(cue.text).trim();
    if (!text) continue;

    if (currentText.length === 0) {
      blockAnchor = cue.offset;
    }

    currentText.push(text);

    if (cue.offset - currentBlockStart >= BLOCK_INTERVAL_SECONDS && currentText.length > 0) {
      segments.push({
        timestamp: formatDuration(blockAnchor),
        startSeconds: Math.floor(blockAnchor),
        text: currentText.join(" "),
      });
      currentText = [];
      currentBlockStart = cue.offset;
    }
  }

  if (currentText.length > 0) {
    segments.push({
      timestamp: formatDuration(blockAnchor),
      startSeconds: Math.floor(blockAnchor),
      text: currentText.join(" "),
    });
  }

  const fullText = segments.map((s) => s.text).join(" ");

  return {
    fullText,
    segments,
    wordCount: fullText.split(/\s+/).filter(Boolean).length,
  };
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Renders a transcript with inline [MM:SS] markers for every block,
 * suitable for feeding to the LLM so it can ground structure/moments
 * in real timestamps.
 */
export function transcriptToPromptText(transcript: Transcript): string {
  return transcript.segments.map((s) => `[${s.timestamp}] ${s.text}`).join("\n");
}
