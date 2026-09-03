export type YoutubeErrorCode =
  | "invalid_url"
  | "video_not_found"
  | "video_private"
  | "transcript_unavailable"
  | "network_error";

export class YoutubeError extends Error {
  code: YoutubeErrorCode;

  constructor(code: YoutubeErrorCode, message: string) {
    super(message);
    this.name = "YoutubeError";
    this.code = code;
  }
}
