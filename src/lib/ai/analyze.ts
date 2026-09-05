import { zodTextFormat } from "openai/helpers/zod";
import { AI_MODEL, getOpenAIClient } from "./client";
import { analysisResultSchema, type AnalysisResult } from "./schema";
import type { VideoMetadata } from "../youtube/metadata";
import type { Transcript } from "../transcript";
import { transcriptToPromptText } from "../transcript";

export class AiAnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiAnalysisError";
  }
}

const SYSTEM_PROMPT = `You are MateNote's senior content strategist. You study YouTube videos the way a top creator-growth consultant would: precise, concrete, and allergic to vague generalities.

Given a video's metadata and full transcript (with [MM:SS] markers), produce a structured analysis that helps a content creator understand and learn from the video.

Rules:
- Write EVERY field in Spanish (Rioplatense/Argentine Spanish — use "vos" instead of "tú" wherever second person is needed), regardless of the language of the video or its transcript. This includes the hook text itself: never output it in the video's original language (English, Portuguese, Arabic, or any other) — always translate it into natural Spanish. The only Spanish output is fully readable Spanish, with zero foreign-language or non-Latin-script text anywhere in the response.
- Ground every timestamp you output in the actual [MM:SS] markers present in the transcript. Never invent a timestamp that isn't supported by the text near it.
- The hook is the first ~15-30 seconds of the transcript. Translate its meaning into a natural Spanish opening line — don't quote it verbatim in the source language, and don't leave any of it untranslated.
- Structure should reflect the video's real narrative beats (hook, context, problem, insight, examples, conclusion, etc.) — use as many beats as the video actually has, not a fixed template.
- Key moments are the 2-8 single most valuable or surprising moments, not a re-listing of the structure.
- Content ideas must be genuinely derived from this video's topic/angle, not generic advice. Vary the format and angle across the ideas.
- Creator takeaways are reusable craft principles (storytelling, hook mechanics, pacing, structure, framing, CTA, editing pattern, topic selection) — never a summary of the video's subject matter.
- Never reproduce large verbatim chunks of the transcript; paraphrase and analyze instead.
- Be specific to this video. Avoid boilerplate that could apply to any video.`;

export async function analyzeTranscript(
  video: VideoMetadata,
  transcript: Transcript
): Promise<AnalysisResult> {
  const client = getOpenAIClient();

  const userPrompt = `Video title: ${video.title}
Channel: ${video.channel}
Duration: ${video.durationSeconds ?? "unknown"} seconds

Transcript:
${transcriptToPromptText(transcript)}`;

  let response;
  try {
    response = await client.responses.parse({
      model: AI_MODEL,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      text: { format: zodTextFormat(analysisResultSchema, "video_analysis") },
    });
  } catch (err) {
    throw new AiAnalysisError(
      err instanceof Error ? err.message : "The AI analysis request failed."
    );
  }

  const parsed = response.output_parsed;
  if (!parsed) {
    throw new AiAnalysisError("The AI did not return a valid structured analysis.");
  }

  const validated = analysisResultSchema.safeParse(parsed);
  if (!validated.success) {
    throw new AiAnalysisError("The AI's analysis failed validation.");
  }

  return validated.data;
}
