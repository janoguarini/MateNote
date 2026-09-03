import { NextResponse } from "next/server";
import { YoutubeError } from "./youtube/errors";
import { AiAnalysisError } from "./ai/analyze";
import { MissingApiKeyError } from "./ai/client";

export interface FriendlyError {
  title: string;
  message: string;
  status: number;
}

/**
 * Maps internal errors to the calm, non-technical messages the product
 * spec requires — never a raw stack trace or provider error string.
 */
export function toFriendlyError(err: unknown): FriendlyError {
  if (err instanceof YoutubeError) {
    switch (err.code) {
      case "invalid_url":
        return {
          title: "That doesn't look like a YouTube link",
          message: "Paste a full YouTube video, Shorts, or youtu.be URL.",
          status: 400,
        };
      case "video_not_found":
        return {
          title: "We couldn't find this video",
          message: "It may have been removed, or it's private. Try another public YouTube video.",
          status: 404,
        };
      case "video_private":
        return {
          title: "This video is private",
          message: "MateNote can only analyze public YouTube videos.",
          status: 403,
        };
      case "transcript_unavailable":
        return {
          title: "We couldn't analyze this video",
          message:
            "This video doesn't appear to have an accessible transcript. Try another public YouTube video.",
          status: 422,
        };
      case "network_error":
        return {
          title: "YouTube is unreachable right now",
          message: "Please try again in a moment.",
          status: 502,
        };
    }
  }

  if (err instanceof MissingApiKeyError) {
    return {
      title: "AI analysis isn't configured yet",
      message: `${err.message} Add it to your environment variables to enable analysis.`,
      status: 503,
    };
  }

  if (err instanceof AiAnalysisError) {
    return {
      title: "We couldn't generate insights for this video",
      message: "Something went wrong while analyzing the transcript. Please try again.",
      status: 502,
    };
  }

  return {
    title: "Something went wrong",
    message: "An unexpected error occurred. Please try again.",
    status: 500,
  };
}

export function friendlyErrorResponse(err: unknown) {
  const friendly = toFriendlyError(err);
  console.error(err);
  return NextResponse.json(
    { error: friendly.title, message: friendly.message },
    { status: friendly.status }
  );
}
