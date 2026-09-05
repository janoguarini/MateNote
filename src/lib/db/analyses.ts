import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, AnalysisRow } from "./types";
import type { VideoMetadata } from "../youtube/metadata";
import type { Transcript } from "../transcript";
import type { AnalysisResult } from "../ai/schema";

type Client = SupabaseClient<Database>;

export async function getAnalysisByVideoId(
  client: Client,
  videoId: string
): Promise<AnalysisRow | null> {
  const { data, error } = await client
    .from("analyses")
    .select("*")
    .eq("video_id", videoId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getAnalysisById(client: Client, id: string): Promise<AnalysisRow | null> {
  const { data, error } = await client.from("analyses").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

const UNIQUE_VIOLATION = "23505";

/**
 * Inserts a new analysis for a video. If another concurrent request for the
 * same video already won the race (video_id is unique), this falls back to
 * returning that existing row instead of erroring — so two users analyzing
 * the same brand-new video at the same moment always converge on a single
 * stored result, never a duplicate row or a hard failure for the loser.
 */
export async function createAnalysis(
  client: Client,
  video: VideoMetadata,
  transcript: Transcript,
  result: AnalysisResult,
  createdBy: string | null
): Promise<AnalysisRow> {
  const { data, error } = await client
    .from("analyses")
    .insert({
      video_id: video.videoId,
      video_url: video.url,
      title: video.title,
      channel: video.channel,
      thumbnail_url: video.thumbnailUrl,
      duration_seconds: video.durationSeconds,
      published_at: video.publishedAt,
      view_count: video.viewCount,
      like_count: video.likeCount,
      comment_count: video.commentCount,
      tags: video.tags,
      category: video.category,
      channel_id: video.channelId,
      subscriber_count: video.subscriberCount,
      transcript,
      summary: result.summary,
      key_takeaways: result.keyTakeaways,
      hook: result.hook,
      structure: result.structure,
      key_moments: result.keyMoments,
      content_ideas: result.contentIdeas,
      creator_takeaways: result.creatorTakeaways,
      created_by: createdBy,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      const existing = await getAnalysisByVideoId(client, video.videoId);
      if (existing) return existing;
    }
    throw error;
  }

  return data;
}

export async function listSavedAnalyses(
  client: Client,
  userId: string
): Promise<(AnalysisRow & { saved_at: string })[]> {
  const { data, error } = await client
    .from("saved_items")
    .select("created_at, analyses(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? [])
    .filter((row): row is typeof row & { analyses: AnalysisRow } => row.analyses !== null)
    .map((row) => ({ ...row.analyses, saved_at: row.created_at }));
}

export async function saveAnalysisForUser(
  client: Client,
  userId: string,
  analysisId: string
): Promise<void> {
  const { error } = await client
    .from("saved_items")
    .upsert({ user_id: userId, analysis_id: analysisId }, { onConflict: "user_id,analysis_id" });
  if (error) throw error;
}

export async function unsaveAnalysisForUser(
  client: Client,
  userId: string,
  analysisId: string
): Promise<void> {
  const { error } = await client
    .from("saved_items")
    .delete()
    .eq("user_id", userId)
    .eq("analysis_id", analysisId);
  if (error) throw error;
}

export async function isAnalysisSaved(
  client: Client,
  userId: string,
  analysisId: string
): Promise<boolean> {
  const { data, error } = await client
    .from("saved_items")
    .select("id")
    .eq("user_id", userId)
    .eq("analysis_id", analysisId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}
