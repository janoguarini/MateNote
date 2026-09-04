import { zodTextFormat } from "openai/helpers/zod";
import { AI_MODEL, getOpenAIClient } from "./client";
import { crossVideoPatternSchema, type CrossVideoPattern, type AnalysisResult } from "./schema";
import { AiAnalysisError } from "./analyze";

export interface AnalyzedVideoSummary {
  title: string;
  channel: string;
  durationSeconds: number | null;
  analysis: Pick<AnalysisResult, "summary" | "hook" | "keyTakeaways">;
}

const SYSTEM_PROMPT = `You are MateNote's research analyst. You compare multiple already-analyzed YouTube videos to find genuine cross-video patterns a creator could act on.

Rules:
- Write everything in Spanish (Rioplatense/Argentine Spanish — use "vos" instead of "tú" wherever second person is needed).
- Only claim a commonality if it is actually supported by at least two of the given videos.
- Be specific: name the shared hook type, phrase, structure, or framing — don't say "they are all good videos".
- The content opportunity must name a concrete underused angle, not generic advice like "be more authentic".`;

export async function findCrossVideoPatterns(
  videos: AnalyzedVideoSummary[]
): Promise<CrossVideoPattern> {
  if (videos.length < 2) {
    throw new AiAnalysisError("At least two analyzed videos are required to detect patterns.");
  }

  const client = getOpenAIClient();

  const userPrompt = videos
    .map(
      (v, i) => `Video ${i + 1}: "${v.title}" by ${v.channel}
Duration: ${v.durationSeconds ?? "unknown"}s
Summary: ${v.analysis.summary}
Hook type: ${v.analysis.hook.type} — "${v.analysis.hook.text}"
Key takeaways: ${v.analysis.keyTakeaways.join("; ")}`
    )
    .join("\n\n");

  let response;
  try {
    response = await client.responses.parse({
      model: AI_MODEL,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      text: { format: zodTextFormat(crossVideoPatternSchema, "cross_video_patterns") },
    });
  } catch (err) {
    throw new AiAnalysisError(
      err instanceof Error ? err.message : "The AI pattern-detection request failed."
    );
  }

  const parsed = response.output_parsed;
  if (!parsed) {
    throw new AiAnalysisError("The AI did not return valid pattern data.");
  }

  return parsed;
}
