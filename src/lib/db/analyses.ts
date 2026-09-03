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

  if (error) throw error;
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
